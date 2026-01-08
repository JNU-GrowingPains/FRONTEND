# API 연동 완료 요약

## 개요
백엔드 API (172.20.10.4:8000)와 프론트엔드 연동이 완료되었습니다.

## 완료된 작업

### 1. 고객 분석 API 연동 ✅
**파일:** `src/services/customers.ts`, `src/types/customer.ts`

**수정 사항:**
- ✅ `Customer` 타입의 `totalAmount` → `totalSpent`로 변경
- ✅ 등급별 통계 API 응답 구조 수정 (`grade_distribution` 필드 우선 처리)
- ✅ 포인트 상위 고객 API 필드 매핑 (`member_id`, `available_points`, `purchase_count`)
- ✅ 고객 목록 API 필드 매핑 (`first_purchase`, `last_purchase` 처리)
- ✅ Mock 데이터 `totalAmount` → `totalSpent` 일괄 변경

**API 엔드포인트:**
- `GET /api/v1/member-analysis/grade-stats` - 등급별 통계
- `GET /api/v1/member-analysis/top-members?limit=10` - 포인트 상위 고객
- `GET /api/v1/member-analysis/members` - 고객 목록

---

### 2. 상품 분석 API 연동 ✅
**파일:** `src/services/products.ts`, `src/services/reviews.ts`

**수정 사항:**
- ✅ 상품 목록 API에 쿼리 파라미터 추가 (`limit`, `from_date`, `to_date`)
- ✅ 상품별 통계 API 파라미터 수정 (`startDate`, `endDate`)
- ✅ 일별 판매 차트 데이터 응답 매핑 (`daily_sales` 필드 처리)
- ✅ 상품별 리뷰 통계, 키워드, 목록 API 에러 처리 추가
- ✅ 전체 리뷰 분석 API 응답 매핑 (`items` 필드, `sentiment` 변환)

**API 엔드포인트:**
- `GET /api/v1/product-analysis/products` - 상품 목록
- `GET /api/v1/product-analysis/products/{id}/stats` - 상품별 통계
- `GET /api/v1/product-analysis/products/{id}/daily-sales` - 일별 판매 데이터
- `GET /api/v1/product-analysis/products/{id}/review-stats` - 상품별 리뷰 통계
- `GET /api/v1/product-analysis/products/{id}/review-keywords` - 상품별 리뷰 키워드
- `GET /api/v1/product-analysis/products/{id}/reviews` - 상품별 리뷰 목록
- `GET /api/v1/review-analysis/stats` - 전체 리뷰 통계
- `GET /api/v1/review-analysis/keywords` - 전체 리뷰 키워드
- `GET /api/v1/review-analysis/list` - 전체 리뷰 목록

---

### 3. 재구매 분석 API 연동 ✅
**파일:** `src/services/repurchase.ts`, `src/types/repurchase.ts`, `src/hooks/useRepurchase.ts`

**수정 사항:**
- ✅ `RepurchaseProduct` 타입에 `repurchaseRate`, `category`, `price` 필드 추가
- ✅ 재구매 상품 목록 API에 `site_id` 파라미터 추가
- ✅ 재구매 KPI API 필드 매핑 검증 (`total_repurchase_count`, `avg_repurchase_rate` 등)
- ✅ 재구매 고객 목록 API 필드 매핑 (`customer_id`, `avg_repurchase_period`, `last_purchase_date`)
- ✅ React Query 훅에 `siteId` 파라미터 추가

**API 엔드포인트:**
- `GET /api/v1/repurchase-analysis/products?site_id=1` - 재구매 상품 목록
- `GET /api/v1/repurchase-analysis/kpis?site_id=1` - 재구매 KPI
- `GET /api/v1/repurchase-analysis/customers?site_id=1` - 재구매 고객 목록

---

### 4. 에러 처리 및 로딩 상태 개선 ✅
**파일:** `src/services/api.ts`

**수정 사항:**
- ✅ 사용자 친화적인 에러 메시지 추가
  - 400: "잘못된 요청입니다. 입력 정보를 확인해주세요."
  - 401: 자동 토큰 갱신 또는 로그인 페이지 리다이렉트
  - 403: "접근 권한이 없습니다."
  - 404: "요청한 데이터를 찾을 수 없습니다."
  - 500: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
- ✅ 모든 서비스에 try-catch 에러 처리 추가
- ✅ 콘솔 로그를 통한 디버깅 정보 출력

---

## 테스트 방법

### 개발 서버 실행
```bash
npm run dev
```

### 1. 고객 분석 페이지 테스트
1. 브라우저에서 `http://localhost:5173` 접속
2. 로그인 후 "고객 분석" 메뉴 클릭
3. **확인 사항:**
   - [ ] 등급별 분포 차트가 정상적으로 표시되는지
   - [ ] 포인트 상위 고객 TOP 3가 표시되는지
   - [ ] 고객 목록 테이블에 데이터가 표시되는지
   - [ ] 등급 필터링이 동작하는지
   - [ ] 정렬 기능이 동작하는지

### 2. 상품 분석 페이지 테스트
1. "상품 분석" 메뉴 클릭
2. **확인 사항:**
   - [ ] 상품 목록이 로드되는지
   - [ ] 상품 선택이 가능한지
   - [ ] 날짜 범위 선택 시 차트가 업데이트되는지
   - [ ] 일별 판매 차트가 표시되는지
   - [ ] 리뷰 통계가 표시되는지
   - [ ] 워드클라우드가 표시되는지
   - [ ] 리뷰 목록 및 필터링이 동작하는지

### 3. 재구매 분석 페이지 테스트
1. "재구매 분석" 메뉴 클릭
2. **확인 사항:**
   - [ ] 재구매 상품 목록이 표시되는지
   - [ ] 전체 평균 KPI가 표시되는지
   - [ ] 상품 선택 시 KPI가 업데이트되는지
   - [ ] 재구매 고객 목록이 표시되는지
   - [ ] 고객 클릭 시 상세 정보가 표시되는지

### 4. 공통 기능 테스트
- [ ] JWT 토큰 자동 갱신이 동작하는지
- [ ] 401 에러 시 로그인 페이지로 리다이렉트되는지
- [ ] 에러 메시지가 적절히 표시되는지
- [ ] 로딩 상태가 적절히 표시되는지

---

## 디버깅 방법

### 브라우저 개발자 도구 콘솔 확인
각 API 호출 시 다음 정보가 콘솔에 출력됩니다:
- 엔드포인트 URL
- 요청 파라미터
- 원본 응답 데이터
- 매핑된 데이터

### 예시 로그
```
=== 고객 목록 API 호출 ===
엔드포인트: /api/v1/member-analysis/members
파라미터: {page: 1, limit: 20}
원본 응답: {...}
응답 타입: object Array? false
✓ response.members 사용
추출된 고객 수: 20
매핑된 고객 수: 20
```

---

## 주요 변경 파일 목록

### 서비스 레이어
- `src/services/api.ts` - API 클라이언트 (에러 처리 개선)
- `src/services/customers.ts` - 고객 API 서비스
- `src/services/products.ts` - 상품 API 서비스
- `src/services/reviews.ts` - 리뷰 API 서비스
- `src/services/repurchase.ts` - 재구매 API 서비스

### 타입 정의
- `src/types/customer.ts` - 고객 타입 (`totalAmount` → `totalSpent`)
- `src/types/repurchase.ts` - 재구매 타입 (필드 추가)

### 훅
- `src/hooks/useRepurchase.ts` - 재구매 훅 (`siteId` 파라미터 추가)

### Mock 데이터
- `src/lib/mockData.ts` - Mock 고객 데이터 (`totalAmount` → `totalSpent`)

---

## 환경 설정

### config.ts
```typescript
export const config = {
  apiMode: 'production', // 'mock' 또는 'production'
  apiBaseUrl: 'http://172.20.10.4:8000',
  // ...
};
```

### API 모드 전환
- **Mock 모드**: `apiMode: 'mock'` - 로컬 Mock 데이터 사용
- **Production 모드**: `apiMode: 'production'` - 실제 백엔드 API 사용

---

## 알려진 이슈 및 해결 방법

### 1. CORS 에러
**증상:** 브라우저 콘솔에 CORS 에러 표시
**해결:** 백엔드에서 CORS 설정 확인 필요

### 2. 401 Unauthorized
**증상:** API 호출 시 401 에러
**해결:** 
- 로그인 후 Access Token이 정상적으로 발급되었는지 확인
- 토큰 자동 갱신이 실패한 경우 재로그인

### 3. 네트워크 연결 실패
**증상:** API 호출 시 네트워크 에러
**해결:**
- 백엔드 서버가 실행 중인지 확인
- IP 주소가 올바른지 확인 (172.20.10.4:8000)
- 같은 와이파이 네트워크에 연결되어 있는지 확인

---

## 다음 단계

1. **실제 백엔드 서버 테스트**
   - 백엔드 서버를 172.20.10.4:8000에서 실행
   - 프론트엔드에서 각 페이지 기능 테스트
   - 콘솔 로그 확인하여 응답 데이터 검증

2. **응답 형식 불일치 수정**
   - 실제 API 응답과 예상 형식이 다른 경우 매핑 로직 조정
   - 콘솔 로그를 참고하여 필드명 확인

3. **에러 처리 보완**
   - 사용자에게 에러 메시지를 Toast나 Alert로 표시
   - 재시도 로직 추가

4. **성능 최적화**
   - React Query 캐싱 전략 최적화
   - 불필요한 API 호출 방지

---

## 연락처
문제 발생 시 백엔드 팀에 문의하여 API 응답 형식을 확인하세요.





