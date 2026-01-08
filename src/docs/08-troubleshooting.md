# 트러블슈팅 가이드

## 🔧 자주 발생하는 문제와 해결 방법

---

## 🚀 빌드 및 실행 문제

### 1. `npm install` 실패

#### 문제
```bash
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

#### 해결 방법
```bash
# 1. 캐시 정리
npm cache clean --force

# 2. node_modules 삭제 후 재설치
rm -rf node_modules package-lock.json
npm install

# 3. 레거시 피어 의존성 옵션으로 설치
npm install --legacy-peer-deps

# 4. Node.js 버전 확인 (v18 이상 권장)
node -v
```

### 2. `npm run dev` 실행 시 포트 충돌

#### 문제
```
Port 3000 is in use
```

#### 해결 방법
```bash
# 1. 사용 중인 프로세스 종료 (macOS/Linux)
lsof -ti:3000 | xargs kill -9

# 2. 사용 중인 프로세스 종료 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# 3. 다른 포트 사용
npm run dev -- --port 5173
```

```typescript
// vite.config.ts에서 포트 변경
export default defineConfig({
  server: {
    port: 5173, // 또는 다른 포트
  },
});
```

### 3. TypeScript 에러

#### 문제
```
Cannot find module './types/product' or its corresponding type declarations
```

#### 해결 방법
```bash
# 1. TypeScript 서버 재시작 (VS Code)
Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"

# 2. tsconfig.json 확인
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}

# 3. 파일 경로 확인
import { Product } from './types/product'; // ✅
import { Product } from './types/product.ts'; // ❌ .ts 확장자 제거
```

---

## 🎨 UI 및 스타일 문제

### 1. Tailwind CSS 클래스가 적용되지 않음

#### 문제
스타일이 전혀 적용되지 않음

#### 해결 방법
```typescript
// 1. globals.css에서 Tailwind imports 확인
@tailwind base;
@tailwind components;
@tailwind utilities;

// 2. tailwind.config.ts에서 content 경로 확인
export default {
  content: [
    "./index.html",
    "./App.tsx",
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
}

// 3. 개발 서버 재시작
npm run dev
```

### 2. 글꼴 크기/두께가 의도한 대로 나오지 않음

#### 문제
Tailwind 타이포그래피 클래스가 무시됨

#### 원인
`/styles/globals.css`에 기본 HTML 요소 스타일이 설정되어 있음

#### 해결 방법
```tsx
// ❌ Bad: Tailwind 타이포그래피 클래스 사용
<h1 className="text-2xl font-bold">제목</h1>

// ✅ Good: 기본 스타일 활용 또는 명시적 요청 시에만 사용
<h1>제목</h1>

// 또는 globals.css 수정 (신중하게)
```

### 3. 다크모드가 동작하지 않음

#### 문제
다크모드 클래스가 적용되지 않음

#### 해결 방법
```typescript
// tailwind.config.ts
export default {
  darkMode: 'class', // 'media' 대신 'class' 사용
  // ...
}
```

```tsx
// 다크모드 토글
<html className="dark">
```

---

## 📊 데이터 및 상태 관리 문제

### 1. TanStack Query 데이터가 로드되지 않음

#### 문제
```typescript
const { data } = useProducts();
console.log(data); // undefined
```

#### 해결 방법
```typescript
// 1. 로딩 상태 확인
const { data, isLoading, error } = useProducts();

if (isLoading) {
  console.log('Loading...');
  return <Skeleton />;
}

if (error) {
  console.error('Error:', error);
  return <ErrorState />;
}

// 2. QueryClient 설정 확인
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// 3. queryKey 확인
useQuery({
  queryKey: ['products'], // 배열 형태여야 함
  queryFn: fetchProducts,
});
```

### 2. Zustand Store 업데이트가 반영되지 않음

#### 문제
```typescript
setProduct('p1');
console.log(selectedProductId); // 여전히 null
```

#### 해결 방법
```typescript
// 1. 선택적 구독 사용
const selectedProductId = useFilterStore((state) => state.selectedProductId);

// 2. 불변성 유지
// ❌ Bad
set((state) => {
  state.dateRange.start = newDate; // 직접 수정
  return state;
});

// ✅ Good
set((state) => ({
  dateRange: {
    ...state.dateRange,
    start: newDate,
  },
}));

// 3. DevTools로 확인
import { devtools } from 'zustand/middleware';

export const useFilterStore = create(
  devtools((set) => ({
    // ...
  }), { name: 'FilterStore' })
);
```

### 3. Query가 자동으로 리페치되지 않음

#### 문제
Store 값이 변경되어도 Query가 다시 실행되지 않음

#### 해결 방법
```typescript
// queryKey에 의존성 포함
const selectedProductId = useFilterStore((state) => state.selectedProductId);

useQuery({
  queryKey: ['productStats', selectedProductId], // ✅ 의존성 포함
  queryFn: () => fetchStats(selectedProductId),
});

// ❌ Bad: 의존성 누락
useQuery({
  queryKey: ['productStats'], // selectedProductId 변경 감지 안 됨
  queryFn: () => fetchStats(selectedProductId),
});
```

---

## 🔌 API 연동 문제

### 1. CORS 에러

#### 문제
```
Access to fetch at 'http://api.example.com' from origin 'http://localhost:5173' has been blocked by CORS policy
```

#### 해결 방법
```typescript
// 개발 환경: vite.config.ts에서 프록시 설정
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});

// 백엔드에서 CORS 허용 (Express 예시)
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
```

### 2. API 요청 타임아웃

#### 문제
```
Error: timeout of 60000ms exceeded
TimeoutError: signal timed out
TypeError: Failed to fetch (ERR_CONNECTION_TIMED_OUT)
```

#### 원인
- 재구매 상세 API 등 복잡한 쿼리는 처리 시간이 길 수 있음 (최대 60초)
- 백엔드 서버 성능 또는 데이터베이스 쿼리 최적화 필요

#### 해결 방법
```typescript
// src/lib/config.ts
export const config = {
  // API 타임아웃을 60초로 설정 (재구매 상세 API 대응)
  apiTimeout: 60000,
};

// src/services/api.ts
const makeRequest = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<T> => {
  const response = await fetch(url, {
    ...options,
    signal: AbortSignal.timeout(config.apiTimeout),
  });
  return handleResponse<T>(response);
};

// TanStack Query 재시도 설정 (타임아웃 가능성 있는 API는 재시도 제한)
useQuery({
  queryKey: ['repurchase', 'customer-detail', customerId],
  queryFn: () => getCustomerRepurchaseDetail(customerId!),
  retry: 1, // 타임아웃 가능성이 있어 재시도 1회로 제한
  staleTime: 1 * 60 * 1000,
});
```

**백엔드 최적화 권장사항:**
1. 데이터베이스 인덱스 추가
2. 쿼리 최적화 (N+1 문제 해결)
3. Redis 등 캐싱 도입 (5-10분)
4. 응답 시간 목표: 5초 이내

### 3. 재구매 고객 상세 API 404 에러

#### 문제
```
Failed to load resource: the server responded with a status of 404 (Not Found)
GET /api/v1/repurchase-analysis/customer/장수진|강원특별자치도.../detail
ApiError: 고객을 찾을 수 없습니다
```

#### 원인
- 비회원 고객 ID가 "이름|주소" 형식으로 특수문자 포함
- URL 인코딩 필요
- 백엔드 API 간 customer_id 불일치

#### 해결 방법
```typescript
// src/services/repurchase.ts
export async function getCustomerRepurchaseDetail(
  customerId: string
): Promise<CustomerRepurchaseData> {
  // URL 인코딩 처리
  const encodedId = encodeURIComponent(customerId);
  const response = await apiClient.get<CustomerRepurchaseDetail>(
    `/api/v1/repurchase-analysis/customer/${encodedId}/detail`
  );
  // ...
}
```

**백엔드 확인사항:**
- `/customers` API의 `customer_id`와 `/customer/{customer_id}/detail` API의 ID가 정확히 일치해야 함
- 비회원의 경우 "이름|주소" 형식이 양쪽 API에서 동일해야 함

### 4. 재구매 고객 테이블 React Key 경고

#### 문제
```
Warning: Encountered two children with the same key, ``
```

#### 원인
- 비회원 고객의 `customer_id`가 빈 문자열이어서 중복 key 발생

#### 해결 방법
백엔드에서 `/customers` API 응답 시 비회원의 `customer_id`를 "이름|주소" 형식으로 제공:

```json
{
  "user_id": null,
  "customer_id": "장수진|강원특별자치도 원주시 한지공원길 102",
  "name": "장수진",
  "grade": "전체"
}
```

프론트엔드에서는 이를 그대로 사용:
```typescript
// src/services/repurchase.ts
id: customer.customer_id, // 백엔드에서 제공하는 고유 ID 사용
```

### 5. 빈 재구매 상품 데이터

#### 문제
고객 상세 API에서 `products` 배열이 비어있음

#### 원인
정상적인 경우로, 다음과 같은 이유일 수 있음:
- 고객이 구매는 했지만 아직 재구매하지 않음
- 특정 상품을 선택했지만 해당 고객은 그 상품을 구매하지 않음
- 데이터 집계 시점 차이

#### 해결 방법
```typescript
// UI에서 빈 데이터 처리
{customerRepurchaseDetail?.products && 
 customerRepurchaseDetail.products.length > 0 ? (
  <RepurchaseProductChart data={customerRepurchaseDetail.products} />
) : (
  <EmptyState
    title="재구매 상품 데이터가 없습니다"
    description="해당 고객은 아직 재구매한 상품이 없거나, 데이터가 집계되지 않았습니다."
  />
)}
```

### 6. 401 Unauthorized 에러

#### 문제
인증 토큰 문제로 API 요청 실패

#### 해결 방법
```typescript
// axios 인터셉터로 토큰 자동 추가
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 토큰 갱신 로직
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const { data } = await axios.post('/api/auth/refresh', {
          refreshToken,
        });

        localStorage.setItem('accessToken', data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

        return apiClient(originalRequest);
      } catch (refreshError) {
        // 로그아웃 처리
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
```

---

## 📅 날짜 관련 문제

### 1. 날짜 포맷이 잘못 표시됨

#### 문제
```
2026-12-10T00:00:00.000Z → "Invalid Date"
```

#### 해결 방법
```typescript
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

// 1. Date 객체로 변환
const date = new Date('2026-12-10');

// 2. 포맷팅
const formatted = format(date, 'yyyy년 MM월 dd일', { locale: ko });

// 3. ISO 문자열에서 변환
const isoString = '2026-12-10T00:00:00.000Z';
const date = new Date(isoString);
const formatted = format(date, 'MM월 dd일');
```

### 2. 시간대 문제

#### 문제
서버에서 받은 날짜가 로컬 시간대와 다름

#### 해결 방법
```typescript
// 1. UTC로 통일
const utcDate = new Date(dateString);

// 2. 로컬 시간대로 변환
import { formatInTimeZone } from 'date-fns-tz';

const formatted = formatInTimeZone(
  utcDate,
  'Asia/Seoul',
  'yyyy-MM-dd HH:mm:ss'
);

// 3. API 요청 시 UTC로 전송
const startDate = dateRange.start.toISOString().split('T')[0];
```

---

## 📊 차트 렌더링 문제

### 1. Recharts가 표시되지 않음

#### 문제
차트 영역이 빈 화면으로 나옴

#### 해결 방법
```typescript
// 1. 데이터 형식 확인
const data = [
  { date: '01/01', value: 15 }, // ✅ 올바른 형식
];

// ❌ 잘못된 형식
const data = [
  { x: '01/01', y: 15 },
];

// 2. ResponsiveContainer 사용
<ResponsiveContainer width="100%" height={300}>
  <BarChart data={data}>
    {/* ... */}
  </BarChart>
</ResponsiveContainer>

// 3. 부모 컨테이너 높이 설정
<div style={{ height: 400 }}>
  <ResponsiveContainer width="100%" height="100%">
    {/* 차트 */}
  </ResponsiveContainer>
</div>
```

### 2. 차트 툴팁이 잘림

#### 문제
차트 툴팁이 카드 경계에 잘림

#### 해결 방법
```typescript
// overflow 설정
<div className="overflow-visible">
  <ResponsiveContainer>
    <BarChart>
      <Tooltip />
    </BarChart>
  </ResponsiveContainer>
</div>

// 또는 커스텀 툴팁
<Tooltip
  content={({ active, payload }) => {
    if (!active || !payload) return null;
    return (
      <div className="bg-white p-2 border rounded shadow-lg">
        {/* 커스텀 내용 */}
      </div>
    );
  }}
/>
```

---

## 🎯 성능 문제

### 1. 초기 로딩이 느림

#### 문제
첫 페이지 로드 시 5초 이상 소요

#### 해결 방법
```typescript
// 1. 코드 분할
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const CustomerInsightPage = lazy(() => import('./pages/CustomerInsightPage'));

<Suspense fallback={<Skeleton />}>
  <ProductDetailPage />
</Suspense>

// 2. 번들 분석
npm run build
npx vite-bundle-visualizer

// 3. 이미지 최적화
<img src={imageUrl} loading="lazy" alt="..." />

// 4. 폰트 최적화
<link rel="preload" href="/fonts/main.woff2" as="font" type="font/woff2" crossorigin />
```

### 2. 리렌더링이 너무 많이 발생

#### 문제
컴포넌트가 불필요하게 자주 리렌더링됨

#### 해결 방법
```typescript
// 1. React.memo 사용
export const ProductCard = memo(function ProductCard({ product }) {
  return <div>{product.name}</div>;
});

// 2. useCallback 사용
const handleClick = useCallback(() => {
  console.log('Clicked');
}, []); // 의존성 배열 비어있음

// 3. useMemo 사용
const sortedProducts = useMemo(() => {
  return products.sort((a, b) => a.price - b.price);
}, [products]);

// 4. Zustand 선택적 구독
// ❌ Bad: 전체 구독
const store = useFilterStore();

// ✅ Good: 필요한 부분만 구독
const selectedId = useFilterStore((state) => state.selectedProductId);
```

### 3. 메모리 누수

#### 문제
페이지를 오래 사용하면 브라우저가 느려짐

#### 해결 방법
```typescript
// 1. useEffect cleanup
useEffect(() => {
  const timer = setInterval(() => {
    // ...
  }, 1000);

  return () => clearInterval(timer); // ✅ cleanup
}, []);

// 2. 이벤트 리스너 제거
useEffect(() => {
  const handleResize = () => {
    // ...
  };

  window.addEventListener('resize', handleResize);

  return () => {
    window.removeEventListener('resize', handleResize); // ✅ cleanup
  };
}, []);

// 3. AbortController 사용
useEffect(() => {
  const controller = new AbortController();

  fetch('/api/data', { signal: controller.signal })
    .then(/* ... */);

  return () => controller.abort(); // ✅ cleanup
}, []);
```

---

## 🧪 개발 도구 문제

### 1. React DevTools가 연결되지 않음

#### 해결 방법
```bash
# 1. 브라우저 확장 프로그램 재설치
# Chrome Web Store에서 React Developer Tools 재설치

# 2. 개발 모드 확인
console.log(import.meta.env.DEV); // true여야 함

# 3. 브라우저 캐시 삭제
```

### 2. Hot Module Replacement (HMR) 동작 안 함

#### 문제
코드 변경 시 자동 새로고침 안 됨

#### 해결 방법
```typescript
// vite.config.ts
export default defineConfig({
  server: {
    hmr: {
      overlay: true,
    },
  },
});

// 개발 서버 재시작
npm run dev
```

---

## 🔍 디버깅 팁

### 1. Console 로그 활용

```typescript
// 개발 모드에서만 로그
if (import.meta.env.DEV) {
  console.log('Debug info:', data);
}

// 그룹 로그
console.group('API Response');
console.log('Status:', response.status);
console.log('Data:', response.data);
console.groupEnd();

// 테이블 로그
console.table(products);
```

### 2. React DevTools Profiler

```typescript
import { Profiler } from 'react';

function onRenderCallback(
  id,
  phase,
  actualDuration,
  baseDuration,
  startTime,
  commitTime
) {
  console.log(`${id} took ${actualDuration}ms to render`);
}

<Profiler id="ProductList" onRender={onRenderCallback}>
  <ProductList />
</Profiler>
```

### 3. Network 탭 활용

- API 요청/응답 확인
- 응답 시간 측정
- 요청 헤더 확인
- 에러 상태 코드 확인

---

## 📞 추가 도움이 필요할 때

### 1. 로그 수집

```bash
# 에러 로그 파일로 저장
npm run dev > dev.log 2>&1
```

### 2. 재현 단계 정리

1. 어떤 페이지에서 발생했는가?
2. 어떤 액션을 했는가?
3. 예상 동작은 무엇인가?
4. 실제 동작은 무엇인가?
5. 에러 메시지는 무엇인가?

### 3. 환경 정보 수집

```bash
# Node.js 버전
node -v

# npm 버전
npm -v

# 운영체제
uname -a  # macOS/Linux
systeminfo  # Windows
```

---

문제가 해결되지 않으면 개발팀에 위 정보와 함께 문의해주세요.
