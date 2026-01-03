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
 */
export async function getProducts(): Promise<Product[]> {
  if (config.apiMode === 'mock') {
    // Mock 모드
    await delay(config.mockDelay);
    return mockProducts;
  } else {
    // Production 모드
    return await apiClient.get<Product[]>(endpoints.products.list);
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
    // Production 모드
    return await apiClient.get<Product>(endpoints.products.detail(productId));
  }
}

/**
 * 상품 통계 조회
 */
export async function getProductStats(
  productId: string,
  params: {
    startDate: Date;
    endDate: Date;
  }
): Promise<ProductStats[]> {
  if (config.apiMode === 'mock') {
    // Mock 모드
    await delay(config.mockDelay + 100);
    
    const daysDiff = Math.ceil(
      (params.endDate.getTime() - params.startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    return generateProductStats(productId, daysDiff);
  } else {
    // Production 모드
    return await apiClient.get<ProductStats[]>(
      endpoints.products.stats(productId),
      {
        startDate: params.startDate.toISOString(),
        endDate: params.endDate.toISOString(),
      }
    );
  }
}
