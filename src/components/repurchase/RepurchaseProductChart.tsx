import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { RepurchaseProduct } from '../../types/repurchase';

interface RepurchaseProductChartProps {
  data: RepurchaseProduct[];
}

export function RepurchaseProductChart({ data }: RepurchaseProductChartProps) {
  // 상품명을 적절한 길이로 표시
  const formatProductName = (name: string): string => {
    if (name.length > 15) {
      return name.substring(0, 15) + '...';
    }
    return name;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-900 mb-1">재구매 상품들</h3>
        <p className="text-sm text-gray-500">상품별 구매수 막대그래프 (가로)</p>
      </div>
      <div className="w-full" style={{ height: Math.max(300, data.length * 60) }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"  // 가로 막대그래프
            margin={{ left: 120, right: 40, top: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
            <XAxis
              type="number"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              stroke="#6b7280"
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <YAxis
              type="category"
              dataKey="productName"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              stroke="#6b7280"
              tick={{ fill: '#6b7280', fontSize: 12 }}
              width={110}
              tickFormatter={formatProductName}
            />
            <Tooltip
              content={() => null}
              cursor={{ fill: 'rgba(16, 185, 129, 0.1)' }}
            />
            <Bar 
              dataKey="repurchaseCount" 
              radius={[0, 4, 4, 0]}  // 오른쪽 모서리만 둥글게
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
