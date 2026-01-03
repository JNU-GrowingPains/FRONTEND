import { useState } from 'react';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useSignup } from '../hooks/useAuth';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

interface SignupPageProps {
  onNavigateToLogin: () => void;
}

export function SignupPage({ onNavigateToLogin }: SignupPageProps) {
  const [formData, setFormData] = useState({
    siteType: 'Cafe24',
    siteName: '',
    siteUrl: '',
    timezone: '아시아/서울',
    businessCategory: '',
    name: '',
    lastName: '',
    email: '',
    password: '',
    agreeToTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);

  const signupMutation = useSignup();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signupMutation.mutate(formData);
  };

  const updateField = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
          <div className="content-stretch flex flex-col gap-2 items-center pb-6 relative shrink-0 w-full">
            <h1 className="font-bold leading-[1.1] text-[#21272a] text-[42px] text-center w-full">
              회원가입
            </h1>
          </div>

          {/* 회원가입 폼 */}
          <form
            onSubmit={handleSubmit}
            className="content-stretch flex flex-col gap-4 items-start relative w-full"
          >
            {/* 사이트 종류 */}
            <div className="flex flex-col gap-2 w-full">
              <Label className="text-[#21272a] text-sm">사이트 종류</Label>
              <Input
                value={formData.siteType}
                onChange={(e) => updateField('siteType', e.target.value)}
                placeholder="예: Cafe24, Shopify, Makeshop"
                className="bg-[#f2f4f8] h-12 border-b border-[#c1c7cd] rounded-none focus-visible:ring-emerald-500"
                required
              />
            </div>

            {/* 사이트 이름 */}
            <div className="flex flex-col gap-2 w-full">
              <Label className="text-[#21272a] text-sm">
                사이트 이름 (도메인)
              </Label>
              <Input
                value={formData.siteName}
                onChange={(e) => updateField('siteName', e.target.value)}
                placeholder="공식 사이트 이름을 말해주세요"
                className="bg-[#f2f4f8] h-12 border-b border-[#c1c7cd] rounded-none focus-visible:ring-emerald-500"
                required
              />
            </div>

            {/* 쇼핑몰 URL */}
            <div className="flex flex-col gap-2 w-full">
              <Label className="text-[#21272a] text-sm">
                쇼핑몰 URL (도메인 주소)
              </Label>
              <Input
                type="url"
                value={formData.siteUrl}
                onChange={(e) => updateField('siteUrl', e.target.value)}
                placeholder="https://example.com"
                className="bg-[#f2f4f8] h-12 border-b border-[#c1c7cd] rounded-none focus-visible:ring-emerald-500"
                required
              />
            </div>

            {/* 사이트 타임존 */}
            <div className="flex flex-col gap-2 w-full">
              <Label className="text-[#21272a] text-sm">사이트 타임존</Label>
              <Select
                value={formData.timezone}
                onValueChange={(value) => updateField('timezone', value)}
              >
                <SelectTrigger className="bg-[#f2f4f8] h-12 border-b border-[#c1c7cd] rounded-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="아시아/서울">아시아 / 서울</SelectItem>
                  <SelectItem value="아시아/도쿄">아시아 / 도쿄</SelectItem>
                  <SelectItem value="미국/뉴욕">미국 / 뉴욕</SelectItem>
                  <SelectItem value="유럽/런던">유럽 / 런던</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 업종 카테고리 */}
            <div className="flex flex-col gap-2 w-full">
              <Label className="text-[#21272a] text-sm">
                업종 카테고리 (패션)
              </Label>
              <Input
                value={formData.businessCategory}
                onChange={(e) =>
                  updateField('businessCategory', e.target.value)
                }
                placeholder="예: 화장품, 패션, 식품"
                className="bg-[#f2f4f8] h-12 border-b border-[#c1c7cd] rounded-none focus-visible:ring-emerald-500"
                required
              />
            </div>

            {/* 이름과 성 */}
            <div className="flex gap-4 w-full">
              <div className="flex flex-col gap-2 flex-1">
                <Label className="text-[#21272a] text-sm">이름</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  placeholder="이름"
                  className="bg-[#f2f4f8] h-12 border-b border-[#c1c7cd] rounded-none focus-visible:ring-emerald-500"
                  required
                />
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <Label className="text-[#21272a] text-sm">성</Label>
                <Input
                  value={formData.lastName}
                  onChange={(e) => updateField('lastName', e.target.value)}
                  placeholder="성"
                  className="bg-[#f2f4f8] h-12 border-b border-[#c1c7cd] rounded-none focus-visible:ring-emerald-500"
                  required
                />
              </div>
            </div>

            {/* 이메일 */}
            <div className="flex flex-col gap-2 w-full">
              <Label className="text-[#21272a] text-sm">Email</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder="example@email.com"
                className="bg-[#f2f4f8] h-12 border-b border-[#c1c7cd] rounded-none focus-visible:ring-emerald-500"
                required
              />
            </div>

            {/* 비밀번호 */}
            <div className="flex flex-col gap-2 w-full">
              <Label className="text-[#21272a] text-sm">비밀번호</Label>
              <div className="relative w-full">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => updateField('password', e.target.value)}
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

            {/* 개인정보 동의 */}
            <div className="flex items-center gap-2 mt-2">
              <Checkbox
                id="terms"
                checked={formData.agreeToTerms}
                onCheckedChange={(checked) =>
                  updateField('agreeToTerms', checked === true)
                }
              />
              <Label
                htmlFor="terms"
                className="text-[#21272a] text-sm cursor-pointer"
              >
                개인정보 제공 동의
              </Label>
            </div>

            {/* 가입하기 버튼 */}
            <Button
              type="submit"
              disabled={signupMutation.isPending}
              className="bg-emerald-800 hover:bg-emerald-900 h-12 w-full text-base mt-4"
            >
              {signupMutation.isPending ? '가입 중...' : '가입하기'}
            </Button>
          </form>

          {/* 구분선 */}
          <div className="h-px relative shrink-0 w-full bg-[#dde1e6]" />
        </div>
      </div>
    </div>
  );
}
