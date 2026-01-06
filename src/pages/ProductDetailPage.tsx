import { useState, useMemo, useEffect } from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { DateRangePicker } from '../components/common/DateRangePicker';
import { EmptyState } from '../components/common/EmptyState';
import { ProductSelector } from '../components/products/ProductSelector';
import { ProductAnalyticsChart } from '../components/charts/ProductAnalyticsChart';
import { ReviewSummary } from '../components/reviews/ReviewSummary';
import { ReviewWordCloud } from '../components/charts/ReviewWordCloud';
import { useFilterStore } from '../store/useFilterStore';
import { useDailySales } from '../hooks/useProducts';
import { useReviews, useWordCloud } from '../hooks/useReviews';
import { Package, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { WordCloudItem } from '../types/review';

const ITEMS_PER_PAGE = 20;

export function ProductDetailPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const selectedProductId = useFilterStore((state) => state.selectedProductIds[0] || null);
  const selectedKeyword = useFilterStore((state) => state.selectedKeyword);
  const ratingFilter = useFilterStore((state) => state.ratingFilter);
  const setKeyword = useFilterStore((state) => state.setKeyword);
  const setRatingFilter = useFilterStore((state) => state.setRatingFilter);
  const clearFilters = useFilterStore((state) => state.clearFilters);
  
  const { data: stats, isLoading } = useDailySales();
  const { data: reviews, isLoading: reviewsLoading } = useReviews();
  const { data: wordCloud, isLoading: wordCloudLoading } = useWordCloud();

  // 필터링된 리뷰
  const filteredReviews = useMemo(() => {
    if (!reviews) return [];
    
    let filtered = [...reviews];
    
    // 키워드 필터
    if (selectedKeyword) {
      filtered = filtered.filter(review => 
        review.content.includes(selectedKeyword)
      );
    }
    
    // 별점 필터
    if (ratingFilter !== null) {
      filtered = filtered.filter(review => review.rating === ratingFilter);
    }
    
    return filtered;
  }, [reviews, selectedKeyword, ratingFilter]);

  // 페이징된 리뷰
  const paginatedReviews = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredReviews.slice(startIndex, endIndex);
  }, [filteredReviews, currentPage]);

  const totalPages = Math.ceil(filteredReviews.length / ITEMS_PER_PAGE);

  // 페이지 변경 시 필터 변경으로 인한 리셋
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const handleWordClick = (word: WordCloudItem) => {
    setKeyword(word.text);
    setCurrentPage(1); // 필터 적용 시 첫 페이지로
  };

  return (
    <div>
      <PageHeader
        title="슈엘로 상품 분석"
        description="화장품 판매 데이터를 확인하고 트렌드를 분석하세요"
      />

      <div className="mb-6">
        <ProductSelector usePagination={true} />
      </div>

      {!selectedProductId ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12">
          <EmptyState
            title="상품을 선택해주세요"
            description="위 목록에서 분석하고 싶은 상품을 선택하세요"
            icon={<Package size={48} />}
          />
        </div>
      ) : (
        <>
          <div className="mb-6">
            <DateRangePicker />
          </div>

          {isLoading ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-500">
              데이터를 불러오는 중...
            </div>
          ) : stats && stats.length > 0 ? (
            <div className="space-y-6">
              {/* Sales Analytics Chart */}
              <ProductAnalyticsChart data={stats} />

              {/* Divider */}
              <div className="border-t-2 border-gray-200 pt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">리뷰 분석</h2>
              </div>

              {/* Reviews Section */}
              {reviewsLoading ? (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-500">
                  리뷰 데이터를 불러오는 중...
                </div>
              ) : reviews && reviews.length > 0 ? (
                <>
                  <ReviewSummary reviews={reviews} />
                  <ReviewWordCloud 
                    words={wordCloud || []} 
                    isLoading={wordCloudLoading}
                    onWordClick={handleWordClick}
                  />
                  
                  {/* All Reviews List */}
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-900">
                        전체 리뷰 ({filteredReviews.length}개)
                        {reviews && filteredReviews.length !== reviews.length && (
                          <span className="text-sm font-normal text-gray-500 ml-2">
                            (전체 {reviews.length}개 중)
                          </span>
                        )}
                      </h3>
                      
                      {/* 필터 UI */}
                      <div className="flex items-center gap-2">
                        {/* 별점 필터 */}
                        <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-1">
                          <button
                            onClick={() => setRatingFilter(null)}
                            className={`px-3 py-1 text-sm rounded transition-colors ${
                              ratingFilter === null
                                ? 'bg-emerald-600 text-white'
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            전체
                          </button>
                          {[5, 4, 3, 2, 1].map((rating) => (
                            <button
                              key={rating}
                              onClick={() => {
                                setRatingFilter(rating);
                                setCurrentPage(1);
                              }}
                              className={`px-3 py-1 text-sm rounded transition-colors flex items-center gap-1 ${
                                ratingFilter === rating
                                  ? 'bg-emerald-600 text-white'
                                  : 'text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              <span className="text-yellow-400">⭐</span>
                              {rating}
                            </button>
                          ))}
                        </div>
                        
                        {/* 필터 초기화 */}
                        {(selectedKeyword || ratingFilter !== null) && (
                          <button
                            onClick={() => {
                              clearFilters();
                              setCurrentPage(1);
                            }}
                            className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <X size={14} />
                            필터 초기화
                          </button>
                        )}
                      </div>
                    </div>

                    {/* 활성 필터 표시 */}
                    {selectedKeyword && (
                      <div className="mb-4 flex items-center gap-2">
                        <span className="text-sm text-gray-600">키워드 필터:</span>
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium flex items-center gap-2">
                          "{selectedKeyword}"
                          <button
                            onClick={() => {
                              setKeyword(null);
                              setCurrentPage(1);
                            }}
                            className="hover:bg-emerald-200 rounded-full p-0.5"
                          >
                            <X size={12} />
                          </button>
                        </span>
                      </div>
                    )}

                    {filteredReviews.length === 0 ? (
                      <div className="text-center py-12 text-gray-500">
                        <p>필터 조건에 맞는 리뷰가 없습니다.</p>
                        {(selectedKeyword || ratingFilter !== null) && (
                          <button
                            onClick={() => {
                              clearFilters();
                              setCurrentPage(1);
                            }}
                            className="mt-2 text-emerald-600 hover:text-emerald-700 text-sm underline"
                          >
                            필터 초기화
                          </button>
                        )}
                      </div>
                    ) : (
                      <>
                        <div className="space-y-4">
                          {paginatedReviews.map((review) => (
                            <div
                              key={review.id}
                              className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-3">
                                  <span className="font-medium">{review.customerName}</span>
                                  <div className="flex items-center gap-1">
                                    {Array.from({ length: review.rating }).map((_, i) => (
                                      <span key={i} className="text-yellow-400">
                                        ⭐
                                      </span>
                                    ))}
                                  </div>
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-xs ${
                                      review.sentiment === 'positive'
                                        ? 'bg-green-100 text-green-700'
                                        : review.sentiment === 'negative'
                                        ? 'bg-red-100 text-red-700'
                                        : 'bg-gray-100 text-gray-700'
                                    }`}
                                  >
                                    {review.sentiment === 'positive'
                                      ? '긍정'
                                      : review.sentiment === 'negative'
                                      ? '부정'
                                      : '중립'}
                                  </span>
                                </div>
                                <span className="text-xs text-gray-500">{review.createdAt}</span>
                              </div>
                              <p className="text-sm text-gray-700">
                                {selectedKeyword ? (
                                  <span>
                                    {review.content.split(selectedKeyword).map((part, i, arr) => (
                                      <span key={i}>
                                        {part}
                                        {i < arr.length - 1 && (
                                          <mark className="bg-yellow-200 px-1 rounded">
                                            {selectedKeyword}
                                          </mark>
                                        )}
                                      </span>
                                    ))}
                                  </span>
                                ) : (
                                  review.content
                                )}
                              </p>
                            </div>
                          ))}
                        </div>

                        {/* 페이징 */}
                        {totalPages > 1 && (
                          <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
                            <div className="text-sm text-gray-600">
                              {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredReviews.length)} / {filteredReviews.length}개
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                              >
                                <ChevronLeft size={20} />
                              </button>
                              <div className="flex items-center gap-1">
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                  let pageNum: number;
                                  if (totalPages <= 5) {
                                    pageNum = i + 1;
                                  } else if (currentPage <= 3) {
                                    pageNum = i + 1;
                                  } else if (currentPage >= totalPages - 2) {
                                    pageNum = totalPages - 4 + i;
                                  } else {
                                    pageNum = currentPage - 2 + i;
                                  }
                                  return (
                                    <button
                                      key={pageNum}
                                      onClick={() => setCurrentPage(pageNum)}
                                      className={`px-3 py-1 text-sm rounded transition-colors ${
                                        currentPage === pageNum
                                          ? 'bg-emerald-600 text-white'
                                          : 'text-gray-700 hover:bg-gray-50'
                                      }`}
                                    >
                                      {pageNum}
                                    </button>
                                  );
                                })}
                              </div>
                              <button
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                              >
                                <ChevronRight size={20} />
                              </button>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </>
              ) : (
                <div className="bg-white rounded-xl border border-gray-200 p-12">
                  <EmptyState
                    title="리뷰가 없습니다"
                    description="선택한 상품에 아직 리뷰가 없습니다"
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-12">
              <EmptyState
                title="데이터가 없습니다"
                description="선택한 기간에 판매 데이터가 없습니다"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
