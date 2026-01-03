import { Trophy, Award, Medal } from 'lucide-react';
import { Customer } from '../../types/customer';

interface CustomerPointTop3Props {
  customers: Customer[];
}

const rankIcons = [Trophy, Award, Medal];
const rankColors = [
  'bg-yellow-50 text-yellow-600 border-yellow-200',
  'bg-gray-50 text-gray-600 border-gray-200',
  'bg-orange-50 text-orange-600 border-orange-200',
];

export function CustomerPointTop3({ customers }: CustomerPointTop3Props) {
  const topCustomers = [...customers]
    .sort((a, b) => b.points - a.points)
    .slice(0, 3);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">포인트 상위 고객</h3>
      <div className="space-y-4">
        {topCustomers.map((customer, index) => {
          const Icon = rankIcons[index];
          const colorClass = rankColors[index];
          
          return (
            <div
              key={customer.id}
              className={`flex items-center gap-4 p-4 rounded-lg border ${colorClass}`}
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-white border">
                <Icon size={24} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{customer.name}</span>
                  <span className={`px-2 py-0.5 rounded text-xs ${
                    customer.grade === 'VVIP'
                      ? 'bg-purple-100 text-purple-700'
                      : customer.grade === 'VIP'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {customer.grade}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{customer.email}</p>
              </div>
              <div className="text-right">
                <div className="font-medium">{customer.points.toLocaleString()}P</div>
                <div className="text-xs text-gray-500">
                  {customer.purchaseCount}회 구매
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}