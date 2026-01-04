/**
 * 고객 서비스
 * mock/production 모드에 따라 적절한 데이터 소스 선택
 */

import { config } from '../lib/config';
import { apiClient, endpoints } from './api';
import { mockCustomers, mockGradeDistribution } from '../lib/mockData';
import type { Customer, GradeDistribution } from '../types/customer';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * 고객 목록 조회
 * 명세서: GET /api/v1/customer-analysis/list
 */
export async function getCustomers(params?: {
  page?: number;
  limit?: number;
  grade?: string;
  sort_by?: 'latest_purchase' | 'purchase_count' | 'points' | 'name';
}): Promise<Customer[]> {
  if (config.apiMode === 'mock') {
    // Mock 모드
    await delay(config.mockDelay);
    return mockCustomers;
  } else {
    // Production 모드
    return await apiClient.get<Customer[]>(endpoints.customerAnalysis.list, params);
  }
}

/**
 * 고객 KPI 조회
 * 명세서: GET /api/v1/customer-analysis/kpis
 */
export async function getCustomerKPIs(): Promise<any> {
  if (config.apiMode === 'mock') {
    // Mock 모드
    await delay(config.mockDelay);
    return {
      totalCustomers: mockCustomers.length,
      newCustomers: 10,
      activeCustomers: 50,
    };
  } else {
    // Production 모드
    return await apiClient.get<any>(endpoints.customerAnalysis.kpis);
  }
}

/**
 * 고객 상세 조회
 */
export async function getCustomerDetail(customerId: string): Promise<Customer> {
  if (config.apiMode === 'mock') {
    // Mock 모드
    await delay(config.mockDelay);
    const customer = mockCustomers.find(c => c.id === customerId);
    if (!customer) {
      throw new Error('고객을 찾을 수 없습니다.');
    }
    return customer;
  } else {
    // Production 모드
    return await apiClient.get<Customer>(endpoints.customers.detail(customerId));
  }
}

/**
 * 고객 등급 분포 조회
 * 명세서: GET /api/v1/customer-analysis/grades
 */
export async function getGradeDistribution(): Promise<GradeDistribution[]> {
  if (config.apiMode === 'mock') {
    // Mock 모드
    await delay(config.mockDelay);
    return mockGradeDistribution;
  } else {
    // Production 모드
    return await apiClient.get<GradeDistribution[]>(endpoints.customerAnalysis.grades);
  }
}
