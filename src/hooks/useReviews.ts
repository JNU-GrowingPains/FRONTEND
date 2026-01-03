import { useQuery } from '@tanstack/react-query';
import * as reviewService from '../services/reviews';
import { useFilterStore } from '../store/useFilterStore';

export const useReviews = () => {
  const selectedProductId = useFilterStore((state) => state.selectedProductIds[0] || null);

  return useQuery({
    queryKey: ['reviews', selectedProductId],
    queryFn: () => reviewService.getReviews(selectedProductId || undefined),
  });
};

export const useWordCloud = () => {
  const selectedProductId = useFilterStore((state) => state.selectedProductIds[0] || null);

  return useQuery({
    queryKey: ['wordCloud', selectedProductId],
    queryFn: () => {
      if (!selectedProductId) return [];
      return reviewService.getWordCloud(selectedProductId);
    },
    enabled: !!selectedProductId,
  });
};