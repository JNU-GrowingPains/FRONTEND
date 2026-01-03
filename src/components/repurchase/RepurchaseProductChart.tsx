import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { RepurchaseProduct } from '../../types/repurchase';

interface RepurchaseProductChartProps {
  data: RepurchaseProduct[];
}

export function RepurchaseProductChart({ data }: RepurchaseProductChartProps) {
  // 상품명을 짧게 표시하는 함수
  const shortenProductName = (name: string): string => {
    // 상품명이 길면 앞부분만 표시
    if (name.length > 8) {
      return name.substring(0, 8) + '...';
    }
    return name;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-900 mb-1">재구매 상품들</h3>
        <p className="text-sm text-gray-500">상품별 구매수 막대그래프</p>
      </div>
      <div className="w-full" style={{ height: '400px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ left: 8, right: 8, top: 20, bottom: 80 }}
            barCategoryGap="20%"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            <XAxis
              dataKey="productName"
              angle={-45}
              textAnchor="end"
              height={100}
              tickLine={false}
              axisLine={false}
              tickMargin={12}
              interval={0}
              stroke="#6b7280"
              tick={{ fill: '#6b7280', fontSize: 11 }}
              tickFormatter={shortenProductName}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              stroke="#6b7280"
              tick={{ fill: '#6b7280', fontSize: 12 }}
              width={50}
            />
            <Tooltip
              formatter={(value: number) => [`${value}회`, '재구매 수']}
              labelFormatter={(label: string) => `상품: ${label}`}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '8px 12px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
              cursor={{ fill: 'rgba(16, 185, 129, 0.1)' }}
            />
            <Bar 
              dataKey="repurchaseCount" 
              radius={[4, 4, 0, 0]} 
              fill="#10b981"
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill="#10b981"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

