import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { RepurchaseAddress } from '../../types/repurchase';

interface RepurchaseAddressChartProps {
  data: RepurchaseAddress[];
}

const COLORS = ['#10b981', '#34d399', '#6b7280', '#9ca3af', '#d1d5db', '#e5e7eb'];

export function RepurchaseAddressChart({ data }: RepurchaseAddressChartProps) {
  const MAX_DISPLAY_ITEMS = 5;

  // 상위 5개만 표시하고 나머지는 기타로 묶기
  const processedData = useMemo(() => {
    if (data.length <= MAX_DISPLAY_ITEMS) {
      return data;
    }

    // count 기준으로 내림차순 정렬
    const sorted = [...data].sort((a, b) => b.count - a.count);
    const topItems = sorted.slice(0, MAX_DISPLAY_ITEMS);
    const others = sorted.slice(MAX_DISPLAY_ITEMS);

    // 기타 항목 합계 계산
    const othersTotal = others.reduce((sum, item) => sum + item.count, 0);
    const totalCount = data.reduce((sum, item) => sum + item.count, 0);
    const othersPercentage = totalCount > 0 ? (othersTotal / totalCount) * 100 : 0;

    // 기타 항목이 0이 아니면 추가
    if (othersTotal > 0) {
      return [
        ...topItems,
        {
          address: '기타',
          count: othersTotal,
          percentage: othersPercentage,
        } as RepurchaseAddress,
      ];
    }

    return topItems;
  }, [data]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-900 mb-1">재구매 배송지</h3>
        <p className="text-sm text-gray-500">시-구-동 단위 배송지 분포</p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={processedData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ address, percentage }) => `${address} ${percentage.toFixed(1)}%`}
            outerRadius={100}
            innerRadius={60}
            fill="#8884d8"
            dataKey="count"
          >
            {processedData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number, name, props: any) => [
              `${value}건 (${props.payload.percentage.toFixed(1)}%)`,
              '재구매 수',
            ]}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-4 flex flex-wrap justify-center gap-4">
        {processedData.map((item, index) => (
          <div key={`${item.address}-${index}`} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="text-sm text-gray-600">
              {item.address}: {item.percentage.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

