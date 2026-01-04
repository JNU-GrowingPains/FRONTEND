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
 * 리뷰 목록 조회
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
    return await apiClient.get<Review[]>(endpoints.reviewAnalysis.list, params);
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
 * 리뷰 키워드 데이터 조회 (워드클라우드용)
 * 명세서: GET /api/v1/review-analysis/keywords
 */
export async function getWordCloud(productId?: string): Promise<WordCloudItem[]> {
  if (config.apiMode === 'mock') {
    // Mock 모드
    await delay(config.mockDelay);
    return mockWordCloud;
  } else {
    // Production 모드
    return await apiClient.get<WordCloudItem[]>(endpoints.reviewAnalysis.keywords);
  }
}
