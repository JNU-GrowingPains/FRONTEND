/**
 * 인증 서비스
 * mock/production 모드에 따라 적절한 데이터 소스 선택
 */

import { config } from '../lib/config';
import { apiClient, endpoints } from './api';
import type {
  LoginCredentials,
  SignupData,
  ForgotPasswordData,
  AuthResponse,
  User,
  UpdateProfileData,
} from '../types/auth';

// Mock delay for realistic API simulation
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock user database
const mockUsers: User[] = [
  {
    id: '1',
    email: 'kim@suelo.co.kr',
    name: '슈엘',
    lastName: '김',
    siteType: 'Cafe24',
    siteName: '슈엘로 화장품',
    siteUrl: 'https://suelo.co.kr',
    timezone: '아시아/서울',
    businessCategory: '화장품',
    createdAt: new Date('2026-01-01'),
    phone: '010-1234-5678',
    storeDescription: '건강한 아름다움을 위한 프리미엄 화장품 브랜드',
    businessNumber: '123-45-67890',
  },
];

/**
 * 로그인
 */
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  if (config.apiMode === 'mock') {
    // Mock 모드
    await delay(config.mockDelay);
    
    const { email, password } = credentials;
    
    if (!email || !password) {
      throw new Error('이메일과 비밀번호를 입력해주세요.');
    }
    
    // 모든 이메일 허용
    let user = mockUsers.find((u) => u.email === email);
    
    if (!user) {
      user = {
        id: `user-${Date.now()}`,
        email,
        name: '사용자',
        lastName: '김',
        siteType: 'Cafe24',
        siteName: '슈엘로 화장품',
        siteUrl: 'https://example.com',
        timezone: '아시아/서울',
        businessCategory: '화장품',
        createdAt: new Date(),
        phone: '010-0000-0000',
        storeDescription: '쇼핑몰 설명을 입력해주세요.',
        businessNumber: '000-00-00000',
      };
    }
    
    const accessToken = `mock-jwt-token-${Date.now()}`;
    const refreshToken = `mock-refresh-token-${Date.now()}`;
    
    return { user, accessToken, refreshToken };
  } else {
    // Production 모드 - JSON 형식 (Swagger 명세서 확인 완료)
    const response = await apiClient.post<{
      access_token: string;
      refresh_token: string;
      token_type: string;
    }>(endpoints.auth.login, {
      email: credentials.email,
      password: credentials.password,
    });
    
    return {
      user: null,
      accessToken: response.access_token,
      refreshToken: response.refresh_token,
    };
  }
}

/**
 * 회원가입 (명세서: /auth/register)
 */
export async function signup(data: SignupData): Promise<AuthResponse> {
  if (config.apiMode === 'mock') {
    // Mock 모드
    await delay(config.mockDelay + 200);
    
    const {
      email,
      password,
      name,
      lastName,
      siteType,
      siteName,
      siteUrl,
      timezone,
      businessCategory,
      agreeToTerms,
    } = data;
    
    if (!agreeToTerms) {
      throw new Error('개인정보 제공 동의가 필요합니다.');
    }
    
    if (!email || !password) {
      throw new Error('이메일과 비밀번호를 입력해주세요.');
    }
    
    const existingUser = mockUsers.find((u) => u.email === email);
    if (existingUser) {
      throw new Error('이미 가입된 이메일입니다.');
    }
    
    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      name,
      lastName,
      siteType,
      siteName,
      siteUrl,
      timezone,
      businessCategory,
      createdAt: new Date(),
      phone: '',
      storeDescription: '',
      businessNumber: '',
    };
    
    mockUsers.push(newUser);
    
    const accessToken = `mock-jwt-token-${Date.now()}`;
    const refreshToken = `mock-refresh-token-${Date.now()}`;
    
    return { user: newUser, accessToken, refreshToken };
  } else {
    // Production 모드 - 명세서에 따르면 register는 user 정보만 반환
    // 하지만 실제로는 로그인을 다시 해야 할 수도 있음
    // 일단 명세서대로 구현하고, 필요시 추가 로그인 호출
    const registerData = {
      site_type: data.siteType,
      site_name: data.siteName,
      site_url: data.siteUrl,
      site_tz: data.timezone,
      site_category: data.businessCategory,
      first_name: data.name,
      last_name: data.lastName,
      email: data.email,
      password: data.password,
      agree_privacy: data.agreeToTerms,
    };
    
    const response = await apiClient.post<{
      customer_id: number;
      name: string;
      email: string;
    }>(endpoints.auth.register, registerData);
    
    // 회원가입 성공 - 자동 로그인 없이 user 정보만 반환
    return {
      user: {
        id: String(response.customer_id),
        email: response.email,
        name: response.name.split(' ')[0] || response.name,
        lastName: response.name.split(' ').slice(1).join(' ') || '',
        siteType: data.siteType,
        siteName: data.siteName,
        siteUrl: data.siteUrl,
        timezone: data.timezone,
        businessCategory: data.businessCategory,
        createdAt: new Date(),
      },
      accessToken: '',
      refreshToken: '',
    };
  }
}

/**
 * 비밀번호 찾기 (명세서에 없음, 기존 기능 유지)
 */
export async function forgotPassword(
  data: ForgotPasswordData
): Promise<{ message: string }> {
  if (config.apiMode === 'mock') {
    // Mock 모드
    await delay(config.mockDelay + 200);
    
    const { email } = data;
    
    if (!email) {
      throw new Error('이메일을 입력해주세요.');
    }
    
    const user = mockUsers.find((u) => u.email === email);
    
    if (!user) {
      throw new Error('해당 이메일로 가입된 계정이 없습니다.');
    }
    
    console.log(`비밀번호 재설정 이메일 발송: ${email}`);
    
    return {
      message: '비밀번호 재설정 링크가 이메일로 전송되었습니다.',
    };
  } else {
    // Production 모드 - 명세서에 없으므로 에러 반환하거나 기존 엔드포인트 사용
    throw new Error('비밀번호 찾기 기능은 현재 지원되지 않습니다.');
  }
}

/**
 * 로그아웃
 */
export async function logout(refreshToken?: string): Promise<void> {
  if (config.apiMode === 'mock') {
    // Mock 모드
    await delay(config.mockDelay);
    console.log('로그아웃 완료');
  } else {
    // Production 모드 - 명세서에 따르면 refresh_token을 body에 포함
    if (!refreshToken) {
      // refreshToken이 없으면 store에서 가져오기
      const { useAuthStore } = await import('../store/useAuthStore');
      refreshToken = useAuthStore.getState().refreshToken || '';
    }
    
    await apiClient.post<void>(endpoints.auth.logout, {
      refresh_token: refreshToken,
    });
  }
}

/**
 * 토큰 재발급
 */
export async function refreshToken(refreshToken: string): Promise<{
  access_token: string;
  refresh_token: string;
  token_type: string;
}> {
  if (config.apiMode === 'mock') {
    // Mock 모드
    await delay(config.mockDelay);
    return {
      access_token: `mock-jwt-token-${Date.now()}`,
      refresh_token: `mock-refresh-token-${Date.now()}`,
      token_type: 'bearer',
    };
  } else {
    // Production 모드
    return await apiClient.post(endpoints.auth.refresh, {
      refresh_token: refreshToken,
    });
  }
}

/**
 * 현재 사용자 정보 조회
 * 명세서: GET /api/v1/management/profile
 */
export async function getCurrentUser(): Promise<User> {
  if (config.apiMode === 'mock') {
    // Mock 모드
    await delay(config.mockDelay);
    return mockUsers[0];
  } else {
    // Production 모드 - 실제 API 규격: { customer_id, name, email, site_name, created_at }
    console.log('GET profile 요청 시작');
    const response = await apiClient.get<any>(endpoints.management.profile);
    console.log('GET profile 응답:', response);
    
    // name을 firstName과 lastName으로 분리 (한국식: "성 이름")
    const nameParts = (response.name || '').split(' ');
    const lastName = nameParts.length > 1 ? nameParts[0] : '';
    const firstName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : response.name;
    
    return {
      id: String(response.customer_id || ''),
      email: response.email || '',
      name: firstName || response.name || '',
      lastName: lastName || '',
      siteType: '', // API에서 제공하지 않음
      siteName: response.site_name || '',
      siteUrl: '', // API에서 제공하지 않음
      timezone: '', // API에서 제공하지 않음
      businessCategory: '', // API에서 제공하지 않음
      createdAt: response.created_at ? new Date(response.created_at) : new Date(),
      phone: '', // API에서 제공하지 않음 (UI에서 제거됨)
      storeDescription: '', // API에서 제공하지 않음 (UI에서 제거됨)
      businessNumber: '', // API에서 제공하지 않음 (UI에서 제거됨)
    };
  }
}

/**
 * 프로필 정보 업데이트
 * 명세서: PUT /api/v1/management/profile
 */
export async function updateProfile(data: UpdateProfileData): Promise<User> {
  if (config.apiMode === 'mock') {
    // Mock 모드
    await delay(config.mockDelay);
    
    // mockUsers의 첫 번째 사용자 업데이트 (실제로는 현재 로그인한 사용자)
    const user = mockUsers[0];
    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }
    
    // 업데이트할 필드만 적용
    Object.assign(user, data);
    
    return user;
  } else {
    // Production 모드 - API는 오직 'name' 필드만 받음
    // firstName과 lastName을 합쳐서 전송 (한국식: "성 이름")
    const fullName = data.lastName 
      ? `${data.lastName} ${data.name}`.trim()
      : data.name || '';
    
    if (!fullName) {
      throw new Error('이름을 입력해주세요.');
    }
    
    console.log('프로필 업데이트 요청:', { name: fullName });
    
    // API 요청: { name: "홍길동" }
    const response = await apiClient.put<any>(endpoints.management.updateProfile, {
      name: fullName
    });
    
    console.log('프로필 업데이트 응답:', response);
    
    // API 응답: { success, message, updated_data: { customer_id, name, email, site_name, created_at } }
    const updatedData = response.updated_data || response;
    
    // name을 firstName과 lastName으로 분리
    const nameParts = (updatedData.name || fullName).split(' ');
    const lastName = nameParts.length > 1 ? nameParts[0] : '';
    const firstName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : updatedData.name;
    
    return {
      id: String(updatedData.customer_id || ''),
      email: updatedData.email || '',
      name: firstName || updatedData.name || '',
      lastName: lastName || '',
      siteType: data.siteType || '', // 로컬에서 유지
      siteName: updatedData.site_name || data.siteName || '',
      siteUrl: data.siteUrl || '', // 로컬에서 유지
      timezone: data.timezone || '', // 로컬에서 유지
      businessCategory: data.businessCategory || '', // 로컬에서 유지
      createdAt: updatedData.created_at ? new Date(updatedData.created_at) : new Date(),
      phone: data.phone || '', // 로컬에서 유지 (사용 안함)
      storeDescription: data.storeDescription || '', // 로컬에서 유지 (사용 안함)
      businessNumber: data.businessNumber || '', // 로컬에서 유지 (사용 안함)
    };
  }
}

/**
 * 대시보드 통계 조회
 * 명세서: GET /api/v1/management/dashboard-stats
 */
export async function getDashboardStats(): Promise<any> {
  if (config.apiMode === 'mock') {
    // Mock 모드
    await delay(config.mockDelay);
    return {
      total_products: 15,
      total_customers: 128,
      monthly_revenue: 5200000,
    };
  } else {
    // Production 모드
    return await apiClient.get<any>(endpoints.management.dashboardStats);
  }
}
