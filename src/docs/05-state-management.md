# 상태 관리 가이드

## 📦 상태 관리 아키텍처 개요

**성장통 (Growth Analytics)** 는 두 가지 주요 상태 관리 라이브러리를 사용합니다:

1. **Zustand**: 클라이언트 전역 상태 관리 (UI 상태, 필터 등)
2. **TanStack Query**: 서버 상태 관리 (API 데이터 페칭 및 캐싱)

이러한 분리는 각 도구가 가장 잘하는 영역에 집중할 수 있게 합니다.

---

## 🎯 상태 분류

### 클라이언트 상태 (Zustand)
사용자 인터랙션과 관련된 로컬 상태

**예시:**
- 선택된 상품 ID
- 날짜 범위 필터
- UI 토글 상태 (모달, 사이드바 등)
- 테마 설정

### 서버 상태 (TanStack Query)
백엔드에서 가져오는 데이터 상태

**예시:**
- 상품 목록
- 고객 데이터
- 판매 통계
- 리뷰 데이터

---

## 🔵 Zustand 사용 가이드

프로젝트에는 두 가지 주요 Store가 있습니다:
1. **useAuthStore**: 인증 상태 관리 (persist 미들웨어 사용)
2. **useFilterStore**: 필터 상태 관리

### 기본 Store 구조

#### useAuthStore (인증 상태)

```typescript
// store/useAuthStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
      updateUser: (userData) => set((state) => ({
        user: state.user ? { ...state.user, ...userData } : null,
      })),
    }),
    {
      name: 'auth-storage', // localStorage key
    }
  )
);
```

#### useFilterStore (필터 상태)

```typescript
// store/useFilterStore.ts
import { create } from 'zustand';

interface DateRange {
  start: Date;
  end: Date;
}

interface FilterState {
  // State
  selectedProductIds: string[];  // 다중 선택 지원
  dateRange: DateRange;
  
  // Actions
  setProducts: (ids: string[]) => void;
  setDateRange: (range: DateRange) => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  // Initial State
  selectedProductIds: [],
  dateRange: {
    start: subDays(new Date(), 30),
    end: new Date(),
  },
  
  // Actions
  setProducts: (ids) => set({ selectedProductIds: ids }),
  setDateRange: (range) => set({ dateRange: range }),
}));
```

### Store 사용하기

#### 1. 전체 State 가져오기
```typescript
function Component() {
  const { selectedProductId, dateRange, setProduct, setDateRange } = useFilterStore();
  
  return (
    <div>
      <p>선택된 상품: {selectedProductId}</p>
      <button onClick={() => setProduct('p1')}>상품 1 선택</button>
    </div>
  );
}
```

#### 2. 특정 State만 선택하기 (성능 최적화)
```typescript
function Component() {
  // 이 컴포넌트는 selectedProductIds가 변경될 때만 리렌더링됨
  const selectedProductIds = useFilterStore((state) => state.selectedProductIds);
  const setProducts = useFilterStore((state) => state.setProducts);
  
  return <div>{selectedProductIds.join(', ')}</div>;
}

// 인증 상태 사용 예시
function UserProfile() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  if (!isAuthenticated) return <div>로그인이 필요합니다</div>;
  
  return <div>{user?.name}</div>;
}
```

#### 3. Shallow 비교로 객체 선택
```typescript
import { shallow } from 'zustand/shallow';

function Component() {
  // dateRange의 내용이 실제로 변경될 때만 리렌더링
  const dateRange = useFilterStore(
    (state) => state.dateRange,
    shallow
  );
  
  return <div>{dateRange.start.toLocaleDateString()}</div>;
}
```

### 고급 패턴

#### 1. Computed Values
```typescript
interface FilterState {
  selectedProductId: string | null;
  dateRange: DateRange;
  
  // Computed
  getDaysDiff: () => number;
}

export const useFilterStore = create<FilterState>((set, get) => ({
  selectedProductId: null,
  dateRange: { start: new Date(), end: new Date() },
  
  getDaysDiff: () => {
    const { dateRange } = get();
    return Math.ceil(
      (dateRange.end.getTime() - dateRange.start.getTime()) / (1000 * 60 * 60 * 24)
    );
  },
}));
```

#### 2. Middleware: DevTools
```typescript
import { devtools } from 'zustand/middleware';

export const useFilterStore = create<FilterState>()(
  devtools(
    (set) => ({
      selectedProductId: null,
      dateRange: { start: new Date(), end: new Date() },
      setProduct: (id) => set({ selectedProductId: id }),
    }),
    { name: 'FilterStore' }
  )
);
```

#### 3. Middleware: Persist (로컬 스토리지)
```typescript
import { persist } from 'zustand/middleware';

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'light',
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'settings-storage', // localStorage key
    }
  )
);
```

#### 4. 복잡한 State 업데이트
```typescript
interface State {
  users: User[];
  addUser: (user: User) => void;
  updateUser: (id: string, data: Partial<User>) => void;
  deleteUser: (id: string) => void;
}

export const useUserStore = create<State>((set) => ({
  users: [],
  
  addUser: (user) =>
    set((state) => ({
      users: [...state.users, user],
    })),
    
  updateUser: (id, data) =>
    set((state) => ({
      users: state.users.map((user) =>
        user.id === id ? { ...user, ...data } : user
      ),
    })),
    
  deleteUser: (id) =>
    set((state) => ({
      users: state.users.filter((user) => user.id !== id),
    })),
}));
```

---

## 🟢 TanStack Query 사용 가이드

### Query 기본 사용법

```typescript
// hooks/useProducts.ts
import { useQuery } from '@tanstack/react-query';
import { mockProducts } from '../lib/mockData';

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      // API 호출 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockProducts;
    },
  });
};
```

### 컴포넌트에서 사용
```typescript
import { useProducts } from '../hooks/useProducts';

function ProductList() {
  const { data, isLoading, error, refetch } = useProducts();

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>에러 발생: {error.message}</div>;
  }

  return (
    <div>
      {data?.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
      <button onClick={() => refetch()}>새로고침</button>
    </div>
  );
}
```

### Query 옵션

#### 1. 조건부 실행 (enabled)
```typescript
export const useProductStats = () => {
  const selectedProductId = useFilterStore((state) => state.selectedProductId);

  return useQuery({
    queryKey: ['productStats', selectedProductId],
    queryFn: async () => {
      // selectedProductId가 null이면 실행되지 않음
      return fetchProductStats(selectedProductId!);
    },
    enabled: !!selectedProductId, // selectedProductId가 있을 때만 실행
  });
};
```

#### 2. 의존성 기반 리페칭
```typescript
export const useProductStats = () => {
  const selectedProductId = useFilterStore((state) => state.selectedProductId);
  const dateRange = useFilterStore((state) => state.dateRange);

  return useQuery({
    // queryKey에 의존성을 포함
    queryKey: ['productStats', selectedProductId, dateRange],
    queryFn: async () => {
      // selectedProductId나 dateRange가 변경되면 자동으로 리페치
      return fetchProductStats(selectedProductId!, dateRange);
    },
    enabled: !!selectedProductId,
  });
};
```

#### 3. 캐싱 전략
```typescript
export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    
    // 5분간 fresh 상태 유지 (리페치 안 함)
    staleTime: 5 * 60 * 1000,
    
    // 10분간 캐시 메모리에 유지
    cacheTime: 10 * 60 * 1000,
    
    // 윈도우 포커스 시 자동 리페치 여부
    refetchOnWindowFocus: false,
    
    // 마운트 시 자동 리페치 여부
    refetchOnMount: true,
    
    // 재연결 시 자동 리페치 여부
    refetchOnReconnect: true,
    
    // 재시도 횟수
    retry: 3,
    
    // 재시도 지연 (exponential backoff)
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
```

### Mutation 사용법

#### 1. 기본 Mutation
```typescript
// hooks/useUpdateProduct.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (product: Product) => {
      const response = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        body: JSON.stringify(product),
      });
      return response.json();
    },
    
    // 성공 시 캐시 무효화
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    
    // 에러 처리
    onError: (error) => {
      console.error('Failed to update product:', error);
    },
  });
};
```

#### 2. 컴포넌트에서 Mutation 사용
```typescript
function ProductForm() {
  const updateProduct = useUpdateProduct();

  const handleSubmit = (product: Product) => {
    updateProduct.mutate(product, {
      onSuccess: () => {
        toast.success('상품이 업데이트되었습니다.');
      },
      onError: (error) => {
        toast.error('업데이트 실패: ' + error.message);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* 폼 필드 */}
      <button 
        type="submit" 
        disabled={updateProduct.isLoading}
      >
        {updateProduct.isLoading ? '저장 중...' : '저장'}
      </button>
    </form>
  );
}
```

#### 3. Optimistic Updates
```typescript
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProductApi,
    
    // Mutation 실행 전
    onMutate: async (newProduct) => {
      // 진행 중인 리페치 취소
      await queryClient.cancelQueries({ queryKey: ['products'] });

      // 이전 데이터 백업
      const previousProducts = queryClient.getQueryData(['products']);

      // UI에 낙관적으로 업데이트 반영
      queryClient.setQueryData(['products'], (old: Product[]) =>
        old.map((product) =>
          product.id === newProduct.id ? newProduct : product
        )
      );

      // Rollback을 위한 컨텍스트 반환
      return { previousProducts };
    },
    
    // 에러 시 롤백
    onError: (err, newProduct, context) => {
      queryClient.setQueryData(['products'], context?.previousProducts);
    },
    
    // 완료 후 리페치
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};
```

### Query Prefetching

#### 1. 마우스 호버 시 미리 로드
```typescript
import { useQueryClient } from '@tanstack/react-query';

function ProductCard({ product }: { product: Product }) {
  const queryClient = useQueryClient();

  const handleMouseEnter = () => {
    queryClient.prefetchQuery({
      queryKey: ['productStats', product.id],
      queryFn: () => fetchProductStats(product.id),
      staleTime: 60 * 1000, // 1분
    });
  };

  return (
    <div onMouseEnter={handleMouseEnter}>
      {product.name}
    </div>
  );
}
```

#### 2. 다음 페이지 미리 로드
```typescript
function ProductPagination({ currentPage }: { currentPage: number }) {
  const queryClient = useQueryClient();

  useEffect(() => {
    // 다음 페이지 미리 로드
    queryClient.prefetchQuery({
      queryKey: ['products', currentPage + 1],
      queryFn: () => fetchProducts(currentPage + 1),
    });
  }, [currentPage, queryClient]);

  return <div>{/* 페이지네이션 UI */}</div>;
}
```

---

## 🔄 Zustand와 TanStack Query 연동

### 패턴 1: Zustand가 Query 의존성 제공

```typescript
// store/useFilterStore.ts
export const useFilterStore = create<FilterState>((set) => ({
  selectedProductId: null,
  setProduct: (id) => set({ selectedProductId: id }),
}));

// hooks/useProductStats.ts
export const useProductStats = () => {
  // Zustand store에서 필터 값 가져오기
  const selectedProductId = useFilterStore((state) => state.selectedProductId);
  const dateRange = useFilterStore((state) => state.dateRange);

  // Query의 의존성으로 사용
  return useQuery({
    queryKey: ['productStats', selectedProductId, dateRange],
    queryFn: async () => {
      if (!selectedProductId) return null;
      return fetchProductStats(selectedProductId, dateRange);
    },
    enabled: !!selectedProductId,
  });
};
```

### 패턴 2: Query 결과를 Zustand에 저장

```typescript
// store/useCacheStore.ts
interface CacheState {
  lastFetchedProducts: Product[] | null;
  setLastFetchedProducts: (products: Product[]) => void;
}

export const useCacheStore = create<CacheState>((set) => ({
  lastFetchedProducts: null,
  setLastFetchedProducts: (products) => set({ lastFetchedProducts: products }),
}));

// 컴포넌트에서
function Component() {
  const setLastFetchedProducts = useCacheStore((state) => state.setLastFetchedProducts);
  
  const { data } = useProducts({
    onSuccess: (data) => {
      // Query 성공 시 Zustand에도 저장
      setLastFetchedProducts(data);
    },
  });
}
```

---

## 📊 실제 사용 예시

### ProductDetailPage 상태 흐름

```typescript
// pages/ProductDetailPage.tsx
export function ProductDetailPage() {
  // 1. Zustand에서 필터 상태 가져오기
  const selectedProductId = useFilterStore((state) => state.selectedProductId);
  const dateRange = useFilterStore((state) => state.dateRange);
  const setProduct = useFilterStore((state) => state.setProduct);
  const setDateRange = useFilterStore((state) => state.setDateRange);

  // 2. TanStack Query로 서버 데이터 페칭
  const { data: products } = useProducts();
  const { data: stats, isLoading } = useProductStats();
  const { data: reviews } = useReviews();

  // 3. 사용자 인터랙션 처리
  const handleProductSelect = (productId: string) => {
    setProduct(productId); // Zustand 업데이트
    // → useProductStats가 자동으로 리페치됨
  };

  const handleDateChange = (range: DateRange) => {
    setDateRange(range); // Zustand 업데이트
    // → useProductStats가 자동으로 리페치됨
  };

  return (
    <div>
      <DateRangePicker
        value={dateRange}
        onChange={handleDateChange}
      />
      
      <ProductSelector
        products={products}
        selectedId={selectedProductId}
        onSelect={handleProductSelect}
      />
      
      {isLoading ? (
        <Skeleton />
      ) : (
        <ProductAnalyticsChart data={stats} />
      )}
    </div>
  );
}
```

---

## 🎯 베스트 프랙티스

### 1. 상태를 올바른 곳에 배치
```typescript
// ✅ Good: UI 상태는 Zustand
const isModalOpen = useUIStore((state) => state.isModalOpen);

// ✅ Good: 서버 데이터는 TanStack Query
const { data: products } = useProducts();

// ❌ Bad: 서버 데이터를 Zustand에 저장
const products = useDataStore((state) => state.products); // Anti-pattern
```

### 2. Query Key 설계
```typescript
// ✅ Good: 명확하고 일관된 구조
['products']
['products', productId]
['products', productId, 'stats']
['products', productId, 'reviews', { startDate, endDate }]

// ❌ Bad: 일관성 없는 구조
['getProducts']
['product_stats_123']
['reviews-for-product-123']
```

### 3. 선택적 구독으로 성능 최적화
```typescript
// ✅ Good: 필요한 것만 구독
const selectedProductId = useFilterStore((state) => state.selectedProductId);

// ❌ Bad: 전체 store 구독 (불필요한 리렌더링)
const { selectedProductId, dateRange, /* ... 사용하지 않는 것들 */ } = useFilterStore();
```

### 4. Query 의존성 명확히
```typescript
// ✅ Good: queryKey에 모든 의존성 포함
useQuery({
  queryKey: ['productStats', productId, dateRange],
  queryFn: () => fetchStats(productId, dateRange),
});

// ❌ Bad: queryKey에 의존성 누락
useQuery({
  queryKey: ['productStats'],
  queryFn: () => fetchStats(productId, dateRange), // productId, dateRange 변경 감지 안 됨
});
```

### 5. 에러 처리
```typescript
// ✅ Good: 에러 상태 처리
const { data, error, isLoading } = useProducts();

if (error) {
  return <ErrorState message={error.message} />;
}

// ❌ Bad: 에러 무시
const { data } = useProducts();
return <div>{data.map(...)}</div>; // data가 undefined일 수 있음
```

---

## 🛠 디버깅 도구

### TanStack Query DevTools
```typescript
// App.tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YourApp />
      {/* 개발 모드에서만 표시 */}
      {import.meta.env.DEV && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
```

### Zustand DevTools
```typescript
import { devtools } from 'zustand/middleware';

export const useStore = create<State>()(
  devtools(
    (set) => ({
      // store 정의
    }),
    { name: 'MyStore' }
  )
);
```

---

이 가이드를 따라 효율적이고 확장 가능한 상태 관리를 구현할 수 있습니다.
