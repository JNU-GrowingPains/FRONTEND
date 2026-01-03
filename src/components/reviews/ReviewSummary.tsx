import { MessageSquare, ThumbsUp, ThumbsDown, AlertCircle } from 'lucide-react';
import { Review } from '../../types/review';

interface ReviewSummaryProps {
  reviews: Review[];
}

export function ReviewSummary({ reviews }: ReviewSummaryProps) {
  const totalCount = reviews.length;
  const positiveCount = reviews.filter(r => r.sentiment === 'positive').length;
  const negativeCount = reviews.filter(r => r.sentiment === 'negative').length;
  const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / totalCount || 0;

  const topNegativeReviews = reviews
    .filter(r => r.sentiment === 'negative')
    .sort((a, b) => a.rating - b.rating)
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <MessageSquare size={20} />
            </div>
            <span className="text-sm text-gray-600">총 리뷰 수</span>
          </div>
          <div className="text-2xl">{totalCount}개</div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg">
              <span className="text-xl">⭐</span>
            </div>
            <span className="text-sm text-gray-600">평균 평점</span>
          </div>
          <div className="text-2xl">{averageRating.toFixed(1)}</div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-50 text-green-600 rounded-lg">
              <ThumbsUp size={20} />
            </div>
            <span className="text-sm text-gray-600">긍정 리뷰</span>
          </div>
          <div className="text-2xl">
            {positiveCount}개
            <span className="text-sm text-gray-500 ml-2">
              ({totalCount > 0 ? ((positiveCount / totalCount) * 100).toFixed(0) : 0}%)
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-50 text-red-600 rounded-lg">
              <ThumbsDown size={20} />
            </div>
            <span className="text-sm text-gray-600">부정 리뷰</span>
          </div>
          <div className="text-2xl">
            {negativeCount}개
            <span className="text-sm text-gray-500 ml-2">
              ({totalCount > 0 ? ((negativeCount / totalCount) * 100).toFixed(0) : 0}%)
            </span>
          </div>
        </div>
      </div>

      {/* Top Negative Reviews */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
          <AlertCircle className={topNegativeReviews.length > 0 ? "text-red-500" : "text-green-500"} size={20} />
          <h3 className="text-xl font-bold text-gray-900">부정 리뷰 Top 3</h3>
          </div>
        {topNegativeReviews.length > 0 ? (
          <div className="space-y-3">
            {topNegativeReviews.map((review, index) => (
              <div
                key={review.id}
                className="p-4 bg-red-50 border border-red-200 rounded-lg"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium">{review.customerName}</span>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <span key={i} className="text-yellow-400">
                            ⭐
                          </span>
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">{review.createdAt}</span>
                    </div>
                    <p className="text-sm text-gray-700">{review.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p className="text-lg font-medium mb-2">부정 리뷰가 없습니다! 🎉</p>
            <p className="text-sm">모든 고객이 만족하고 있습니다.</p>
        </div>
      )}
      </div>
    </div>
  );
}