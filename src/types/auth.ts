// 인증 관련 타입 정의

export interface User {
  id: string;
  email: string;
  name: string;
  lastName: string;
  siteType: string;
  siteName: string;
  siteUrl: string;
  timezone: string;
  businessCategory: string;
  createdAt: Date;
  // 계정 관리용 추가 필드
  phone?: string;
  storeDescription?: string;
  businessNumber?: string;
  profileImage?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  siteType: string;
  siteName: string;
  siteUrl: string;
  timezone: string;
  businessCategory: string;
  name: string;
  lastName: string;
  email: string;
  password: string;
  agreeToTerms: boolean;
}

export interface ForgotPasswordData {
  email: string;
}

export interface AuthResponse {
  user: User | null;
  accessToken: string;
  refreshToken: string;
}

export interface AuthError {
  message: string;
  field?: string;
}

export interface UpdateProfileData {
  name?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  siteName?: string;
  siteUrl?: string;
  storeDescription?: string;
  profileImage?: string;
}
