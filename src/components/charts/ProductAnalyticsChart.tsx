import { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, DollarSign } from 'lucide-react';
import { ProductStats } from '../../types/product';
import { MetricType } from '../../types/chart';

interface ProductAnalyticsChartProps {
  data: ProductStats[];
}

const metricConfig = {
  revenue: {
    label: '총 매출액',
    icon: DollarSign,
    color: '#10b981',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-600',
    borderColor: 'border-emerald-200',
    activeBg: 'bg-emerald-600',
    formatter: (value: number) => `${(value / 10000).toFixed(0)}만원`,
    displayFormatter: (value: number) => `${(value / 1000000).toFixed(1)}M원`,
  },
  sales: {
    label: '총 판매수',
    icon: TrendingUp,
    color: '#059669',
    bgColor: 'bg-green-50',
    textColor: 'text-green-600',
    borderColor: 'border-green-200',
    activeBg: 'bg-green-600',
    formatter: (value: number) => `${value}개`,
    displayFormatter: (value: number) => `${value.toLocaleString()}개`,
  },
  buyers: {
    label: '총 구매자 수',
    icon: Users,
    color: '#14b8a6',
    bgColor: 'bg-teal-50',
    textColor: 'text-teal-600',
    borderColor: 'border-teal-200',
    activeBg: 'bg-teal-600',
    formatter: (value: number) => `${value}명`,
    displayFormatter: (value: number) => `${value.toLocaleString()}명`,
  },
};

export function ProductAnalyticsChart({ data }: ProductAnalyticsChartProps) {
  const [activeMetric, setActiveMetric] = useState<MetricType>('sales');

  const totals = useMemo(() => ({
    revenue: data.reduce((sum, s) => sum + s.revenue, 0),
    sales: data.reduce((sum, s) => sum + s.sales, 0),
    buyers: data.reduce((sum, s) => sum + s.buyers, 0),
  }), [data]);

  const metrics: MetricType[] = ['revenue', 'sales', 'buyers'];

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header with KPI Cards */}
      <div className="flex flex-col sm:flex-row border-b border-gray-200">
        <div className="flex-1 px-6 py-5 border-b sm:border-b-0 sm:border-r border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-1">상품 판매 분석</h3>
          <p className="text-sm text-gray-500">
            최근 데이터 기반 트렌드 분석
          </p>
        </div>

        <div className="flex divide-x divide-gray-200">
          {metrics.map((metric) => {
            const config = metricConfig[metric];
            const Icon = config.icon;
            const isActive = activeMetric === metric;

            return (
              <button
                key={metric}
                onClick={() => setActiveMetric(metric)}
                className={`flex-1 flex flex-col justify-center gap-2 px-6 py-4 text-left transition-all hover:bg-gray-50 ${
                  isActive ? 'bg-emerald-50 border-b-2 border-emerald-600' : ''
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon size={14} className={isActive ? 'text-emerald-600' : 'text-gray-500'} />
                  <span className={`text-xs ${isActive ? 'text-emerald-600 font-medium' : 'text-gray-500'}`}>
                    {config.label}
                  </span>
                </div>
                <span className={`text-2xl ${isActive ? 'text-emerald-600' : 'text-gray-900'}`}>
                  {metric === 'revenue' 
                    ? `${(totals[metric] / 1000000).toFixed(1)}M`
                    : totals[metric].toLocaleString()
                  }
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chart Content */}
      <div className="bg-white p-6 border-t border-gray-200">
        <div className="mb-4">
          <h4 className="text-gray-900 mb-1">
            {activeMetric === 'revenue' ? '일별 매출액' : activeMetric === 'sales' ? '일별 판매 수' : '일별 구매자 수'}
          </h4>
          <p className="text-sm text-gray-500">
            기간별 {metricConfig[activeMetric].label.replace('총 ', '')} 추이
          </p>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            margin={{ left: 12, right: 12, top: 10, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return `${date.getMonth() + 1}/${date.getDate()}`;
              }}
              stroke="#6b7280"
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              stroke="#6b7280"
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <Tooltip
              cursor={{ fill: 'rgba(16, 185, 129, 0.1)' }}
              formatter={(value: number) => [
                metricConfig[activeMetric].formatter(value),
                metricConfig[activeMetric].label.replace('총 ', '')
              ]}
              labelFormatter={(label) => `날짜: ${label}`}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
              labelStyle={{ color: '#6b7280', fontWeight: 600 }}
            />
            <Bar
              dataKey={activeMetric}
              fill={metricConfig[activeMetric].color}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Summary */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            선택된 지표: <strong className="text-gray-900">{metricConfig[activeMetric].label}</strong>
          </span>
          <span className="text-gray-600">
            총 {data.length}일 데이터
          </span>
        </div>
      </div>
    </div>
  );
}