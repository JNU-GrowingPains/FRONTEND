/**
 * 애플리케이션 설정 파일
 * 환경 변수를 관리하고 API 모드를 제어합니다.
 */

// 안전하게 환경 변수 접근
const getEnv = (key: string, defaultValue: string = ''): string => {
  try {
    return import.meta.env?.[key] || defaultValue;
  } catch {
    return defaultValue;
  }
};

export const config = {
  // API 모드: 'mock' (개발) 또는 'production' (실제 배포)
  apiMode: (getEnv('VITE_API_MODE', 'mock')) as 'mock' | 'production',
  
  // API Base URL (프로덕션 모드일 때 사용)
  apiBaseUrl: getEnv('VITE_API_BASE_URL', 'https://api.suelo.co.kr/v1'),
  
  // API 인증 키
  apiKey: getEnv('VITE_API_KEY', ''),
  
  // 슈엘로 쇼핑몰 URL
  sueloShopUrl: getEnv('VITE_SUELO_SHOP_URL', 'https://suelo.co.kr'),
  
  // 앱 정보
  app: {
    name: getEnv('VITE_APP_NAME', '성장통'),
    version: getEnv('VITE_APP_VERSION', '1.0.0'),
  },
  
  // API 타임아웃 (ms)
  apiTimeout: 30000,
  
  // Mock 데이터 지연 시간 (ms)
  mockDelay: 300,
} as const;

// 개발 모드 여부
export const isDevelopment = config.apiMode === 'mock';

// 프로덕션 모드 여부
export const isProduction = config.apiMode === 'production';