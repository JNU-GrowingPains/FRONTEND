export interface Review {
  id: string;
  productId: string;
  customerId: string;
  customerName: string;
  rating: number;
  content: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  createdAt: string;
}

export interface WordCloudItem {
  text: string;
  value: number;
}

export interface ReviewSummary {
  totalCount: number;
  averageRating: number;
  positiveCount: number;
  negativeCount: number;
  neutralCount: number;
  topNegativeReviews: Review[];
}
