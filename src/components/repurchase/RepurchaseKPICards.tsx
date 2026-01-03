import { RepurchaseKPI } from '../../types/repurchase';
import { Card } from '../ui/card';

interface RepurchaseKPICardsProps {
  kpi: RepurchaseKPI;
}

export function RepurchaseKPICards({ kpi }: RepurchaseKPICardsProps) {
  const cards = [
    {
      title: '총 재구매 수',
      value: kpi.totalRepurchaseCount,
      unit: '회',
    },
    {
      title: '평균 재구매율 (%)',
      value: kpi.averageRepurchaseRate.toFixed(1),
      unit: '%',
    },
    {
      title: '재구매까지 걸린 기간 (days)',
      value: kpi.averageRepurchaseDays,
      unit: '일',
    },
    {
      title: '동일 상품 재구매 비율',
      value: kpi.sameProductRepurchaseRate.toFixed(1),
      unit: '%',
    },
    {
      title: '재구매 고객 매출 기여도 (%)',
      value: kpi.repurchaseCustomerRevenueContribution.toFixed(1),
      unit: '%',
    },
  ];

  return (
    <div className="flex gap-4 w-full">
      {cards.map((card, index) => (
        <Card key={index} className="p-6 bg-white border border-gray-200 flex-1 min-w-0">
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-600">{card.title}</h3>
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-gray-900">
                {card.value}
              </span>
              <span className="text-lg text-gray-600">{card.unit}</span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

