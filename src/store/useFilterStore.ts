import { create } from 'zustand';

interface DateRange {
  start: Date;
  end: Date;
}

interface FilterState {
  selectedProductIds: string[]; // 다중 선택을 위한 배열로 변경
  dateRange: DateRange;
  selectedKeyword: string | null;
  ratingFilter: number | null; // 1-5 또는 null (전체)
  setProduct: (id: string) => void; // 단일 선택용 (하위 호환성 유지)
  toggleProduct: (id: string) => void; // 다중 선택 토글
  setProducts: (ids: string[]) => void; // 다중 선택 설정
  setDateRange: (range: DateRange) => void;
  setKeyword: (keyword: string | null) => void;
  setRatingFilter: (rating: number | null) => void;
  clearFilters: () => void;
}

const subDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
};

export const useFilterStore = create<FilterState>((set) => ({
  selectedProductIds: [],
  dateRange: {
    start: subDays(new Date(), 30),
    end: new Date(),
  },
  selectedKeyword: null,
  ratingFilter: null,
  setProduct: (id) => set({ selectedProductIds: [id] }), // 단일 선택 (하위 호환성)
  toggleProduct: (id) => set((state) => {
    const isSelected = state.selectedProductIds.includes(id);
    if (isSelected) {
      return { selectedProductIds: state.selectedProductIds.filter(pId => pId !== id) };
    } else {
      return { selectedProductIds: [...state.selectedProductIds, id] };
    }
  }),
  setProducts: (ids) => set({ selectedProductIds: ids }),
  setDateRange: (range) => set({ dateRange: range }),
  setKeyword: (keyword) => set({ selectedKeyword: keyword }),
  setRatingFilter: (rating) => set({ ratingFilter: rating }),
  clearFilters: () => set({ selectedKeyword: null, ratingFilter: null }),
}));
