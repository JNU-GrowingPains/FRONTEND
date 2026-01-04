import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Users, ShoppingBag, UserCircle, LogOut, RotateCcw } from 'lucide-react';
import { Toaster } from './components/ui/sonner';
import { useAuthStore } from './store/useAuthStore';
import { useLogout } from './hooks/useAuth';
import * as authService from './services/auth';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CustomerInsightPage } from './pages/CustomerInsightPage';
import { AccountPage } from './pages/AccountPage';
import { RepurchaseAnalysisPage } from './pages/RepurchaseAnalysisPage';
import { config } from './lib/config';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

type Page = 'products' | 'customers' | 'repurchase' | 'account';
type AuthPage = 'login' | 'signup' | 'forgot-password';

const navigation = [
  { id: 'repurchase' as Page, label: '재구매 분석', icon: RotateCcw },
  { id: 'products' as Page, label: '상품 분석', icon: ShoppingBag },
  { id: 'customers' as Page, label: '고객 분석', icon: Users },
  { id: 'account' as Page, label: '계정 관리', icon: UserCircle },
];

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>('repurchase');
  const [authPage, setAuthPage] = useState<AuthPage>('login');
  const [isInitializing, setIsInitializing] = useState(true);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);
  const logoutMutation = useLogout();

  // 초기 인증 상태 확인
  useEffect(() => {
    const checkAuth = async () => {
      // Zustand persist 복원을 위한 짧은 대기
      // persist는 비동기적으로 localStorage를 복원하므로 약간의 지연 필요
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // 현재 store에서 토큰 가져오기 (직접 접근하여 최신 값 보장)
      const state = useAuthStore.getState();
      const currentAccessToken = state.accessToken;
      const currentRefreshToken = state.refreshToken;
      const currentUser = state.user;
      
      // accessToken과 user가 모두 있으면 로그인 상태 유지
      // 명세서에 /auth/me 엔드포인트가 없으므로 토큰 검증은 생략
      if (currentAccessToken && currentUser) {
        // 이미 로그인 상태로 간주
        setIsInitializing(false);
      } else if (currentAccessToken && !currentUser) {
        // 토큰은 있지만 user 정보가 없는 경우 (예: 로그인 직후)
        // 명세서에 user 정보 조회 엔드포인트가 없으므로 로그아웃 처리
        console.warn('토큰은 있지만 사용자 정보가 없습니다. 로그아웃합니다.');
        logout();
        setIsInitializing(false);
      } else {
        // 토큰이 없는 경우
        setIsInitializing(false);
      }
    };

    checkAuth();
  }, [login, logout]); // login, logout 함수를 의존성에 추가

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // 초기화 중일 때 로딩 화면 표시
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-gray-500">로딩 중...</span>
        </div>
      </div>
    );
  }

  // 인증되지 않은 경우 로그인/회원가입 페이지 표시
  if (!isAuthenticated) {
    if (authPage === 'login') {
      return (
        <>
          <LoginPage
            onNavigateToSignup={() => setAuthPage('signup')}
            onNavigateToForgotPassword={() => setAuthPage('forgot-password')}
          />
          <Toaster />
        </>
      );
    }

    if (authPage === 'signup') {
      return (
        <>
          <SignupPage onNavigateToLogin={() => setAuthPage('login')} />
          <Toaster />
        </>
      );
    }

    if (authPage === 'forgot-password') {
      return (
        <>
          <ForgotPasswordPage onNavigateToLogin={() => setAuthPage('login')} />
          <Toaster />
        </>
      );
    }
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'repurchase':
        return <RepurchaseAnalysisPage />;
      case 'products':
        return <ProductDetailPage />;
      case 'customers':
        return <CustomerInsightPage />;
      case 'account':
        return <AccountPage />;
      default:
        return <RepurchaseAnalysisPage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl">🌱</span>
              </div>
              <div>
                <h1 className="text-xl">성장통</h1>
                <p className="text-xs text-gray-500">Growth Analytics</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex gap-2 items-center">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentPage(item.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={18} />
                    <span className="hidden sm:inline">{item.label}</span>
                  </button>
                );
              })}
              
              {/* 사용자 정보 및 로그아웃 */}
              <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-200">
                <div className="text-right hidden md:block">
                  <p className="text-sm">{user?.lastName}{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.siteName}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  title="로그아웃"
                >
                  <LogOut size={18} />
                  <span className="text-sm hidden sm:inline">로그아웃</span>
                </button>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-8 py-6">
        {renderPage()}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between gap-8">
            {/* 왼쪽: 빠른 링크 */}
            <div className="flex items-center gap-6">
              <a 
                href="https://suelo.co.kr/index.html" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-gray-600 hover:text-emerald-600 transition-colors flex items-center gap-1"
              >
                <span>🛍️</span>
                <span>슈엘로 쇼핑몰</span>
              </a>
              <button className="text-sm text-gray-600 hover:text-emerald-600 transition-colors flex items-center gap-1">
                <span>📖</span>
                <span>사용 가이드</span>
              </button>
              <button className="text-sm text-gray-600 hover:text-emerald-600 transition-colors flex items-center gap-1">
                <span>📢</span>
                <span>공지사항</span>
              </button>
            </div>

            {/* 오른쪽: 시스템 정보 */}
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <span>v{config.app.version}</span>
              <div className="h-4 w-px bg-gray-300"></div>
              <span className="text-xs">마지막 슈엘로 동기화: 오늘 {new Date(Date.now() - Math.random() * 3600000).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
        </div>
      </footer>
      
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}