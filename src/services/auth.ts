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
    
    const token = `mock-jwt-token-${Date.now()}`;
    
    return { user, token };
  } else {
    // Production 모드
    return await apiClient.post<AuthResponse>(endpoints.auth.login, credentials);
  }
}

/**
 * 회원가입
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
    
    const token = `mock-jwt-token-${Date.now()}`;
    
    return { user: newUser, token };
  } else {
    // Production 모드
    return await apiClient.post<AuthResponse>(endpoints.auth.signup, data);
  }
}

/**
 * 비밀번호 찾기
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
    // Production 모드
    return await apiClient.post<{ message: string }>(
      endpoints.auth.forgotPassword,
      data
    );
  }
}

/**
 * 로그아웃
 */
export async function logout(): Promise<void> {
  if (config.apiMode === 'mock') {
    // Mock 모드
    await delay(config.mockDelay);
    console.log('로그아웃 완료');
  } else {
    // Production 모드
    await apiClient.post<void>(endpoints.auth.logout);
  }
}

/**
 * 현재 사용자 정보 조회
 */
export async function getCurrentUser(token: string): Promise<User> {
  if (config.apiMode === 'mock') {
    // Mock 모드
    await delay(config.mockDelay);
    
    if (!token || !token.startsWith('mock-jwt-token')) {
      throw new Error('유효하지 않은 토큰입니다.');
    }
    
    return mockUsers[0];
  } else {
    // Production 모드
    return await apiClient.get<User>(endpoints.auth.me);
  }
}

/**
 * 프로필 정보 업데이트
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
    // Production 모드
    return await apiClient.put<User>(endpoints.account.updateProfile, data);
  }
}
