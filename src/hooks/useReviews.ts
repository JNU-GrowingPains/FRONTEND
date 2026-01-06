import { useQuery } from '@tanstack/react-query';
import * as reviewService from '../services/reviews';
import * as productService from '../services/products';
import { useFilterStore } from '../store/useFilterStore';

export const useReviews = () => {
  const selectedProductId = useFilterStore((state) => state.selectedProductIds[0] || null);

  return useQuery({
    queryKey: ['reviews', selectedProductId],
    queryFn: async () => {
      // 전체 리뷰 가져오기 (백엔드에 상품별 리뷰 API 없음)
      const allReviews = await reviewService.getReviews({ limit: 0 });
      
      console.log('=== 리뷰 필터링 ===');
      console.log('전체 리뷰 수:', allReviews.length);
      console.log('선택된 상품 ID (product_id):', selectedProductId);
      
      // 상품 미선택 시 전체 반환
      if (!selectedProductId) {
        console.log('상품 미선택 → 전체 리뷰 반환');
        return allReviews;
      }
      
      // product_id로 product_code 찾기
      const products = await productService.getProducts();
      const selectedProduct = products.find(p => p.id === selectedProductId);
      
      if (!selectedProduct) {
        console.warn('⚠️ 상품을 찾을 수 없음:', selectedProductId);
        return [];
      }
      
      const productCode = selectedProduct.productCode;
      console.log('매칭할 product_code:', productCode);
      
      // review.productId(=product_no)와 product.productCode로 매칭
      const filteredReviews = allReviews.filter((review: any) => {
        const reviewProductNo = Number(review.productId);
        return reviewProductNo === productCode;
      });
      
      console.log('✅ 필터링된 리뷰 수:', filteredReviews.length);
      
      return filteredReviews;
    },
  });
};

export const useWordCloud = () => {
  const selectedProductId = useFilterStore((state) => state.selectedProductIds[0] || null);

  return useQuery({
    queryKey: ['wordCloud', selectedProductId],
    queryFn: async () => {
      if (!selectedProductId) {
        // 상품 미선택 시 전체 키워드
        return reviewService.getWordCloud();
      }
      
      // 상품 선택 시 해당 상품의 키워드만
      return productService.getProductReviewKeywords(selectedProductId, {
        limit: 30,
      });
    },
    enabled: !!selectedProductId,
  });
};