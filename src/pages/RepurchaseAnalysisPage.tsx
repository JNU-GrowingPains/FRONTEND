import { useState, useMemo, useEffect } from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { ProductSelector } from '../components/products/ProductSelector';
import { RepurchaseKPICards } from '../components/repurchase/RepurchaseKPICards';
import { RepurchaseCustomerTable } from '../components/repurchase/RepurchaseCustomerTable';
import { RepurchaseAddressChart } from '../components/repurchase/RepurchaseAddressChart';
import { RepurchaseProductChart } from '../components/repurchase/RepurchaseProductChart';
import { useFilterStore } from '../store/useFilterStore';
import { 
  generateRepurchaseData, 
  getCustomersByProduct,
  generateCustomerRepurchaseData,
  generateRepurchaseCustomers
} from '../lib/mockData';
import { EmptyState } from '../components/common/EmptyState';
import { ArrowLeft } from 'lucide-react';

type ViewMode = 'product' | 'customer';

export function RepurchaseAnalysisPage() {
  const selectedProductIds = useFilterStore((state) => state.selectedProductIds);
  const [viewMode, setViewMode] = useState<ViewMode | null>(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  
  // 상품 선택 여부와 관계없이 재구매 데이터 생성
  // 선택이 없으면 전체 상품의 평균, 선택이 있으면 선택한 상품들의 평균
  const repurchaseData = useMemo(() => {
    // selectedProductIds가 빈 배열이거나 null이면 null 전달 (전체 평균)
    // 선택된 상품이 있으면 선택된 상품 ID 배열 전달
    const productIdsForCalculation = selectedProductIds.length > 0 ? selectedProductIds : null;
    return generateRepurchaseData(productIdsForCalculation);
  }, [selectedProductIds]);

  // 상품별 재구매 고객 필터링 (첫 번째 선택된 상품 기준, 또는 전체 고객)
  const productCustomers = useMemo(() => {
    if (selectedProductIds.length === 0) {
      // 선택이 없으면 전체 재구매 고객 반환
      return generateRepurchaseCustomers(null);
    }
    // 첫 번째 선택된 상품의 고객들 반환 (고객은 단일 선택이므로)
    return getCustomersByProduct(selectedProductIds[0]);
  }, [selectedProductIds]);

  // 고객별 재구매 데이터 생성
  const customerRepurchaseData = useMemo(() => {
    if (!selectedCustomerId) return null;
    return generateCustomerRepurchaseData(selectedCustomerId);
  }, [selectedCustomerId]);

  // 상품 선택 시 product 뷰로 전환 (선택 없어도 전체 평균을 보여주므로 항상 product 뷰)
  useEffect(() => {
    setViewMode('product');
    if (selectedProductIds.length === 0) {
      setSelectedCustomerId(null);
    }
  }, [selectedProductIds]);

  // 고객 클릭 핸들러
  const handleCustomerClick = (customerId: string) => {
    setSelectedCustomerId(customerId);
  };

  // 뒤로가기 핸들러
  const handleBack = () => {
    setSelectedCustomerId(null);
  };

  const selectedCustomer = useMemo(() => {
    if (!selectedCustomerId) return null;
    return productCustomers.find(c => c.id === selectedCustomerId);
  }, [selectedCustomerId, productCustomers]);

  return (
    <div>
      <PageHeader
        title="재구매 분석"
        description="재구매 데이터를 상품별, 고객별로 확인하세요"
      />

      {/* 상품 선택 테이블 */}
      <div className="mb-6">
        <ProductSelector usePagination={false} />
      </div>

      {viewMode === 'product' && repurchaseData ? (
        <div className="space-y-6">
          {/* KPI 카드 */}
          <div>
            {selectedProductIds.length === 0 ? (
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>전체 상품 평균</strong> 데이터를 표시하고 있습니다. 위 목록에서 특정 상품을 선택하면 선택한 상품들의 평균을 볼 수 있습니다.
                </p>
              </div>
            ) : (
              <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                <p className="text-sm text-emerald-800">
                  <strong>{selectedProductIds.length}개 상품 선택됨</strong> - 선택한 상품들의 평균 데이터를 표시하고 있습니다.
                </p>
              </div>
            )}
            <RepurchaseKPICards kpi={repurchaseData.kpi} />
          </div>

          {/* 재구매 고객 테이블 */}
          {productCustomers.length > 0 ? (
            <>
              <RepurchaseCustomerTable 
                customers={productCustomers}
                onCustomerClick={handleCustomerClick}
                selectedCustomerId={selectedCustomerId}
              />

              {/* 고객 선택 시 그래프 표시 */}
              {selectedCustomerId && selectedCustomer && customerRepurchaseData && (
                <>
                  {/* 고객 정보 카드 */}
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {selectedCustomer.name} 고객 재구매 분석
                        </h3>
                        <p className="text-sm text-gray-500">
                          해당 고객의 재구매 상품 및 배송지 정보입니다.
                        </p>
                      </div>
                      <button
                        onClick={handleBack}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200"
                      >
                        <ArrowLeft size={16} />
                        닫기
                      </button>
                    </div>
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">구매 횟수</p>
                        <p className="text-lg font-semibold text-gray-900">{selectedCustomer.purchaseCount}회</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">평균 재구매 기간</p>
                        <p className="text-lg font-semibold text-gray-900">{selectedCustomer.averageRepurchaseDays}일</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">고객 등급</p>
                        <p className="text-lg font-semibold text-gray-900">{selectedCustomer.grade}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">보유 포인트</p>
                        <p className="text-lg font-semibold text-gray-900">{selectedCustomer.points.toLocaleString()}P</p>
                      </div>
                    </div>
                  </div>

                  {/* 고객의 재구매 상품 및 배송지 차트 (양옆 배치) */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {customerRepurchaseData.products.length > 0 ? (
                      <RepurchaseProductChart data={customerRepurchaseData.products} />
                    ) : (
                      <div className="bg-white rounded-xl border border-gray-200 p-12">
                        <EmptyState
                          title="재구매 상품 데이터가 없습니다"
                          description="해당 고객의 재구매 상품 정보가 없습니다."
                        />
                      </div>
                    )}

                    {customerRepurchaseData.addresses.length > 0 ? (
                      <RepurchaseAddressChart data={customerRepurchaseData.addresses} />
                    ) : (
                      <div className="bg-white rounded-xl border border-gray-200 p-12">
                        <EmptyState
                          title="재구매 배송지 데이터가 없습니다"
                          description="해당 고객의 재구매 배송지 정보가 없습니다."
                        />
                      </div>
                    )}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-12">
              <EmptyState
                title="재구매 고객이 없습니다"
                description="해당 상품을 재구매한 고객이 없습니다."
              />
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

