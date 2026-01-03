import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { GradeDistribution } from '../../types/customer';

interface GradeDistributionChartProps {
  data: GradeDistribution[];
}

const gradeColors: Record<string, string> = {
  '슈린이 VIP': '#8b5cf6',
  '슈린이 PLATINUM': '#3b82f6',
  '슈린이 GOLD': '#f59e0b',
  '슈둥이': '#6b7280',
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

// 등급 순서 정의 (VIP -> PLATINUM -> GOLD -> 슈둥이)
const gradeOrder: Record<string, number> = {
  '슈린이 VIP': 1,
  '슈린이 PLATINUM': 2,
  '슈린이 GOLD': 3,
  '슈둥이': 4,
};

export function GradeDistributionChart({ data }: GradeDistributionChartProps) {
  // 등급 순서에 따라 데이터 정렬
  const sortedData = [...data].sort((a, b) => {
    const orderA = gradeOrder[a.grade] || 999;
    const orderB = gradeOrder[b.grade] || 999;
    return orderA - orderB;
  });

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">고객 등급 분포</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={sortedData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="grade" 
            stroke="#9ca3af" 
            tickFormatter={(value) => getGradeDisplayName(value)}
          />
          <YAxis stroke="#9ca3af" />
          <Tooltip
            formatter={(value: number, name, props: any) => [
              `${value}명 (${props.payload.percentage}%)`,
              '고객 수',
            ]}
            labelFormatter={(label) => getGradeDisplayName(label)}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {sortedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={gradeColors[entry.grade] || '#6b7280'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-4 flex justify-center gap-6">
        {sortedData.map((item) => (
          <div key={item.grade} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded"
              style={{ backgroundColor: gradeColors[item.grade] || '#6b7280' }}
            />
            <span className="text-sm text-gray-600">
              {getGradeDisplayName(item.grade)}: {item.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}