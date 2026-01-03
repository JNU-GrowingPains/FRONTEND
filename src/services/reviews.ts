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
 */
export async function getReviews(productId?: string): Promise<Review[]> {
  if (config.apiMode === 'mock') {
    // Mock 모드
    await delay(config.mockDelay);
    
    if (productId) {
      return mockReviews.filter(r => r.productId === productId);
    }
    
    return mockReviews;
  } else {
    // Production 모드
    if (productId) {
      return await apiClient.get<Review[]>(endpoints.reviews.byProduct(productId));
    }
    return await apiClient.get<Review[]>(endpoints.reviews.list);
  }
}

/**
 * 워드 클라우드 데이터 조회
 */
export async function getWordCloud(productId: string): Promise<WordCloudItem[]> {
  if (config.apiMode === 'mock') {
    // Mock 모드
    await delay(config.mockDelay);
    return mockWordCloud;
  } else {
    // Production 모드
    return await apiClient.get<WordCloudItem[]>(endpoints.reviews.wordCloud(productId));
  }
}
