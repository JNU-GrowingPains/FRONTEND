import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useLogin } from '../hooks/useAuth';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

interface LoginPageProps {
  onNavigateToSignup: () => void;
  onNavigateToForgotPassword: () => void;
}

export function LoginPage({
  onNavigateToSignup,
  onNavigateToForgotPassword,
}: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const loginMutation = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="bg-white relative min-h-screen">
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="content-stretch flex flex-col gap-6 items-center justify-center p-20 relative w-full max-w-2xl bg-white rounded-2xl shadow-lg border border-gray-200 my-8">
          {/* 헤더 */}
          <div className="content-stretch flex flex-col gap-2 items-center relative shrink-0 w-full">
            <div className="bg-white content-stretch flex flex-col gap-2 items-center relative shrink-0 w-full">
              <h1 className="font-bold leading-[1.1] relative shrink-0 text-[#21272a] text-[42px] text-center whitespace-nowrap">
                Coredata에 오신걸 환영합니다
              </h1>
            </div>
            <p className="font-normal leading-[1.4] relative shrink-0 text-[#21272a] text-lg text-center w-full">
              슈엘로 화장품 분석 플랫폼
            </p>
          </div>

          {/* 로그인 폼 */}
          <form
            onSubmit={handleSubmit}
            className="content-stretch flex flex-col gap-4 items-center pt-6 relative shrink-0 w-full"
          >
            {/* 아이디 (이메일) */}
            <div className="content-stretch flex flex-col gap-1 items-start relative shrink-0 w-full">
              <div className="content-stretch flex flex-col gap-2 items-start relative shrink-0 w-full">
                <Label className="text-[#21272a] text-sm">아이디</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="이메일을 입력하세요"
                  className="bg-[#f2f4f8] h-12 border-b border-[#c1c7cd] rounded-none focus-visible:ring-emerald-500"
                  required
                />
              </div>
            </div>

            {/* 비밀번호 */}
            <div className="content-stretch flex flex-col gap-1 items-start relative shrink-0 w-full">
              <div className="content-stretch flex flex-col gap-2 items-start relative shrink-0 w-full">
                <Label className="text-[#21272a] text-sm">비밀번호</Label>
                <div className="relative w-full">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="비밀번호를 입력하세요"
                    className="bg-[#f2f4f8] h-12 border-b border-[#c1c7cd] rounded-none focus-visible:ring-emerald-500 pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#697077] hover:text-[#21272a] transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="size-5" />
                    ) : (
                      <Eye className="size-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* 비밀번호 찾기 */}
            <div className="content-stretch flex gap-4 items-center relative shrink-0 w-full">
              <button
                type="button"
                onClick={onNavigateToForgotPassword}
                className="ml-auto font-normal leading-[1.4] text-emerald-700 text-sm text-right hover:text-emerald-800 transition-colors"
              >
                비밀번호 찾기
              </button>
            </div>

            {/* 로그인 버튼 */}
            <Button
              type="submit"
              disabled={loginMutation.isPending}
              className="bg-emerald-800 hover:bg-emerald-900 h-12 w-full text-base"
            >
              {loginMutation.isPending ? '로그인 중...' : '로그인'}
            </Button>
          </form>

          {/* 구분선 */}
          <div className="h-px relative shrink-0 w-full bg-[#dde1e6]" />

          {/* 회원가입 링크 */}
          <button
            type="button"
            onClick={onNavigateToSignup}
            className="font-normal leading-[1.4] text-emerald-700 text-sm text-center hover:text-emerald-800 transition-colors"
          >
            회원가입
          </button>
        </div>
      </div>
    </div>
  );
}
