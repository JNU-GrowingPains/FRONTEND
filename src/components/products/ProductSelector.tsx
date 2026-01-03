import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';
import { useFilterStore } from '../../store/useFilterStore';

const ITEMS_PER_PAGE = 5; // 페이지네이션 사용 시 페이지당 아이템 수
const ITEMS_TO_SHOW = 10; // 페이지네이션 없이 표시할 아이템 수

interface ProductSelectorProps {
  usePagination?: boolean; // 페이지네이션 사용 여부
  showStock?: boolean; // 재고 열 표시 여부
}

export function ProductSelector({ usePagination = false, showStock = false }: ProductSelectorProps) {
  const { data: products, isLoading } = useProducts();
  const { selectedProductIds, toggleProduct, setProduct } = useFilterStore();
  const [currentPage, setCurrentPage] = useState(0);
  
  // 단일 선택 모드: usePagination이 true이거나 다중 선택이 필요 없는 경우
  const isSingleSelect = usePagination;

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">상품 선택</h3>
        <div className="text-center text-gray-500 py-8">로딩 중...</div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">상품 선택</h3>
        <div className="text-center text-gray-500 py-8">상품이 없습니다</div>
      </div>
    );
  }

  // 페이지네이션 사용 여부에 따라 표시할 상품 결정
  const displayProducts = usePagination
    ? (() => {
        const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
        const startIndex = currentPage * ITEMS_PER_PAGE;
        return products.slice(startIndex, startIndex + ITEMS_PER_PAGE);
      })()
    : products.slice(0, ITEMS_TO_SHOW);

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900">슈엘로 상품 목록</h3>
        <div className="flex items-center gap-4">
          {!isSingleSelect && selectedProductIds.length > 0 && (
            <span className="text-sm text-gray-600">
              {selectedProductIds.length}개 선택됨
            </span>
          )}
          {usePagination && (
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevious}
                disabled={currentPage === 0}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="text-sm text-gray-600 min-w-[60px] text-center">
                {currentPage + 1} / {totalPages}
              </span>
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages - 1}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              {!isSingleSelect && (
                <th className="text-left py-3 px-4 w-12">
                  <input
                    type="checkbox"
                    checked={displayProducts.length > 0 && displayProducts.every(p => selectedProductIds.includes(p.id))}
                    onChange={(e) => {
                      if (e.target.checked) {
                        displayProducts.forEach(p => {
                          if (!selectedProductIds.includes(p.id)) {
                            toggleProduct(p.id);
                          }
                        });
                      } else {
                        displayProducts.forEach(p => {
                          if (selectedProductIds.includes(p.id)) {
                            toggleProduct(p.id);
                          }
                        });
                      }
                    }}
                    className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                  />
                </th>
              )}
              <th className="text-left py-3 px-4">상품명</th>
              <th className="text-left py-3 px-4">카테고리</th>
              <th className="text-left py-3 px-4">가격</th>
              {showStock && (
                <th className="text-left py-3 px-4">재고</th>
              )}
            </tr>
          </thead>
          <tbody>
            {displayProducts.map((product) => {
              const isSelected = isSingleSelect
                ? selectedProductIds[0] === product.id
                : selectedProductIds.includes(product.id);
              const handleSelect = () => {
                if (isSingleSelect) {
                  setProduct(product.id);
                } else {
                  toggleProduct(product.id);
                }
              };
              return (
                <tr
                  key={product.id}
                  onClick={handleSelect}
                  className={`cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-emerald-600 text-white'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {!isSingleSelect && (
                    <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={handleSelect}
                        className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 cursor-pointer"
                      />
                    </td>
                  )}
                  <td className="py-3 px-4">
                    <span className={isSelected && !isSingleSelect ? 'font-semibold text-emerald-700' : ''}>
                      {product.name}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs ${
                      isSelected && !isSingleSelect
                        ? 'bg-emerald-500 text-white'
                        : isSelected && isSingleSelect
                        ? 'bg-emerald-500 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {product.category}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {product.price.toLocaleString()}원
                  </td>
                  {showStock && (
                    <td className="py-3 px-4">
                      {product.stock}개
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {!usePagination && products.length > ITEMS_TO_SHOW && (
        <div className="mt-4 text-sm text-gray-500 text-center">
          상위 {ITEMS_TO_SHOW}개 상품만 표시됩니다 (전체 {products.length}개)
        </div>
      )}
    </div>
  );
}