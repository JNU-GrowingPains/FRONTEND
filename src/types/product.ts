export interface Product {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  price: number;
  stock: number;
}

export interface ProductStats {
  date: string;
  sales: number;
  buyers: number;
  revenue: number;
}

export interface ProductKPI {
  totalSales: number;
  totalBuyers: number;
  totalRevenue: number;
  averageOrderValue: number;
}
