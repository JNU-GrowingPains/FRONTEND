import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) =>
        set({
          user,
          token,
          isAuthenticated: true,
        }),
      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        }),
      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),
    }),
    {
      name: 'auth-storage', // localStorage key
      // isAuthenticated는 저장하지 않음 (항상 계산된 값으로 사용)
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
      // 복원 시 token과 user가 모두 있을 때만 isAuthenticated를 true로 설정
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isAuthenticated = !!(state.token && state.user);
        }
      },
    }
  )
);
