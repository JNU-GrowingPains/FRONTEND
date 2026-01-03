import { memo, useMemo } from 'react';
import { WordCloudItem } from '../../types/review';
import { Tooltip, TooltipTrigger, TooltipContent } from '../ui/tooltip';

interface ReviewWordCloudProps {
  words: WordCloudItem[];
  isLoading?: boolean;
  onWordClick?: (word: WordCloudItem) => void;
}

// 색상 팔레트 (빈도수 높을수록 진한 색)
const lightColors = [
  '#93C5FD', // blue-300
  '#A5B4FC', // indigo-300
  '#C4B5FD', // violet-300
  '#D8B4FE', // purple-300
  '#F9A8D4', // pink-300
  '#FCD34D', // amber-300
];

const mediumColors = [
  '#60A5FA', // blue-400
  '#818CF8', // indigo-400
  '#A78BFA', // violet-400
  '#C084FC', // purple-400
  '#F472B6', // pink-400
  '#FBBF24', // amber-400
];

const darkColors = [
  '#3B82F6', // blue-500
  '#6366F1', // indigo-500
  '#8B5CF6', // violet-500
  '#A855F7', // purple-500
  '#EC4899', // pink-500
  '#F59E0B', // amber-500
];

// 시드 기반 랜덤 함수
const seededRandom = (seed: number) => {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
};

function ReviewWordCloudComponent({ 
  words, 
  isLoading = false,
  onWordClick 
}: ReviewWordCloudProps) {

  // 나선형 배치로 단어 위치 계산
  const styledWords = useMemo(() => {
    if (!words || words.length === 0) return [];
    
    // 상위 30개만 표시
    const limitedWords = [...words]
      .sort((a, b) => b.value - a.value)
      .slice(0, 30);
    
    const maxValue = Math.max(...limitedWords.map(w => w.value));
    const minValue = Math.min(...limitedWords.map(w => w.value));
    const range = maxValue - minValue || 1;

    // value 기준 정렬 (큰 것 먼저 - 중앙에 배치)
    const sorted = [...limitedWords].sort((a, b) => b.value - a.value);

    const centerX = 50; // 중앙 X (%)
    const centerY = 50; // 중앙 Y (%)

    return sorted.map((word, index) => {
      const normalized = (word.value - minValue) / range;
      
      // 폰트 크기: 12px ~ 48px
      const fontSize = Math.floor(12 + normalized * 36);
      
      // 빈도수에 비례한 색상 선택
      let color: string;
      const colorIndex = index % 6;
      if (normalized > 0.7) {
        // 상위 30% - 진한 색
        color = darkColors[colorIndex];
      } else if (normalized > 0.4) {
        // 중간 30% - 중간 색
        color = mediumColors[colorIndex];
      } else {
        // 하위 40% - 연한 색
        color = lightColors[colorIndex];
      }
      
      // 회전 (-15 ~ 15도)
      const rotation = (seededRandom(index * 7 + 3) - 0.5) * 30;

      // 나선형 배치 계산
      // 첫 번째(가장 큰) 단어는 중앙에
      let x = centerX;
      let y = centerY;

      if (index > 0) {
        // 나선형 좌표 계산
        const angle = index * 137.5 * (Math.PI / 180); // 황금각
        const radius = 8 + Math.sqrt(index) * 12; // 반지름 증가
        
        x = centerX + Math.cos(angle) * radius;
        y = centerY + Math.sin(angle) * radius;
        
        // 약간의 랜덤 오프셋 추가
        x += (seededRandom(index * 11) - 0.5) * 8;
        y += (seededRandom(index * 17) - 0.5) * 8;
      }

      // 경계 내로 제한
      x = Math.max(10, Math.min(90, x));
      y = Math.max(15, Math.min(85, y));

      return {
        ...word,
        fontSize,
        color,
        rotation,
        x,
        y,
        zIndex: sorted.length - index, // 큰 단어가 위에
      };
    });
  }, [words]);

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">리뷰 키워드 워드클라우드</h3>
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-gray-500">워드클라우드 로딩 중...</span>
          </div>
        </div>
      </div>
    );
  }

  // 데이터가 없는 경우
  if (!words || words.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">리뷰 키워드 워드클라우드</h3>
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="text-center">
            <p className="text-gray-500">리뷰 키워드 데이터가 없습니다.</p>
            <p className="text-sm text-gray-400 mt-1">상품을 선택하면 키워드가 표시됩니다.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">리뷰 키워드 워드클라우드</h3>
      <div 
        className="relative w-full"
        style={{ height: '320px' }}
      >
        {styledWords.map((word, index) => (
          <Tooltip key={`${word.text}-${index}`}>
            <TooltipTrigger asChild>
          <span
                onClick={() => onWordClick?.(word)}
            style={{
                  position: 'absolute',
                  left: `${word.x}%`,
                  top: `${word.y}%`,
                  transform: `translate(-50%, -50%) rotate(${word.rotation}deg)`,
                  fontSize: `${word.fontSize}px`,
                  color: word.color,
                  fontWeight: 700,
                  zIndex: word.zIndex,
                  cursor: onWordClick ? 'pointer' : 'default',
                  transition: 'all 0.2s ease',
                  userSelect: 'none',
                  whiteSpace: 'nowrap',
                }}
                className="hover:scale-125 hover:brightness-110"
          >
            {word.text}
          </span>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-gray-900 text-white">
              <div className="text-center">
                <div className="font-semibold">{word.text}</div>
                <div className="text-xs text-gray-300 mt-0.5">빈도수: {word.value}회</div>
              </div>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
      
      {/* 범례 */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-500 text-center">
          글자 크기와 색상은 키워드 빈도수에 비례합니다. 클릭하면 상세 정보를 볼 수 있습니다. (상위 30개 표시)
        </p>
      </div>
    </div>
  );
}

export const ReviewWordCloud = memo(ReviewWordCloudComponent);
