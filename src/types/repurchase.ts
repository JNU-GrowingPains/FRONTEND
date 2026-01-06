export interface RepurchaseCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string; // 시-구-동 형식
  grade: '슈둥이' | '슈린이 GOLD' | '슈린이 PLATINUM' | '슈린이 VIP' | '전체'; // '전체' 추가 (비회원)
  purchaseCount: number;
  averageRepurchaseDays: number; // 재구매 평균 소요 시간 (일)
  points: number;
  recentPurchaseDate: string;
  userId?: number | null; // 백엔드 user_id (회원: 숫자, 비회원: null)
  customerId?: string; // 백엔드 customer_id (회원: member_id, 비회원: "")
}

export interface RepurchaseKPI {
  totalRepurchaseCount: number; // 총 재구매 수
  averageRepurchaseRate: number; // 평균 재구매율 (%)
  averageRepurchaseDays: number; // 재구매까지 걸린 기간 (days)
  sameProductRepurchaseRate: number; // 동일 상품 재구매 비율 (%)
  repurchaseCustomerRevenueContribution: number; // 재구매 고객 매출 기여도 (%)
}

export interface RepurchaseProduct {
  productId: string;
  productName: string;
  price?: string; // 가격
  category?: string; // 카테고리
  repurchaseRate?: number; // 재구매율 (%)
  repurchaseCount?: number; // 재구매 횟수 (차트용)
}

export interface RepurchaseAddress {
  address: string; // 시-구-동
  count: number;
  percentage: number;
}

export interface RepurchaseData {
  kpi: RepurchaseKPI;
  customers: RepurchaseCustomer[];
  products: RepurchaseProduct[];
  addresses: RepurchaseAddress[];
}

// 고객 상세 정보 백엔드 응답 타입
export interface CustomerRepurchaseDetail {
  customer: {
    customer_id: string;
    name: string;
    grade: string;
    point: number;
    total_order_count: number;
    avg_repurchase_days: number;
    first_order_date: string;
    last_order_date: string;
  };
  products: Array<{
    product_id: number;
    product_name: string;
    repurchase_count: number;
    percentage: number;
    first_purchase_date: string;
    last_purchase_date: string;
  }>;
  addresses: Array<{
    address: string;
    order_count: number;
    percentage: number;
    first_order_date: string;
    last_order_date: string;
  }>;
}

// 차트 컴포넌트용 매핑된 타입
export interface CustomerRepurchaseData {
  customer: {
    customerId: string;
    name: string;
    grade: string;
    points: number;
    totalOrderCount: number;
    avgRepurchaseDays: number;
    firstOrderDate: string;
    lastOrderDate: string;
  };
  products: RepurchaseProduct[];
  addresses: RepurchaseAddress[];
}

