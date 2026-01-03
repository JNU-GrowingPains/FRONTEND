import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Check, X, Filter } from 'lucide-react';
import { Customer } from '../../types/customer';

interface CustomerTableProps {
  customers: Customer[];
}

const ITEMS_PER_PAGE = 10;

type SortKey = 'name' | 'purchaseCount' | 'firstPurchaseDate' | 'recentPurchaseDate' | 'points';
type GradeFilter = 'all' | '슈둥이' | '슈린이 GOLD' | '슈린이 PLATINUM' | '슈린이 VIP';

export function CustomerTable({ customers }: CustomerTableProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [sortKey, setSortKey] = useState<SortKey>('recentPurchaseDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [gradeFilter, setGradeFilter] = useState<GradeFilter>('all');

  // Filter customers by grade
  const filteredCustomers = useMemo(() => {
    if (gradeFilter === 'all') {
      return customers;
    }
    
    // 정확한 문자열 비교를 위해 trim과 명시적 비교
    const filtered = customers.filter(customer => {
      const customerGrade = String(customer.grade).trim();
      const filterGrade = String(gradeFilter).trim();
      return customerGrade === filterGrade;
    });
    
    return filtered;
  }, [customers, gradeFilter]);

  // Sort customers
  const sortedCustomers = useMemo(() => {
    return [...filteredCustomers].sort((a, b) => {
      let aValue: any = a[sortKey];
      let bValue: any = b[sortKey];

      if (sortKey === 'firstPurchaseDate' || sortKey === 'recentPurchaseDate') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [filteredCustomers, sortKey, sortOrder]);

  const totalPages = sortedCustomers.length > 0 ? Math.ceil(sortedCustomers.length / ITEMS_PER_PAGE) : 1;
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const currentCustomers = sortedCustomers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
    setCurrentPage(0);
  };

  const handleGradeFilter = (grade: GradeFilter) => {
    setGradeFilter(grade);
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

  const getSortLabel = (key: SortKey) => {
    const labels: Record<SortKey, string> = {
      name: '이름순',
      purchaseCount: '구매 횟수순',
      firstPurchaseDate: '최초 구매일순',
      recentPurchaseDate: '최근 구매일순',
      points: '포인트순',
    };
    return labels[key];
  };

  const getGradeCount = (grade: GradeFilter) => {
    if (grade === 'all') return customers.length;
    return customers.filter(c => {
      const customerGrade = String(c.grade).trim();
      const filterGrade = String(grade).trim();
      return customerGrade === filterGrade;
    }).length;
  };

  const getFilterButtonClass = (grade: GradeFilter, selected: boolean) => {
    if (!selected) {
      return 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1';
    }
    return 'bg-emerald-600 text-white border border-emerald-700 hover:bg-emerald-700 active:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1';
  };

  const getFilterLabel = (grade: GradeFilter) => {
    if (grade === 'all') return '전체';
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
            <h3 className="text-xl font-bold text-gray-900">주요 고객 리스트</h3>
            <p className="text-sm text-gray-500 mt-1">
              전체 {sortedCustomers.length}명 중 {sortedCustomers.length > 0 ? `${startIndex + 1}-${Math.min(startIndex + ITEMS_PER_PAGE, sortedCustomers.length)}` : '0'}명 표시
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
              {(['all', '슈둥이', '슈린이 GOLD', '슈린이 PLATINUM', '슈린이 VIP'] as GradeFilter[]).map((grade) => (
                <button
                  type="button"
                  key={grade}
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
              {(['recentPurchaseDate', 'purchaseCount', 'points', 'name'] as SortKey[]).map((key) => (
                <button
                  key={key}
                  onClick={() => handleSort(key)}
                  className={`px-3 py-1 rounded-lg text-xs transition-colors ${
                    sortKey === key
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {getSortLabel(key)}
                  {sortKey === key && (
                    <span className="ml-1">{sortOrder === 'desc' ? '↓' : '↑'}</span>
                  )}
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
                최초 구매일
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 border-r border-gray-200">
                최근 구매일
              </th>
              <th className="text-center py-3 px-4 text-sm font-medium text-gray-700 border-r border-gray-200">
                할인 쿠폰 사용
              </th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">
                포인트 잔액
              </th>
            </tr>
          </thead>
          <tbody>
            {currentCustomers.length > 0 ? (
              currentCustomers.map((customer, index) => (
                <tr
                  key={customer.id}
                  className={`border-b border-gray-200 hover:bg-emerald-50 transition-colors ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  }`}
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
                  <td className="py-3 px-4 text-sm text-gray-600 border-r border-gray-200 font-mono">
                    {customer.firstPurchaseDate}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600 border-r border-gray-200 font-mono">
                    {customer.recentPurchaseDate}
                  </td>
                  <td className="py-3 px-4 text-sm text-center border-r border-gray-200">
                    <div className="flex items-center justify-center">
                      {customer.usedCoupon ? (
                        <div className="flex items-center gap-1 text-green-600">
                          <Check size={16} />
                          <span className="text-xs">사용</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-gray-400">
                          <X size={16} />
                          <span className="text-xs">미사용</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-right font-medium">
                    {customer.points.toLocaleString()}P
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="py-12 text-center text-gray-500">
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
