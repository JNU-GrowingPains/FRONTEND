export interface RepurchaseCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string; // 시-구-동 형식
  grade: '슈둥이' | '슈린이 GOLD' | '슈린이 PLATINUM' | '슈린이 VIP';
  purchaseCount: number;
  averageRepurchaseDays: number; // 재구매 평균 소요 시간 (일)
  points: number;
  recentPurchaseDate: string;
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
  repurchaseCount: number; // 재구매 횟수
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

