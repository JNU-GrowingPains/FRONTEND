/**
 * API 클라이언트
 * 모든 HTTP 요청을 중앙에서 관리합니다.
 */

import { config } from '../lib/config';
import { useAuthStore } from '../store/useAuthStore';

// API 응답 타입
interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// API 에러 타입
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * API 클라이언트 클래스
 */
class ApiClient {
  private baseUrl: string;
  private baseHeaders: HeadersInit;

  constructor() {
    this.baseUrl = config.apiBaseUrl;
    this.baseHeaders = {
      'Content-Type': 'application/json',
    };

    // API 키가 있으면 헤더에 추가
    if (config.apiKey) {
      this.baseHeaders = {
        ...this.baseHeaders,
        'X-API-Key': config.apiKey,
      };
    }
  }

  /**
   * 토큰이 필요한 엔드포인트 확인
   */
  private needsAuth(endpoint: string, method: string): boolean {
    const authRequiredEndpoints = [
      { endpoint: '/api/v1/management/profile', methods: ['GET', 'PUT'] },
      { endpoint: '/api/v1/management/dashboard-stats', methods: ['GET'] },
      { endpoint: '/auth/logout', methods: ['POST'] },
    ];
    
    return authRequiredEndpoints.some(
      (item) => endpoint === item.endpoint && item.methods.includes(method.toUpperCase())
    );
  }

  /**
   * 요청 헤더 생성 (특정 엔드포인트에만 토큰 포함)
   */
  private getHeaders(endpoint: string, method: string): HeadersInit {
    const headers: Record<string, string> = { ...this.baseHeaders } as Record<string, string>;
    
    // 토큰이 필요한 엔드포인트인 경우에만 Authorization 헤더 추가
    if (this.needsAuth(endpoint, method)) {
      try {
        const accessToken = useAuthStore.getState().accessToken;
        if (accessToken) {
          headers['Authorization'] = `Bearer ${accessToken}`;
        }
      } catch (error) {
        // store가 아직 초기화되지 않은 경우 무시
      }
    }
    
    return headers as HeadersInit;
  }

  /**
   * GET 요청
   */
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          // 배열인 경우 FastAPI 스타일로 여러 번 append
          // 예: product_ids=[15, 40] -> ?product_ids=15&product_ids=40
          if (Array.isArray(value)) {
            value.forEach(item => {
              url.searchParams.append(key, String(item));
            });
          } else {
            url.searchParams.append(key, String(value));
          }
        }
      });
    }

    const makeRequest = () => fetch(url.toString(), {
      method: 'GET',
      headers: this.getHeaders(endpoint, 'GET'),
      signal: AbortSignal.timeout(config.apiTimeout),
    });

    const response = await makeRequest();
    return this.handleResponse<T>(response, makeRequest);
  }

  /**
   * POST 요청
   */
  async post<T>(endpoint: string, data?: any): Promise<T> {
    const makeRequest = () => fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(endpoint, 'POST'),
      body: data ? JSON.stringify(data) : undefined,
      signal: AbortSignal.timeout(config.apiTimeout),
    });

    const response = await makeRequest();
    return this.handleResponse<T>(response, makeRequest);
  }

  /**
   * PUT 요청
   */
  async put<T>(endpoint: string, data?: any): Promise<T> {
    const makeRequest = () => fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(endpoint, 'PUT'),
      body: data ? JSON.stringify(data) : undefined,
      signal: AbortSignal.timeout(config.apiTimeout),
    });

    const response = await makeRequest();
    return this.handleResponse<T>(response, makeRequest);
  }

  /**
   * DELETE 요청
   */
  async delete<T>(endpoint: string): Promise<T> {
    const makeRequest = () => fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(endpoint, 'DELETE'),
      signal: AbortSignal.timeout(config.apiTimeout),
    });

    const response = await makeRequest();
    return this.handleResponse<T>(response, makeRequest);
  }

  /**
   * 응답 처리 (자동 토큰 갱신 포함)
   */
  private async handleResponse<T>(response: Response, retryRequest?: () => Promise<Response>): Promise<T> {
    if (!response.ok) {
      // 401 Unauthorized 에러 처리 (토큰 갱신 시도)
      if (response.status === 401 && retryRequest) {
        try {
          console.log('401 에러 발생 - 토큰 갱신 시도');
          const currentRefreshToken = useAuthStore.getState().refreshToken;
          
          if (currentRefreshToken) {
            // 토큰 갱신 API 호출 (순환 참조 방지를 위해 직접 fetch 사용)
            const refreshResponse = await fetch(`${this.baseUrl}${endpoints.auth.refresh}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ refresh_token: currentRefreshToken }),
            });
            
            if (refreshResponse.ok) {
              const tokens = await refreshResponse.json();
              console.log('토큰 갱신 성공');
              
              // 새 토큰을 store에 저장
              const { login } = useAuthStore.getState();
              const currentUser = useAuthStore.getState().user;
              if (currentUser) {
                login(currentUser, tokens.access_token, tokens.refresh_token);
              }
              
              // 원래 요청 재시도
              const retryResponse = await retryRequest();
              return this.handleResponse<T>(retryResponse);
            } else {
              console.log('토큰 갱신 실패 - 로그아웃 처리');
              throw new Error('Token refresh failed');
            }
          } else {
            console.log('Refresh Token 없음 - 로그아웃 처리');
            throw new Error('No refresh token');
          }
        } catch (error) {
          console.error('토큰 갱신 중 에러:', error);
          // 토큰 갱신 실패 시 로그아웃 및 리다이렉트
          useAuthStore.getState().logout();
          if (typeof window !== 'undefined') {
            window.location.href = '/';
          }
          return Promise.reject(new Error('Unauthorized - Redirecting to login'));
        }
      } else if (response.status === 401) {
        // retryRequest가 없으면 (토큰 갱신 API 자체가 실패한 경우) 바로 로그아웃
        try {
          useAuthStore.getState().logout();
          if (typeof window !== 'undefined') {
            window.location.href = '/';
          }
        } catch (error) {
          console.error('Failed to handle 401 error:', error);
        }
        return Promise.reject(new Error('Unauthorized - Redirecting to login'));
      }

      const errorData = await response.json().catch(() => ({}));
      
      // 사용자 친화적인 에러 메시지
      let userMessage = errorData.detail || errorData.message;
      if (!userMessage) {
        switch (response.status) {
          case 400:
            userMessage = '잘못된 요청입니다. 입력 정보를 확인해주세요.';
            break;
          case 403:
            userMessage = '접근 권한이 없습니다.';
            break;
          case 404:
            userMessage = '요청한 데이터를 찾을 수 없습니다.';
            break;
          case 500:
            userMessage = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
            break;
          default:
            userMessage = '요청 처리 중 오류가 발생했습니다.';
        }
      }
      
      throw new ApiError(
        userMessage,
        response.status,
        errorData.code
      );
    }

    // 빈 응답 처리
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      // JSON이 아닌 경우 (예: 204 No Content)
      return {} as T;
    }

    try {
      const text = await response.text();
      if (!text.trim()) {
        // 빈 JSON 응답
        return {} as T;
      }
      
      const data = JSON.parse(text);
      
      // API 응답이 { data, success, message } 형태인 경우
      if ('data' in data && 'success' in data) {
        return (data as ApiResponse<T>).data;
      }
      
      // 그 외의 경우 전체 응답 반환
      return data as T;
    } catch (error) {
      // JSON 파싱 실패
      throw new ApiError('응답 파싱에 실패했습니다.', response.status);
    }
  }
}

// API 클라이언트 싱글톤 인스턴스
export const apiClient = new ApiClient();

/**
 * API 엔드포인트 정의 (명세서 기준)
 */
export const endpoints = {
  // 인증
  auth: {
    register: '/auth/register',
    login: '/auth/login',
    refresh: '/auth/refresh',
    logout: '/auth/logout',
  },
  
  // 고객 분석 (명세서: member-analysis)
  memberAnalysis: {
    gradeStats: '/api/v1/member-analysis/grade-stats',
    topMembers: '/api/v1/member-analysis/top-members',
    members: '/api/v1/member-analysis/members',
  },
  
  // 상품 분석
  productAnalysis: {
    products: '/api/v1/product-analysis/products',
    stats: '/api/v1/product-analysis/stats', // Query parameter 방식
    productStats: (productId: string) => `/api/v1/product-analysis/products/${productId}/stats`, // RESTful 방식
    chartTrend: '/api/v1/product-analysis/chart/trend',
    reviewStats: (productId: string) => `/api/v1/product-analysis/products/${productId}/review-stats`,
    reviewKeywords: (productId: string) => `/api/v1/product-analysis/products/${productId}/review-keywords`,
    reviews: (productId: string) => `/api/v1/product-analysis/products/${productId}/reviews`,
  },
  
  // 리뷰 분석
  reviewAnalysis: {
    stats: '/api/v1/review-analysis/stats',
    keywords: '/api/v1/review-analysis/keywords',
    list: '/api/v1/review-analysis/list',
  },
  
  // 재구매 분석
  repurchaseAnalysis: {
    products: '/api/v1/repurchase-analysis/products',
    kpis: '/api/v1/repurchase-analysis/kpis',
    customers: '/api/v1/repurchase-analysis/customers',
  },
  
  // 개인정보 관리
  management: {
    profile: '/api/v1/management/profile',
    updateProfile: '/api/v1/management/profile',
    dashboardStats: '/api/v1/management/dashboard-stats',
  },
} as const;
