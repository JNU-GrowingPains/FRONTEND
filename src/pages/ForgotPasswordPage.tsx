import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useForgotPassword } from '../hooks/useAuth';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

interface ForgotPasswordPageProps {
  onNavigateToLogin: () => void;
}

export function ForgotPasswordPage({
  onNavigateToLogin,
}: ForgotPasswordPageProps) {
  const [email, setEmail] = useState('');
  const forgotPasswordMutation = useForgotPassword();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    forgotPasswordMutation.mutate(
      { email },
      {
        onSuccess: () => {
          // 성공 시 로그인 페이지로 이동
          setTimeout(() => {
            onNavigateToLogin();
          }, 2000);
        },
      }
    );
  };

  return (
    <div className="bg-white relative min-h-screen">
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="content-stretch flex flex-col gap-6 items-center justify-center p-20 relative w-full max-w-2xl bg-white rounded-2xl shadow-lg border border-gray-200 my-8">
          {/* 뒤로가기 버튼 */}
          <button
            onClick={onNavigateToLogin}
            className="self-start flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="size-5" />
            <span className="text-sm">로그인으로 돌아가기</span>
          </button>

          {/* 헤더 */}
          <div className="content-stretch flex flex-col gap-2 items-center relative shrink-0 w-full">
            <div className="content-stretch flex flex-col gap-2 items-center relative shrink-0 w-full">
              <h1 className="font-bold leading-[1.1] relative shrink-0 text-[#21272a] text-[42px] text-center w-full">
                비밀번호를 잊으셨나요?
              </h1>
            </div>
            <p className="font-normal leading-[1.4] relative shrink-0 text-[#697077] text-base text-center w-full">
              가입하신 이메일 주소를 입력하시면
              <br />
              비밀번호 재설정 링크를 보내드립니다
            </p>
          </div>

          {/* 비밀번호 찾기 폼 */}
          <form
            onSubmit={handleSubmit}
            className="content-stretch flex flex-col gap-4 items-center pt-6 relative shrink-0 w-full"
          >
            {/* 이메일 주소 */}
            <div className="content-stretch flex flex-col gap-1 items-start relative shrink-0 w-full">
              <div className="content-stretch flex flex-col gap-2 items-start relative shrink-0 w-full">
                <Label className="text-[#21272a] text-sm">이메일 주소</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  className="bg-[#f2f4f8] h-12 border-b border-[#c1c7cd] rounded-none focus-visible:ring-emerald-500"
                  required
                />
              </div>
            </div>

            {/* 전송 버튼 */}
            <Button
              type="submit"
              disabled={forgotPasswordMutation.isPending}
              className="bg-emerald-800 hover:bg-emerald-900 h-12 w-full text-base"
            >
              {forgotPasswordMutation.isPending
                ? '전송 중...'
                : '이메일 주소로 비밀번호 전송하기'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
