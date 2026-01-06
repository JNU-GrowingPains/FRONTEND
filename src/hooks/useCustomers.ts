import { useQuery } from '@tanstack/react-query';
import * as customerService from '../services/customers';

export const useCustomers = () => {
  return useQuery({
    queryKey: ['customers'],
    queryFn: () => customerService.getCustomers({ limit: 0 }), // 전체 데이터 조회
  });
};

export const useGradeDistribution = () => {
  return useQuery({
    queryKey: ['gradeDistribution'],
    queryFn: () => customerService.getGradeDistribution(),
  });
};

export const useTopMembers = (limit: number = 10) => {
  return useQuery({
    queryKey: ['topMembers', limit],
    queryFn: () => customerService.getTopMembers(limit),
  });
};