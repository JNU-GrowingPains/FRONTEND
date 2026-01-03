import { useState } from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { User, Store, Bell, Mail, Phone, Building, Calendar, ShoppingBag, Users } from 'lucide-react';
import { mockStoreOwner, mockNotificationSettings } from '../lib/accountData';

export function AccountPage() {
  const [owner, setOwner] = useState(mockStoreOwner);
  const [notifications, setNotifications] = useState(mockNotificationSettings);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
    // API 호출하여 저장하는 로직이 여기 들어갈 예정
    alert('변경사항이 저장되었습니다.');
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
                <p className="text-3xl text-gray-900">10</p>
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
                <p className="text-3xl text-gray-900">1,190</p>
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
                <p className="text-3xl text-emerald-600">48.5M</p>
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
                {isEditing ? (
                  <input
                    type="email"
                    value={owner.email}
                    onChange={(e) => setOwner({ ...owner, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                ) : (
                  <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg">
                    <Mail className="text-gray-400" size={18} />
                    <p className="text-gray-900">{owner.email}</p>
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm text-gray-500 block mb-2">연락처</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={owner.phone}
                    onChange={(e) => setOwner({ ...owner, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                ) : (
                  <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg">
                    <Phone className="text-gray-400" size={18} />
                    <p className="text-gray-900">{owner.phone}</p>
                  </div>
                )}
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
                {isEditing ? (
                  <input
                    type="text"
                    value={owner.storeName}
                    onChange={(e) => setOwner({ ...owner, storeName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                ) : (
                  <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg">
                    <Store className="text-gray-400" size={18} />
                    <p className="text-gray-900">{owner.storeName}</p>
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm text-gray-500 block mb-2">상점 설명</label>
                {isEditing ? (
                  <textarea
                    value={owner.storeDescription}
                    onChange={(e) => setOwner({ ...owner, storeDescription: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    rows={4}
                  />
                ) : (
                  <div className="flex items-start gap-3 px-4 py-3 bg-gray-50 rounded-lg">
                    <Building className="text-gray-400 mt-0.5" size={18} />
                    <p className="text-gray-900">{owner.storeDescription}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}