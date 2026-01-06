export interface Product {
  id: string; // product_id
  productCode?: number; // product_code (쇼핑몰 상품 코드)
  name: string; // product_name
  category?: string; // API에서 제공하지 않음 (선택적)
  imageUrl?: string; // API에서 제공하지 않음 (선택적)
  price: number; // 가격 (문자열을 숫자로 파싱)
  stock?: number; // API에서 제공하지 않음 (선택적)
}

export interface ProductStats {
  date: string;
  sales: number;
  buyers: number;
  revenue: number;
}

export interface ProductKPI {
  days: number; // 조회 기간 (일)
  sales: number; // 총 매출액 (원)
  items: number; // 총 판매 수량 (개)
  buyers: number; // 총 구매자 수 (명)
}
