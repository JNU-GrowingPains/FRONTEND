import { useQuery } from '@tanstack/react-query';
import * as productService from '../services/products';
import { useFilterStore } from '../store/useFilterStore';

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: () => productService.getProducts(),
  });
};

export const useProductStats = () => {
  const selectedProductId = useFilterStore((state) => state.selectedProductIds[0] || null);
  const dateRange = useFilterStore((state) => state.dateRange);

  return useQuery({
    queryKey: ['productStats', selectedProductId, dateRange],
    queryFn: () => {
      if (!selectedProductId) return null;
      
      return productService.getProductStats(selectedProductId, {
        startDate: dateRange.start,
        endDate: dateRange.end,
      });
    },
    enabled: !!selectedProductId,
  });
};

export const useDailySales = () => {
  const selectedProductId = useFilterStore((state) => state.selectedProductIds[0] || null);
  const dateRange = useFilterStore((state) => state.dateRange);

  return useQuery({
    queryKey: ['dailySales', selectedProductId, dateRange],
    queryFn: async () => {
      if (!selectedProductId) return [];
      
      // 날짜 범위를 일수로 변환
      const days = Math.ceil(
        (dateRange.end.getTime() - dateRange.start.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      // 최소 7일, 최대 90일로 제한하고 넉넉하게 가져오기
      const apiDays = Math.max(7, Math.min(days + 7, 90));
      
      // 3개의 metric을 모두 병렬로 호출
      const [revenueData, salesData, buyersData] = await Promise.all([
        productService.getDailySales(selectedProductId, {
          days: apiDays,
          metric: 'amount', // 매출액
        }),
        productService.getDailySales(selectedProductId, {
          days: apiDays,
          metric: 'quantity', // 판매 수량
        }),
        productService.getDailySales(selectedProductId, {
          days: apiDays,
          metric: 'buyers', // 구매자 수
        }),
      ]);
      
      // 날짜별로 데이터 결합
      const dataMap = new Map<string, { revenue: number; sales: number; buyers: number }>();
      
      // 매출액 데이터 추가
      revenueData.forEach(item => {
        dataMap.set(item.date, {
          revenue: item.revenue,
          sales: 0,
          buyers: 0,
        });
      });
      
      // 판매 수량 데이터 추가
      salesData.forEach(item => {
        const existing = dataMap.get(item.date);
        if (existing) {
          existing.sales = item.sales;
        } else {
          dataMap.set(item.date, {
            revenue: 0,
            sales: item.sales,
            buyers: 0,
          });
        }
      });
      
      // 구매자 수 데이터 추가
      buyersData.forEach(item => {
        const existing = dataMap.get(item.date);
        if (existing) {
          existing.buyers = item.buyers;
        } else {
          dataMap.set(item.date, {
            revenue: 0,
            sales: 0,
            buyers: item.buyers,
          });
        }
      });
      
      // 선택한 날짜 범위 설정
      const startDate = new Date(dateRange.start);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(dateRange.end);
      endDate.setHours(23, 59, 59, 999);
      
      // 날짜 범위의 모든 날짜 생성하고 채우기
      const result = [];
      const current = new Date(startDate);
      
      while (current <= endDate) {
        const dateStr = current.toISOString().split('T')[0];
        const existingData = dataMap.get(dateStr);
        
        // 데이터가 있으면 사용, 없으면 0으로 채우기
        result.push({
          date: dateStr,
          revenue: existingData?.revenue || 0,
          sales: existingData?.sales || 0,
          buyers: existingData?.buyers || 0,
        });
        
        current.setDate(current.getDate() + 1);
      }
      
      console.log('=== 병합된 차트 데이터 ===');
      console.log('총', result.length, '건');
      if (result.length > 0) {
        console.log('첫 번째 샘플:', result[0]);
        console.log('마지막 샘플:', result[result.length - 1]);
      }
      
      return result;
    },
    enabled: !!selectedProductId,
  });
};