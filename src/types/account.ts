// 알림 설정 타입
export interface NotificationSettings {
  emailNotification: boolean;
  smsNotification: boolean;
  lowStockAlert: boolean;
  newOrderAlert: boolean;
  reviewAlert: boolean;
}
