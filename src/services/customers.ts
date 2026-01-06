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
 * 명세서: GET /api/v1/member-analysis/members
 */
export async function getCustomers(params?: {
  page?: number;
  limit?: number;
  grade?: string;
  sort_by?: 'latest_purchase' | 'purchase_count' | 'points' | 'name';
  order?: 'desc' | 'asc';
}): Promise<Customer[]> {
  if (config.apiMode === 'mock') {
    // Mock 모드
    await delay(config.mockDelay);
    return mockCustomers;
  } else {
    // Production 모드
    try {
      const response = await apiClient.get<any>(endpoints.memberAnalysis.members, params);
      console.log('=== 고객 목록 API 호출 ===');
      console.log('엔드포인트:', endpoints.memberAnalysis.members);
      console.log('파라미터:', params);
      console.log('원본 응답:', JSON.stringify(response, null, 2));
      console.log('응답 타입:', typeof response, 'Array?', Array.isArray(response));
      console.log('응답 키:', response ? Object.keys(response) : 'null');
      
      // 백엔드 응답 형식 처리
      let customers = [];
      if (Array.isArray(response)) {
        console.log('✓ 응답이 배열입니다');
        customers = response;
      } else if (response && response.members) {
        console.log('✓ response.members 사용');
        customers = response.members;
      } else if (response && response.items) {
        console.log('✓ response.items 사용');
        customers = response.items;
      } else if (response && response.data) {
        console.log('✓ response.data 사용');
        customers = Array.isArray(response.data) ? response.data : (response.data.members || response.data.items || []);
      }
      
      console.log('추출된 고객 수:', customers.length);
      if (customers.length > 0) {
        console.log('첫 번째 고객 샘플:', customers[0]);
      } else {
        console.warn('⚠️ 추출된 고객이 비어있습니다!');
      }
      
      // 백엔드 응답을 프론트엔드 타입으로 매핑
      const mappedCustomers = customers.map((customer: any) => ({
        id: customer.member_id || customer.user_id?.toString() || customer.id,
        name: customer.name,
        email: customer.email || '',
        grade: customer.grade,
        points: customer.available_points ?? customer.points ?? 0,
        purchaseCount: customer.purchase_count ?? 0,
        totalSpent: customer.total_spent ?? customer.totalSpent ?? 0,
        firstPurchaseDate: customer.first_purchase || customer.join_date || customer.created_at,
        recentPurchaseDate: customer.last_purchase || customer.last_purchase_date,
        joinDate: customer.first_purchase || customer.join_date || customer.created_at,
        usedCoupon: false, // API 규격서에 없는 필드
      }));
      
      console.log('매핑된 고객 수:', mappedCustomers.length);
      return mappedCustomers;
    } catch (error) {
      console.error('고객 목록 로드 실패:', error);
      return [];
    }
  }
}

/**
 * 포인트 상위 고객 조회
 * 명세서: GET /api/v1/member-analysis/top-members
 */
export async function getTopMembers(limit: number = 10): Promise<Customer[]> {
  if (config.apiMode === 'mock') {
    // Mock 모드
    await delay(config.mockDelay);
    return mockCustomers
      .sort((a, b) => b.points - a.points)
      .slice(0, limit);
  } else {
    // Production 모드
    try {
      const response = await apiClient.get<any>(endpoints.memberAnalysis.topMembers, { limit });
      console.log('=== 상위 고객 API 호출 ===');
      console.log('엔드포인트:', endpoints.memberAnalysis.topMembers);
      console.log('limit:', limit);
      console.log('원본 응답:', JSON.stringify(response, null, 2));
      console.log('응답 타입:', typeof response, 'Array?', Array.isArray(response));
      
      // 백엔드 응답 형식 처리
      let topMembers = [];
      if (Array.isArray(response)) {
        console.log('✓ 응답이 배열입니다');
        topMembers = response;
      } else if (response && response.top_members) {
        console.log('✓ response.top_members 사용');
        topMembers = response.top_members;
      } else if (response && response.items) {
        console.log('✓ response.items 사용');
        topMembers = response.items;
      } else if (response && response.data) {
        console.log('✓ response.data 사용');
        topMembers = Array.isArray(response.data) ? response.data : (response.data.top_members || response.data.items || []);
      }
      
      console.log('추출된 상위 고객 수:', topMembers.length);
      if (topMembers.length === 0) {
        console.warn('⚠️ 추출된 상위 고객이 비어있습니다!');
      }
      
      // 백엔드 응답을 프론트엔드 타입으로 매핑
      const mappedMembers = topMembers.map((customer: any) => ({
        id: customer.member_id || customer.user_id?.toString() || customer.id,
        name: customer.name,
        email: customer.email || '',
        grade: customer.grade,
        points: customer.available_points ?? customer.points ?? 0,
        purchaseCount: customer.purchase_count ?? 0,
        totalSpent: customer.total_spent ?? customer.totalSpent ?? 0,
        firstPurchaseDate: customer.first_purchase || customer.join_date || customer.created_at,
        recentPurchaseDate: customer.last_purchase || customer.last_purchase_date,
        joinDate: customer.first_purchase || customer.join_date || customer.created_at,
        usedCoupon: false, // API 규격서에 없는 필드
      }));
      
      return mappedMembers;
    } catch (error) {
      console.error('상위 고객 로드 실패:', error);
      return [];
    }
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
    // Production 모드 - 명세서에 없지만 기존 기능 유지
    throw new Error('고객 상세 조회는 현재 지원되지 않습니다.');
  }
}

/**
 * 고객 등급 분포 조회
 * 명세서: GET /api/v1/member-analysis/grade-stats
 */
export async function getGradeDistribution(): Promise<GradeDistribution[]> {
  if (config.apiMode === 'mock') {
    // Mock 모드
    await delay(config.mockDelay);
    return mockGradeDistribution;
  } else {
    // Production 모드
    try {
      const response = await apiClient.get<any>(endpoints.memberAnalysis.gradeStats);
      console.log('=== 등급 분포 API 호출 ===');
      console.log('엔드포인트:', endpoints.memberAnalysis.gradeStats);
      console.log('원본 응답:', JSON.stringify(response, null, 2));
      console.log('응답 타입:', typeof response, 'Array?', Array.isArray(response));
      console.log('응답 키:', response ? Object.keys(response) : 'null');
      
      // 백엔드 응답 형식 처리
      // API 규격서: { total_members: number, grade_distribution: [...] }
      let gradeStats = [];
      if (Array.isArray(response)) {
        console.log('✓ 응답이 배열입니다');
        gradeStats = response;
      } else if (response && response.grade_distribution) {
        console.log('✓ response.grade_distribution 사용 (규격서 형식)');
        gradeStats = response.grade_distribution;
      } else if (response && response.grade_stats) {
        console.log('✓ response.grade_stats 사용');
        gradeStats = response.grade_stats;
      } else if (response && response.grades) {
        console.log('✓ response.grades 사용');
        gradeStats = response.grades;
      } else if (response && response.items) {
        console.log('✓ response.items 사용');
        gradeStats = response.items;
      } else if (response && response.data) {
        console.log('✓ response.data 사용');
        gradeStats = Array.isArray(response.data) ? response.data : (response.data.grade_distribution || response.data.grade_stats || response.data.grades || response.data.items || []);
      }
      
      console.log('추출된 등급 통계 수:', gradeStats.length);
      if (gradeStats.length > 0) {
        console.log('첫 번째 등급 통계:', gradeStats[0]);
      } else {
        console.warn('⚠️ 추출된 등급 통계가 비어있습니다!');
      }
      
      // 백엔드 응답을 프론트엔드 타입으로 매핑
      const mappedStats = gradeStats.map((stat: any) => ({
        grade: stat.grade_name || stat.grade || stat.name,
        count: stat.member_count ?? stat.customer_count ?? stat.count ?? 0,
        percentage: stat.percentage ?? stat.percent ?? 0,
      }));
      
      console.log('매핑된 등급 통계:', mappedStats);
      return mappedStats;
    } catch (error) {
      console.error('❌ 등급 분포 로드 실패:', error);
      return [];
    }
  }
}
