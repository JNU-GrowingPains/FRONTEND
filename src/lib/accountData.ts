import { NotificationSettings } from '../types/account';

// 스토어 오너 정보 (나중에 API 연동 시 초기값으로 사용)
export interface StoreOwner {
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  storeName: string;
  storeDescription: string;
  businessNumber: string;
}

export const mockStoreOwner: StoreOwner = {
  name: '김슈엘',
  email: 'kim@suelo.co.kr',
  phone: '010-1234-5678',
  joinDate: '2026-01-01',
  storeName: '슈엘로 화장품',
  storeDescription: '건강한 아름다움을 위한 프리미엄 화장품 브랜드',
  businessNumber: '123-45-67890',
};

// Mock 알림 설정 (AccountPage에서 사용)
export const mockNotificationSettings: NotificationSettings = {
  emailNotification: true,
  smsNotification: true,
  lowStockAlert: true,
  newOrderAlert: true,
  reviewAlert: false,
};
