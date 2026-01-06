import { Product, ProductStats } from '../types/product';
import { Customer, GradeDistribution } from '../types/customer';
import { Review, WordCloudItem } from '../types/review';
import { RepurchaseData, RepurchaseCustomer, RepurchaseProduct, RepurchaseAddress } from '../types/repurchase';

export const mockProducts: Product[] = [
  {
    id: 'p1',
    name: '히알루론산 세럼',
    category: '세럼',
    imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200&h=200&fit=crop',
    price: 45000,
    stock: 234,
  },
  {
    id: 'p2',
    name: '비타민C 앰플',
    category: '앰플',
    imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=200&h=200&fit=crop',
    price: 52000,
    stock: 189,
  },
  {
    id: 'p3',
    name: '수분 크림',
    category: '크림',
    imageUrl: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=200&h=200&fit=crop',
    price: 38000,
    stock: 312,
  },
  {
    id: 'p4',
    name: '클렌징 폼',
    category: '클렌저',
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200&h=200&fit=crop',
    price: 28000,
    stock: 456,
  },
  {
    id: 'p5',
    name: '선크림 SPF50+',
    category: '선케어',
    imageUrl: 'https://images.unsplash.com/photo-1614524559017-5a529782e42e?w=200&h=200&fit=crop',
    price: 35000,
    stock: 298,
  },
  {
    id: 'p6',
    name: '나이아신아마이드 토너',
    category: '토너',
    imageUrl: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=200&h=200&fit=crop',
    price: 42000,
    stock: 267,
  },
  {
    id: 'p7',
    name: '레티놀 나이트 크림',
    category: '크림',
    imageUrl: 'https://images.unsplash.com/photo-1617897903246-719242758050?w=200&h=200&fit=crop',
    price: 68000,
    stock: 145,
  },
  {
    id: 'p8',
    name: '미스트 토너',
    category: '토너',
    imageUrl: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=200&h=200&fit=crop',
    price: 32000,
    stock: 389,
  },
  {
    id: 'p9',
    name: '아이 세럼',
    category: '아이케어',
    imageUrl: 'https://images.unsplash.com/photo-1590439471364-192aa70c0b53?w=200&h=200&fit=crop',
    price: 55000,
    stock: 178,
  },
  {
    id: 'p10',
    name: '수딩 마스크팩',
    category: '마스크',
    imageUrl: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=200&h=200&fit=crop',
    price: 25000,
    stock: 523,
  },
];

// 더 현실적인 판매 패턴을 생성
export const generateProductStats = (productId: string, days: number): ProductStats[] => {
  const stats: ProductStats[] = [];
  const today = new Date();
  
  // 상품별 기본 판매량 설정
  const productBaseStats: Record<string, { baseSales: number, basePrice: number }> = {
    p1: { baseSales: 25, basePrice: 45000 },
    p2: { baseSales: 18, basePrice: 52000 },
    p3: { baseSales: 35, basePrice: 38000 },
    p4: { baseSales: 45, basePrice: 28000 },
    p5: { baseSales: 40, basePrice: 35000 },
    p6: { baseSales: 22, basePrice: 42000 },
    p7: { baseSales: 12, basePrice: 68000 },
    p8: { baseSales: 30, basePrice: 32000 },
    p9: { baseSales: 15, basePrice: 55000 },
    p10: { baseSales: 50, basePrice: 25000 },
  };
  
  const baseStats = productBaseStats[productId] || { baseSales: 20, basePrice: 40000 };
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // 요일별 패턴 (주말에 더 많이 팔림)
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const weekendBonus = isWeekend ? 1.4 : 1.0;
    
    // 주간 트렌드 (최근일수록 약간 증가)
    const trendBonus = 1 + (days - i) / days * 0.3;
    
    // 랜덤 변동 (-20% ~ +30%)
    const randomFactor = 0.8 + Math.random() * 0.5;
    
    const sales = Math.floor(baseStats.baseSales * weekendBonus * trendBonus * randomFactor);
    
    // 구매자 수는 판매 수보다 약간 적음 (중복 구매 고려)
    const buyers = Math.max(1, Math.floor(sales * (0.7 + Math.random() * 0.2)));
    
    // 매출액 = 판매 수 * 가격
    const revenue = sales * baseStats.basePrice;
    
    stats.push({
      date: date.toISOString().split('T')[0],
      sales,
      buyers,
      revenue,
    });
  }
  
  return stats;
};

export const mockCustomers: Customer[] = [
  {
    id: 'C001',
    name: '김서연',
    email: 'seoyeon.kim@email.com',
    grade: '슈린이 VIP',
    points: 18920,
    totalSpent: 6780000,
    purchaseCount: 35,
    firstPurchaseDate: '2022-11-03',
    recentPurchaseDate: '2026-12-01',
    usedCoupon: true,
    joinDate: '2022-11-03',
  },
  {
    id: 'C002',
    name: '박지우',
    email: 'jiwoo.park@email.com',
    grade: '슈린이 VIP',
    points: 15840,
    totalSpent: 5420000,
    purchaseCount: 28,
    firstPurchaseDate: '2023-01-15',
    recentPurchaseDate: '2026-11-28',
    usedCoupon: true,
    joinDate: '2023-01-15',
  },
  {
    id: 'C003',
    name: '이민준',
    email: 'minjun.lee@email.com',
    grade: '슈린이 VIP',
    points: 14320,
    totalSpent: 4890000,
    purchaseCount: 24,
    firstPurchaseDate: '2023-03-20',
    recentPurchaseDate: '2026-11-26',
    usedCoupon: true,
    joinDate: '2023-03-20',
  },
  {
    id: 'C004',
    name: '최하윤',
    email: 'hayoon.choi@email.com',
    grade: '슈린이 VIP',
    points: 12950,
    totalSpent: 4320000,
    purchaseCount: 22,
    firstPurchaseDate: '2023-02-10',
    recentPurchaseDate: '2026-11-24',
    usedCoupon: false,
    joinDate: '2023-02-10',
  },
  {
    id: 'C005',
    name: '정수아',
    email: 'sua.jung@email.com',
    grade: '슈린이 VIP',
    points: 10450,
    totalSpent: 3650000,
    purchaseCount: 20,
    firstPurchaseDate: '2023-04-12',
    recentPurchaseDate: '2026-11-30',
    usedCoupon: true,
    joinDate: '2023-04-12',
  },
  {
    id: 'C006',
    name: '강도윤',
    email: 'doyoon.kang@email.com',
    grade: '슈린이 VIP',
    points: 9120,
    totalSpent: 3240000,
    purchaseCount: 18,
    firstPurchaseDate: '2023-05-22',
    recentPurchaseDate: '2026-11-28',
    usedCoupon: true,
    joinDate: '2023-05-22',
  },
  {
    id: 'C007',
    name: '윤시우',
    email: 'siwoo.yoon@email.com',
    grade: '슈린이 VIP',
    points: 8450,
    totalSpent: 2890000,
    purchaseCount: 15,
    firstPurchaseDate: '2023-06-05',
    recentPurchaseDate: '2026-11-20',
    usedCoupon: true,
    joinDate: '2023-06-05',
  },
  {
    id: 'C008',
    name: '장은서',
    email: 'eunseo.jang@email.com',
    grade: '슈린이 VIP',
    points: 7230,
    totalSpent: 2340000,
    purchaseCount: 12,
    firstPurchaseDate: '2023-08-12',
    recentPurchaseDate: '2026-11-18',
    usedCoupon: true,
    joinDate: '2023-08-12',
  },
  {
    id: 'C009',
    name: '한예준',
    email: 'yejun.han@email.com',
    grade: '슈린이 VIP',
    points: 6890,
    totalSpent: 2150000,
    purchaseCount: 11,
    firstPurchaseDate: '2023-07-28',
    recentPurchaseDate: '2026-11-22',
    usedCoupon: false,
    joinDate: '2023-07-28',
  },
  {
    id: 'C010',
    name: '오서준',
    email: 'seojun.oh@email.com',
    grade: '슈린이 VIP',
    points: 5670,
    totalSpent: 1890000,
    purchaseCount: 9,
    firstPurchaseDate: '2023-09-18',
    recentPurchaseDate: '2026-11-10',
    usedCoupon: true,
    joinDate: '2023-09-18',
  },
  {
    id: 'C011',
    name: '임지아',
    email: 'jia.lim@email.com',
    grade: '슈린이 PLATINUM',
    points: 3420,
    totalSpent: 980000,
    purchaseCount: 6,
    firstPurchaseDate: '2026-01-10',
    recentPurchaseDate: '2026-11-15',
    usedCoupon: true,
    joinDate: '2026-01-10',
  },
  {
    id: 'C012',
    name: '송하은',
    email: 'haeun.song@email.com',
    grade: '슈린이 PLATINUM',
    points: 2890,
    totalSpent: 720000,
    purchaseCount: 5,
    firstPurchaseDate: '2026-02-15',
    recentPurchaseDate: '2026-11-12',
    usedCoupon: false,
    joinDate: '2026-02-15',
  },
  {
    id: 'C013',
    name: '배윤서',
    email: 'yunseo.bae@email.com',
    grade: '슈린이 PLATINUM',
    points: 2340,
    totalSpent: 620000,
    purchaseCount: 4,
    firstPurchaseDate: '2026-03-25',
    recentPurchaseDate: '2026-09-14',
    usedCoupon: false,
    joinDate: '2026-03-25',
  },
  {
    id: 'C014',
    name: '신지호',
    email: 'jiho.shin@email.com',
    grade: '슈린이 PLATINUM',
    points: 1580,
    totalSpent: 450000,
    purchaseCount: 3,
    firstPurchaseDate: '2026-06-10',
    recentPurchaseDate: '2026-10-05',
    usedCoupon: false,
    joinDate: '2026-06-10',
  },
  {
    id: 'C015',
    name: '홍다은',
    email: 'daeun.hong@email.com',
    grade: '슈린이 GOLD',
    points: 890,
    totalSpent: 280000,
    purchaseCount: 2,
    firstPurchaseDate: '2026-08-05',
    recentPurchaseDate: '2026-10-22',
    usedCoupon: false,
    joinDate: '2026-08-05',
  },
  {
    id: 'C016',
    name: '안유진',
    email: 'yujin.ahn@email.com',
    grade: '슈린이 VIP',
    points: 7890,
    totalSpent: 2560000,
    purchaseCount: 14,
    firstPurchaseDate: '2023-05-08',
    recentPurchaseDate: '2026-11-29',
    usedCoupon: true,
    joinDate: '2023-05-08',
  },
  {
    id: 'C017',
    name: '조민서',
    email: 'minseo.jo@email.com',
    grade: '슈린이 VIP',
    points: 16240,
    totalSpent: 5680000,
    purchaseCount: 31,
    firstPurchaseDate: '2022-12-18',
    recentPurchaseDate: '2026-12-02',
    usedCoupon: true,
    joinDate: '2022-12-18',
  },
  {
    id: 'C018',
    name: '권태윤',
    email: 'taeyoon.kwon@email.com',
    grade: '슈린이 VIP',
    points: 6340,
    totalSpent: 2180000,
    purchaseCount: 10,
    firstPurchaseDate: '2023-10-14',
    recentPurchaseDate: '2026-11-19',
    usedCoupon: false,
    joinDate: '2023-10-14',
  },
  {
    id: 'C019',
    name: '류서현',
    email: 'seohyun.ryu@email.com',
    grade: '슈린이 PLATINUM',
    points: 1920,
    totalSpent: 540000,
    purchaseCount: 3,
    firstPurchaseDate: '2026-04-22',
    recentPurchaseDate: '2026-09-30',
    usedCoupon: true,
    joinDate: '2026-04-22',
  },
  {
    id: 'C020',
    name: '노하린',
    email: 'harin.noh@email.com',
    grade: '슈린이 PLATINUM',
    points: 1230,
    totalSpent: 380000,
    purchaseCount: 2,
    firstPurchaseDate: '2026-07-11',
    recentPurchaseDate: '2026-11-08',
    usedCoupon: false,
    joinDate: '2026-07-11',
  },
];

export const mockGradeDistribution: GradeDistribution[] = [
  { grade: '슈둥이', count: 120, percentage: 10.1 },
  { grade: '슈린이 GOLD', count: 320, percentage: 26.9 },
  { grade: '슈린이 PLATINUM', count: 454, percentage: 38.1 },
  { grade: '슈린이 VIP', count: 296, percentage: 24.9 },
];

// 리뷰 템플릿 데이터
const reviewTemplates = {
  positive: [
    { rating: 5, content: '히알루론산 함량이 높아서 그런지 피부에 수분이 정말 잘 차요. 건조한 겨울철에 딱이에요!' },
    { rating: 5, content: '세럼 중에 최고예요! 아침에 일어나면 피부가 촉촉하고 윤기가 흘러요.' },
    { rating: 5, content: '친구 추천으로 샀는데 정말 좋네요! 모공도 좀 줄어든 느낌이에요.' },
    { rating: 5, content: '보습 효과가 정말 뛰어나요. 피부가 부드럽고 탄력이 생긴 것 같아요.' },
    { rating: 5, content: '가성비 최고예요! 고가 제품 못지않은 효과를 느낄 수 있어요.' },
    { rating: 4, content: '보습력은 좋은데 향이 좀 강한 편이에요. 무향이었으면 더 좋았을 것 같아요.' },
    { rating: 4, content: '가성비가 좋아요. 용량도 넉넉하고 효과도 만족스럽습니다.' },
    { rating: 4, content: '흡수력이 빠르고 끈적임이 없어서 좋아요. 아침에도 사용하기 편해요.' },
    { rating: 4, content: '피부결이 좋아진 것 같아요. 계속 사용해볼 예정입니다.' },
    { rating: 4, content: '수분 공급이 확실해요. 건조한 피부에 정말 도움이 됩니다.' },
    { rating: 4, content: '진정 효과가 있어서 좋아요. 트러블이 있는 피부에도 부담이 없어요.' },
    { rating: 4, content: '탄력이 생긴 것 같아요. 피부가 더욱 건강해 보입니다.' },
  ],
  negative: [
    { rating: 2, content: '제 피부에는 너무 끈적여서 흡수가 잘 안되네요. 가격 대비 아쉬워요.' },
    { rating: 1, content: '사용 3일차인데 트러블이 올라왔어요. 민감성 피부에는 맞지 않는 것 같습니다.' },
    { rating: 2, content: '효과를 전혀 못 느끼겠어요. 다른 제품과 비교했을 때 차이가 없네요.' },
    { rating: 1, content: '알레르기 반응이 생겼어요. 사용을 중단했습니다.' },
    { rating: 2, content: '향이 너무 강해서 사용하기 어려워요. 무향 제품을 찾아야겠어요.' },
    { rating: 2, content: '가격 대비 효과가 미미해요. 기대했던 것보다 아쉽습니다.' },
    { rating: 1, content: '피부가 더 건조해진 것 같아요. 제 피부 타입에는 맞지 않네요.' },
    { rating: 2, content: '용량이 적어서 금방 다 써버렸어요. 가성비가 좋지 않아요.' },
  ],
  neutral: [
    { rating: 3, content: '나쁘지는 않지만 다른 제품과 차이를 못 느끼겠어요. 재구매 고민 중입니다.' },
    { rating: 3, content: '평범한 제품인 것 같아요. 특별한 효과는 없지만 나쁘지도 않아요.' },
    { rating: 3, content: '사용해본 지 얼마 안 되어서 효과를 판단하기는 어려워요.' },
    { rating: 3, content: '무난한 제품이에요. 크게 만족스럽지는 않지만 불만도 없어요.' },
  ],
};

const customerNames = [
  '김서연', '박지우', '이민준', '최하윤', '정수아', '강도윤', '윤시우', '장은서',
  '한예준', '오서준', '임지아', '송하은', '배윤서', '신지호', '홍다은', '안유진',
  '조민서', '권태윤', '류서현', '노하린', '김다은', '박서윤', '이하늘', '최지우',
  '정민서', '강서연', '윤지원', '장예은', '한소율', '오나은', '임채원', '송지안',
  '배서아', '신하린', '홍예린', '안지유', '조서아', '권다인', '류예나', '노소은',
];

// 날짜 생성 함수
const generateDate = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
};

// Mock 리뷰 생성
export const mockReviews: Review[] = (() => {
  const reviews: Review[] = [];
  let reviewId = 1;
  let customerId = 1;

  // 긍정 리뷰 30개
  for (let i = 0; i < 30; i++) {
    const template = reviewTemplates.positive[i % reviewTemplates.positive.length];
    reviews.push({
      id: `r${reviewId++}`,
    productId: 'p1',
      customerId: `c${customerId++}`,
      customerName: customerNames[i % customerNames.length],
      rating: template.rating,
      content: template.content,
    sentiment: 'positive',
      createdAt: generateDate(Math.floor(Math.random() * 60)),
    });
  }

  // 부정 리뷰 15개
  for (let i = 0; i < 15; i++) {
    const template = reviewTemplates.negative[i % reviewTemplates.negative.length];
    reviews.push({
      id: `r${reviewId++}`,
    productId: 'p1',
      customerId: `c${customerId++}`,
      customerName: customerNames[(i + 30) % customerNames.length],
      rating: template.rating,
      content: template.content,
    sentiment: 'negative',
      createdAt: generateDate(Math.floor(Math.random() * 60)),
    });
  }

  // 중립 리뷰 10개
  for (let i = 0; i < 10; i++) {
    const template = reviewTemplates.neutral[i % reviewTemplates.neutral.length];
    reviews.push({
      id: `r${reviewId++}`,
    productId: 'p1',
      customerId: `c${customerId++}`,
      customerName: customerNames[(i + 45) % customerNames.length],
      rating: template.rating,
      content: template.content,
    sentiment: 'neutral',
      createdAt: generateDate(Math.floor(Math.random() * 60)),
    });
  }

  // 추가 긍정 리뷰 (다양한 키워드 포함)
  const additionalPositive = [
    { rating: 5, content: '보습 효과가 정말 뛰어나요. 피부가 촉촉해지는 게 느껴져요!' },
    { rating: 5, content: '수분 공급이 확실해서 건조한 피부에 딱이에요. 추천합니다!' },
    { rating: 5, content: '윤기가 정말 좋아요. 피부가 건강해 보여요.' },
    { rating: 4, content: '흡수력이 빠르고 사용감이 좋아요. 가성비도 괜찮아요.' },
    { rating: 5, content: '탄력이 생기고 피부결이 좋아진 것 같아요. 만족합니다!' },
    { rating: 4, content: '진정 효과가 있어서 좋아요. 트러블이 있는 피부에도 괜찮아요.' },
    { rating: 5, content: '모공이 줄어든 것 같아요. 피부가 더욱 깨끗해 보여요.' },
    { rating: 4, content: '향이 은은하고 좋아요. 효과도 만족스럽습니다.' },
    { rating: 5, content: '용량이 넉넉해서 오래 쓸 수 있어요. 가성비 최고예요!' },
    { rating: 4, content: '피부에 부담이 없어서 좋아요. 계속 사용할 예정입니다.' },
  ];

  for (let i = 0; i < additionalPositive.length; i++) {
    reviews.push({
      id: `r${reviewId++}`,
    productId: 'p1',
      customerId: `c${customerId++}`,
      customerName: customerNames[(i + 55) % customerNames.length],
      rating: additionalPositive[i].rating,
      content: additionalPositive[i].content,
    sentiment: 'positive',
      createdAt: generateDate(Math.floor(Math.random() * 60)),
    });
  }

  // 날짜순으로 정렬 (최신순)
  return reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
})();

export const mockWordCloud: WordCloudItem[] = [
  { text: '보습', value: 95 },
  { text: '촉촉', value: 87 },
  { text: '흡수력', value: 78 },
  { text: '수분', value: 72 },
  { text: '가성비', value: 65 },
  { text: '윤기', value: 58 },
  { text: '끈적임', value: 52 },
  { text: '향', value: 48 },
  { text: '모공', value: 45 },
  { text: '탄력', value: 42 },
  { text: '피부결', value: 38 },
  { text: '진정', value: 35 },
  { text: '트러블', value: 32 },
  { text: '효과', value: 28 },
  { text: '용량', value: 25 },
];

// 주소 목록 (일관성 유지를 위해 전역으로 정의)
const REPURCHASE_ADDRESSES = [
  '서울특별시 강남구 역삼동',
  '서울특별시 서초구 반포동',
  '서울특별시 송파구 잠실동',
  '용인시 기흥구 신갈동',
  '용인시 수지구 죽전동',
  '전주시 덕진구 인후동',
  '부산시 해운대구 우동',
  '대전시 유성구 봉명동',
];

// 재구매 고객 mock 데이터 생성 (mockCustomers 기반)
export const generateRepurchaseCustomers = (productId: string | null): RepurchaseCustomer[] => {
  // 재구매를 한 고객들만 필터링 (구매 횟수가 2회 이상)
  const repurchaseCustomers = mockCustomers
    .filter(customer => customer.purchaseCount > 1)
    .map((customer): RepurchaseCustomer => {
      // 재구매 평균 소요 시간 계산 (첫 구매일과 최근 구매일 사이의 일수를 구매 횟수로 나눔)
      const firstDate = new Date(customer.firstPurchaseDate);
      const recentDate = new Date(customer.recentPurchaseDate);
      const daysDiff = Math.ceil((recentDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24));
      // 평균 재구매 소요 시간 = 전체 기간 / (구매 횟수 - 1)
      const averageRepurchaseDays = customer.purchaseCount > 1 
        ? Math.round(daysDiff / (customer.purchaseCount - 1))
        : 0;

      // 전화번호 생성 (고객 ID 기반으로 일관성 있게)
      const customerNum = parseInt(customer.id.replace('C', ''));
      const phone = `010-${String(customerNum).padStart(4, '0')}-${String(customerNum * 7 % 10000).padStart(4, '0')}`;

      // 주소는 고객 ID 기반으로 일관성 있게 할당
      const addressIndex = customerNum % REPURCHASE_ADDRESSES.length;

      return {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: phone,
        address: REPURCHASE_ADDRESSES[addressIndex],
        grade: customer.grade,
        purchaseCount: customer.purchaseCount,
        averageRepurchaseDays: averageRepurchaseDays,
        points: customer.points,
        recentPurchaseDate: customer.recentPurchaseDate,
      };
    });

  // 상품 필터링이 있으면 해당 상품을 구매한 고객만 반환
  // 실제로는 더 복잡한 필터링이 필요하지만, 여기서는 전체 재구매 고객 반환
  return repurchaseCustomers;
};

// 재구매 상품 데이터 생성
const generateRepurchaseProducts = (productId: string | null): RepurchaseProduct[] => {
  const allProducts: RepurchaseProduct[] = [
    { productId: 'p1', productName: '히알루론산 세럼', price: '45000', repurchaseRate: 68.5 },
    { productId: 'p2', productName: '비타민C 앰플', price: '52000', repurchaseRate: 65.2 },
    { productId: 'p3', productName: '수분 크림', price: '38000', repurchaseRate: 62.8 },
    { productId: 'p4', productName: '클렌징 폼', price: '28000', repurchaseRate: 58.3 },
    { productId: 'p5', productName: '선크림 SPF50+', price: '35000', repurchaseRate: 55.7 },
    { productId: 'p6', productName: '나이아신아마이드 토너', price: '42000', repurchaseRate: 52.1 },
    { productId: 'p7', productName: '레티놀 나이트 크림', price: '68000', repurchaseRate: 48.5 },
    { productId: 'p8', productName: '미스트 토너', price: '32000', repurchaseRate: 45.2 },
    { productId: 'p9', productName: '아이 세럼', price: '55000', repurchaseRate: 41.8 },
    { productId: 'p10', productName: '수딩 마스크팩', price: '25000', repurchaseRate: 38.3 },
  ];

  return allProducts.sort((a, b) => (b.repurchaseRate || 0) - (a.repurchaseRate || 0));
};

// 재구매 배송지 데이터 생성 (실제 고객 데이터 기반)
const generateRepurchaseAddresses = (): RepurchaseAddress[] => {
  const allCustomers = generateRepurchaseCustomers(null);
  
  // 주소별 고객 수 집계
  const addressCounts = new Map<string, number>();
  allCustomers.forEach(customer => {
    const count = addressCounts.get(customer.address) || 0;
    addressCounts.set(customer.address, count + 1);
  });

  // 주소별 재구매 수 계산 (고객당 평균 구매 횟수 고려)
  const addressData = Array.from(addressCounts.entries()).map(([address, customerCount]) => {
    const customersInAddress = allCustomers.filter(c => c.address === address);
    const totalRepurchaseCount = customersInAddress.reduce((sum, c) => sum + c.purchaseCount, 0);
    return {
      address,
      count: totalRepurchaseCount,
      customerCount,
    };
  });

  // count 기준으로 내림차순 정렬
  addressData.sort((a, b) => b.count - a.count);

  // 전체 재구매 수 계산
  const totalCount = addressData.reduce((sum, item) => sum + item.count, 0);

  // percentage 계산
  const addresses: RepurchaseAddress[] = addressData.map(item => ({
    address: item.address,
    count: item.count,
    percentage: totalCount > 0 ? (item.count / totalCount) * 100 : 0,
  }));

  return addresses;
};

// 재구매 KPI 데이터 생성 (다중 상품 지원)
const generateRepurchaseKPI = (productIds: string[] | null, products: RepurchaseProduct[]): RepurchaseData['kpi'] => {
  // 선택된 상품들 필터링
  const selectedProducts = productIds && productIds.length > 0
    ? products.filter(p => productIds.includes(p.productId))
    : products; // 선택이 없으면 전체 상품 사용

  // 평균 KPI 계산
  if (selectedProducts.length === 0) {
    return {
      totalRepurchaseCount: 0,
      averageRepurchaseRate: 0,
      averageRepurchaseDays: 0,
      sameProductRepurchaseRate: 0,
      repurchaseCustomerRevenueContribution: 0,
    };
  }

  // 상품별로 다른 KPI 값 생성 (각 상품의 재구매율 기반)
  const productKPIs = selectedProducts.map((product) => {
    const rate = product.repurchaseRate || 50;
    const rateRatio = rate / 100; // 0~1 사이 값
    return {
      totalRepurchaseCount: Math.floor(100 + rateRatio * 100),
      averageRepurchaseRate: rate,
      averageRepurchaseDays: Math.floor(25 + (1 - rateRatio) * 30), // 재구매율이 높을수록 기간 짧음
      sameProductRepurchaseRate: 40 + rateRatio * 30,
      repurchaseCustomerRevenueContribution: 65 + rateRatio * 20,
    };
  });

  // 단순 평균 계산
  const count = productKPIs.length;
  return {
    totalRepurchaseCount: Math.round(productKPIs.reduce((sum, kpi) => sum + kpi.totalRepurchaseCount, 0) / count),
    averageRepurchaseRate: Math.round(productKPIs.reduce((sum, kpi) => sum + kpi.averageRepurchaseRate, 0) / count * 10) / 10,
    averageRepurchaseDays: Math.round(productKPIs.reduce((sum, kpi) => sum + kpi.averageRepurchaseDays, 0) / count),
    sameProductRepurchaseRate: Math.round(productKPIs.reduce((sum, kpi) => sum + kpi.sameProductRepurchaseRate, 0) / count * 10) / 10,
    repurchaseCustomerRevenueContribution: Math.round(productKPIs.reduce((sum, kpi) => sum + kpi.repurchaseCustomerRevenueContribution, 0) / count * 10) / 10,
  };
};

// 재구매 데이터 생성 함수 (다중 상품 지원)
export const generateRepurchaseData = (productIds: string[] | null): RepurchaseData => {
  const products = generateRepurchaseProducts(null); // 항상 전체 상품 목록 사용
  return {
    kpi: generateRepurchaseKPI(productIds, products),
    customers: generateRepurchaseCustomers(null), // 고객은 전체 고객 사용 (필요시 필터링 가능)
    products: products,
    addresses: generateRepurchaseAddresses(),
  };
};

// 상품별 재구매 고객 필터링
export const getCustomersByProduct = (productId: string): RepurchaseCustomer[] => {
  const allCustomers = generateRepurchaseCustomers(null);
  const product = mockProducts.find(p => p.id === productId);
  if (!product) return [];
  
  // 상품별로 일관성 있게 고객 선택
  // 실제로는 고객의 구매 이력에서 해당 상품을 구매한 고객만 필터링해야 함
  // Mock 데이터에서는 상품 ID 기반으로 일관성 있게 고객 선택
  const productIndex = parseInt(productId.replace('p', ''));
  
  // 상품별로 다른 고객 그룹 반환 (일관성 유지)
  // 구매 횟수가 많은 고객들을 우선 선택하되, 상품별로 다른 그룹
  const sortedCustomers = [...allCustomers].sort((a, b) => b.purchaseCount - a.purchaseCount);
  const startIndex = (productIndex - 1) * 2;
  const endIndex = Math.min(startIndex + 10, sortedCustomers.length);
  
  return sortedCustomers.slice(startIndex, endIndex);
};

// 배송지별 재구매 고객 필터링
export const getCustomersByAddress = (address: string): RepurchaseCustomer[] => {
  const allCustomers = generateRepurchaseCustomers(null);
  return allCustomers.filter(customer => customer.address === address);
};

// 고객별 재구매 데이터 생성
export const generateCustomerRepurchaseData = (customerId: string): RepurchaseData => {
  const customer = mockCustomers.find(c => c.id === customerId);
  if (!customer) {
    return {
      kpi: {
        totalRepurchaseCount: 0,
        averageRepurchaseRate: 0,
        averageRepurchaseDays: 0,
        sameProductRepurchaseRate: 0,
        repurchaseCustomerRevenueContribution: 0,
      },
      customers: [],
      products: [],
      addresses: [],
    };
  }

  // 고객의 재구매 상품 데이터 생성
  // 구매 횟수에 비례하여 상품 수 결정
  const productCount = Math.min(customer.purchaseCount, mockProducts.length);
  const customerProducts: RepurchaseProduct[] = mockProducts
    .slice(0, productCount)
    .map((product, index) => {
      // 고객 ID 기반으로 일관성 있는 재구매 횟수 생성
      const customerNum = parseInt(customerId.replace('C', ''));
      const baseCount = Math.floor((customerNum + index * 3) % 10) + 1;
      return {
        productId: product.id,
        productName: product.name,
        price: product.price?.toString() || '0',
        repurchaseRate: (baseCount / 10) * 5, // 간단한 재구매율 계산
      };
    })
    .sort((a, b) => (b.repurchaseRate || 0) - (a.repurchaseRate || 0));

  // 고객의 재구매 배송지 데이터 생성
  // 고객의 주소를 기반으로 생성
  const repurchaseCustomer = generateRepurchaseCustomers(null).find(c => c.id === customerId);
  const customerAddresses: RepurchaseAddress[] = repurchaseCustomer ? [
    {
      address: repurchaseCustomer.address,
      count: customer.purchaseCount,
      percentage: 100,
    },
  ] : [];

  // 고객별 KPI 계산
  const firstDate = new Date(customer.firstPurchaseDate);
  const recentDate = new Date(customer.recentPurchaseDate);
  const daysDiff = Math.ceil((recentDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24));
  const averageRepurchaseDays = customer.purchaseCount > 1 
    ? Math.round(daysDiff / (customer.purchaseCount - 1))
    : 0;

  return {
    kpi: {
      totalRepurchaseCount: Math.max(0, customer.purchaseCount - 1),
      averageRepurchaseRate: customer.purchaseCount > 1 ? 100 : 0,
      averageRepurchaseDays: averageRepurchaseDays,
      sameProductRepurchaseRate: customerProducts.length > 0 ? 60 : 0,
      repurchaseCustomerRevenueContribution: 0,
    },
    customers: [],
    products: customerProducts,
    addresses: customerAddresses,
  };
};
