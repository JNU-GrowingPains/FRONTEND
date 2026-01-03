# 성장통 (Growth Analytics)

슈엘로 화장품 쇼핑몰을 위한 데이터 분석 플랫폼

## 📋 프로젝트 소개

성장통은 쇼핑몰 운영자들이 상품, 고객, 재구매 데이터를 분석하여 비즈니스 인사이트를 얻을 수 있는 대시보드 플랫폼입니다.

### 주요 기능

- 📊 **상품 분석**: 상품별 판매 통계, 트렌드 분석
- 👥 **고객 분석**: 고객 등급 분포, 고객별 구매 이력
- 🔄 **재구매 분석**: 재구매율, 지역별 재구매 분석
- ⭐ **리뷰 분석**: 리뷰 워드클라우드, 평점 분석

## 🚀 시작하기

### 필수 요구사항

- Node.js v18.0.0 이상
- npm v9.0.0 이상 (또는 yarn, pnpm)

### 설치 방법

1. **저장소 클론**
```bash
git clone <repository-url>
cd "Suelo Data Analysis Platform"
```

2. **의존성 설치**
```bash
npm install
```

3. **환경 변수 설정**
```bash
# .env.example을 복사하여 .env 파일 생성
cp .env.example .env

# .env 파일을 편집하여 필요한 환경 변수 설정
# 개발 환경에서는 기본값(mock 모드)으로 동작합니다
```

4. **개발 서버 실행**
```bash
npm run dev
```

브라우저에서 `http://localhost:3000`으로 접속합니다.

## 📦 빌드

### 프로덕션 빌드

```bash
npm run build
```

빌드된 파일은 `dist/` 폴더에 생성됩니다.

### 빌드 미리보기

```bash
npm run preview
```

프로덕션 빌드를 로컬에서 테스트할 수 있습니다.

## 🔧 환경 변수

프로젝트 루트에 `.env` 파일을 생성하여 다음 환경 변수를 설정할 수 있습니다:

| 변수명 | 설명 | 기본값 |
|--------|------|--------|
| `VITE_API_MODE` | API 모드 (`mock` 또는 `production`) | `mock` |
| `VITE_API_BASE_URL` | API Base URL | `https://api.suelo.co.kr/v1` |
| `VITE_API_KEY` | API 인증 키 | (없음) |
| `VITE_SUELO_SHOP_URL` | 슈엘로 쇼핑몰 URL | `https://suelo.co.kr` |
| `VITE_APP_NAME` | 애플리케이션 이름 | `성장통` |
| `VITE_APP_VERSION` | 애플리케이션 버전 | `1.0.0` |

자세한 내용은 [`.env.example`](./.env.example) 파일을 참조하세요.

## 🔐 기본 로그인 정보 (Mock 모드)

개발 환경(Mock 모드)에서는 다음 계정으로 로그인할 수 있습니다:

- **이메일**: `kim@suelo.co.kr`
- **비밀번호**: (아무 값)

## 📚 문서

자세한 문서는 [`src/docs/`](./src/docs/) 폴더를 참조하세요:

- [프로젝트 개요](./src/docs/01-project-overview.md)
- [파일 구조](./src/docs/02-file-structure.md)
- [개발 가이드](./src/docs/03-development-guide.md)
- [API 연동 가이드](./src/docs/04-api-integration.md)
- [배포 가이드](./src/docs/07-deployment.md)

## 🏗️ 기술 스택

- **프레임워크**: React 18 + TypeScript
- **빌드 도구**: Vite
- **상태 관리**: Zustand, TanStack Query
- **UI 라이브러리**: Tailwind CSS, shadcn/ui
- **차트**: Recharts, react-d3-cloud

## 📄 라이선스

이 프로젝트는 비공개 프로젝트입니다.
