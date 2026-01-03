import { useQuery } from '@tanstack/react-query';
import * as customerService from '../services/customers';

export const useCustomers = () => {
  return useQuery({
    queryKey: ['customers'],
    queryFn: () => customerService.getCustomers(),
  });
};

export const useGradeDistribution = () => {
  return useQuery({
    queryKey: ['gradeDistribution'],
    queryFn: () => customerService.getGradeDistribution(),
  });
};