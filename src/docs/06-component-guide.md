# 컴포넌트 가이드

## 📦 컴포넌트 개요

**성장통 (Growth Analytics)** 프로젝트의 모든 컴포넌트는 재사용성, 확장성, 유지보수성을 고려하여 설계되었습니다.

---

## 🎨 shadcn/ui 컴포넌트

### 설치된 컴포넌트 목록

프로젝트에는 다음 shadcn/ui 컴포넌트들이 설치되어 있습니다:

- **레이아웃**: Card, Separator, Tabs, Accordion
- **입력**: Button, Input, Textarea, Select, Checkbox, Radio Group, Switch
- **폼**: Form (react-hook-form 통합)
- **피드백**: Alert, Toast (Sonner), Progress, Skeleton
- **오버레이**: Dialog, Sheet, Popover, Dropdown Menu, Hover Card
- **네비게이션**: Navigation Menu, Breadcrumb, Pagination
- **데이터**: Table, Badge, Avatar
- **유틸리티**: Calendar, Command

### 기본 사용법

#### Button
```typescript
import { Button } from './components/ui/button';

// Variants
<Button variant="default">기본</Button>
<Button variant="destructive">삭제</Button>
<Button variant="outline">아웃라인</Button>
<Button variant="secondary">보조</Button>
<Button variant="ghost">고스트</Button>
<Button variant="link">링크</Button>

// Sizes
<Button size="default">기본</Button>
<Button size="sm">작게</Button>
<Button size="lg">크게</Button>
<Button size="icon">아이콘</Button>
```

#### Card
```typescript
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>제목</CardTitle>
    <CardDescription>설명</CardDescription>
  </CardHeader>
  <CardContent>
    <p>본문 내용</p>
  </CardContent>
  <CardFooter>
    <Button>액션</Button>
  </CardFooter>
</Card>
```

#### Table
```typescript
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './components/ui/table';

<Table>
  <TableCaption>테이블 설명</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead>이름</TableHead>
      <TableHead>이메일</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {data.map((item) => (
      <TableRow key={item.id}>
        <TableCell>{item.name}</TableCell>
        <TableCell>{item.email}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

#### Badge
```typescript
import { Badge } from './components/ui/badge';

<Badge variant="default">기본</Badge>
<Badge variant="secondary">보조</Badge>
<Badge variant="destructive">위험</Badge>
<Badge variant="outline">아웃라인</Badge>

// 등급별 커스텀 스타일
<Badge className="bg-purple-100 text-purple-700">VIP</Badge>
<Badge className="bg-yellow-100 text-yellow-700">Gold</Badge>
```

---

## 📊 차트 컴포넌트

### ProductAnalyticsChart

상품 판매량과 매출을 동시에 보여주는 복합 차트

```typescript
import { ProductAnalyticsChart } from './components/charts/ProductAnalyticsChart';

<ProductAnalyticsChart
  data={[
    { date: '01/01', sales: 15, revenue: 675000 },
    { date: '01/02', sales: 23, revenue: 1035000 },
  ]}
/>
```

**특징:**
- 막대 차트 (판매량)
- 라인 차트 (매출)
- 툴팁 포맷팅 (숫자 천 단위 구분)
- 반응형 디자인
- 에메랄드 그린 테마

### SalesBarChart

판매량을 막대 차트로 표시

```typescript
import { SalesBarChart } from './components/charts/SalesBarChart';

<SalesBarChart
  data={[
    { date: '01/01', value: 15 },
    { date: '01/02', value: 23 },
  ]}
/>
```

**Props:**
```typescript
interface SalesBarChartProps {
  data: Array<{ date: string; value: number }>;
}
```

### GradeDistributionChart

고객 등급별 분포를 파이 차트로 표시

```typescript
import { GradeDistributionChart } from './components/charts/GradeDistributionChart';

<GradeDistributionChart
  data={[
    { grade: 'VIP', count: 15, percentage: 15 },
    { grade: 'Gold', count: 25, percentage: 25 },
    { grade: 'Silver', count: 35, percentage: 35 },
    { grade: 'Bronze', count: 25, percentage: 25 },
  ]}
/>
```

**특징:**
- 파이 차트
- 등급별 색상 코딩
- 백분율 표시
- 범례 포함

### CustomerPointTop3

적립금 기준 TOP 3 고객을 막대 차트로 표시

```typescript
import { CustomerPointTop3 } from './components/charts/CustomerPointTop3';

<CustomerPointTop3
  data={[
    { name: '김민지', points: 24500 },
    { name: '이수진', points: 22300 },
    { name: '박서연', points: 19800 },
  ]}
/>
```

### ReviewWordCloud

리뷰 키워드를 워드클라우드로 시각화

```typescript
import { ReviewWordCloud } from './components/charts/ReviewWordCloud';

<ReviewWordCloud
  data={[
    { text: '촉촉', value: 45 },
    { text: '효과', value: 38 },
    { text: '만족', value: 32 },
  ]}
/>
```

**특징:**
- 키워드 빈도에 따른 크기 조절
- 그리드 레이아웃
- 클릭 가능한 키워드
- 빈도 표시

---

## 🔧 공통 컴포넌트

### DateRangePicker

날짜 범위를 선택하는 컴포넌트

```typescript
import { DateRangePicker } from './components/common/DateRangePicker';

<DateRangePicker
  value={{ start: new Date(), end: new Date() }}
  onChange={(range) => console.log(range)}
/>
```

**Props:**
```typescript
interface DateRangePickerProps {
  value: {
    start: Date;
    end: Date;
  };
  onChange: (range: { start: Date; end: Date }) => void;
}
```

**특징:**
- 캘린더 아이콘 포함
- Popover 기반 UI
- 클릭으로만 선택 가능 (타이핑 불가)
- 시작일/종료일 표시
- 자동 포맷팅 (MM월 DD일)

**커스터마이징:**
```typescript
// 최대 선택 가능 범위 제한
const isDateDisabled = (date: Date) => {
  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 90); // 90일 후까지만
  return date > maxDate || date > today;
};

<DateRangePicker
  value={range}
  onChange={setRange}
  disabled={isDateDisabled}
/>
```

### PageHeader

페이지 상단에 제목과 설명을 표시

```typescript
import { PageHeader } from './components/common/PageHeader';

<PageHeader
  title="상품 분석"
  description="상품별 판매 데이터와 고객 리뷰를 분석합니다"
/>
```

**Props:**
```typescript
interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}
```

**고급 사용:**
```typescript
<PageHeader
  title="상품 분석"
  description="상품별 판매 데이터 분석"
  action={
    <Button>
      <Download className="mr-2 h-4 w-4" />
      리포트 다운로드
    </Button>
  }
/>
```

### EmptyState

데이터가 없거나 에러가 발생했을 때 표시

```typescript
import { EmptyState } from './components/common/EmptyState';
import { Package } from 'lucide-react';

<EmptyState
  icon={Package}
  title="상품을 선택해주세요"
  description="상품을 선택하면 해당 상품의 분석 데이터를 확인할 수 있습니다"
/>
```

**Props:**
```typescript
interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}
```

**사용 예시:**
```typescript
// 로딩 중
if (isLoading) {
  return <Skeleton className="h-64" />;
}

// 에러 발생
if (error) {
  return (
    <EmptyState
      icon={AlertCircle}
      title="데이터를 불러올 수 없습니다"
      description="잠시 후 다시 시도해주세요"
      action={<Button onClick={refetch}>다시 시도</Button>}
    />
  );
}

// 데이터 없음
if (!data || data.length === 0) {
  return (
    <EmptyState
      icon={Package}
      title="상품이 없습니다"
      description="새로운 상품을 추가해보세요"
    />
  );
}
```

---

## 🛍 상품 관련 컴포넌트

### ProductSelector

상품 목록을 테이블로 표시하고 선택 기능 제공

```typescript
import { ProductSelector } from './components/products/ProductSelector';

<ProductSelector
  products={products}
  selectedId={selectedProductId}
  onSelect={(id) => setSelectedProductId(id)}
/>
```

**Props:**
```typescript
interface ProductSelectorProps {
  products: Product[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}
```

**특징:**
- 5개씩 페이지네이션
- 선택된 상품 하이라이트 (에메랄드 그린)
- 반응형 테이블
- 가격 및 재고 표시
- 카테고리 뱃지

**테이블 컬럼:**
1. 상품명
2. 카테고리 (Badge)
3. 가격 (천 단위 구분)
4. 재고

### ProductSummaryCards

상품 주요 지표를 카드로 표시

```typescript
import { ProductSummaryCards } from './components/products/ProductSummaryCards';

<ProductSummaryCards
  kpi={{
    days: 30,
    sales: 20250000,
    items: 450,
    buyers: 320,
  }}
/>
```

**Props:**
```typescript
interface ProductSummaryCardsProps {
  kpi: {
    days: number;     // 조회 기간 (일)
    sales: number;    // 총 매출액 (원)
    items: number;    // 총 판매 수량 (개)
    buyers: number;   // 총 구매자 수 (명)
  };
}
```

**특징:**
- 4개 KPI 카드
- 아이콘 포함 (Lucide React)
- 숫자 포맷팅
- 그리드 레이아웃

**KPI 카드:**
1. **총 판매량**: ShoppingCart 아이콘
2. **총 구매자**: Users 아이콘
3. **총 매출**: DollarSign 아이콘
4. **평균 주문 금액**: CreditCard 아이콘

---

## 🔄 재구매 관련 컴포넌트

### RepurchaseKPICards

재구매 주요 지표를 카드로 표시

```typescript
import { RepurchaseKPICards } from './components/repurchase/RepurchaseKPICards';

<RepurchaseKPICards
  kpi={{
    repurchaseRate: 65.5,
    averageRepurchaseDays: 42,
    repurchaseCustomers: 120,
    repurchaseCycle: 35,
  }}
/>
```

**Props:**
```typescript
interface RepurchaseKPICardsProps {
  kpi: {
    repurchaseRate: number;          // 재구매율 (%)
    averageRepurchaseDays: number;   // 평균 재구매 기간 (일)
    repurchaseCustomers: number;     // 재구매 고객 수
    repurchaseCycle: number;         // 재구매 주기 (일)
  };
}
```

### RepurchaseCustomerTable

재구매 고객 목록을 테이블로 표시

```typescript
import { RepurchaseCustomerTable } from './components/repurchase/RepurchaseCustomerTable';

<RepurchaseCustomerTable
  customers={repurchaseCustomers}
  onCustomerClick={(customerId) => console.log(customerId)}
  selectedCustomerId={selectedCustomerId}
/>
```

**특징:**
- 고객 클릭 시 상세 정보 표시
- 재구매 횟수, 평균 재구매 기간, 등급 표시
- 선택된 고객 하이라이트

### RepurchaseProductChart

고객별 재구매 상품을 차트로 시각화

```typescript
import { RepurchaseProductChart } from './components/repurchase/RepurchaseProductChart';

<RepurchaseProductChart
  data={[
    { productName: '히알루론산 세럼', count: 5 },
    { productName: '비타민C 세럼', count: 3 },
  ]}
/>
```

### RepurchaseAddressChart

지역별 재구매 배송지를 차트로 시각화

```typescript
import { RepurchaseAddressChart } from './components/repurchase/RepurchaseAddressChart';

<RepurchaseAddressChart
  data={[
    { address: '서울특별시', count: 45 },
    { address: '경기도', count: 32 },
  ]}
/>
```

## 👥 고객 관련 컴포넌트

### CustomerTable

고객 목록을 테이블로 표시

```typescript
import { CustomerTable } from './components/customers/CustomerTable';

<CustomerTable
  customers={customers}
  onSort={(field, order) => console.log(field, order)}
/>
```

**Props:**
```typescript
interface CustomerTableProps {
  customers: Customer[];
  onSort?: (field: string, order: 'asc' | 'desc') => void;
}
```

**특징:**
- 정렬 가능한 컬럼
- 등급별 색상 코딩 뱃지
- 날짜 포맷팅
- 숫자 포맷팅 (천 단위 구분)
- 반응형 테이블

**테이블 컬럼:**
1. 고객명
2. 이메일
3. 등급 (Badge)
4. 총 구매액
5. 총 구매 횟수
6. 평균 구매액
7. 최근 구매일

**등급별 색상:**
- VIP: 보라색 (`bg-purple-100 text-purple-700`)
- Gold: 노란색 (`bg-yellow-100 text-yellow-700`)
- Silver: 회색 (`bg-gray-100 text-gray-700`)
- Bronze: 주황색 (`bg-orange-100 text-orange-700`)

---

## ⭐ 리뷰 관련 컴포넌트

### ReviewSummary

리뷰 통계 요약 표시

```typescript
import { ReviewSummary } from './components/reviews/ReviewSummary';

<ReviewSummary
  averageRating={4.5}
  totalReviews={120}
  keywords={[
    { keyword: '촉촉', count: 45 },
    { keyword: '효과', count: 38 },
    { keyword: '만족', count: 32 },
  ]}
/>
```

**Props:**
```typescript
interface ReviewSummaryProps {
  averageRating: number;
  totalReviews: number;
  keywords: Array<{
    keyword: string;
    count: number;
  }>;
}
```

**특징:**
- 평균 평점 (별 5개 만점)
- 총 리뷰 수
- 주요 키워드 TOP 5
- 키워드별 언급 횟수

---

## 🌟 워드클라우드 구현 가이드

### 개요

리뷰 키워드를 시각적으로 표현하는 워드클라우드는 고객의 주요 피드백을 한눈에 파악할 수 있는 강력한 도구입니다. 
본 가이드에서는 React 기반 워드클라우드를 구현하는 방법을 다룹니다.

### 추천 라이브러리

워드클라우드 구현을 위한 주요 라이브러리:

1. **react-wordcloud** (추천)
   - 장점: 간단한 API, 커스터마이징 용이
   - 설치: `npm install react-wordcloud d3-cloud`
   - 사용 예시 아래 참조

2. **react-d3-cloud**
   - 장점: D3.js 기반, 강력한 애니메이션
   - 설치: `npm install react-d3-cloud`

3. **커스텀 구현** (현재 프로젝트에서 사용)
   - 장점: 완전한 제어, 의존성 최소화
   - 단점: 직접 구현 필요

### 데이터 구조

워드클라우드를 위한 데이터 구조:

```typescript
interface WordCloudData {
  text: string;   // 키워드
  value: number;  // 빈도/가중치
  color?: string; // 선택적 색상
}

// 예시 데이터
const keywords: WordCloudData[] = [
  { text: '촉촉', value: 45 },
  { text: '효과', value: 38 },
  { text: '만족', value: 32 },
  { text: '좋아요', value: 28 },
  { text: '추천', value: 25 },
  { text: '가성비', value: 22 },
  { text: '향', value: 20 },
  { text: '지속력', value: 18 },
];
```

### 방법 1: react-wordcloud 사용

```typescript
// components/charts/ReactWordCloud.tsx
import ReactWordcloud from 'react-wordcloud';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface WordCloudProps {
  data: Array<{ text: string; value: number }>;
  title?: string;
}

export function ReactWordCloud({ data, title = '리뷰 키워드' }: WordCloudProps) {
  const options = {
    rotations: 2,
    rotationAngles: [0, 90] as [number, number],
    fontSizes: [16, 60] as [number, number],
    fontFamily: 'Pretendard, sans-serif',
    fontWeight: 'bold',
    colors: [
      '#059669', // emerald-600
      '#10b981', // emerald-500
      '#34d399', // emerald-400
      '#6ee7b7', // emerald-300
      '#a7f3d0', // emerald-200
    ],
    enableTooltip: true,
    deterministic: false,
    padding: 2,
    spiral: 'archimedean',
  };

  const callbacks = {
    onWordClick: (word: { text: string; value: number }) => {
      console.log(`"${word.text}" 키워드 클릭됨 (빈도: ${word.value})`);
      // 키워드 클릭 시 필터링 등의 액션 추가 가능
    },
    getWordTooltip: (word: { text: string; value: number }) =>
      `${word.text}: ${word.value}회 언급`,
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ height: '400px', width: '100%' }}>
          <ReactWordcloud
            words={data}
            options={options}
            callbacks={callbacks}
          />
        </div>
      </CardContent>
    </Card>
  );
}
```

### 방법 2: 커스텀 그리드 레이아웃 (현재 프로젝트)

```typescript
// components/charts/ReviewWordCloud.tsx
import { Card, CardContent } from '../ui/card';

interface ReviewWordCloudProps {
  data: Array<{ text: string; value: number }>;
}

export function ReviewWordCloud({ data }: ReviewWordCloudProps) {
  // 빈도에 따라 내림차순 정렬
  const sortedData = [...data].sort((a, b) => b.value - a.value);
  
  // 최대값 기준으로 폰트 사이즈 계산
  const maxValue = Math.max(...data.map((d) => d.value));
  const minFontSize = 14;
  const maxFontSize = 48;
  
  const getFontSize = (value: number) => {
    const normalized = value / maxValue;
    return minFontSize + (maxFontSize - minFontSize) * normalized;
  };

  // 빈도에 따라 색상 결정
  const getColor = (value: number) => {
    const normalized = value / maxValue;
    if (normalized > 0.8) return 'text-emerald-700';
    if (normalized > 0.6) return 'text-emerald-600';
    if (normalized > 0.4) return 'text-emerald-500';
    if (normalized > 0.2) return 'text-emerald-400';
    return 'text-emerald-300';
  };

  const handleKeywordClick = (keyword: string, count: number) => {
    console.log(`"${keyword}" 키워드 클릭됨 (빈도: ${count})`);
    // 키워드 클릭 시 해당 키워드를 포함한 리뷰 필터링 등
  };

  return (
    <Card className="h-full">
      <CardContent className="pt-6">
        <div className="flex flex-wrap items-center justify-center gap-4 p-8 min-h-[300px]">
          {sortedData.map((item, index) => (
            <button
              key={`${item.text}-${index}`}
              onClick={() => handleKeywordClick(item.text, item.value)}
              className={`
                ${getColor(item.value)}
                hover:opacity-70 transition-opacity
                cursor-pointer select-none
                font-bold
              `}
              style={{
                fontSize: `${getFontSize(item.value)}px`,
                lineHeight: 1.2,
              }}
              title={`${item.text}: ${item.value}회 언급`}
            >
              {item.text}
              <span className="text-xs ml-1 opacity-60">
                {item.value}
              </span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
```

### 방법 3: Canvas 기반 워드클라우드

더 복잡한 레이아웃과 애니메이션이 필요한 경우:

```typescript
// components/charts/CanvasWordCloud.tsx
import { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface CanvasWordCloudProps {
  data: Array<{ text: string; value: number }>;
}

export function CanvasWordCloud({ data }: CanvasWordCloudProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Canvas 크기 설정
    const width = canvas.width = canvas.offsetWidth * 2; // Retina 대응
    const height = canvas.height = 400 * 2;
    ctx.scale(2, 2);

    // 배경 클리어
    ctx.clearRect(0, 0, width, height);

    // 최대값 계산
    const maxValue = Math.max(...data.map((d) => d.value));

    // 키워드 렌더링
    const centerX = width / 4;
    const centerY = height / 4;
    let currentAngle = 0;
    const angleStep = (Math.PI * 2) / data.length;

    data.forEach((item, index) => {
      // 빈도에 따른 폰트 크기
      const fontSize = 14 + (item.value / maxValue) * 34;
      ctx.font = `bold ${fontSize}px Pretendard, sans-serif`;

      // 빈도에 따른 색상
      const intensity = Math.floor((item.value / maxValue) * 255);
      ctx.fillStyle = `rgb(${255 - intensity}, ${intensity}, ${100})`;

      // 나선형 배치
      const radius = 50 + index * 15;
      const x = centerX + Math.cos(currentAngle) * radius;
      const y = centerY + Math.sin(currentAngle) * radius;

      ctx.fillText(item.text, x, y);
      currentAngle += angleStep;
    });
  }, [data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>리뷰 키워드 분석</CardTitle>
      </CardHeader>
      <CardContent>
        <canvas
          ref={canvasRef}
          className="w-full"
          style={{ height: '400px' }}
        />
      </CardContent>
    </Card>
  );
}
```

### 키워드 추출 및 전처리

리뷰 텍스트에서 키워드를 추출하는 방법:

```typescript
// lib/keyword-extractor.ts

/**
 * 리뷰 텍스트에서 키워드 추출 및 빈도 계산
 */
export function extractKeywords(reviews: string[]): Array<{ text: string; value: number }> {
  // 1. 불용어 정의 (제거할 단어들)
  const stopWords = new Set([
    '이', '그', '저', '것', '수', '등', '들', '및', '또는',
    '그리고', '하지만', '그러나', '때문에', '위해',
    '있다', '없다', '이다', '아니다', '하다', '되다',
    // 추가 불용어...
  ]);

  // 2. 모든 리뷰 합치기
  const allText = reviews.join(' ');

  // 3. 단어 분리 (한글, 영문, 숫자만)
  const words = allText
    .match(/[가-힣a-zA-Z0-9]+/g) || [];

  // 4. 빈도 계산
  const frequency = new Map<string, number>();
  words.forEach((word) => {
    // 불용어 및 짧은 단어 제외
    if (stopWords.has(word) || word.length < 2) return;
    
    frequency.set(word, (frequency.get(word) || 0) + 1);
  });

  // 5. 배열로 변환 및 정렬
  return Array.from(frequency.entries())
    .map(([text, value]) => ({ text, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 30); // TOP 30 키워드만
}

/**
 * 사전 정의된 긍정/부정 키워드로 필터링
 */
export function extractPredefinedKeywords(
  reviews: string[],
  keywords: string[]
): Array<{ text: string; value: number }> {
  const frequency = new Map<string, number>();

  reviews.forEach((review) => {
    keywords.forEach((keyword) => {
      // 대소문자 구분 없이 검색
      const regex = new RegExp(keyword, 'gi');
      const matches = review.match(regex);
      if (matches) {
        frequency.set(
          keyword,
          (frequency.get(keyword) || 0) + matches.length
        );
      }
    });
  });

  return Array.from(frequency.entries())
    .map(([text, value]) => ({ text, value }))
    .sort((a, b) => b.value - a.value);
}

// 사용 예시
const reviews = [
  '정말 촉촉하고 좋아요. 효과도 만족스럽습니다.',
  '가성비가 좋고 향도 은은해서 만족합니다.',
  '촉촉함이 오래 지속되어 좋아요. 추천합니다!',
];

// 방법 1: 자동 추출
const autoKeywords = extractKeywords(reviews);

// 방법 2: 사전 정의 키워드
const predefinedKeywordList = [
  '촉촉', '효과', '만족', '가성비', '향', '지속력',
  '추천', '좋아요', '부드러움', '흡수', '보습',
];
const predefinedKeywords = extractPredefinedKeywords(reviews, predefinedKeywordList);
```

### 실전 활용 예시

```typescript
// pages/ProductAnalysisPage.tsx 내부
import { ReviewWordCloud } from './components/charts/ReviewWordCloud';
import { extractKeywords } from './lib/keyword-extractor';

function ProductAnalysisPage() {
  const { data: productData } = useQuery({
    queryKey: ['product', selectedProductId],
    queryFn: () => fetchProduct(selectedProductId),
  });

  // 리뷰 텍스트에서 키워드 추출
  const keywords = productData?.reviews
    ? extractKeywords(productData.reviews.map((r) => r.content))
    : [];

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* 기존 차트들... */}
      
      {/* 워드클라우드 */}
      <div className="col-span-2">
        <ReviewWordCloud data={keywords} />
      </div>
    </div>
  );
}
```

### 성능 최적화

```typescript
import { useMemo } from 'react';

function ProductAnalysisPage() {
  const { data: reviews } = useQuery({
    queryKey: ['reviews', selectedProductId],
    queryFn: () => fetchReviews(selectedProductId),
  });

  // 키워드 추출은 비용이 높으므로 메모이제이션
  const keywords = useMemo(() => {
    if (!reviews) return [];
    return extractKeywords(reviews.map((r) => r.content));
  }, [reviews]);

  return <ReviewWordCloud data={keywords} />;
}
```

### 스타일링 팁

```typescript
// 에메랄드 그린 테마에 맞는 색상 팔레트
const emeraldPalette = {
  colors: [
    '#064e3b', // emerald-900
    '#065f46', // emerald-800
    '#047857', // emerald-700
    '#059669', // emerald-600 (메인)
    '#10b981', // emerald-500
    '#34d399', // emerald-400
    '#6ee7b7', // emerald-300
  ],
  gradientColors: [
    ['#047857', '#10b981'], // 진한 그라데이션
    ['#059669', '#34d399'], // 중간 그라데이션
    ['#10b981', '#6ee7b7'], // 밝은 그라데이션
  ],
};

// 호버 효과 추가
const keywordStyle = `
  hover:scale-110 
  hover:text-emerald-600 
  transition-all 
  duration-200 
  cursor-pointer
`;
```

### 접근성 고려사항

```typescript
// 키보드 네비게이션 지원
<button
  onClick={() => handleKeywordClick(item.text)}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleKeywordClick(item.text);
    }
  }}
  aria-label={`${item.text} 키워드, ${item.value}회 언급됨`}
  tabIndex={0}
>
  {item.text}
</button>

// 스크린 리더를 위한 설명 추가
<div role="img" aria-label="리뷰 키워드 워드클라우드">
  {/* 워드클라우드 내용 */}
</div>
```

### 추가 기능 아이디어

1. **키워드 필터링**: 클릭한 키워드로 리뷰 필터링
2. **감성 분석**: 긍정/부정 키워드 색상 구분
3. **시간대별 비교**: 기간별 키워드 변화 추이
4. **경쟁 상품 비교**: 여러 상품의 키워드 비교
5. **애니메이션**: 키워드 등장 애니메이션 추가

---

## 🎯 컴포넌트 작성 가이드

### 1. 컴포넌트 구조

```typescript
// components/feature/FeatureCard.tsx
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';

interface FeatureCardProps {
  title: string;
  description?: string;
  variant?: 'default' | 'highlighted';
  className?: string;
}

export function FeatureCard({
  title,
  description,
  variant = 'default',
  className,
}: FeatureCardProps) {
  return (
    <Card className={className}>
      <CardContent className="pt-6">
        <h3 className={variant === 'highlighted' ? 'text-emerald-600' : ''}>
          {title}
        </h3>
        {description && <p className="text-gray-600">{description}</p>}
      </CardContent>
    </Card>
  );
}
```

### 2. Props 설계 원칙

```typescript
// ✅ Good: 명확한 타입
interface Props {
  data: Product[];
  onSelect: (id: string) => void;
  variant?: 'compact' | 'detailed';
}

// ❌ Bad: any 타입
interface Props {
  data: any;
  onSelect: any;
}
```

### 3. 조건부 렌더링

```typescript
export function DataDisplay({ data, isLoading, error }: Props) {
  // Early returns
  if (isLoading) {
    return <Skeleton className="h-64" />;
  }

  if (error) {
    return <EmptyState icon={AlertCircle} title="에러 발생" />;
  }

  if (!data || data.length === 0) {
    return <EmptyState icon={Package} title="데이터 없음" />;
  }

  // 정상 렌더링
  return <div>{/* ... */}</div>;
}
```

### 4. 이벤트 핸들러

```typescript
export function ProductCard({ product, onSelect }: Props) {
  // 이벤트 핸들러는 컴포넌트 내부에 정의
  const handleClick = () => {
    console.log('Product selected:', product.id);
    onSelect(product.id);
  };

  return (
    <div onClick={handleClick}>
      {product.name}
    </div>
  );
}
```

### 5. 스타일 조합

```typescript
import { cn } from '../lib/utils';

export function Button({ variant, size, className, ...props }: Props) {
  return (
    <button
      className={cn(
        // 기본 스타일
        'rounded-lg transition-colors',
        // Variant
        variant === 'primary' && 'bg-emerald-600 text-white',
        variant === 'secondary' && 'bg-gray-200 text-gray-900',
        // Size
        size === 'sm' && 'px-3 py-1.5',
        size === 'md' && 'px-4 py-2',
        // 외부에서 전달된 className
        className
      )}
      {...props}
    />
  );
}
```

---

## 🔄 컴포넌트 재사용 패턴

### 1. Compound Components

```typescript
// Card 컴포넌트 그룹
<Card>
  <CardHeader>
    <CardTitle>제목</CardTitle>
  </CardHeader>
  <CardContent>내용</CardContent>
  <CardFooter>푸터</CardFooter>
</Card>
```

### 2. Render Props

```typescript
interface DataFetcherProps {
  url: string;
  children: (data: any, isLoading: boolean) => React.ReactNode;
}

function DataFetcher({ url, children }: DataFetcherProps) {
  const { data, isLoading } = useFetch(url);
  return <>{children(data, isLoading)}</>;
}

// 사용
<DataFetcher url="/api/products">
  {(data, isLoading) => (
    isLoading ? <Skeleton /> : <ProductList products={data} />
  )}
</DataFetcher>
```

### 3. Higher-Order Component (HOC)

```typescript
function withLoading<P extends object>(
  Component: React.ComponentType<P>
) {
  return function WithLoadingComponent(
    props: P & { isLoading: boolean }
  ) {
    if (props.isLoading) {
      return <Skeleton />;
    }
    return <Component {...props} />;
  };
}

// 사용
const ProductListWithLoading = withLoading(ProductList);
```

---

## 🧪 테스트 가능한 컴포넌트

### 1. Props를 통한 제어

```typescript
// ✅ Good: 외부에서 제어 가능
function SearchInput({ value, onChange }: Props) {
  return (
    <input value={value} onChange={(e) => onChange(e.target.value)} />
  );
}

// ❌ Bad: 내부 상태로만 관리
function SearchInput() {
  const [value, setValue] = useState('');
  return <input value={value} onChange={(e) => setValue(e.target.value)} />;
}
```

### 2. 의존성 주입

```typescript
// ✅ Good: API 호출을 props로 받음
function UserList({ fetchUsers }: { fetchUsers: () => Promise<User[]> }) {
  // ...
}

// ❌ Bad: API 호출이 하드코딩됨
function UserList() {
  const fetchUsers = () => fetch('/api/users');
  // ...
}
```

---

이 가이드를 참고하여 일관성 있고 재사용 가능한 컴포넌트를 작성할 수 있습니다.