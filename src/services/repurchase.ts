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
  CustomerRepurchaseDetail,
  CustomerRepurchaseData,
} from '../types/repurchase';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * 재구매 상품 목록 조회
 * 백엔드 규격서: GET /api/v1/repurchase-analysis/products
 * 응답: 배열 직접 반환 [{ product_id, product_name, price }, ...]
 */
export async function getRepurchaseProducts(): Promise<RepurchaseProduct[]> {
  if (config.apiMode === 'mock') {
    // Mock 모드
    await delay(config.mockDelay);
    const data = generateRepurchaseData(null);
    return data.products;
  } else {
    // Production 모드
    try {
      console.log('=== 재구매 상품 목록 API 호출 ===');
      console.log('엔드포인트:', endpoints.repurchaseAnalysis.products);
      
      const response = await apiClient.get<any>(endpoints.repurchaseAnalysis.products);
      console.log('원본 응답:', JSON.stringify(response, null, 2));
      
      // 백엔드는 배열을 직접 반환
      let rawProducts = [];
      if (Array.isArray(response)) {
        rawProducts = response;
      } else if (response && response.data && Array.isArray(response.data)) {
        rawProducts = response.data;
      }
      
      console.log('추출된 상품 수:', rawProducts.length);
      if (rawProducts.length > 0) {
        console.log('첫 번째 상품 샘플:', rawProducts[0]);
      }
      
      // 백엔드 응답 형식: { product_id: 15, product_name: "...", price: "45000" }
      const mappedProducts = rawProducts.map((product: any) => ({
        productId: product.product_id?.toString() || product.productId?.toString() || '',
        productName: product.product_name || product.productName || '',
        price: product.price,
        category: product.category,
        repurchaseRate: product.repurchase_rate ?? product.repurchaseRate,
      }));
      
      console.log('매핑된 상품 수:', mappedProducts.length);
      return mappedProducts;
    } catch (error: any) {
      console.error('❌ 재구매 상품 목록 로드 실패:', error);
      console.error('에러 상세:', {
        message: error.message,
        status: error.status,
        endpoint: endpoints.repurchaseAnalysis.products,
      });
      return [];
    }
  }
}

/**
 * 재구매 통계 조회 (5가지 KPI)
 * 백엔드 규격서: GET /api/v1/repurchase-analysis/kpis
 * Query Parameters: product_ids (int[], FastAPI 스타일 - 여러 번 전달)
 * 응답: { total_repurchase_count, avg_repurchase_rate, avg_repurchase_days, same_product_rate, sales_contribution }
 */
export async function getRepurchaseKPIs(productIds?: string[]): Promise<RepurchaseKPI> {
  if (config.apiMode === 'mock') {
    // Mock 모드
    await delay(config.mockDelay);
    const data = generateRepurchaseData(productIds?.length ? productIds : null);
    return data.kpi;
  } else {
    // Production 모드
    try {
      console.log('=== 재구매 KPI API 호출 ===');
      console.log('엔드포인트:', endpoints.repurchaseAnalysis.kpis);
      console.log('product_ids:', productIds);
      
      // FastAPI 스타일: product_ids를 배열로 전달
      // axios는 배열을 자동으로 ?product_ids=15&product_ids=40 형식으로 변환
      const params: any = {};
      if (productIds && productIds.length > 0) {
        params.product_ids = productIds;
      }
      
      console.log('파라미터:', params);
      
      const response = await apiClient.get<any>(endpoints.repurchaseAnalysis.kpis, params);
      console.log('원본 응답:', JSON.stringify(response, null, 2));
      
      // 백엔드 응답을 프론트엔드 타입으로 매핑
      const rawData = response.data || response;
      
      console.log('KPI 매핑 전 데이터:', rawData);
      
      // 백엔드 규격서 필드명으로 매핑
      const mapped = {
        totalRepurchaseCount: rawData.total_repurchase_count ?? 0,
        averageRepurchaseRate: rawData.avg_repurchase_rate ?? 0,
        averageRepurchaseDays: rawData.avg_repurchase_days ?? 0,
        sameProductRepurchaseRate: rawData.same_product_rate ?? 0,
        repurchaseCustomerRevenueContribution: rawData.sales_contribution ?? 0,
      };
      
      console.log('KPI 매핑 후 데이터:', mapped);
      return mapped;
    } catch (error) {
      console.error('❌ 재구매 KPI 로드 실패:', error);
      return {
        totalRepurchaseCount: 0,
        averageRepurchaseRate: 0,
        averageRepurchaseDays: 0,
        sameProductRepurchaseRate: 0,
        repurchaseCustomerRevenueContribution: 0,
      };
    }
  }
}

/**
 * 재구매 고객 목록 조회
 * 백엔드 규격서: GET /api/v1/repurchase-analysis/customers
 * Query Parameters: page, limit, grade, sort_by, product_ids
 * 응답: { total_count, page, limit, items: [...] }
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
    try {
      const queryParams: any = {
        page: params?.page,
        limit: params?.limit,
        grade: params?.grade,
        sort_by: params?.sort_by || 'latest_repurchase',
      };
      
      // FastAPI 스타일: product_ids를 배열로 전달
      if (params?.product_ids && params.product_ids.length > 0) {
        queryParams.product_ids = params.product_ids;
      }
      
      console.log('=== 재구매 고객 API 호출 ===');
      console.log('엔드포인트:', endpoints.repurchaseAnalysis.customers);
      console.log('파라미터:', queryParams);
      
      const response = await apiClient.get<any>(
        endpoints.repurchaseAnalysis.customers,
        queryParams
      );
      console.log('원본 응답:', JSON.stringify(response, null, 2));
      console.log('응답 타입:', typeof response, 'Array?', Array.isArray(response));
      
      // 백엔드 규격서: { total_count, page, limit, items: [...] }
      let rawCustomers = [];
      if (response && response.items) {
        console.log('✓ response.items 사용 (규격서 형식)');
        rawCustomers = response.items;
      } else if (Array.isArray(response)) {
        console.log('✓ 응답이 배열입니다');
        rawCustomers = response;
      } else if (response && response.data) {
        rawCustomers = response.data.items || response.data.customers || response.data || [];
      }
      
      console.log('추출된 고객 수:', rawCustomers.length);
      if (rawCustomers.length > 0) {
        console.log('첫 번째 고객 샘플:', rawCustomers[0]);
      }
      
      // 백엔드 응답 필드명으로 매핑
      // 백엔드: { user_id, customer_id, name, grade, purchase_count, address, phone, email, point, avg_period }
      const mappedCustomers = rawCustomers.map((customer: any) => {
        // purchase_count 파싱: "31회" -> 31
        let purchaseCount: number = 0;
        if (typeof customer.purchase_count === 'string') {
          purchaseCount = parseInt(customer.purchase_count.replace(/[^0-9]/g, '')) || 0;
        } else {
          purchaseCount = customer.purchase_count ?? 0;
        }
        
        // avg_period 파싱: "48일" -> 48
        let avgPeriod: number = 0;
        if (typeof customer.avg_period === 'string') {
          avgPeriod = parseInt(customer.avg_period.replace(/[^0-9]/g, '')) || 0;
        } else {
          avgPeriod = customer.avg_period ?? 0;
        }
        
        // point 파싱: "16,240P" -> 16240
        let points: number = 0;
        if (typeof customer.point === 'string') {
          points = parseInt(customer.point.replace(/[^0-9]/g, '')) || 0;
        } else {
          points = customer.point ?? customer.points ?? 0;
        }
        
        return {
          userId: customer.user_id,
          customerId: customer.customer_id || '',
          // 백엔드에서 customer_id가 "비회원"인 경우, "이름|주소" 형식으로 고유 ID 생성
          id: customer.customer_id === '비회원' || !customer.customer_id || customer.customer_id === 'null'
            ? `${customer.name}|${customer.address}`
            : customer.customer_id,
          name: customer.name || '',
          email: customer.email || '',
          phone: customer.phone || '',
          address: customer.address || '',
          grade: customer.grade || '전체',
          purchaseCount,
          averageRepurchaseDays: avgPeriod,
          points,
          recentPurchaseDate: customer.last_purchase_date ?? customer.recent_purchase_date ?? '',
        };
      });
      
      console.log('매핑된 고객 수:', mappedCustomers.length);
      return mappedCustomers;
    } catch (error: any) {
      console.error('❌ 재구매 고객 목록 로드 실패:', error);
      console.error('에러 상세:', {
        message: error.message,
        status: error.status,
      });
      return [];
    }
  }
}

/**
 * 고객별 재구매 상세 정보 조회
 * 백엔드 규격서: GET /api/v1/repurchase-analysis/customer/{customer_id}/detail
 * @param customerId - 회원: member_id, 비회원: "이름|주소"
 */
export async function getCustomerRepurchaseDetail(customerId: string): Promise<CustomerRepurchaseData> {
  if (config.apiMode === 'mock') {
    // Mock 모드
    await delay(config.mockDelay);
    const mockData = generateRepurchaseData(null);
    
    // mockData를 CustomerRepurchaseData 형식으로 변환
    return {
      customer: {
        customerId: customerId,
        name: customerId.split('|')[0] || 'Mock Customer',
        grade: 'VIP',
        points: 12950,
        totalOrderCount: 22,
        avgRepurchaseDays: 66,
        firstOrderDate: '2024-01-15',
        lastOrderDate: '2025-11-20',
      },
      products: mockData.products.slice(0, 5).map((p, index) => ({
        productId: p.productId,
        productName: p.productName,
        repurchaseCount: Math.floor(Math.random() * 10) + 3,
        price: p.price,
        repurchaseRate: p.repurchaseRate,
      })),
      addresses: mockData.addresses.slice(0, 3),
    };
  } else {
    // Production 모드
    try {
      // URL 인코딩 (비회원 "이름|주소" 형식 처리)
      const encodedId = encodeURIComponent(customerId);
      
      console.log('=== 고객 재구매 상세 API 호출 ===');
      console.log('customer_id:', customerId);
      console.log('encoded:', encodedId);
      
      const response = await apiClient.get<any>(
        `/api/v1/repurchase-analysis/customer/${encodedId}/detail`
      );
      
      console.log('원본 응답:', JSON.stringify(response, null, 2));
      
      // 백엔드 응답을 프론트엔드 형식으로 매핑
      const rawData = response.data || response;
      
      const mappedData: CustomerRepurchaseData = {
        customer: {
          customerId: rawData.customer.customer_id,
          name: rawData.customer.name,
          grade: rawData.customer.grade,
          points: rawData.customer.point,
          totalOrderCount: rawData.customer.total_order_count,
          avgRepurchaseDays: rawData.customer.avg_repurchase_days,
          firstOrderDate: rawData.customer.first_order_date,
          lastOrderDate: rawData.customer.last_order_date,
        },
        products: rawData.products.map((p: any) => ({
          productId: p.product_id.toString(),
          productName: p.product_name,
          repurchaseCount: p.repurchase_count,
          // 차트에서 사용할 추가 정보
          price: undefined,
          repurchaseRate: p.percentage,
        })),
        addresses: rawData.addresses.map((a: any) => ({
          address: a.address,
          count: a.order_count,
          percentage: a.percentage,
        })),
      };
      
      console.log('매핑된 데이터:', mappedData);
      return mappedData;
    } catch (error: any) {
      console.error('❌ 고객 재구매 상세 로드 실패:', error);
      console.error('에러 상세:', {
        message: error.message,
        status: error.status,
      });
      throw error;
    }
  }
}

