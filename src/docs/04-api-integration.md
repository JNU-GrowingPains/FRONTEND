# API 연동 가이드

## 📡 개요

현재 **성장통 (Growth Analytics)** 프로젝트는 Mock 데이터로 동작합니다.
이 문서는 실제 백엔드 API와 연동하는 방법을 단계별로 설명합니다.

---

## 🎯 API 연동 전략

### Phase 1: API 엔드포인트 정의
백엔드 팀과 협업하여 필요한 API 엔드포인트를 정의합니다.

### Phase 2: API 클라이언트 생성
Axios 또는 Fetch API를 사용하여 API 클라이언트를 구성합니다.

### Phase 3: Hook 수정
Mock 데이터를 사용하는 Custom Hook을 실제 API 호출로 변경합니다.

### Phase 4: 에러 처리 강화
네트워크 에러, 인증 실패 등 다양한 에러 상황을 처리합니다.

### Phase 5: 인증/인가 구현
JWT 토큰 기반 인증 시스템을 구현합니다.

---

## 🔐 인증 (Authentication) API

프로젝트에 이미 인증 시스템이 구현되어 있습니다. 아래 API를 백엔드와 연동하세요.

### 1. 로그인 (POST /api/auth/login)

사용자 로그인 처리

**Request:**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "kim@suelo.co.kr",
  "password": "password123"
}
```

**Response (성공):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "1",
      "email": "kim@suelo.co.kr",
      "name": "슈엘",
      "lastName": "김",
      "siteType": "Cafe24",
      "siteName": "슈엘로 화장품",
      "siteUrl": "https://suelo.co.kr",
      "timezone": "아시아/서울",
      "businessCategory": "화장품",
      "createdAt": "2026-01-01T00:00:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Response (실패):**
```json
{
  "success": false,
  "error": {
    "message": "이메일 또는 비밀번호가 올바르지 않습니다.",
    "code": "INVALID_CREDENTIALS"
  }
}
```

**구현 위치:** `/lib/authApi.ts` - `loginApi()`

### 2. 회원가입 (POST /api/auth/signup)

신규 사용자 등록

**Request:**
```http
POST /api/auth/signup
Content-Type: application/json

{
  "siteType": "Cafe24",
  "siteName": "슈엘로",
  "siteUrl": "https://shuello.com",
  "timezone": "아시아/서울",
  "businessCategory": "화장품",
  "name": "슈엘",
  "lastName": "김",
  "email": "kim@shuello.com",
  "password": "password123",
  "agreeToTerms": true
}
```

**Response (성공):**
```json
{
  "success": true,
  "data": {
    "user": { /* 사용자 정보 */ },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Response (실패):**
```json
{
  "success": false,
  "error": {
    "message": "이미 가입된 이메일입니다.",
    "code": "EMAIL_ALREADY_EXISTS",
    "field": "email"
  }
}
```

**구현 위치:** `/lib/authApi.ts` - `signupApi()`

### 3. 비밀번호 찾기 (POST /api/auth/forgot-password)

비밀번호 재설정 이메일 발송

**Request:**
```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "kim@shuello.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "비밀번호 재설정 링크가 이메일로 전송되었습니다."
}
```

**구현 위치:** `/lib/authApi.ts` - `forgotPasswordApi()`

### 4. 로그아웃 (POST /api/auth/logout)

사용자 로그아웃 처리

**Request:**
```http
POST /api/auth/logout
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "message": "로그아웃 되었습니다."
}
```

**구현 위치:** `/lib/authApi.ts` - `logoutApi()`

### 5. 현재 사용자 조회 (GET /api/auth/me)

JWT 토큰으로 현재 로그인한 사용자 정보 조회

**Request:**
```http
GET /api/auth/me
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user-123",
    "email": "kim@shuello.com",
    "name": "슈엘",
    "lastName": "김",
    "siteType": "Cafe24",
    "siteName": "슈엘로",
    "siteUrl": "https://shuello.com",
    "timezone": "아시아/서울",
    "businessCategory": "화장품",
    "createdAt": "2026-01-01T00:00:00Z"
  }
}
```

**구현 위치:** `/lib/authApi.ts` - `getCurrentUserApi()`

### 인증 구현 방법

#### 1. 토큰 저장 및 관리

```typescript
// store/useAuthStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 로그인 시 토큰을 localStorage에 자동 저장
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage', // localStorage key
    }
  )
);
```

#### 2. API 요청에 토큰 포함

```typescript
// lib/apiClient.ts (생성 필요)
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
});

// 요청 인터셉터: 모든 요청에 토큰 추가
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터: 401 에러 시 로그아웃
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

#### 3. 실제 API 연동

```typescript
// lib/authApi.ts 수정
import apiClient from './apiClient';

export async function loginApi(credentials: LoginCredentials): Promise<AuthResponse> {
  const response = await apiClient.post('/auth/login', credentials);
  return response.data.data; // { user, token }
}

export async function signupApi(data: SignupData): Promise<AuthResponse> {
  const response = await apiClient.post('/auth/signup', data);
  return response.data.data;
}

export async function forgotPasswordApi(data: ForgotPasswordData): Promise<{ message: string }> {
  const response = await apiClient.post('/auth/forgot-password', data);
  return { message: response.data.message };
}

export async function logoutApi(): Promise<void> {
  await apiClient.post('/auth/logout');
}

export async function getCurrentUserApi(token: string): Promise<User> {
  const response = await apiClient.get('/auth/me');
  return response.data.data;
}
```

---

## 🔌 필요한 API 엔드포인트

### 1. 상품 관련 API

#### GET /api/products
전체 상품 목록 조회

**Request:**
```http
GET /api/products
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "p1",
      "name": "히알루론산 세럼",
      "category": "세럼",
      "imageUrl": "https://...",
      "price": 45000,
      "stock": 234
    }
  ]
}
```

#### GET /api/products/:productId/stats
특정 상품의 판매 통계 조회

**Request:**
```http
GET /api/products/p1/stats?startDate=2026-01-01&endDate=2026-01-31
```

**Query Parameters:**
- `startDate` (string, required): 시작일 (YYYY-MM-DD)
- `endDate` (string, required): 종료일 (YYYY-MM-DD)

**Response:**
```json
{
  "success": true,
  "data": {
    "kpi": {
      "totalSales": 450,
      "totalBuyers": 320,
      "totalRevenue": 20250000,
      "averageOrderValue": 63281
    },
    "timeline": [
      {
        "date": "2026-01-01",
        "sales": 15,
        "buyers": 12,
        "revenue": 675000
      }
    ]
  }
}
```

### 2. 고객 관련 API

#### GET /api/customers
전체 고객 목록 조회

**Request:**
```http
GET /api/customers?page=1&limit=10&sortBy=totalSpent&order=desc
```

**Query Parameters:**
- `page` (number, optional): 페이지 번호 (기본값: 1)
- `limit` (number, optional): 페이지당 항목 수 (기본값: 10)
- `sortBy` (string, optional): 정렬 기준 (totalSpent, totalOrders, lastPurchaseDate)
- `order` (string, optional): 정렬 순서 (asc, desc)

**Response:**
```json
{
  "success": true,
  "data": {
    "customers": [
      {
        "id": "c1",
        "name": "김민지",
        "email": "minji@example.com",
        "grade": "VIP",
        "totalSpent": 2450000,
        "totalOrders": 28,
        "avgOrderValue": 87500,
        "lastPurchaseDate": "2026-12-08",
        "points": 24500
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 50,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

#### GET /api/customers/grade-distribution
고객 등급별 분포

**Request:**
```http
GET /api/customers/grade-distribution
```

**Response:**
```json
{
  "success": true,
  "data": [
    { "grade": "VIP", "count": 15, "percentage": 15 },
    { "grade": "Gold", "count": 25, "percentage": 25 },
    { "grade": "Silver", "count": 35, "percentage": 35 },
    { "grade": "Bronze", "count": 25, "percentage": 25 }
  ]
}
```

#### GET /api/customers/top
적립금 기준 상위 고객

**Request:**
```http
GET /api/customers/top?limit=3&sortBy=points
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "c1",
      "name": "김민지",
      "points": 24500
    }
  ]
}
```

### 3. 리뷰 관련 API

#### GET /api/products/:productId/reviews
특정 상품의 리뷰 목록

**Request:**
```http
GET /api/products/p1/reviews?startDate=2026-01-01&endDate=2026-01-31
```

**Response:**
```json
{
  "success": true,
  "data": {
    "reviews": [
      {
        "id": "r1",
        "productId": "p1",
        "rating": 5,
        "content": "피부가 촉촉해졌어요!",
        "keywords": ["촉촉", "피부", "만족"],
        "createdAt": "2026-01-15T10:30:00Z"
      }
    ],
    "summary": {
      "averageRating": 4.5,
      "totalReviews": 120
    }
  }
}
```

#### GET /api/products/:productId/reviews/keywords
리뷰 키워드 분석

**Request:**
```http
GET /api/products/p1/reviews/keywords?startDate=2026-01-01&endDate=2026-01-31
```

**Response:**
```json
{
  "success": true,
  "data": {
    "wordCloud": [
      { "text": "촉촉", "value": 45 },
      { "text": "효과", "value": 38 },
      { "text": "만족", "value": 32 }
    ],
    "topKeywords": [
      { "keyword": "촉촉", "count": 45, "sentiment": "positive" },
      { "keyword": "효과", "count": 38, "sentiment": "positive" }
    ]
  }
}
```

### 4. 계정 관련 API

#### GET /api/account
현재 로그인한 사용자 정보

**Request:**
```http
GET /api/account
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "admin1",
    "name": "김슈엘",
    "email": "kim.suello@suello.com",
    "role": "관리자",
    "createdAt": "2023-01-15T00:00:00Z",
    "settings": {
      "emailNotifications": {
        "weeklyReport": true,
        "importantUpdates": true
      }
    }
  }
}
```

#### PUT /api/account/password
비밀번호 변경

**Request:**
```http
PUT /api/account/password
Authorization: Bearer {token}
Content-Type: application/json

{
  "currentPassword": "old_password",
  "newPassword": "new_password",
  "confirmPassword": "new_password"
}
```

**Response:**
```json
{
  "success": true,
  "message": "비밀번호가 성공적으로 변경되었습니다."
}
```

#### PUT /api/account/settings
알림 설정 변경

**Request:**
```http
PUT /api/account/settings
Authorization: Bearer {token}
Content-Type: application/json

{
  "emailNotifications": {
    "weeklyReport": true,
    "importantUpdates": false
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "설정이 저장되었습니다."
}
```

### 5. 인증 관련 API

#### POST /api/auth/login
로그인

**Request:**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "kim.suello@suello.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600,
    "user": {
      "id": "admin1",
      "name": "김슈엘",
      "email": "kim.suello@suello.com",
      "role": "관리자"
    }
  }
}
```

#### POST /api/auth/refresh
토큰 갱신

**Request:**
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600
  }
}
```

---

## 🛠 API 클라이언트 구현

현재 프로젝트에는 `src/services/api.ts`에 API 클라이언트가 구현되어 있습니다.

### 1. API 클라이언트 설정

#### API 클라이언트 구조

프로젝트는 `src/services/api.ts`에 중앙화된 API 클라이언트를 사용합니다:

```typescript
// services/api.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.suelo.co.kr/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request 인터셉터 - 토큰 자동 추가
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response 인터셉터 - 에러 처리
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401 에러 시 토큰 갱신 시도
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken } = response.data.data;
        localStorage.setItem('accessToken', accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // 토큰 갱신 실패 시 로그아웃
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
```

### 2. API 함수 정의

```typescript
// lib/api/products.ts
import { apiClient } from '../apiClient';
import { Product, ProductStats } from '../../types/product';

interface ProductStatsParams {
  productId: string;
  startDate: string;
  endDate: string;
}

export const productsApi = {
  // 전체 상품 목록
  getAll: async (): Promise<Product[]> => {
    const response = await apiClient.get('/products');
    return response.data.data;
  },

  // 상품 통계
  getStats: async ({ productId, startDate, endDate }: ProductStatsParams) => {
    const response = await apiClient.get(`/products/${productId}/stats`, {
      params: { startDate, endDate },
    });
    return response.data.data;
  },
};
```

```typescript
// lib/api/customers.ts
import { apiClient } from '../apiClient';
import { Customer, GradeDistribution } from '../../types/customer';

interface CustomersParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export const customersApi = {
  getAll: async (params: CustomersParams = {}) => {
    const response = await apiClient.get('/customers', { params });
    return response.data.data;
  },

  getGradeDistribution: async (): Promise<GradeDistribution[]> => {
    const response = await apiClient.get('/customers/grade-distribution');
    return response.data.data;
  },

  getTop: async (limit = 3) => {
    const response = await apiClient.get('/customers/top', {
      params: { limit, sortBy: 'points' },
    });
    return response.data.data;
  },
};
```

```typescript
// lib/api/reviews.ts
import { apiClient } from '../apiClient';

interface ReviewsParams {
  productId: string;
  startDate: string;
  endDate: string;
}

export const reviewsApi = {
  getByProduct: async ({ productId, startDate, endDate }: ReviewsParams) => {
    const response = await apiClient.get(`/products/${productId}/reviews`, {
      params: { startDate, endDate },
    });
    return response.data.data;
  },

  getKeywords: async ({ productId, startDate, endDate }: ReviewsParams) => {
    const response = await apiClient.get(`/products/${productId}/reviews/keywords`, {
      params: { startDate, endDate },
    });
    return response.data.data;
  },
};
```

### 3. Hook 수정

#### Before (Mock 데이터)
```typescript
// hooks/useProducts.ts
import { useQuery } from '@tanstack/react-query';
import { mockProducts } from '../lib/mockData';

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockProducts;
    },
  });
};
```

#### After (실제 API)
```typescript
// hooks/useProducts.ts
import { useQuery } from '@tanstack/react-query';
import { productsApi } from '../lib/api/products';

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: productsApi.getAll,
    staleTime: 5 * 60 * 1000, // 5분간 fresh 상태 유지
    cacheTime: 10 * 60 * 1000, // 10분간 캐시 유지
  });
};

export const useProductStats = () => {
  const selectedProductId = useFilterStore((state) => state.selectedProductId);
  const dateRange = useFilterStore((state) => state.dateRange);

  return useQuery({
    queryKey: ['productStats', selectedProductId, dateRange],
    queryFn: async () => {
      if (!selectedProductId) return null;

      const startDate = dateRange.start.toISOString().split('T')[0];
      const endDate = dateRange.end.toISOString().split('T')[0];

      return productsApi.getStats({
        productId: selectedProductId,
        startDate,
        endDate,
      });
    },
    enabled: !!selectedProductId,
  });
};
```

---

## 🔐 환경 변수 설정

### .env 파일 생성
```bash
# .env.development
VITE_API_BASE_URL=http://localhost:3000/api

# .env.production
VITE_API_BASE_URL=https://api.suello.com/api
```

### 환경 변수 타입 정의
```typescript
// vite-env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

---

## 🚨 에러 처리

### 1. 커스텀 에러 클래스

```typescript
// lib/errors.ts
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const handleApiError = (error: any): ApiError => {
  if (error.response) {
    // 서버가 2xx 범위를 벗어난 상태 코드로 응답
    return new ApiError(
      error.response.status,
      error.response.data?.message || '서버 오류가 발생했습니다.',
      error.response.data
    );
  } else if (error.request) {
    // 요청이 전송되었지만 응답을 받지 못함
    return new ApiError(0, '네트워크 오류가 발생했습니다.');
  } else {
    // 요청 설정 중 오류 발생
    return new ApiError(0, error.message || '알 수 없는 오류가 발생했습니다.');
  }
};
```

### 2. Hook에서 에러 처리

```typescript
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { handleApiError } from '../lib/errors';

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: productsApi.getAll,
    onError: (error) => {
      const apiError = handleApiError(error);
      toast.error(apiError.message);
    },
  });
};
```

### 3. 컴포넌트에서 에러 처리

```typescript
function ProductList() {
  const { data, isLoading, error } = useProducts();

  if (error) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="데이터를 불러올 수 없습니다"
        description="잠시 후 다시 시도해주세요."
      />
    );
  }

  if (isLoading) {
    return <Skeleton />;
  }

  return <div>{/* 정상 렌더링 */}</div>;
}
```

---

## 🔄 마이그레이션 체크리스트

### 준비 단계
- [ ] 백엔드 API 문서 확인
- [ ] API 엔드포인트 테스트 (Postman 등)
- [ ] 환경 변수 설정
- [ ] API 클라이언트 구현

### 구현 단계
- [ ] API 함수 작성 (`/lib/api/*.ts`)
- [ ] Hook 수정 (Mock → 실제 API)
- [ ] 에러 처리 추가
- [ ] 로딩 상태 처리 확인

### 테스트 단계
- [ ] 각 API 엔드포인트 동작 확인
- [ ] 에러 시나리오 테스트
- [ ] 로딩 상태 UI 확인
- [ ] 캐싱 동작 확인

### 배포 단계
- [ ] 프로덕션 환경 변수 설정
- [ ] CORS 설정 확인
- [ ] 인증 토큰 처리 확인
- [ ] 성능 모니터링 설정

---

## 📊 API 성능 최적화

### 1. 캐싱 전략
```typescript
export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: productsApi.getAll,
    staleTime: 5 * 60 * 1000,      // 5분간 fresh
    cacheTime: 10 * 60 * 1000,      // 10분간 캐시 유지
    refetchOnWindowFocus: false,    // 윈도우 포커스 시 리페치 비활성화
    refetchOnMount: false,          // 마운트 시 리페치 비활성화
  });
};
```

### 2. 병렬 요청
```typescript
function DashboardPage() {
  const { data: products } = useProducts();
  const { data: customers } = useCustomers();
  const { data: stats } = useProductStats();

  // 세 개의 요청이 병렬로 실행됨
}
```

### 3. Prefetching
```typescript
import { useQueryClient } from '@tanstack/react-query';

function ProductSelector() {
  const queryClient = useQueryClient();

  const handleMouseEnter = (productId: string) => {
    // 호버 시 미리 데이터 페칭
    queryClient.prefetchQuery({
      queryKey: ['productStats', productId],
      queryFn: () => productsApi.getStats({ productId, /* ... */ }),
    });
  };
}
```

---

이 가이드를 따라 Mock 데이터에서 실제 API로 안전하게 전환할 수 있습니다.