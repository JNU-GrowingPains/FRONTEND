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