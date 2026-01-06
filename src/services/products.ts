/**
 * 상품 서비스
 * mock/production 모드에 따라 적절한 데이터 소스 선택
 */

import { config } from '../lib/config';
import { apiClient, endpoints } from './api';
import { mockProducts, generateProductStats } from '../lib/mockData';
import type { Product, ProductStats } from '../types/product';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * 상품 목록 조회
 * 명세서: GET /api/v1/product-analysis/products
 * Query Parameters: limit, from_date, to_date
 * 응답: { items: [...], count: 10 }
 */
export async function getProducts(params?: {
  limit?: number;
  from_date?: string;
  to_date?: string;
}): Promise<Product[]> {
  if (config.apiMode === 'mock') {
    // Mock 모드
    await delay(config.mockDelay);
    return mockProducts;
  } else {
    // Production 모드
    try {
      const response = await apiClient.get<any>(endpoints.productAnalysis.products, params);
      console.log('=== 상품 목록 API 호출 ===');
      console.log('엔드포인트:', endpoints.productAnalysis.products);
      console.log('파라미터:', params);
      console.log('원본 응답:', response);
      
      // 백엔드 응답 형식: { items: [...], count: 10 }
      let products = [];
      
      if (Array.isArray(response)) {
        console.log('응답이 배열입니다');
        products = response;
      } else if (response && response.items) {
        console.log('응답에 items 필드 있음 (API 규격서 형식)');
        products = response.items;
      } else if (response && response.products) {
        console.log('응답에 products 필드 있음');
        products = response.products;
      } else if (response && response.data) {
        console.log('응답에 data 필드 있음');
        products = Array.isArray(response.data) ? response.data : (response.data.items || response.data.products || []);
      }
      
      console.log('추출된 상품 수:', products.length);
      if (products.length > 0) {
        console.log('첫 번째 상품 샘플:', products[0]);
      }
      
      // API 규격서에 맞게 매핑: { product_id, product_code, product_name, price }
      const mappedProducts = products.map((product: any) => ({
        id: String(product.product_id || product.id), // 숫자를 문자열로 변환
        productCode: product.product_code || product.productCode,
        name: product.product_name || product.name,
        category: product.category || product.product_category || '기타', // API에서 제공하지 않으므로 기본값
        price: typeof product.price === 'string' ? parseInt(product.price.replace(/,/g, '')) : (product.price || 0),
        stock: product.stock || product.product_stock || 0,
        imageUrl: product.image_url || product.imageUrl || product.image || '',
      }));
      
      console.log('매핑된 상품 수:', mappedProducts.length);
      if (mappedProducts.length > 0) {
        console.log('매핑된 첫 번째 상품:', mappedProducts[0]);
      }
      
      return mappedProducts;
    } catch (error) {
      console.error('상품 목록 로드 실패:', error);
      return [];
    }
  }
}

/**
 * 상품 상세 조회
 */
export async function getProductDetail(productId: string): Promise<Product> {
  if (config.apiMode === 'mock') {
    // Mock 모드
    await delay(config.mockDelay);
    const product = mockProducts.find(p => p.id === productId);
    if (!product) {
      throw new Error('상품을 찾을 수 없습니다.');
    }
    return product;
  } else {
    // Production 모드 - 명세서에 없지만 기존 기능 유지
    throw new Error('상품 상세 조회는 현재 지원되지 않습니다.');
  }
}

/**
 * 상품별 KPI 통계 조회
 * 명세서: GET /api/v1/product-analysis/stats?days=30&product_id=15
 * 응답: { days: 30, sales: 15420000, items: 342, buyers: 156 }
 */
export async function getProductStats(
  productId: string,
  params?: {
    days?: number;
    startDate?: string;
    endDate?: string;
  }
): Promise<any> {
  if (config.apiMode === 'mock') {
    // Mock 모드
    await delay(config.mockDelay + 100);
    return {
      days: params?.days || 30,
      sales: 1500000,
      items: 250,
      buyers: 180,
    };
  } else {
    // Production 모드
    try {
      // Query parameter 방식 사용 (규격서 2번 방식)
      const response = await apiClient.get<any>(
        endpoints.productAnalysis.stats,
        {
          days: params?.days || 30,
          product_id: parseInt(productId),
        }
      );
      console.log('=== 상품 KPI 통계 API 호출 ===');
      console.log('상품 ID:', productId);
      console.log('파라미터:', params);
      console.log('원본 응답:', response);
      
      // API 응답: { days: 30, sales: 15420000, items: 342, buyers: 156 }
      return {
        days: response.days || params?.days || 30,
        sales: response.sales || 0,
        items: response.items || 0,
        buyers: response.buyers || 0,
      };
    } catch (error) {
      console.error('상품 KPI 통계 로드 실패:', error);
      return {
        days: params?.days || 30,
        sales: 0,
        items: 0,
        buyers: 0,
      };
    }
  }
}

/**
 * 상품 트렌드 차트 데이터 조회
 * 명세서: GET /api/v1/product-analysis/chart/trend
 * Query Parameters: days, metric, product_id
 * metric: 'amount' (매출액), 'quantity' (판매 수량), 'buyers' (구매자 수)
 * 응답: [{ date: "2025-01-01", value: 450000 }, ...]
 */
export async function getDailySales(
  productId: string,
  params?: {
    days?: number;
    metric?: 'amount' | 'quantity' | 'buyers';
  }
): Promise<ProductStats[]> {
  if (config.apiMode === 'mock') {
    // Mock 모드
    await delay(config.mockDelay + 100);
    const days = params?.days || 30;
    return generateProductStats(productId, days);
  } else {
    // Production 모드
    try {
      const response = await apiClient.get<any>(
        endpoints.productAnalysis.chartTrend,
        {
          product_id: parseInt(productId),
          days: params?.days || 30,
          metric: params?.metric || 'amount',
        }
      );
      console.log('=== 상품 트렌드 차트 API 호출 ===');
      console.log('상품 ID:', productId);
      console.log('파라미터:', params);
      console.log('원본 응답:', response);
      
      // API 응답: [{ date: "2025-01-01", value: 450000 }, ...]
      let mappedStats: ProductStats[] = [];
      
      if (Array.isArray(response)) {
        const metric = params?.metric || 'amount';
        mappedStats = response
          .filter((item: any) => item.date) // date가 null인 항목 제외
          .map((item: any) => {
            const value = item.value || 0;
            return {
              date: item.date,
              revenue: metric === 'amount' ? value : 0,
              sales: metric === 'quantity' ? value : 0,
              buyers: metric === 'buyers' ? value : 0,
            };
          });
      }
      
      console.log('매핑된 차트 데이터:', mappedStats.length, '건');
      if (mappedStats.length > 0) {
        console.log('첫 번째 데이터 샘플:', mappedStats[0]);
      }
      return mappedStats;
    } catch (error) {
      console.error('상품 트렌드 차트 데이터 로드 실패:', error);
      return [];
    }
  }
}

/**
 * 상품별 리뷰 통계 조회
 * 명세서: GET /api/v1/product-analysis/products/{product_id}/review-stats
 */
export async function getProductReviewStats(productId: string): Promise<any> {
  if (config.apiMode === 'mock') {
    // Mock 모드
    await delay(config.mockDelay);
    return {
      total_reviews: 48,
      average_rating: 4.5,
    };
  } else {
    // Production 모드
    try {
      const response = await apiClient.get<any>(
        endpoints.productAnalysis.reviewStats(productId)
      );
      console.log('=== 상품별 리뷰 통계 API 호출 ===');
      console.log('상품 ID:', productId);
      console.log('원본 응답:', response);
      return response;
    } catch (error) {
      console.error('상품별 리뷰 통계 로드 실패:', error);
      return {
        total_reviews: 0,
        average_rating: 0,
      };
    }
  }
}

/**
 * 상품별 리뷰 키워드 워드클라우드 조회
 * 명세서: GET /api/v1/product-analysis/products/{product_id}/review-keywords
 */
export async function getProductReviewKeywords(
  productId: string,
  params?: {
    limit?: number;
  }
): Promise<any> {
  if (config.apiMode === 'mock') {
    // Mock 모드
    await delay(config.mockDelay);
    return [
      { text: '촉촉해요', value: 45 },
      { text: '흡수력', value: 38 },
      { text: '향이좋아요', value: 32 },
    ];
  } else {
    // Production 모드
    try {
      const response = await apiClient.get<any>(
        endpoints.productAnalysis.reviewKeywords(productId),
        params
      );
      console.log('=== 상품별 리뷰 키워드 API 호출 ===');
      console.log('상품 ID:', productId);
      console.log('파라미터:', params);
      console.log('원본 응답:', response);
      
      // 응답 형식 처리 (배열로 반환됨)
      let keywords = [];
      if (Array.isArray(response)) {
        keywords = response;
      } else if (response && response.keywords) {
        keywords = response.keywords;
      } else if (response && response.data) {
        keywords = Array.isArray(response.data) ? response.data : response.data.keywords || [];
      }
      
      console.log('추출된 상품별 키워드 수:', keywords.length);
      return keywords;
    } catch (error) {
      console.error('상품별 리뷰 키워드 로드 실패:', error);
      return [];
    }
  }
}

/**
 * 상품별 리뷰 목록 조회
 * 명세서: GET /api/v1/product-analysis/products/{product_id}/reviews
 */
export async function getProductReviews(
  productId: string,
  params?: {
    page?: number;
    limit?: number;
    sort_by?: 'latest' | 'rating_high' | 'rating_low' | 'hit';
  }
): Promise<any> {
  if (config.apiMode === 'mock') {
    // Mock 모드
    await delay(config.mockDelay);
    return {
      reviews: [],
      total_count: 0,
      page: params?.page || 1,
      limit: params?.limit || 20,
    };
  } else {
    // Production 모드
    try {
      const response = await apiClient.get<any>(
        endpoints.productAnalysis.reviews(productId),
        params
      );
      console.log('=== 상품별 리뷰 목록 API 호출 ===');
      console.log('상품 ID:', productId);
      console.log('파라미터:', params);
      console.log('원본 응답:', response);
      return response;
    } catch (error) {
      console.error('상품별 리뷰 목록 로드 실패:', error);
      return {
        reviews: [],
        total_count: 0,
        page: params?.page || 1,
        limit: params?.limit || 20,
      };
    }
  }
}
