import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner@2.0.3';
import { useAuthStore } from '../store/useAuthStore';
import * as authService from '../services/auth';
import type {
  LoginCredentials,
  SignupData,
  ForgotPasswordData,
} from '../types/auth';

export const useLogin = () => {
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      // 로그인 후 프로필 조회까지 함께 처리
      const authData = await authService.login(credentials);
      
      let user = authData.user;
      if (!user) {
        try {
          console.log('프로필 조회 중...');
          user = await authService.getCurrentUser();
          console.log('프로필 조회 성공:', user);
        } catch (error) {
          console.error('프로필 조회 실패:', error);
          // 프로필 조회 실패 시 에러를 throw하지 않고 기본값 사용
          user = {
            id: 'unknown',
            email: credentials.email,
            name: '사용자',
            lastName: '',
            siteType: '',
            siteName: '쇼핑몰',
            siteUrl: '',
            timezone: '',
            businessCategory: '',
            createdAt: new Date(),
          };
        }
      }
      
      return {
        user,
        accessToken: authData.accessToken,
        refreshToken: authData.refreshToken,
      };
    },
    onSuccess: (data) => {
      // 토큰과 user 정보 함께 저장
      login(data.user, data.accessToken, data.refreshToken);
      toast.success('로그인 되었습니다.');
    },
    onError: (error: Error) => {
      toast.error(error.message || '로그인에 실패했습니다.');
    },
  });
};

export const useSignup = () => {
  return useMutation({
    mutationFn: (data: SignupData) => authService.signup(data),
    onSuccess: () => {
      toast.success('회원가입이 완료되었습니다. 로그인해주세요.');
    },
    onError: (error: Error) => {
      toast.error(error.message || '회원가입에 실패했습니다.');
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (data: ForgotPasswordData) => authService.forgotPassword(data),
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error: Error) => {
      toast.error(error.message || '비밀번호 재설정에 실패했습니다.');
    },
  });
};

export const useLogout = () => {
  const logout = useAuthStore((state) => state.logout);
  const refreshToken = useAuthStore((state) => state.refreshToken);

  return useMutation({
    mutationFn: () => authService.logout(refreshToken || undefined),
    onSuccess: () => {
      logout();
      toast.success('로그아웃 되었습니다.');
    },
    onError: (error: Error) => {
      toast.error(error.message || '로그아웃에 실패했습니다.');
    },
  });
};