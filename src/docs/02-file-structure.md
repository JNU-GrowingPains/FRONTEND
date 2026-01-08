# 파일 구조 설명

## 📁 전체 디렉토리 구조

```
성장통 (Growth Analytics)/
├── docs/                       # 프로젝트 문서
│   ├── README.md
│   ├── 01-project-overview.md
│   ├── 02-file-structure.md
│   ├── 03-development-guide.md
│   ├── 04-api-integration.md
│   ├── 05-state-management.md
│   ├── 06-component-guide.md
│   ├── 07-deployment.md
│   └── 08-troubleshooting.md
│
├── components/                 # React 컴포넌트
│   ├── charts/                # 차트 컴포넌트
│   ├── common/                # 공통 컴포넌트
│   ├── customers/             # 고객 관련 컴포넌트
│   ├── products/              # 상품 관련 컴포넌트
│   ├── repurchase/            # 재구매 관련 컴포넌트
│   ├── reviews/               # 리뷰 관련 컴포넌트
│   └── ui/                    # shadcn/ui 컴포넌트
│
├── hooks/                      # Custom React Hooks
│   ├── useAuth.ts
│   ├── useCustomers.ts
│   ├── useProducts.ts
│   ├── useRepurchase.ts       # 재구매 분석 hooks (API 연동)
│   └── useReviews.ts
│
├── lib/                        # 유틸리티 및 데이터
│   ├── accountData.ts
│   ├── config.ts
│   └── mockData.ts
│
├── pages/                      # 페이지 컴포넌트
│   ├── AccountPage.tsx
│   ├── CustomerInsightPage.tsx
│   ├── ForgotPasswordPage.tsx
│   ├── LoginPage.tsx
│   ├── ProductDetailPage.tsx
│   ├── RepurchaseAnalysisPage.tsx
│   └── SignupPage.tsx
│
├── services/                   # API 서비스 레이어
│   ├── api.ts                 # API 클라이언트 (타임아웃 60초)
│   ├── auth.ts
│   ├── customers.ts
│   ├── repurchase.ts          # 재구매 분석 API (실제 연동)
│   ├── products.ts
│   └── reviews.ts
│
├── store/                      # 전역 상태 관리
│   ├── useAuthStore.ts
│   └── useFilterStore.ts
│
├── styles/                     # 스타일시트
│   └── globals.css
│
├── types/                      # TypeScript 타입 정의
│   ├── account.ts
│   ├── chart.ts
│   ├── customer.ts
│   ├── product.ts
│   └── review.ts
│
├── guidelines/                 # 개발 가이드라인
│   └── Guidelines.md
│
├── App.tsx                     # 메인 애플리케이션 컴포넌트
├── Attributions.md             # 라이선스 및 크레딧
├── package.json                # 프로젝트 의존성
├── tsconfig.json               # TypeScript 설정
├── vite.config.ts              # Vite 설정
└── tailwind.config.ts          # Tailwind CSS 설정
```

---

## 📂 주요 디렉토리 상세 설명

### `/components` - 컴포넌트 디렉토리

모든 React 컴포넌트를 기능별로 분류하여 관리합니다.

#### `/components/charts` - 차트 컴포넌트
데이터 시각화를 담당하는 Recharts 기반 컴포넌트들

- **CustomerPointTop3.tsx**: 적립금 기준 TOP 3 고객 막대 차트
- **GradeDistributionChart.tsx**: 고객 등급 분포 파이 차트
- **ProductAnalyticsChart.tsx**: 상품 판매량/매출 복합 차트
- **ReviewWordCloud.tsx**: 리뷰 키워드 워드클라우드 시각화
- **SalesBarChart.tsx**: 판매량 막대 차트

#### `/components/common` - 공통 컴포넌트
여러 페이지에서 재사용되는 컴포넌트들

- **DateRangePicker.tsx**: 날짜 범위 선택 컴포넌트
  - 캘린더 아이콘 포함
  - 클릭으로만 선택 가능
  - Zustand store와 연동
  
- **EmptyState.tsx**: 데이터 없음/에러 상태 표시
  - 커스터마이징 가능한 아이콘, 제목, 설명
  
- **PageHeader.tsx**: 페이지 상단 헤더
  - 제목 및 설명 표시
  - 일관된 레이아웃 제공

#### `/components/customers` - 고객 관련 컴포넌트

- **CustomerTable.tsx**: 고객 목록 테이블
  - 정렬 기능
  - 등급별 뱃지 표시
  - 페이지네이션 지원

#### `/components/products` - 상품 관련 컴포넌트

- **ProductSelector.tsx**: 상품 선택 컴포넌트
  - 5개씩 페이지네이션 (옵션)
  - 상품 테이블 형식
  - 선택 시 Zustand store 업데이트
  - 다중 선택 지원

#### `/components/repurchase` - 재구매 관련 컴포넌트

- **RepurchaseKPICards.tsx**: 재구매 주요 지표 5개 카드
  - 총 재구매 고객 수
  - 평균 재구매율 (%)
  - 평균 재구매 소요 기간 (일)
  - 동일 상품 재구매 비율 (%)
  - 재구매 고객 매출 기여도 (%)
  - 실시간 API 연동
  
- **RepurchaseCustomerTable.tsx**: 재구매 고객 목록 테이블
  - 회원/비회원 통합 표시
  - 고객별 재구매 정보 (구매 횟수, 평균 재구매 기간, 등급)
  - 클릭 시 고객 상세 정보 로드 (최대 60초)
  - 고유 key 사용으로 React 최적화
  
- **RepurchaseProductChart.tsx**: 고객별 재구매 상품 가로 막대 차트
  - 개별 고객의 재구매 상품 시각화
  - 재구매 횟수와 비율 표시
  - 동적 높이 조정
  - 빈 데이터 처리 (EmptyState)
  
- **RepurchaseAddressChart.tsx**: 지역별 재구매 배송지 도넛 차트
  - 지역별 재구매 배송지 분포 시각화
  - 주소별 주문 비율 표시
  - 색상 구분 및 툴팁

#### `/components/reviews` - 리뷰 관련 컴포넌트

- **ReviewSummary.tsx**: 리뷰 통계 요약
  - 평균 평점, 총 리뷰 수
  - 주요 키워드 TOP 5

#### `/components/ui` - shadcn/ui 컴포넌트
프로젝트에서 사용하는 모든 shadcn/ui 기반 컴포넌트

- **button.tsx**: 버튼 컴포넌트
- **card.tsx**: 카드 컨테이너
- **table.tsx**: 테이블 컴포넌트
- **badge.tsx**: 뱃지/라벨
- **calendar.tsx**: 캘린더
- **select.tsx**: 드롭다운 선택
- **input.tsx**: 입력 필드
- 기타 30+ UI 컴포넌트

---

### `/hooks` - Custom Hooks

TanStack Query를 활용한 데이터 페칭 로직을 캡슐화

#### `useProducts.ts`
```typescript
// 상품 목록 조회
useProducts() 

// 선택된 상품의 통계 조회
useProductStats()
```

#### `useCustomers.ts`
```typescript
// 고객 목록 조회
useCustomers()

// 고객 등급 분포 조회
useGradeDistribution()

// TOP 3 고객 조회
useTopCustomers()
```

#### `useReviews.ts`
```typescript
// 선택된 상품의 리뷰 조회
useReviews()

// 리뷰 워드클라우드 데이터 조회
useReviewWordCloud()
```

#### `useRepurchase.ts` ⭐ **실제 API 연동**
```typescript
// 재구매 상품 목록
useRepurchaseProducts()

// 재구매 KPI (상품 ID에 따라 동적)
useRepurchaseKPIs(productIds: number[])

// 재구매 고객 목록
useRepurchaseCustomers(productIds: number[])

// 고객별 재구매 상세 (선택 시에만 활성화)
useCustomerRepurchaseDetail(customerId: string | null)
```

**주요 특징:**
- 자동 캐싱 및 의존성 기반 리페칭
- 로딩/에러 상태 관리
- Zustand store 연동
- **재구매 분석**: 실제 API 연동, 조건부 실행, 타임아웃 처리

---

### `/lib` - 유틸리티 및 데이터

#### `mockData.ts`
프로젝트에서 사용하는 모든 Mock 데이터를 관리

**포함된 데이터:**
- `mockProducts`: 10개 화장품 상품 데이터
- `generateProductStats()`: 상품별 판매 통계 생성
- `mockCustomers`: 고객 데이터 (다양한 등급)
- `generateGradeDistribution()`: 등급 분포 데이터 생성
- `generateReviews()`: 상품별 리뷰 생성
- `generateReviewKeywords()`: 리뷰 키워드 추출

**데이터 생성 로직:**
- 랜덤하지만 현실적인 데이터
- 날짜 범위에 따른 동적 생성
- 상품별로 다른 패턴의 데이터

#### `accountData.ts`
계정 관리 페이지에서 사용하는 사용자 정보

```typescript
export const mockAccount = {
  name: '김슈엘',
  email: 'kim.suello@suello.com',
  role: '관리자',
  // ...
}
```

---

### `/pages` - 페이지 컴포넌트

각 페이지의 최상위 컴포넌트

#### `LoginPage.tsx`
로그인 페이지

**구성:**
- 이메일/비밀번호 입력 폼
- 회원가입 및 비밀번호 찾기 링크
- Mock 모드에서 아무 비밀번호로 로그인 가능

#### `SignupPage.tsx`
회원가입 페이지

**구성:**
- 쇼핑몰 정보 입력 (상호명, URL, 타입 등)
- 사용자 정보 입력 (이름, 이메일, 비밀번호)
- 이용약관 동의

#### `ForgotPasswordPage.tsx`
비밀번호 찾기 페이지

**구성:**
- 이메일 입력 폼
- 비밀번호 재설정 링크 전송

#### `RepurchaseAnalysisPage.tsx`
재구매 분석 페이지 (기본 페이지) - **실제 API 연동 완료**

**구성:**
- PageHeader (제목: "재구매 분석")
- ProductSelector (상품 선택, 다중 선택 가능)
  - 선택 없음: 전체 평균 KPI
  - 단일 선택: 해당 상품 KPI
  - 복수 선택: 교차 재구매 포함 평균 KPI
- RepurchaseKPICards (재구매 주요 지표 5개)
- RepurchaseCustomerTable (재구매 고객 목록, 회원/비회원 통합)
- RepurchaseProductChart (고객별 재구매 상품, 가로 막대 차트)
- RepurchaseAddressChart (지역별 재구매 배송지, 도넛 차트)

**API 연동:**
- `GET /api/v1/repurchase-analysis/products` - 상품 목록
- `GET /api/v1/repurchase-analysis/kpis` - KPI 조회
- `GET /api/v1/repurchase-analysis/customers` - 고객 목록
- `GET /api/v1/repurchase-analysis/customer/{customer_id}/detail` - 고객 상세

#### `ProductDetailPage.tsx`
상품 분석 페이지

**구성:**
- PageHeader (제목: "상품 분석")
- DateRangePicker (날짜 범위 선택)
- ProductSelector (상품 선택)
- ProductAnalyticsChart (판매 추이)
- ReviewSummary (리뷰 통계)
- ReviewWordCloud (키워드 클라우드)

#### `CustomerInsightPage.tsx`
고객 분석 페이지

**구성:**
- PageHeader (제목: "고객 분석")
- GradeDistributionChart (등급 분포)
- CustomerPointTop3 (TOP 3 고객)
- CustomerTable (고객 목록)

#### `AccountPage.tsx`
계정 관리 페이지

**구성:**
- PageHeader (제목: "계정 관리")
- 프로필 정보 카드
- 비밀번호 변경 폼
- 알림 설정

---

### `/services` - API 서비스 레이어

백엔드 API와 통신하는 서비스 함수들을 관리합니다.

#### `api.ts`
API 클라이언트 기본 설정 및 공통 유틸리티

#### `auth.ts`
인증 관련 API 서비스
- `login()`, `signup()`, `logout()`, `getCurrentUser()`, `forgotPassword()`

#### `customers.ts`
고객 관련 API 서비스
- `getCustomers()`, `getGradeDistribution()`, `getTopCustomers()`

#### `products.ts`
상품 관련 API 서비스
- `getProducts()`, `getProductStats()`

#### `reviews.ts`
리뷰 관련 API 서비스
- `getReviews()`, `getReviewKeywords()`

#### `repurchase.ts` ⭐ **실제 API 연동**
재구매 분석 관련 API 서비스

**주요 함수:**
- `getRepurchaseProducts()`: 재구매 분석용 상품 목록 조회
- `getRepurchaseKPIs(productIds)`: 재구매 KPI 조회
  - 상품 미선택: 전체 평균
  - 단일 상품: 해당 상품 KPI
  - 복수 상품: 교차 재구매 포함 평균
- `getRepurchaseCustomers(productIds, page, limit)`: 재구매 고객 목록 조회
  - 회원/비회원 통합
  - 페이지네이션 지원
- `getCustomerRepurchaseDetail(customerId)`: 고객별 재구매 상세 정보
  - 재구매 상품 목록
  - 재구매 배송지 목록
  - 최대 60초 소요 가능

**특징:**
- URL 인코딩 처리 (비회원 ID: "이름|주소")
- 배열 파라미터 FastAPI 스타일 (`?product_ids=10&product_ids=15`)
- 문자열 → 숫자 파싱 (purchase_count, avg_period, point)
- snake_case → camelCase 변환

### `/store` - 상태 관리

#### `useAuthStore.ts`
Zustand를 사용한 인증 상태 관리 (persist 미들웨어 사용)

**관리하는 상태:**
```typescript
{
  user: User | null;              // 현재 로그인한 사용자 정보
  token: string | null;           // JWT 토큰
  isAuthenticated: boolean;       // 인증 여부
}
```

**액션:**
- `login(user, token)`: 로그인
- `logout()`: 로그아웃
- `updateUser(userData)`: 사용자 정보 업데이트

**특징:**
- localStorage에 자동 저장 (persist 미들웨어)
- 토큰 및 사용자 정보 유지 (새로고침 시에도 유지)

#### `useFilterStore.ts`
Zustand를 사용한 전역 필터 상태 관리

**관리하는 상태:**
```typescript
{
  selectedProductIds: string[];   // 선택된 상품 ID 배열 (다중 선택)
  dateRange: {                    // 날짜 범위
    start: Date;
    end: Date;
  };
}
```

**액션:**
- `setProducts(ids)`: 상품 선택 (다중 선택)
- `setDateRange(range)`: 날짜 범위 변경

**초기값:**
- 상품: 빈 배열 (선택 없음)
- 날짜: 최근 30일

---

### `/types` - TypeScript 타입 정의

모든 데이터 타입을 중앙에서 관리하여 타입 안정성 확보

#### `product.ts`
```typescript
Product          // 상품 기본 정보
ProductStats     // 상품 판매 통계
ProductKPI       // 상품 주요 지표
```

#### `customer.ts`
```typescript
Customer         // 고객 정보
GradeDistribution // 등급 분포
CustomerGrade    // 등급 타입 (VIP | Gold | Silver | Bronze)
```

#### `review.ts`
```typescript
Review           // 리뷰 정보
WordCloudItem    // 워드클라우드 아이템
ReviewKeyword    // 리뷰 키워드
```

#### `chart.ts`
```typescript
ChartDataPoint   // 차트 데이터 포인트
ChartConfig      // 차트 설정
```

#### `account.ts`
```typescript
Account          // 계정 정보
NotificationSettings // 알림 설정
```

---

### `/styles` - 스타일시트

#### `globals.css`
전역 CSS 및 Tailwind 설정

**포함 내용:**
- Tailwind directives (@tailwind base, components, utilities)
- CSS 변수 (색상, 간격 등)
- 기본 HTML 요소 스타일
- 다크모드 설정 (현재 미사용)
- 커스텀 유틸리티 클래스

---

## 📄 루트 레벨 파일

### `App.tsx`
애플리케이션의 진입점

**역할:**
- TanStack Query Provider 설정
- 상단 네비게이션 바 렌더링
- 페이지 라우팅 (상품 분석, 고객 분석, 계정 관리)
- 전역 레이아웃 관리

**네비게이션 구조:**
```typescript
const navigation = [
  { id: 'repurchase', label: '재구매 분석', icon: RotateCcw },
  { id: 'products', label: '상품 분석', icon: ShoppingBag },
  { id: 'customers', label: '고객 분석', icon: Users },
  { id: 'account', label: '계정 관리', icon: UserCircle },
];
```

### `package.json`
프로젝트 의존성 및 스크립트 정의

**주요 의존성:**
- react, react-dom
- typescript
- vite
- tailwindcss
- @tanstack/react-query
- zustand
- recharts
- shadcn/ui 컴포넌트들
- lucide-react
- date-fns

**스크립트:**
- `dev`: 개발 서버 실행
- `build`: 프로덕션 빌드
- `preview`: 빌드 결과 미리보기

### `tsconfig.json`
TypeScript 컴파일러 설정

**주요 설정:**
- `strict: true`: 엄격한 타입 체크
- `target: ES2020`: 최신 JavaScript 기능 사용
- Path alias 설정 (`@/components`, `@/lib` 등)

### `vite.config.ts`
Vite 빌드 도구 설정

**주요 설정:**
- React 플러그인
- Path alias 설정
- 개발 서버 포트
- 빌드 최적화

### `tailwind.config.ts`
Tailwind CSS 커스터마이징

**주요 설정:**
- 콘텐츠 경로 (스캔할 파일)
- 테마 확장 (색상, 폰트 등)
- 플러그인 설정

---

## 🔍 파일 명명 규칙

### 컴포넌트 파일
- **PascalCase**: `ProductSelector.tsx`, `DateRangePicker.tsx`
- React 컴포넌트는 항상 대문자로 시작

### Hook 파일
- **camelCase with "use" prefix**: `useProducts.ts`, `useCustomers.ts`
- Custom hook은 항상 `use`로 시작

### 타입 파일
- **camelCase**: `product.ts`, `customer.ts`
- 데이터 모델명과 일치

### 유틸리티 파일
- **camelCase**: `mockData.ts`, `accountData.ts`

---

## 📦 컴포넌트 import 패턴

### 절대 경로 import (권장)
```typescript
import { Button } from './components/ui/button';
import { useProducts } from './hooks/useProducts';
import { Product } from './types/product';
```

### 상대 경로 import
```typescript
import { ProductSelector } from '../components/products/ProductSelector';
```

---

## 🧩 코드 구조 베스트 프랙티스

### 1. 컴포넌트 파일 구조
```typescript
// 1. Import 섹션
import { useState } from 'react';
import { Card } from './components/ui/card';

// 2. 타입 정의
interface Props {
  // ...
}

// 3. 컴포넌트 정의
export function ComponentName({ ...props }: Props) {
  // 4. Hooks
  const [state, setState] = useState();
  
  // 5. 로직
  const handleClick = () => { };
  
  // 6. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

### 2. Hook 파일 구조
```typescript
// 1. Import
import { useQuery } from '@tanstack/react-query';

// 2. Hook 정의
export const useCustomHook = () => {
  return useQuery({
    queryKey: ['key'],
    queryFn: async () => {
      // 데이터 페칭 로직
    },
  });
};
```

### 3. 타입 파일 구조
```typescript
// 기본 타입 정의
export interface BaseType {
  // ...
}

// 확장 타입 정의
export interface ExtendedType extends BaseType {
  // ...
}

// 유틸리티 타입
export type UnionType = 'a' | 'b' | 'c';
```

---

이 파일 구조는 확장 가능하고 유지보수하기 쉬운 구조로 설계되었습니다.
