export interface Customer {
  id: string;
  name: string;
  email: string;
  grade: '슈둥이' | '슈린이 GOLD' | '슈린이 PLATINUM' | '슈린이 VIP';
  points: number;
  totalAmount: number;
  purchaseCount: number;
  firstPurchaseDate: string;
  recentPurchaseDate: string;
  usedCoupon: boolean;
  joinDate: string;
}

export interface GradeDistribution {
  grade: string;
  count: number;
  percentage: number;
}