import { useState, useMemo } from 'react';
import { RepurchaseCustomer } from '../../types/repurchase';
import { ChevronLeft, ChevronRight, Filter } from 'lucide-react';

interface RepurchaseCustomerTableProps {
  customers: RepurchaseCustomer[];
  onCustomerClick?: (customerId: string) => void;
  selectedCustomerId?: string | null;
  gradeFilter?: string;
  sortBy?: 'latest_repurchase' | 'purchase_count' | 'points' | 'name';
  onGradeFilterChange?: (grade: string | undefined) => void;
  onSortByChange?: (sortBy: 'latest_repurchase' | 'purchase_count' | 'points' | 'name') => void;
}

type SortOption = 'latest_repurchase' | 'purchase_count' | 'points' | 'name';

const ITEMS_PER_PAGE = 20;

export function RepurchaseCustomerTable({ 
  customers, 
  onCustomerClick, 
  selectedCustomerId,
  gradeFilter,
  sortBy,
  onGradeFilterChange,
  onSortByChange
}: RepurchaseCustomerTableProps) {
  const [currentPage, setCurrentPage] = useState(0);

  // 백엔드에서 이미 필터링/정렬된 데이터를 받으므로 그대로 사용
  const displayCustomers = customers;

  const totalPages = displayCustomers.length > 0 ? Math.ceil(displayCustomers.length / ITEMS_PER_PAGE) : 1;
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const paginatedCustomers = displayCustomers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));
  };

  const handleSort = (option: SortOption) => {
    if (onSortByChange) {
      onSortByChange(option);
    }
    setCurrentPage(0);
  };

  const handleGradeFilter = (grade: string | undefined) => {
    if (onGradeFilterChange) {
      onGradeFilterChange(grade);
    }
    setCurrentPage(0);
  };

  const getGradeBadgeClass = (grade: string) => {
    switch (grade) {
      case '슈린이 VIP':
        return 'bg-purple-100 text-purple-700 border border-purple-300';
      case '슈린이 PLATINUM':
        return 'bg-blue-100 text-blue-700 border border-blue-300';
      case '슈린이 GOLD':
        return 'bg-amber-100 text-amber-700 border border-amber-300';
      case '슈둥이':
        return 'bg-gray-100 text-gray-700 border border-gray-300';
      default:
        return 'bg-gray-100 text-gray-700 border border-gray-300';
    }
  };

  const getGradeRowClass = (grade: string) => {
    switch (grade) {
      case '슈린이 VIP':
        return 'bg-purple-50 hover:bg-purple-100';
      case '슈린이 PLATINUM':
        return 'bg-blue-50 hover:bg-blue-100';
      case '슈린이 GOLD':
        return 'bg-amber-50 hover:bg-amber-100';
      case '슈둥이':
        return 'bg-gray-50 hover:bg-gray-100';
      default:
        return 'bg-white hover:bg-gray-50';
    }
  };

  const getGradeDisplayName = (grade: string) => {
    switch (grade) {
      case '슈린이 GOLD':
        return 'GOLD';
      case '슈린이 PLATINUM':
        return 'PLATINUM';
      case '슈린이 VIP':
        return 'VIP';
      default:
        return grade;
    }
  };

  const getSortLabel = (option: SortOption) => {
    const labels: Record<SortOption, string> = {
      latest_repurchase: '최근 구매일순',
      purchase_count: '구매 횟수순',
      points: '포인트순',
      name: '이름순',
    };
    return labels[option];
  };

  const getGradeCount = (grade: string | undefined) => {
    if (!grade) return customers.length;
    return customers.filter(c => {
      const customerGrade = String(c.grade).trim();
      const filterGrade = String(grade).trim();
      return customerGrade === filterGrade;
    }).length;
  };

  const getFilterButtonClass = (grade: string | undefined, selected: boolean) => {
    if (!selected) {
      return 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1';
    }
    return 'bg-emerald-600 text-white border border-emerald-700 hover:bg-emerald-700 active:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1';
  };

  const getFilterLabel = (grade: string | undefined) => {
    if (!grade) return '전체';
    if (grade === '슈린이 GOLD') return 'GOLD';
    if (grade === '슈린이 PLATINUM') return 'PLATINUM';
    if (grade === '슈린이 VIP') return 'VIP';
    return grade;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      {/* Header with Filters */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">재구매 고객 리스트</h3>
            <p className="text-sm text-gray-500 mt-1">
              전체 {displayCustomers.length}명 중 {displayCustomers.length > 0 ? `${startIndex + 1}-${Math.min(startIndex + ITEMS_PER_PAGE, displayCustomers.length)}` : '0'}명 표시
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevious}
              disabled={currentPage === 0}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-sm text-gray-600 min-w-[80px] text-center">
              {currentPage + 1} / {totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={currentPage >= totalPages - 1 || totalPages === 0}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-500" />
            <span className="text-sm text-gray-600">등급:</span>
            <div className="flex gap-2">
              {[undefined, '슈둥이', '슈린이 GOLD', '슈린이 PLATINUM', '슈린이 VIP'].map((grade, index) => (
                <button
                  type="button"
                  key={grade || 'all'}
                  onClick={() => handleGradeFilter(grade)}
                  style={{ color: 'inherit' }}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${getFilterButtonClass(grade, gradeFilter === grade)}`}
                >
                  <span style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
                    {getFilterLabel(grade)} ({getGradeCount(grade)})
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="h-6 w-px bg-gray-300" />

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">정렬:</span>
            <div className="flex gap-2">
              {(['latest_repurchase', 'purchase_count', 'points', 'name'] as SortOption[]).map((option) => (
                <button
                  key={option}
                  onClick={() => handleSort(option)}
                  className={`px-3 py-1 rounded-lg text-xs transition-colors ${
                    sortBy === option
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {getSortLabel(option)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Excel-style Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 border-r border-gray-200">
                고객 ID
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 border-r border-gray-200">
                이름
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 border-r border-gray-200">
                고객 등급
              </th>
              <th className="text-center py-3 px-4 text-sm font-medium text-gray-700 border-r border-gray-200">
                구매 횟수
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 border-r border-gray-200">
                거주지
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 border-r border-gray-200">
                휴대폰번호
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 border-r border-gray-200">
                이메일
              </th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-700 border-r border-gray-200">
                보유 포인트
              </th>
              <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">
                재구매 평균 소요 시간
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedCustomers.length > 0 ? (
              paginatedCustomers.map((customer, index) => (
                <tr
                  key={customer.id}
                  className={`border-b border-gray-200 transition-colors ${
                    selectedCustomerId === customer.id
                      ? 'bg-emerald-100 border-l-4 border-l-emerald-600'
                      : getGradeRowClass(customer.grade)
                  } ${onCustomerClick ? 'cursor-pointer' : ''}`}
                  onClick={() => onCustomerClick?.(customer.id)}
                >
                  <td className="py-3 px-4 text-sm border-r border-gray-200 font-mono">
                    {customer.id}
                  </td>
                  <td className="py-3 px-4 text-sm border-r border-gray-200 font-medium">
                    {customer.name}
                  </td>
                  <td className="py-3 px-4 text-sm border-r border-gray-200">
                    <span className={`inline-block px-3 py-1 rounded text-xs ${getGradeBadgeClass(customer.grade)}`}>
                      {getGradeDisplayName(customer.grade)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-center border-r border-gray-200">
                    {customer.purchaseCount}회
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600 border-r border-gray-200">
                    {customer.address}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600 border-r border-gray-200 font-mono">
                    {customer.phone}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600 border-r border-gray-200">
                    {customer.email}
                  </td>
                  <td className="py-3 px-4 text-sm text-right border-r border-gray-200 font-medium">
                    {customer.points.toLocaleString()}P
                  </td>
                  <td className="py-3 px-4 text-sm text-center">
                    {customer.averageRepurchaseDays}일
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="py-12 text-center text-gray-500">
                  필터 조건에 맞는 고객이 없습니다
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
        💡 필터와 정렬 옵션을 사용하여 원하는 고객을 찾아보세요
      </div>
    </div>
  );
}
