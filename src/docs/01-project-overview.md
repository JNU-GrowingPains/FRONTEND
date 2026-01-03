# 프로젝트 오버뷰

## 📋 프로젝트 소개

**성장통 (Growth Analytics)** 는 슈엘로 화장품 쇼핑몰을 위한 종합 데이터 분석 플랫폼입니다. 
상품 판매 데이터, 고객 정보, 리뷰 데이터를 실시간으로 시각화하고 분석하여 비즈니스 인사이트를 제공합니다.

## 🎯 주요 기능

### 1. 인증 시스템
- **로그인**: 이메일/비밀번호 기반 인증
- **회원가입**: 쇼핑몰 정보 등록 및 계정 생성
- **비밀번호 찾기**: 이메일을 통한 비밀번호 재설정
- **자동 로그인 유지**: localStorage 기반 세션 관리
- **JWT 토큰**: 안전한 인증 처리

### 2. 재구매 분석 (Repurchase Analysis)
- **재구매율 분석**: 전체 또는 선택한 상품들의 재구매율 통계
- **상품별 재구매 분석**: 특정 상품의 재구매 고객 목록 및 통계
- **고객별 재구매 분석**: 개별 고객의 재구매 상품 및 배송지 분석
- **주요 지표 (KPI)**:
  - 재구매율
  - 평균 재구매 기간
  - 재구매 고객 수
  - 재구매 주기
- **시각화 차트**:
  - 재구매 고객 테이블
  - 고객별 재구매 상품 차트
  - 지역별 재구매 배송지 차트
- **고객 상세 정보**: 고객 클릭 시 해당 고객의 재구매 상품 및 배송지 정보 확인

### 3. 상품 분석 (Product Analytics)
- **상품 목록 관리**: 10개 화장품 상품을 5개씩 페이지네이션으로 표시
- **상품 선택 및 필터링**: 특정 상품 선택 시 해당 상품의 상세 분석 데이터 표시
- **날짜 범위 선택**: 캘린더 아이콘을 통한 날짜 선택 (기본값: 최근 30일)
- **주요 지표 (KPI)**:
  - 총 판매량
  - 총 구매자 수
  - 총 매출액
  - 평균 주문 금액
- **시각화 차트**:
  - 판매량 추이 그래프 (막대 차트)
  - 매출 추이 그래프 (라인 차트)
  - 리뷰 워드클라우드 (가장 많이 언급된 키워드)
  - 리뷰 통계 (평균 평점, 리뷰 수, 키워드 순위)

### 4. 고객 분석 (Customer Insights)
- **고객 목록 관리**: 실시간 고객 데이터 테이블
- **고객 등급 분석**: 
  - VIP, Gold, Silver, Bronze 등급별 분포
  - 등급별 고객 수 시각화 (파이 차트)
- **고객 상세 정보**:
  - 고객명, 이메일, 등급
  - 총 구매액, 총 구매 횟수
  - 평균 구매액
  - 최근 구매일
- **정렬 및 필터링**: 등급, 구매액, 구매 횟수 등으로 정렬 가능
- **TOP 3 고객**: 적립금 기준 상위 3명 고객 하이라이트 (막대 차트)

### 5. 계정 관리 (Account Management)
- **사용자 프로필**: 쇼핑몰 대표 계정 정보 관리
- **프로필 수정**: 이름, 이메일, 연락처 등 정보 업데이트
- **쇼핑몰 정보**: 상호명, 사업자 정보 관리
- **알림 설정**: 이메일, SMS, 재고/주문/리뷰 알림 설정

## 🛠 기술 스택

### Frontend Framework & Build Tool
- **React 18**: 최신 React 기능 활용 (Hooks, Suspense 등)
- **TypeScript**: 타입 안정성 확보
- **Vite**: 빠른 개발 서버 및 번들링

### UI & Styling
- **Tailwind CSS**: 유틸리티 기반 CSS 프레임워크
- **shadcn/ui**: 고품질 재사용 가능 UI 컴포넌트
- **Lucide React**: 아이콘 라이브러리

### 데이터 시각화
- **Recharts**: 반응형 차트 라이브러리
  - 막대 차트 (Bar Chart)
  - 라인 차트 (Line Chart)
  - 파이 차트 (Pie Chart)
  - 영역 차트 (Area Chart)

### 상태 관리
- **Zustand**: 경량 전역 상태 관리
  - 사용자 인증 상태
  - 선택된 상품 ID
  - 날짜 범위 필터
  - 로컬 스토리지 자동 동기화 (persist 미들웨어)
- **TanStack Query (React Query)**: 서버 상태 관리 및 데이터 페칭
  - 캐싱 전략
  - 자동 리페칭
  - 로딩/에러 상태 관리

### 날짜 처리
- **date-fns**: 날짜 포맷팅 및 계산
- **React Day Picker**: 날짜 선택 컴포넌트

## 🎨 디자인 시스템

### 컬러 팔레트
- **Primary Color**: Emerald/Green (에메랄드-그린)
  - `emerald-50` ~ `emerald-900`
  - `green-500`, `green-600`
- **Neutral Colors**: Gray 계열
  - 배경: `gray-50`, `gray-100`
  - 텍스트: `gray-600`, `gray-700`, `gray-900`
  - 경계선: `gray-200`, `gray-300`
- **Accent Colors**:
  - 성공: `emerald-500`
  - 경고: `yellow-500`
  - 위험: `red-500`

### 타이포그래피
- 기본 폰트는 `/styles/globals.css`에서 설정
- 반응형 폰트 크기 적용

### 레이아웃
- **헤더**: 고정 네비게이션 (sticky top)
- **메인 컨텐츠**: 최대 너비 제한 (`max-w-7xl`)
- **카드**: 그림자 효과 및 모서리 둥글림 (`rounded-lg`)
- **반응형**: 모바일, 태블릿, 데스크톱 대응

## 👤 사용자 정보

### 기본 계정 정보 (통일됨)
- **ID**: `1`
- **이메일**: `kim@suelo.co.kr`
- **이름**: `김슈엘` (성: 김, 이름: 슈엘)
- **쇼핑몰명**: `슈엘로 화장품`
- **사이트**: `https://suelo.co.kr`
- **가입일**: `2026-01-01`

**사용처:**
- 로그인 페이지 (기본 계정)
- 상단 네비게이션 (사용자 표시)
- 계정 관리 페이지 (프로필 정보)

## 📊 데이터 구조

### 사용자 (User)
```typescript
interface User {
  id: string;           // 사용자 ID
  email: string;        // 이메일
  name: string;         // 이름
  lastName: string;     // 성
  siteType: string;     // 쇼핑몰 타입 (Cafe24, etc.)
  siteName: string;     // 쇼핑몰명
  siteUrl: string;      // 쇼핑몰 URL
  timezone: string;     // 시간대
  businessCategory: string; // 업종
  createdAt: Date;      // 가입일
}
```

### 상품 (Product)
```typescript
interface Product {
  id: string;           // 상품 ID
  name: string;         // 상품명
  category: string;     // 카테고리
  imageUrl: string;     // 이미지 URL
  price: number;        // 가격
  stock: number;        // 재고 수량
}
```

### 고객 (Customer)
```typescript
interface Customer {
  id: string;           // 고객 ID
  name: string;         // 고객명
  email: string;        // 이메일
  grade: string;        // 등급 (VIP, Gold, Silver, Bronze)
  totalSpent: number;   // 총 구매액
  totalOrders: number;  // 총 구매 횟수
  avgOrderValue: number;// 평균 구매액
  lastPurchaseDate: string; // 최근 구매일
  points: number;       // 적립금
}
```

### 리뷰 (Review)
```typescript
interface Review {
  id: string;           // 리뷰 ID
  productId: string;    // 상품 ID
  rating: number;       // 평점 (1-5)
  content: string;      // 리뷰 내용
  keywords: string[];   // 추출된 키워드
}
```

## 🔄 데이터 흐름

### Mock 모드 (현재)
1. **사용자 인터랙션**
   - 로그인: `kim@suelo.co.kr` + 아무 비밀번호
   - Zustand Store에 사용자 정보 저장
   - localStorage에 자동 저장 (새로고침해도 유지)

2. **상품/고객 분석**
   - 상품 선택 → Zustand Store 업데이트
   - 날짜 범위 선택 → Zustand Store 업데이트
   - TanStack Query가 Store 변경 감지
   - Mock API 시뮬레이션 (300-400ms 지연)

3. **UI 업데이트**
   - 로딩 상태: Skeleton UI 표시
   - 데이터 수신: 차트 및 테이블 렌더링
   - 에러 발생: EmptyState 컴포넌트 표시

### Production 모드 (백엔드 연동 후)
1. **로그인**
   - 실제 API 호출: `POST /auth/login`
   - JWT 토큰 수신
   - Zustand + localStorage에 저장

2. **데이터 페칭**
   - 모든 API 요청에 JWT 토큰 자동 포함
   - 실제 데이터베이스에서 조회
   - TanStack Query 캐싱

3. **자동 인증**
   - localStorage에 토큰 있으면 자동 로그인
   - 401 에러 시 자동 로그아웃
   - 토큰 만료 시 재발급 (Refresh Token)

## 🚀 향후 개선 방향

### Phase 1: 실제 API 연동 (완료)
- Mock 데이터를 실제 백엔드 API로 교체
- 인증/인가 시스템 구현
- 환경 변수만 변경하면 즉시 전환 가능

### Phase 2: 고급 분석 기능
- 상품 비교 분석
- 예측 분석 (판매량 예측)
- 코호트 분석

### Phase 3: 알림 시스템
- 실시간 판매 알림
- 재고 부족 알림
- 이상 징후 감지

### Phase 4: 리포트 생성
- PDF 리포트 자동 생성
- 엑셀 데이터 내보내기
- 이메일 리포트 자동 발송

## 📱 브라우저 호환성

- Chrome (최신 2개 버전)
- Firefox (최신 2개 버전)
- Safari (최신 2개 버전)
- Edge (최신 2개 버전)

## 📄 라이선스

이 프로젝트는 슈엘로 쇼핑몰의 내부 사용 목적으로 개발되었습니다.
