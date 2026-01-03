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
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: (data) => {
      login(data.user, data.token);
      toast.success('로그인 되었습니다.');
    },
    onError: (error: Error) => {
      toast.error(error.message || '로그인에 실패했습니다.');
    },
  });
};

export const useSignup = () => {
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: (data: SignupData) => authService.signup(data),
    onSuccess: (data) => {
      login(data.user, data.token);
      toast.success('회원가입이 완료되었습니다.');
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

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      logout();
      toast.success('로그아웃 되었습니다.');
    },
    onError: (error: Error) => {
      toast.error(error.message || '로그아웃에 실패했습니다.');
    },
  });
};