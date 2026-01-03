# 배포 가이드

## 🚀 배포 개요

**성장통 (Growth Analytics)** 프로젝트를 프로덕션 환경에 배포하는 방법을 설명합니다.

---

## 📦 프로덕션 빌드

### 1. 빌드 준비

#### 환경 변수 확인
```bash
# .env.production 파일 생성
VITE_API_BASE_URL=https://api.suello.com/api
```

#### package.json 버전 확인
```json
{
  "name": "growth-analytics",
  "version": "1.0.0",
  "type": "module"
}
```

### 2. 빌드 실행

```bash
# 의존성 설치
npm install

# 프로덕션 빌드
npm run build
```

**빌드 결과:**
- `/dist` 폴더에 최적화된 파일 생성
- JavaScript 번들 최소화
- CSS 최적화
- 이미지 압축

### 3. 빌드 결과 확인

```bash
# 빌드된 파일 미리보기
npm run preview
```

브라우저에서 `http://localhost:4173` 열어서 프로덕션 빌드 테스트

### 4. 빌드 최적화

#### Vite 설정 최적화
```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    // 청크 크기 제한 경고 설정
    chunkSizeWarningLimit: 1000,
    
    // 코드 분할
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'query-vendor': ['@tanstack/react-query'],
          'chart-vendor': ['recharts'],
          'ui-vendor': ['lucide-react', 'date-fns'],
        },
      },
    },
    
    // Minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // console.log 제거
      },
    },
  },
});
```

---

## 🌐 호스팅 플랫폼별 배포

### Vercel (권장)

프로젝트 루트에 `vercel.json` 파일이 포함되어 있어 Vercel 배포가 간편합니다.

#### 1. Vercel CLI 설치
```bash
npm install -g vercel
```

#### 2. Vercel 로그인
```bash
vercel login
```

#### 3. 프로젝트 배포
```bash
# 첫 배포
vercel

# 프로덕션 배포
vercel --prod
```

#### 4. GitHub 연동 (자동 배포)

1. [Vercel Dashboard](https://vercel.com/dashboard)에서 "Add New Project" 클릭
2. GitHub 저장소 연결
3. 프로젝트 설정 (vercel.json에 이미 설정됨):
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. 환경 변수 설정:
   - `VITE_API_BASE_URL`: 프로덕션 API URL
   - `VITE_API_MODE`: `production`
   - 기타 필요한 환경 변수

5. Deploy 클릭

**vercel.json 설정:**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**자동 배포 워크플로우:**
- `main` 브랜치에 Push → 자동으로 프로덕션 배포
- PR 생성 → 미리보기 배포 자동 생성

### Netlify

#### 1. Netlify CLI 설치
```bash
npm install -g netlify-cli
```

#### 2. Netlify 로그인
```bash
netlify login
```

#### 3. 프로젝트 초기화
```bash
netlify init
```

#### 4. 배포 설정
```bash
# Build command
npm run build

# Publish directory
dist
```

#### 5. 배포
```bash
netlify deploy --prod
```

#### 6. GitHub 연동

**netlify.toml** 파일 생성:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

### AWS S3 + CloudFront

#### 1. S3 버킷 생성

```bash
# AWS CLI 설치 필요
aws s3 mb s3://growth-analytics-app
```

#### 2. 빌드 파일 업로드

```bash
# 빌드
npm run build

# S3 업로드
aws s3 sync dist/ s3://growth-analytics-app --delete
```

#### 3. S3 정적 웹사이트 호스팅 설정

```bash
aws s3 website s3://growth-analytics-app \
  --index-document index.html \
  --error-document index.html
```

#### 4. CloudFront 배포 생성

1. AWS Console → CloudFront → Create Distribution
2. Origin Domain: S3 버킷 선택
3. Viewer Protocol Policy: Redirect HTTP to HTTPS
4. Default Root Object: `index.html`
5. Error Pages:
   - 403: `/index.html` (200 응답)
   - 404: `/index.html` (200 응답)

#### 5. 자동 배포 스크립트

```bash
# deploy.sh
#!/bin/bash

# 빌드
npm run build

# S3 업로드
aws s3 sync dist/ s3://growth-analytics-app --delete

# CloudFront 캐시 무효화
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"

echo "배포 완료!"
```

---

## 🔐 보안 설정

### 1. 환경 변수 관리

**절대 커밋하지 말 것:**
- `.env.local`
- `.env.production`
- API 키, 시크릿

**.gitignore에 추가:**
```
.env
.env.local
.env.production
.env.*.local
```

### 2. API 키 보호

```typescript
// ✅ Good: 환경 변수 사용
const API_URL = import.meta.env.VITE_API_BASE_URL;

// ❌ Bad: 하드코딩
const API_URL = 'https://api.suello.com/api';
```

### 3. HTTPS 강제

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    https: true, // 개발 환경에서도 HTTPS
  },
});
```

### 4. CSP (Content Security Policy) 설정

```html
<!-- index.html -->
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
/>
```

---

## 🔄 CI/CD 설정

### GitHub Actions

**.github/workflows/deploy.yml:**
```yaml
name: Deploy to Production

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          VITE_API_BASE_URL: ${{ secrets.VITE_API_BASE_URL }}

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### 환경별 배포

```yaml
# .github/workflows/deploy-staging.yml
name: Deploy to Staging

on:
  push:
    branches:
      - develop

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          VITE_API_BASE_URL: ${{ secrets.STAGING_API_URL }}

      - name: Deploy to Staging
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

---

## 📊 성능 모니터링

### 1. Lighthouse 점수 확인

```bash
# Lighthouse CI 설치
npm install -g @lhci/cli

# Lighthouse 실행
lhci autorun
```

**목표 점수:**
- Performance: 90+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 90+

### 2. Web Vitals 모니터링

```typescript
// App.tsx
import { onCLS, onFID, onFCP, onLCP, onTTFB } from 'web-vitals';

function sendToAnalytics(metric: any) {
  // Google Analytics 등으로 전송
  console.log(metric);
}

onCLS(sendToAnalytics);
onFID(sendToAnalytics);
onFCP(sendToAnalytics);
onLCP(sendToAnalytics);
onTTFB(sendToAnalytics);
```

### 3. Bundle 분석

```bash
# Rollup Plugin Visualizer 설치
npm install --save-dev rollup-plugin-visualizer
```

```typescript
// vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
});
```

빌드 후 `stats.html` 파일 생성되어 번들 크기 시각화

---

## 🐛 프로덕션 에러 추적

### Sentry 통합

#### 1. Sentry 설치
```bash
npm install @sentry/react
```

#### 2. Sentry 초기화
```typescript
// App.tsx
import * as Sentry from '@sentry/react';

if (import.meta.env.PROD) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE,
    integrations: [
      new Sentry.BrowserTracing(),
      new Sentry.Replay(),
    ],
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
}
```

#### 3. Error Boundary
```typescript
import { ErrorBoundary } from '@sentry/react';

function App() {
  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <YourApp />
    </ErrorBoundary>
  );
}
```

---

## 🔍 배포 전 체크리스트

### 기능 테스트
- [ ] 모든 페이지가 정상 작동하는가?
- [ ] 상품 선택 및 필터링이 동작하는가?
- [ ] 날짜 범위 선택이 동작하는가?
- [ ] 차트가 정상적으로 표시되는가?

### 성능 테스트
- [ ] 초기 로딩 속도가 3초 이내인가?
- [ ] 이미지 최적화가 되어 있는가?
- [ ] JavaScript 번들 크기가 적절한가?
- [ ] 캐싱이 적절히 설정되어 있는가?

### 보안 테스트
- [ ] 환경 변수가 노출되지 않는가?
- [ ] HTTPS가 강제되는가?
- [ ] API 키가 안전하게 관리되는가?

### 호환성 테스트
- [ ] Chrome에서 정상 작동하는가?
- [ ] Safari에서 정상 작동하는가?
- [ ] Firefox에서 정상 작동하는가?
- [ ] Edge에서 정상 작동하는가?
- [ ] 모바일 브라우저에서 정상 작동하는가?

### SEO 설정
- [ ] 메타 태그가 적절히 설정되어 있는가?
- [ ] Open Graph 태그가 있는가?
- [ ] Favicon이 설정되어 있는가?

---

## 📈 배포 후 모니터링

### 1. 실시간 모니터링

**확인 사항:**
- 서버 응답 시간
- API 에러율
- 사용자 수
- 페이지 로딩 속도

### 2. 로그 모니터링

**Vercel Analytics:**
```typescript
// vercel.json
{
  "analytics": {
    "enabled": true
  }
}
```

### 3. 알림 설정

**Slack 웹훅 설정:**
```yaml
# GitHub Actions에 Slack 알림 추가
- name: Notify Slack
  if: always()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

---

## 🔄 롤백 프로세스

### Vercel 롤백

```bash
# 이전 배포로 롤백
vercel rollback
```

### Git 기반 롤백

```bash
# 이전 커밋으로 되돌리기
git revert HEAD
git push origin main

# 특정 커밋으로 되돌리기
git reset --hard <commit-hash>
git push --force origin main
```

---

## 📱 모바일 최적화

### PWA 설정

#### manifest.json
```json
{
  "name": "성장통 - Growth Analytics",
  "short_name": "성장통",
  "description": "슈엘로 화장품 쇼핑몰 분석 플랫폼",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#10b981",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

#### Service Worker
```typescript
// vite.config.ts
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: '성장통',
        short_name: '성장통',
        theme_color: '#10b981',
      },
    }),
  ],
});
```

---

## 🌍 다국어 지원 (향후)

### i18n 설정 준비

```bash
npm install react-i18next i18next
```

```typescript
// i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    ko: {
      translation: {
        'products.title': '상품 분석',
      },
    },
    en: {
      translation: {
        'products.title': 'Product Analytics',
      },
    },
  },
  lng: 'ko',
  fallbackLng: 'ko',
});
```

---

이 가이드를 따라 안전하고 효율적으로 프로덕션 환경에 배포할 수 있습니다.
