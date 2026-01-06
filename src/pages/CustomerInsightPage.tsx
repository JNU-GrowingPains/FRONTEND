import { PageHeader } from '../components/common/PageHeader';
import { CustomerTable } from '../components/customers/CustomerTable';
import { GradeDistributionChart } from '../components/charts/GradeDistributionChart';
import { CustomerPointTop3 } from '../components/charts/CustomerPointTop3';
import { useCustomers, useGradeDistribution, useTopMembers } from '../hooks/useCustomers';

export function CustomerInsightPage() {
  const { data: customers, isLoading: customersLoading } = useCustomers();
  const { data: gradeDistribution, isLoading: gradeLoading } = useGradeDistribution();
  const { data: topMembers, isLoading: topMembersLoading } = useTopMembers(3);

  console.log('고객 분석 페이지 - customers:', customers);
  console.log('고객 분석 페이지 - gradeDistribution:', gradeDistribution);
  console.log('고객 분석 페이지 - topMembers:', topMembers);
  console.log('고객 분석 페이지 - 로딩 상태:', { customersLoading, gradeLoading, topMembersLoading });

  if (customersLoading || gradeLoading || topMembersLoading) {
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

  return (
    <div>
      <PageHeader
        title="고객 분석"
        description="고객 등급과 구매 패턴을 분석하세요"
      />

      {!customers || customers.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-500">
          고객 데이터가 없습니다
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              {gradeDistribution && gradeDistribution.length > 0 ? (
                <GradeDistributionChart data={gradeDistribution} />
              ) : (
                <div className="bg-white rounded-xl border border-gray-200 p-6 text-center text-gray-500">
                  등급 분포 데이터 로딩 중...
                </div>
              )}
            </div>
            <div>
              <CustomerPointTop3 customers={topMembers || []} />
            </div>
          </div>

          <CustomerTable customers={customers} />
        </>
      )}
    </div>
  );
}
