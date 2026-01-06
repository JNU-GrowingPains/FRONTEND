/**
 * 리뷰 서비스
 * mock/production 모드에 따라 적절한 데이터 소스 선택
 */

import { config } from '../lib/config';
import { apiClient, endpoints } from './api';
import { mockReviews, mockWordCloud } from '../lib/mockData';
import type { Review, WordCloudItem } from '../types/review';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * 전체 리뷰 목록 조회
 * 명세서: GET /api/v1/review-analysis/list
 */
export async function getReviews(params?: {
  page?: number;
  limit?: number;
  rating?: number;
}): Promise<Review[]> {
  if (config.apiMode === 'mock') {
    // Mock 모드
    await delay(config.mockDelay);
    
    if (params?.rating) {
      return mockReviews.filter(r => r.rating === params.rating);
    }
    
    return mockReviews;
  } else {
    // Production 모드
    try {
      const response = await apiClient.get<any>(endpoints.reviewAnalysis.list, params);
      console.log('=== 전체 리뷰 목록 API 호출 ===');
      console.log('파라미터:', params);
      console.log('원본 응답:', response);
      
      // 백엔드 응답 형식 처리 (API 규격서: { total_count, page, limit, items: [...] })
      let reviews = [];
      if (Array.isArray(response)) {
        reviews = response;
      } else if (response && response.items) {
        reviews = response.items;
      } else if (response && response.reviews) {
        reviews = response.reviews;
      } else if (response && response.data) {
        reviews = Array.isArray(response.data) ? response.data : (response.data.items || response.data.reviews || []);
      }
      
      // 백엔드 응답을 프론트엔드 타입으로 매핑
      const mappedReviews = reviews.map((review: any) => ({
        id: review.review_id?.toString() || review.id,
        customerName: review.writer || review.customer_name || review.name,
        rating: review.rating || 0,
        content: review.content || '',
        createdAt: review.created_date || review.created_at || review.date,
        sentiment: review.sentiment === '긍정' ? 'positive' : review.sentiment === '부정' ? 'negative' : 'neutral',
        productId: review.product_no?.toString() || review.product_id?.toString(),
      }));
      
      console.log('매핑된 리뷰 수:', mappedReviews.length);
      return mappedReviews;
    } catch (error) {
      console.error('리뷰 목록 로드 실패:', error);
      return [];
    }
  }
}

/**
 * 리뷰 통계 조회
 * 명세서: GET /api/v1/review-analysis/stats
 */
export async function getReviewStats(): Promise<any> {
  if (config.apiMode === 'mock') {
    // Mock 모드
    await delay(config.mockDelay);
    return {
      totalReviews: mockReviews.length,
      averageRating: 4.2,
      negativeReviews: mockReviews.filter(r => r.rating <= 2).slice(0, 3),
    };
  } else {
    // Production 모드
    return await apiClient.get<any>(endpoints.reviewAnalysis.stats);
  }
}

/**
 * 전체 리뷰 키워드 데이터 조회 (워드클라우드용)
 * 명세서: GET /api/v1/review-analysis/keywords
 */
export async function getWordCloud(productId?: string): Promise<WordCloudItem[]> {
  if (config.apiMode === 'mock') {
    // Mock 모드
    await delay(config.mockDelay);
    return mockWordCloud;
  } else {
    // Production 모드
    try {
      const response = await apiClient.get<any>(endpoints.reviewAnalysis.keywords);
      console.log('=== 전체 리뷰 키워드 API 호출 ===');
      console.log('원본 응답:', response);
      
      // 백엔드 응답 형식 처리 (API 규격서: [{ text, value }, ...])
      let keywords = [];
      if (Array.isArray(response)) {
        keywords = response;
      } else if (response && response.keywords) {
        keywords = response.keywords;
      } else if (response && response.data) {
        keywords = Array.isArray(response.data) ? response.data : (response.data.keywords || []);
      }
      
      console.log('추출된 키워드 수:', keywords.length);
      return keywords;
    } catch (error) {
      console.error('리뷰 키워드 로드 실패:', error);
      return [];
    }
  }
}
