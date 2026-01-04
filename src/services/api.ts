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
   * 요청 헤더 생성 (동적으로 토큰 가져오기)
   */
  private getHeaders(): HeadersInit {
    const headers: Record<string, string> = { ...this.baseHeaders } as Record<string, string>;
    
    // Zustand store에서 토큰 가져오기 (동적)
    try {
      const accessToken = useAuthStore.getState().accessToken;
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }
    } catch (error) {
      // store가 아직 초기화되지 않은 경우 무시
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
          url.searchParams.append(key, String(value));
        }
      });
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: this.getHeaders(),
      signal: AbortSignal.timeout(config.apiTimeout),
    });

    return this.handleResponse<T>(response);
  }

  /**
   * POST 요청
   */
  async post<T>(endpoint: string, data?: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
      signal: AbortSignal.timeout(config.apiTimeout),
    });

    return this.handleResponse<T>(response);
  }

  /**
   * PUT 요청
   */
  async put<T>(endpoint: string, data?: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
      signal: AbortSignal.timeout(config.apiTimeout),
    });

    return this.handleResponse<T>(response);
  }

  /**
   * DELETE 요청
   */
  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
      signal: AbortSignal.timeout(config.apiTimeout),
    });

    return this.handleResponse<T>(response);
  }

  /**
   * 응답 처리
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      // 401 Unauthorized 에러 처리
      if (response.status === 401) {
        try {
          useAuthStore.getState().logout();
          // 로그인 페이지로 리다이렉트 (window.location은 브라우저에서만 사용 가능)
          if (typeof window !== 'undefined') {
            window.location.href = '/';
            // 리다이렉트 후 함수 종료 (에러 throw 안 함)
            return Promise.reject(new Error('Unauthorized - Redirecting to login'));
          }
        } catch (error) {
          // store 접근 실패 시 무시
          console.error('Failed to handle 401 error:', error);
        }
      }

      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || '요청 처리 중 오류가 발생했습니다.',
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
  
  // 상품 분석
  productAnalysis: {
    products: '/api/v1/product-analysis/products',
    stats: '/api/v1/product-analysis/stats',
    chartTrend: '/api/v1/product-analysis/chart/trend',
  },
  
  // 고객 분석
  customerAnalysis: {
    kpis: '/api/v1/customer-analysis/kpis',
    grades: '/api/v1/customer-analysis/grades',
    list: '/api/v1/customer-analysis/list',
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
  
  // 계정 (명세서에 없지만 기존 기능 유지)
  account: {
    profile: '/account/profile',
    updateProfile: '/account/profile',
    changePassword: '/account/password',
    deleteAccount: '/account',
  },
} as const;
