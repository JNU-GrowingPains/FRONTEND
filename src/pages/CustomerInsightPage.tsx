import { PageHeader } from '../components/common/PageHeader';
import { CustomerTable } from '../components/customers/CustomerTable';
import { GradeDistributionChart } from '../components/charts/GradeDistributionChart';
import { CustomerPointTop3 } from '../components/charts/CustomerPointTop3';
import { useCustomers, useGradeDistribution } from '../hooks/useCustomers';

export function CustomerInsightPage() {
  const { data: customers, isLoading: customersLoading } = useCustomers();
  const { data: gradeDistribution, isLoading: gradeLoading } = useGradeDistribution();

  if (customersLoading || gradeLoading) {
    return (
      <div>
        <PageHeader
          title="고객 분석"
          description="고객 등급과 구매 패턴을 분석하세요"
        />
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-500">
          데이터를 불러오는 중...
        </div>
      </div>
    );
  }

  if (!customers || !gradeDistribution) {
    return (
      <div>
        <PageHeader
          title="고객 분석"
          description="고객 등급과 구매 패턴을 분석하세요"
        />
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-500">
          데이터를 불러올 수 없습니다
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="고객 분석"
        description="고객 등급과 구매 패턴을 분석하세요"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <GradeDistributionChart data={gradeDistribution} />
        </div>
        <div>
          <CustomerPointTop3 customers={customers} />
        </div>
      </div>

      <CustomerTable customers={customers} />
    </div>
  );
}
