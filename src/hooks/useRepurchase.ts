import { useQuery } from '@tanstack/react-query';
import * as repurchaseService from '../services/repurchase';

/**
 * 재구매 상품 목록 조회 훅
 */
export const useRepurchaseProducts = () => {
  return useQuery({
    queryKey: ['repurchaseProducts'],
    queryFn: () => repurchaseService.getRepurchaseProducts(),
  });
};

/**
 * 재구매 KPI 통계 조회 훅
 */
export const useRepurchaseKPIs = (productIds?: string[]) => {
  return useQuery({
    queryKey: ['repurchaseKPIs', productIds],
    queryFn: () => repurchaseService.getRepurchaseKPIs(productIds),
    enabled: true, // 항상 조회 (productIds가 없으면 전체 통계)
  });
};

/**
 * 재구매 고객 목록 조회 훅
 */
export const useRepurchaseCustomers = (params?: {
  page?: number;
  limit?: number;
  grade?: string;
  sort_by?: 'latest_repurchase' | 'purchase_count' | 'points' | 'name';
  product_ids?: string[];
}) => {
  return useQuery({
    queryKey: ['repurchaseCustomers', params],
    queryFn: () => repurchaseService.getRepurchaseCustomers({
      ...params,
      limit: 0, // 전체 데이터 조회
    }),
  });
};

/**
 * 고객별 재구매 상세 정보 조회 훅
 */
export const useCustomerRepurchaseDetail = (customerId: string | null) => {
  return useQuery({
    queryKey: ['customerRepurchaseDetail', customerId],
    queryFn: () => repurchaseService.getCustomerRepurchaseDetail(customerId!),
    enabled: !!customerId, // customerId가 있을 때만 실행
  });
};


