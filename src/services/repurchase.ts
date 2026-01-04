/**
 * 재구매 분석 서비스
 * mock/production 모드에 따라 적절한 데이터 소스 선택
 */

import { config } from '../lib/config';
import { apiClient, endpoints } from './api';
import { generateRepurchaseData, generateRepurchaseCustomers } from '../lib/mockData';
import type {
  RepurchaseCustomer,
  RepurchaseKPI,
  RepurchaseProduct,
  RepurchaseData,
} from '../types/repurchase';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * 재구매 상품 목록 조회
 * 명세서: GET /api/v1/repurchase-analysis/products
 */
export async function getRepurchaseProducts(): Promise<RepurchaseProduct[]> {
  if (config.apiMode === 'mock') {
    // Mock 모드
    await delay(config.mockDelay);
    const data = generateRepurchaseData(null);
    return data.products;
  } else {
    // Production 모드
    return await apiClient.get<RepurchaseProduct[]>(
      endpoints.repurchaseAnalysis.products
    );
  }
}

/**
 * 재구매 KPI 조회
 * 명세서: GET /api/v1/repurchase-analysis/kpis
 */
export async function getRepurchaseKPIs(productIds?: string[]): Promise<RepurchaseKPI> {
  if (config.apiMode === 'mock') {
    // Mock 모드
    await delay(config.mockDelay);
    const data = generateRepurchaseData(productIds?.length ? productIds : null);
    return data.kpi;
  } else {
    // Production 모드
    return await apiClient.get<RepurchaseKPI>(
      endpoints.repurchaseAnalysis.kpis,
      {
        product_ids: productIds,
      }
    );
  }
}

/**
 * 재구매 고객 목록 조회
 * 명세서: GET /api/v1/repurchase-analysis/customers
 */
export async function getRepurchaseCustomers(params?: {
  page?: number;
  limit?: number;
  grade?: string;
  sort_by?: 'latest_repurchase' | 'purchase_count' | 'points' | 'name';
  product_ids?: string[];
}): Promise<RepurchaseCustomer[]> {
  if (config.apiMode === 'mock') {
    // Mock 모드
    await delay(config.mockDelay);
    return generateRepurchaseCustomers(
      params?.product_ids && params.product_ids.length > 0
        ? params.product_ids[0]
        : null
    );
  } else {
    // Production 모드
    return await apiClient.get<RepurchaseCustomer[]>(
      endpoints.repurchaseAnalysis.customers,
      {
        page: params?.page,
        limit: params?.limit,
        grade: params?.grade,
        sort_by: params?.sort_by || 'latest_repurchase',
        product_ids: params?.product_ids,
      }
    );
  }
}

