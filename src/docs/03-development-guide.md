# 개발 가이드

## 🚀 시작하기

### 필수 요구사항

- **Node.js**: v18.0.0 이상
- **npm**: v9.0.0 이상 (또는 yarn, pnpm)
- **Git**: 버전 관리
- **VSCode**: 권장 에디터 (선택사항)

### 초기 설정

#### 1. 저장소 클론
```bash
git clone <repository-url>
cd growth-analytics
```

#### 2. 의존성 설치
```bash
npm install
```

#### 3. 개발 서버 실행
```bash
npm run dev
```

서버가 시작되면 브라우저에서 `http://localhost:3000`으로 접속합니다.

#### 4. 프로덕션 빌드
```bash
npm run build
```

빌드된 파일은 `dist/` 폴더에 생성됩니다.

#### 5. 빌드 미리보기
```bash
npm run preview
```

---

## 🛠 개발 환경 설정

### VSCode 권장 확장 프로그램

프로젝트 루트에 `.vscode/extensions.json` 생성:

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "dsznajder.es7-react-js-snippets",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

### VSCode 설정

프로젝트 루트에 `.vscode/settings.json` 생성:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
    ["cn\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
```

---

## 📝 코딩 컨벤션

### TypeScript 규칙

#### 1. 타입 정의
```typescript
// ✅ Good: Interface 사용 (확장 가능)
interface Product {
  id: string;
  name: string;
}

// ✅ Good: Type 사용 (Union, Intersection)
type Status = 'active' | 'inactive';

// ❌ Bad: any 타입 사용 지양
const data: any = {}; // 피하기
```

#### 2. 함수 타이핑
```typescript
// ✅ Good: 명시적 리턴 타입
function calculateTotal(price: number, quantity: number): number {
  return price * quantity;
}

// ✅ Good: Arrow function with type
const formatDate = (date: Date): string => {
  return date.toISOString();
};
```

#### 3. Props 타이핑
```typescript
// ✅ Good: Interface로 Props 정의
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export function Button({ label, onClick, disabled = false }: ButtonProps) {
  // ...
}
```

### React 컴포넌트 작성 규칙

#### 1. 함수형 컴포넌트 사용
```typescript
// ✅ Good: Named export with function declaration
export function ProductCard({ product }: Props) {
  return <div>{product.name}</div>;
}

// ⚠️ Acceptable: Arrow function
export const ProductCard = ({ product }: Props) => {
  return <div>{product.name}</div>;
};

// ❌ Bad: Class component (레거시)
export class ProductCard extends React.Component {
  // ...
}
```

#### 2. Hooks 사용 규칙
```typescript
// ✅ Good: Hooks는 최상단에 배치
export function MyComponent() {
  const [state, setState] = useState(0);
  const data = useQuery(['key'], fetchData);
  
  // 조건부나 반복문 내부에서 Hook 사용 금지
  // ❌ Bad
  if (condition) {
    const [value, setValue] = useState(0); // Error!
  }
}
```

#### 3. 조건부 렌더링
```typescript
// ✅ Good: Early return
export function ProductList({ products }: Props) {
  if (!products.length) {
    return <EmptyState />;
  }
  
  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

// ✅ Good: 삼항 연산자
return (
  <div>
    {isLoading ? <Skeleton /> : <Content />}
  </div>
);

// ✅ Good: && 연산자
return (
  <div>
    {error && <ErrorMessage />}
  </div>
);
```

#### 4. Key Props
```typescript
// ✅ Good: Unique, stable key
products.map(product => (
  <ProductCard key={product.id} product={product} />
))

// ❌ Bad: Index as key (재정렬 시 문제)
products.map((product, index) => (
  <ProductCard key={index} product={product} />
))
```

### Tailwind CSS 규칙

#### 1. 클래스 순서 (권장)
```typescript
// Layout → Box Model → Typography → Visual → Animation
<div className="
  flex items-center justify-between
  p-4 m-2
  bg-white rounded-lg shadow-md
  hover:shadow-lg transition-shadow
">
```

#### 2. 조건부 클래스
```typescript
// ✅ Good: Template literal
<div className={`
  base-class
  ${isActive ? 'active-class' : 'inactive-class'}
`}>

// ✅ Better: cn utility (from shadcn/ui)
import { cn } from './lib/utils';

<div className={cn(
  'base-class',
  isActive && 'active-class',
  error && 'error-class'
)}>
```

#### 3. 반응형 디자인
```typescript
// Mobile-first approach
<div className="
  w-full          /* 모바일: 전체 너비 */
  md:w-1/2        /* 태블릿: 50% */
  lg:w-1/3        /* 데스크톱: 33% */
">
```

### 파일 및 폴더 명명 규칙

#### 1. 컴포넌트 파일
- **PascalCase**: `ProductSelector.tsx`
- 파일명과 컴포넌트명 일치

#### 2. Hook 파일
- **camelCase with "use" prefix**: `useProducts.ts`

#### 3. 유틸리티 파일
- **camelCase**: `mockData.ts`, `formatters.ts`

#### 4. 타입 파일
- **camelCase**: `product.ts`, `customer.ts`

#### 5. 폴더명
- **camelCase**: `components/`, `hooks/`, `lib/`
- 기능별 그룹화: `components/products/`, `components/charts/`

---

## 🔄 개발 워크플로우

### 1. 새로운 기능 개발

#### Step 1: 타입 정의
```typescript
// types/newFeature.ts
export interface NewFeature {
  id: string;
  name: string;
}
```

#### Step 2: Mock 데이터 생성
```typescript
// lib/mockData.ts
export const mockNewFeatures: NewFeature[] = [
  { id: '1', name: 'Feature 1' },
  // ...
];
```

#### Step 3: Custom Hook 생성
```typescript
// hooks/useNewFeature.ts
import { useQuery } from '@tanstack/react-query';

export const useNewFeature = () => {
  return useQuery({
    queryKey: ['newFeature'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockNewFeatures;
    },
  });
};
```

#### Step 4: 컴포넌트 생성
```typescript
// components/newFeature/FeatureList.tsx
import { useNewFeature } from '../../hooks/useNewFeature';

export function FeatureList() {
  const { data, isLoading, error } = useNewFeature();
  
  if (isLoading) return <Skeleton />;
  if (error) return <ErrorState />;
  
  return (
    <div>
      {data?.map(feature => (
        <div key={feature.id}>{feature.name}</div>
      ))}
    </div>
  );
}
```

#### Step 5: 페이지에 통합
```typescript
// pages/NewFeaturePage.tsx
import { FeatureList } from '../components/newFeature/FeatureList';

export function NewFeaturePage() {
  return (
    <div>
      <PageHeader title="새 기능" />
      <FeatureList />
    </div>
  );
}
```

### 2. 버그 수정 워크플로우

1. **문제 재현**: 로컬에서 버그 재현
2. **원인 분석**: 개발자 도구, 콘솔 로그 확인
3. **수정**: 최소한의 변경으로 수정
4. **테스트**: 다양한 시나리오에서 테스트
5. **커밋**: 명확한 커밋 메시지 작성

### 3. 리팩토링 워크플로우

1. **현재 코드 분석**: 개선 포인트 파악
2. **테스트 작성** (선택): 기존 동작 보존 확인
3. **점진적 개선**: 한 번에 하나씩 개선
4. **검증**: 기능 동작 확인

---

## 🧪 테스팅 가이드 (선택사항)

### 단위 테스트 설정

#### 1. 테스팅 라이브러리 설치
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

#### 2. Vitest 설정
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
  },
});
```

#### 3. 테스트 작성 예시
```typescript
// components/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with label', () => {
    render(<Button label="Click me" onClick={() => {}} />);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
  
  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button label="Click" onClick={handleClick} />);
    
    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

---

## 🐛 디버깅 팁

### 1. React DevTools 사용
- 컴포넌트 트리 확인
- Props 및 State 검사
- 렌더링 성능 분석

### 2. TanStack Query DevTools
```typescript
// App.tsx에 추가
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

### 3. Console 로깅
```typescript
// ✅ Good: 구조화된 로깅
console.log('Product selected:', { productId, timestamp: new Date() });

// ❌ Bad: 의미 없는 로깅
console.log('here');
```

### 4. 브레이크포인트
```typescript
// 코드에서 직접 브레이크포인트 설정
debugger;
```

---

## 📦 의존성 관리

### 패키지 추가
```bash
# 프로덕션 의존성
npm install package-name

# 개발 의존성
npm install -D package-name
```

### 패키지 업데이트
```bash
# 모든 패키지 업데이트 확인
npm outdated

# 특정 패키지 업데이트
npm update package-name

# 메이저 버전 업데이트
npm install package-name@latest
```

### 보안 취약점 확인
```bash
npm audit
npm audit fix
```

---

## 🎨 디자인 토큰 사용

### 색상 팔레트
```typescript
// Tailwind 색상 사용
<div className="bg-emerald-500 text-white">
<Badge className="bg-emerald-100 text-emerald-700">

// CSS 변수 사용 (globals.css에 정의됨)
<div style={{ color: 'var(--primary)' }}>
```

### 간격
```typescript
// 일관된 간격 사용
<div className="space-y-4">    {/* 16px */}
<div className="gap-6">        {/* 24px */}
<div className="p-8">          {/* 32px */}
```

---

## 🔧 유용한 NPM 스크립트

### package.json에 추가할 스크립트
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "type-check": "tsc --noEmit",
    "format": "prettier --write \"**/*.{ts,tsx,json,md}\"",
    "format:check": "prettier --check \"**/*.{ts,tsx,json,md}\""
  }
}
```

---

## 📊 성능 최적화

### 1. 코드 스플리팅
```typescript
// 페이지별 lazy loading
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));

<Suspense fallback={<Skeleton />}>
  <ProductDetailPage />
</Suspense>
```

### 2. 메모이제이션
```typescript
// useMemo: 비용이 큰 계산
const expensiveValue = useMemo(() => {
  return calculateExpensiveValue(data);
}, [data]);

// useCallback: 함수 메모이제이션
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);
```

### 3. React Query 캐싱
```typescript
// 캐시 시간 조정
useQuery({
  queryKey: ['products'],
  queryFn: fetchProducts,
  staleTime: 5 * 60 * 1000, // 5분
  cacheTime: 10 * 60 * 1000, // 10분
});
```

---

## 🔐 보안 고려사항

### 1. XSS 방지
```typescript
// ✅ Good: React가 자동으로 이스케이프
<div>{userInput}</div>

// ⚠️ Dangerous: dangerouslySetInnerHTML 사용 시 주의
<div dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />
```

### 2. API 키 관리
```typescript
// ❌ Bad: 코드에 직접 하드코딩
const API_KEY = 'abc123';

// ✅ Good: 환경 변수 사용
const API_KEY = import.meta.env.VITE_API_KEY;
```

### 3. 민감한 데이터 처리
- PII (개인 식별 정보)는 최소화
- 로컬 스토리지에 민감 정보 저장 금지
- 로그에 민감 정보 출력 금지

---

## 📚 추가 학습 자료

- [React 공식 문서](https://react.dev)
- [TypeScript 공식 문서](https://www.typescriptlang.org/docs/)
- [TanStack Query 문서](https://tanstack.com/query/latest)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)
- [Zustand 문서](https://zustand-demo.pmnd.rs/)
- [Recharts 문서](https://recharts.org/en-US/)

---

이 가이드를 따르면 일관되고 유지보수하기 쉬운 코드를 작성할 수 있습니다.
