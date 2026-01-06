import { useState, useEffect } from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { User, Store, Bell, Mail, Calendar, ShoppingBag, Users } from 'lucide-react';
import { mockStoreOwner, mockNotificationSettings } from '../lib/accountData';
import { useAuthStore } from '../store/useAuthStore';
import * as authService from '../services/auth';

export function AccountPage() {
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  
  const [owner, setOwner] = useState({
    name: user?.name || mockStoreOwner.name,
    storeName: user?.siteName || mockStoreOwner.storeName,
    email: user?.email || mockStoreOwner.email,
    joinDate: user?.createdAt ? new Date(user.createdAt).toISOString().split('T')[0] : mockStoreOwner.joinDate,
  });
  
  const [dashboardStats, setDashboardStats] = useState({
    total_products: 0,
    total_customers: 0,
    monthly_revenue: 0,
  });
  
  const [notifications, setNotifications] = useState(mockNotificationSettings);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // 사용자 정보 및 대시보드 통계 로드
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // 프로필 정보가 없으면 조회
        if (!user || user.id === 'unknown') {
          const profile = await authService.getCurrentUser();
          updateUser(profile);
          
          setOwner({
            name: `${profile.lastName} ${profile.name}`.trim() || profile.name,
            storeName: profile.siteName || '쇼핑몰',
            email: profile.email,
            joinDate: profile.createdAt ? new Date(profile.createdAt).toISOString().split('T')[0] : mockStoreOwner.joinDate,
          });
        } else {
          setOwner({
            name: `${user.lastName} ${user.name}`.trim() || user.name,
            storeName: user.siteName || '쇼핑몰',
            email: user.email,
            joinDate: user.createdAt ? new Date(user.createdAt).toISOString().split('T')[0] : mockStoreOwner.joinDate,
          });
        }
        
        // 대시보드 통계 조회
        const stats = await authService.getDashboardStats();
        setDashboardStats(stats);
        
      } catch (error) {
        console.error('데이터 로드 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [user, updateUser]);

  const handleSave = async () => {
    try {
      // 프로필 업데이트 API 호출 (API는 이름만 업데이트 가능)
      const [lastName, ...firstNameParts] = owner.name.split(' ');
      const firstName = firstNameParts.join(' ') || lastName;
      
      const updateData: any = {
        name: firstNameParts.length > 0 ? firstName : owner.name,
        lastName: firstNameParts.length > 0 ? lastName : '',
      };
      
      // storeName은 응답에서 받아오지만 업데이트는 안됨 (로컬에서만 유지)
      updateData.siteName = owner.storeName;
      
      // user에서 가져올 수 있는 다른 필드들 (로컬에서 유지)
      if (user?.siteUrl) updateData.siteUrl = user.siteUrl;
      if (user?.siteType) updateData.siteType = user.siteType;
      if (user?.timezone) updateData.timezone = user.timezone;
      if (user?.businessCategory) updateData.businessCategory = user.businessCategory;
      
      const updatedUser = await authService.updateProfile(updateData);
      
      // Zustand store 업데이트
      updateUser(updatedUser);
      
      setIsEditing(false);
      alert('변경사항이 저장되었습니다.');
    } catch (error) {
      console.error('프로필 저장 실패:', error);
      alert('변경사항 저장에 실패했습니다.');
    }
  };

  const handleNotificationToggle = (key: keyof typeof notifications) => {
    setNotifications({
      ...notifications,
      [key]: !notifications[key],
    });
  };

  return (
    <div>
      <PageHeader
        title="계정 관리"
        description="슈엘로 쇼핑몰 사장님 정보 및 설정"
      />

      <div className="space-y-6">
        {/* Profile Header Card */}
        <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <User size={40} className="text-white" />
              </div>
              <div>
                <h2 className="text-white text-2xl mb-1">{owner.name}</h2>
                <p className="text-emerald-100 mb-2">{owner.storeName}</p>
                <div className="flex items-center gap-2 text-sm text-emerald-100">
                  <Calendar size={16} />
                  <span>가입일: {owner.joinDate}</span>
                </div>
              </div>
            </div>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-3 bg-white text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors font-medium"
              >
                정보 수정하기
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-3 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors font-medium"
                >
                  취소
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-3 bg-white text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors font-medium"
                >
                  저장하기
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">등록 상품</p>
                <p className="text-3xl text-gray-900">
                  {isLoading ? '...' : dashboardStats.total_products}
                </p>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
                <Store size={24} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">전체 고객</p>
                <p className="text-3xl text-gray-900">
                  {isLoading ? '...' : dashboardStats.total_customers.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
                <Users size={24} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">이번 달 매출</p>
                <p className="text-3xl text-emerald-600">
                  {isLoading 
                    ? '...' 
                    : `₩${(dashboardStats.monthly_revenue / 1000000).toFixed(1)}M`
                  }
                </p>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
                <ShoppingBag size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <User size={24} />
              </div>
              <h3 className="text-lg">개인 정보</h3>
            </div>

            <div className="space-y-5">
              <div>
                <label className="text-sm text-gray-500 block mb-2">이름</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={owner.name}
                    onChange={(e) => setOwner({ ...owner, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                ) : (
                  <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg">
                    <User className="text-gray-400" size={18} />
                    <p className="text-gray-900">{owner.name}</p>
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm text-gray-500 block mb-2">이메일</label>
                <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg">
                  <Mail className="text-gray-400" size={18} />
                  <p className="text-gray-900">{owner.email}</p>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-500 block mb-2">가입일</label>
                <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg">
                  <Calendar className="text-gray-400" size={18} />
                  <p className="text-gray-900">{owner.joinDate}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Store Information */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <Store size={24} />
              </div>
              <h3 className="text-lg">쇼핑몰 정보</h3>
            </div>

            <div className="space-y-5">
              <div>
                <label className="text-sm text-gray-500 block mb-2">상점명</label>
                <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg">
                  <Store className="text-gray-400" size={18} />
                  <p className="text-gray-900">{owner.storeName}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}