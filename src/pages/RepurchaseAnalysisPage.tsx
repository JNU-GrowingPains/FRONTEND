import { useState, useMemo, useEffect } from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { ProductSelector } from '../components/products/ProductSelector';
import { RepurchaseKPICards } from '../components/repurchase/RepurchaseKPICards';
import { RepurchaseCustomerTable } from '../components/repurchase/RepurchaseCustomerTable';
import { RepurchaseAddressChart } from '../components/repurchase/RepurchaseAddressChart';
import { RepurchaseProductChart } from '../components/repurchase/RepurchaseProductChart';
import { useFilterStore } from '../store/useFilterStore';
import { EmptyState } from '../components/common/EmptyState';
import { ArrowLeft } from 'lucide-react';
import { useRepurchaseKPIs, useRepurchaseCustomers, useRepurchaseProducts, useCustomerRepurchaseDetail } from '../hooks/useRepurchase';

type ViewMode = 'product' | 'customer';

export function RepurchaseAnalysisPage() {
  const selectedProductIds = useFilterStore((state) => state.selectedProductIds);
  const [viewMode, setViewMode] = useState<ViewMode>('product'); // 초기값을 'product'로 설정
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  
  // 필터 및 정렬 상태 추가
  const [gradeFilter, setGradeFilter] = useState<string | undefined>(undefined);
  const [sortBy, setSortBy] = useState<'latest_repurchase' | 'purchase_count' | 'points' | 'name'>('latest_repurchase');
  
  // API로 재구매 상품 목록 조회
  const { data: repurchaseProducts, isLoading: productsLoading } = useRepurchaseProducts();
  
  // API로 재구매 KPI 데이터 조회
  const { data: kpiData, isLoading: kpiLoading } = useRepurchaseKPIs(
    selectedProductIds.length > 0 ? selectedProductIds : undefined
  );

  // API로 재구매 고객 목록 조회 - grade와 sort_by 추가
  const { data: customersData, isLoading: customersLoading } = useRepurchaseCustomers({
    product_ids: selectedProductIds.length > 0 ? selectedProductIds : undefined,
    grade: gradeFilter,
    sort_by: sortBy,
  });
  
  // 재구매 상품 목록 로그 출력
  useEffect(() => {
    console.log('재구매 상품 목록:', repurchaseProducts);
  }, [repurchaseProducts]);
  
  // 재구매 고객 목록 로그 출력
  useEffect(() => {
    console.log('재구매 고객 목록:', customersData);
  }, [customersData]);
  
  // 전체 선택/해제 핸들러
  const handleSelectAll = () => {
    if (!repurchaseProducts) return;
    
    const displayedIds = repurchaseProducts.slice(0, 10).map(p => p.productId);
    const allSelected = displayedIds.every(id => selectedProductIds.includes(id));
    
    if (allSelected) {
      // 전체 해제
      const { setProducts } = useFilterStore.getState();
      setProducts(selectedProductIds.filter(id => !displayedIds.includes(id)));
    } else {
      // 전체 선택
      const { setProducts } = useFilterStore.getState();
      const newSelection = [...new Set([...selectedProductIds, ...displayedIds])];
      setProducts(newSelection);
    }
  };

  // 고객별 재구매 데이터 조회 (API 연동)
  const { data: customerRepurchaseDetail, isLoading: detailLoading, error: detailError } = useCustomerRepurchaseDetail(selectedCustomerId);

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
    if (!selectedCustomerId || !customersData) return null;
    return customersData.find(c => c.id === selectedCustomerId);
  }, [selectedCustomerId, customersData]);

  // 로딩 상태
  if (productsLoading || kpiLoading || customersLoading) {
    return (
      <div>
        <PageHeader
          title="재구매 분석"
          description="재구매 데이터를 상품별, 고객별로 확인하세요"
        />
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-500">
          데이터를 불러오는 중...
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="재구매 분석"
        description="재구매 데이터를 상품별, 고객별로 확인하세요"
      />

      {/* 재구매 상품 선택 테이블 */}
      <div className="mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">재구매 상품 선택</h3>
            <div className="flex items-center gap-4">
              {selectedProductIds.length > 0 && (
                <span className="text-sm text-gray-600">
                  {selectedProductIds.length}개 선택됨
                </span>
              )}
            </div>
          </div>
          
          {repurchaseProducts && repurchaseProducts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 w-12">
                      <input
                        type="checkbox"
                        checked={
                          repurchaseProducts.slice(0, 10).length > 0 &&
                          repurchaseProducts.slice(0, 10).every(p => selectedProductIds.includes(p.productId))
                        }
                        onChange={handleSelectAll}
                        className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                      />
                    </th>
                    <th className="text-left py-3 px-4">상품명</th>
                    <th className="text-left py-3 px-4">가격</th>
                  </tr>
                </thead>
                <tbody>
                  {repurchaseProducts.slice(0, 10).map((product) => {
                    const isSelected = selectedProductIds.includes(product.productId);
                    return (
                      <tr 
                        key={product.productId}
                        onClick={() => useFilterStore.getState().toggleProduct(product.productId)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-emerald-600 text-white'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => useFilterStore.getState().toggleProduct(product.productId)}
                            className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <span className={isSelected ? 'font-semibold text-emerald-700' : ''}>
                            {product.productName}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {product.price ? `₩${Number(product.price).toLocaleString()}` : '-'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">재구매 상품이 없습니다</div>
          )}
          
          {repurchaseProducts && repurchaseProducts.length > 10 && (
            <div className="mt-4 text-sm text-gray-500 text-center">
              상위 10개 상품만 표시됩니다 (전체 {repurchaseProducts.length}개)
            </div>
          )}
        </div>
      </div>

      {viewMode === 'product' ? (
        <div className="space-y-6">
          {/* KPI 카드 */}
          {kpiData ? (
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
              <RepurchaseKPICards kpi={kpiData} />
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-500">
              KPI 데이터를 불러올 수 없습니다
            </div>
          )}

          {/* 재구매 고객 테이블 */}
          {customersData && customersData.length > 0 ? (
            <>
              <RepurchaseCustomerTable 
                customers={customersData}
                onCustomerClick={handleCustomerClick}
                selectedCustomerId={selectedCustomerId}
                gradeFilter={gradeFilter}
                sortBy={sortBy}
                onGradeFilterChange={setGradeFilter}
                onSortByChange={setSortBy}
              />

              {/* 고객 선택 시 그래프 표시 */}
              {selectedCustomerId && selectedCustomer && (
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
                        <p className="text-lg font-semibold text-gray-900">
                          {customerRepurchaseDetail?.customer.totalOrderCount || selectedCustomer.purchaseCount}회
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">평균 재구매 기간</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {customerRepurchaseDetail?.customer.avgRepurchaseDays || selectedCustomer.averageRepurchaseDays}일
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">고객 등급</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {customerRepurchaseDetail?.customer.grade || selectedCustomer.grade}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">보유 포인트</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {(customerRepurchaseDetail?.customer.points || selectedCustomer.points).toLocaleString()}P
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 고객의 재구매 상품 및 배송지 차트 (양옆 배치) */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {detailLoading ? (
                      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                          <p className="text-gray-500">데이터를 불러오는 중...</p>
                          <p className="text-xs text-gray-400">처음 로딩 시 최대 60초가 걸릴 수 있습니다</p>
                        </div>
                      </div>
                    ) : detailError ? (
                      <div className="bg-white rounded-xl border border-red-200 p-12">
                        <EmptyState
                          title="데이터 로드 실패"
                          description="고객 정보를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요."
                        />
                      </div>
                    ) : customerRepurchaseDetail?.products && customerRepurchaseDetail.products.length > 0 ? (
                      <RepurchaseProductChart data={customerRepurchaseDetail.products} />
                    ) : (
                      <div className="bg-white rounded-xl border border-gray-200 p-12">
                        <EmptyState
                          title="재구매 상품 데이터가 없습니다"
                          description="해당 고객은 아직 재구매한 상품이 없거나, 데이터가 집계되지 않았습니다."
                        />
                      </div>
                    )}

                    {detailLoading ? (
                      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                          <p className="text-gray-500">데이터를 불러오는 중...</p>
                          <p className="text-xs text-gray-400">처음 로딩 시 최대 60초가 걸릴 수 있습니다</p>
                        </div>
                      </div>
                    ) : detailError ? (
                      <div className="bg-white rounded-xl border border-red-200 p-12">
                        <EmptyState
                          title="데이터 로드 실패"
                          description="배송지 정보를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요."
                        />
                      </div>
                    ) : customerRepurchaseDetail?.addresses && customerRepurchaseDetail.addresses.length > 0 ? (
                      <RepurchaseAddressChart data={customerRepurchaseDetail.addresses} />
                    ) : (
                      <div className="bg-white rounded-xl border border-gray-200 p-12">
                        <EmptyState
                          title="재구매 배송지 데이터가 없습니다"
                          description="해당 고객의 배송지 정보가 없거나, 데이터가 집계되지 않았습니다."
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

