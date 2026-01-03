# 성장통 (Growth Analytics)

슈엘로 화장품 쇼핑몰을 위한 데이터 분석 대시보드

## 🌱 프로젝트 소개

**성장통**은 슈엘로 화장품 쇼핑몰의 판매 데이터, 고객 데이터, 리뷰 데이터를 시각화하여 비즈니스 인사이트를 제공하는 B2B 대시보드입니다.

### 주요 기능

- **상품 분석**: 10개 화장품의 판매 추이, 재고 현황, 리뷰 분석
- **고객 분석**: 등급별 고객 분포, 포인트 TOP3, 구매 패턴
- **계정 관리**: 사용자 프로필, 비즈니스 정보 관리
- **인증 시스템**: 로그인, 회원가입, 비밀번호 찾기

## 🚀 기술 스택

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS 4.0 + shadcn/ui
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Charts**: Recharts
- **Date Handling**: date-fns
- **Form**: React Hook Form + Zod

## 📦 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.example` 파일을 복사하여 `.env` 파일을 생성합니다:

```bash
cp .env.example .env
```

개발 환경 (Mock 모드):
```env
VITE_API_MODE=mock
```

프로덕션 환경 (실제 API):
```env
VITE_API_MODE=production
VITE_API_BASE_URL=https://api.suelo.co.kr/v1
VITE_API_KEY=your_api_key_here
```

### 3. 개발 서버 실행

```bash
npm run dev
```

http://localhost:5173 에서 확인할 수 있습니다.

### 4. 프로덕션 빌드

```bash
npm run build
```

빌드된 파일은 `dist` 폴더에 생성됩니다.

## 📖 문서

자세한 문서는 `/docs` 폴더를 참고하세요:

- [프로젝트 개요](./docs/01-project-overview.md)
- [파일 구조](./docs/02-file-structure.md)
- [개발 가이드](./docs/03-development-guide.md)
- [API 연동](./docs/04-api-integration.md)
- [상태 관리](./docs/05-state-management.md)
- [컴포넌트 가이드](./docs/06-component-guide.md)
- [배포 가이드](./docs/07-deployment.md)
- [문제 해결](./docs/08-troubleshooting.md)
- [API 연동 가이드](./docs/09-api-integration-guide.md)

## 🔐 기본 로그인 정보

Mock 모드에서는 아무 이메일/비밀번호로 로그인할 수 있습니다:

```
이메일: kim@suelo.co.kr
비밀번호: (아무 값)
```

## 🏗️ 프로젝트 구조

```
/
├── components/          # React 컴포넌트
│   ├── charts/         # 차트 컴포넌트
│   ├── common/         # 공통 컴포넌트
│   ├── customers/      # 고객 관련 컴포넌트
│   ├── products/       # 상품 관련 컴포넌트
│   ├── reviews/        # 리뷰 관련 컴포넌트
│   └── ui/            # shadcn/ui 컴포넌트
├── docs/               # 문서
├── hooks/              # React Hooks
├── lib/                # 유틸리티 및 설정
├── pages/              # 페이지 컴포넌트
├── services/           # API 서비스 레이어
├── store/              # Zustand 스토어
├── types/              # TypeScript 타입 정의
└── App.tsx             # 메인 앱 컴포넌트
```

## 🔄 Mock 모드 ↔ Production 모드 전환

### Mock 모드 (개발)
- `.env` 파일: `VITE_API_MODE=mock`
- 로컬 mock 데이터 사용
- 빠른 개발 및 테스트 가능

### Production 모드 (배포)
- `.env` 파일: `VITE_API_MODE=production`
- 실제 백엔드 API 호출
- API 키 및 Base URL 필요

환경 변수 변경 후 **개발 서버를 재시작**해야 합니다.

## 🎨 디자인 시스템

- **Primary Color**: Emerald Green (#10b981)
- **Typography**: Pretendard (fallback: system-ui)
- **Spacing**: Tailwind의 8px 기반 시스템
- **Components**: shadcn/ui 기반 재사용 가능한 컴포넌트

## 🧪 테스트 계정

Mock 모드에서 사용할 수 있는 테스트 계정:

```
이메일: kim@suelo.co.kr
이름: 김슈엘
쇼핑몰: 슈엘로 (https://suelo.co.kr)
카테고리: 화장품
```

## 📊 데이터 구조

### 상품 (Product)
- 10개의 화장품 (세럼, 앰플, 크림 등)
- 실시간 재고 및 판매 데이터
- 리뷰 및 평점 통계

### 고객 (Customer)
- 등급별 분류 (VIP, Gold, Silver, Bronze)
- 포인트 및 구매 이력
- 최근 방문일 추적

### 리뷰 (Review)
- 상품별 고객 리뷰
- 평점 (1-5점)
- 워드 클라우드 분석

## 🤝 기여

이 프로젝트는 슈엘로 쇼핑몰을 위한 내부 도구입니다.

## 📝 라이선스

Copyright © 2026 성장통 (Growth Analytics)

## 🔗 관련 링크

- [슈엘로 쇼핑몰](https://suelo.co.kr)
- [React 공식 문서](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [Recharts](https://recharts.org)

## 📞 문의

프로젝트 관련 문의사항은 이슈를 등록해주세요.
