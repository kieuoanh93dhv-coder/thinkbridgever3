import React from 'react';
import { UserRole, StudentProfile } from '../types';
import { Sparkles, Trophy, BookOpen, MessageSquare, ShieldAlert, UserCheck, Flame, Gift, RefreshCw, Menu, X } from 'lucide-react';

interface HeaderProps {
  currentRole: UserRole;
  onSwitchRole: (role: UserRole) => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  student: StudentProfile;
  teacher: any;
  onOpenRoleModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onSwitchRole,
  activeTab,
  onSelectTab,
  student,
  teacher,
  onOpenRoleModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const studentNavItems = [
    { id: 'home', label: 'Trang chủ', icon: BookOpen },
    { id: 'chat', label: 'Hỏi bài AI', icon: MessageSquare, badge: 'Từng bước' },
    { id: 'journal', label: 'Nhật ký tư duy', icon: Sparkles },
    { id: 'store', label: 'Xếp hạng & Đổi quà', icon: Gift },
  ];

  const teacherNavItems = [
    { id: 'dashboard', label: 'Bảng điều khiển 8A', icon: ShieldAlert, badge: 'Giáo viên' },
    { id: 'chat', label: 'Thử hỏi bài (AI Tutor)', icon: MessageSquare },
  ];

  const navItems = currentRole === 'student' ? studentNavItems : teacherNavItems;

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-blue-900/40 text-white shadow-lg">
      {/* Top Banner with Motto */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-amber-950 py-1.5 px-4 text-center text-xs md:text-sm font-semibold tracking-wide border-b border-amber-500/20 text-amber-200 flex items-center justify-center gap-2 shadow-inner">
        <span className="inline-block animate-pulse">✨</span>
        <span>Hỏi AI thông minh – Tự nghĩ trước khi xem đáp án</span>
        <span className="hidden sm:inline-block text-amber-400 font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-[11px]">
          🌰 Càng tự thử, càng nhiều hạt dẻ
        </span>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onSelectTab(currentRole === 'student' ? 'home' : 'dashboard')}
              className="flex items-center gap-2.5 text-left group transition"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-md shadow-orange-500/20 text-white font-extrabold text-xl group-hover:scale-105 transition-transform border border-amber-300/40">
                🌰
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-white via-blue-100 to-amber-300 bg-clip-text text-transparent">
                    ThinkBridge
                  </span>
                  <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-blue-800/80 text-blue-200 border border-blue-700">
                    Socratic
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 hidden sm:block">
                  Cầu nối rèn luyện tư duy độc lập
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`relative flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive
                          ? 'bg-amber-400 text-slate-950'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Side: Role Badge + Quick Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Chestnut Counter (if student) */}
            {currentRole === 'student' ? (
              <div
                onClick={() => onSelectTab('store')}
                className="cursor-pointer group flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 hover:border-amber-400 transition"
                title="Hạt dẻ thông thái - Bấm để vào Cửa hàng quà tặng"
              >
                <span className="text-base group-hover:scale-125 transition-transform inline-block">🌰</span>
                <span className="font-extrabold text-amber-300 text-sm sm:text-base">
                  {student.chestnuts}
                </span>
                <span className="text-[11px] text-amber-200/80 hidden sm:inline">hạt dẻ</span>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-950 border border-blue-700/60 text-xs text-blue-200">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Lớp 8A ({teacher.totalStudents} HS)</span>
              </div>
            )}

            {/* Current User Pill / Switcher */}
            <button
              onClick={onOpenRoleModal}
              className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 transition text-xs sm:text-sm text-left group"
              title="Bấm để đổi vai trò Demo (Học sinh ↔ Giáo viên)"
            >
              <span className="text-base sm:text-lg">
                {currentRole === 'student' ? student.avatar : teacher.avatar}
              </span>
              <div className="hidden sm:block">
                <div className="font-bold text-slate-100 flex items-center gap-1">
                  <span>{currentRole === 'student' ? student.name : teacher.name}</span>
                  <RefreshCw className="w-3 h-3 text-amber-400 group-hover:rotate-180 transition-transform duration-300" />
                </div>
                <div className="text-[10px] text-slate-400">
                  {currentRole === 'student' ? 'Học sinh Demo' : 'Giáo viên Demo'}
                </div>
              </div>
              <div className="sm:hidden text-xs font-bold text-amber-400">
                {currentRole === 'student' ? 'HS' : 'GV'}
              </div>
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white md:hidden hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-blue-900/50 px-4 pt-2 pb-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 text-amber-300" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
            <span className="text-xs text-slate-400">Đổi vai trải nghiệm:</span>
            <button
              onClick={() => {
                onSwitchRole(currentRole === 'student' ? 'teacher' : 'student');
                setMobileMenuOpen(false);
              }}
              className="px-3 py-1 bg-amber-600 text-white rounded-lg text-xs font-bold flex items-center gap-1.5"
            >
              <RefreshCw className="w-3 h-3" />
              Chuyển sang {currentRole === 'student' ? 'Giáo viên' : 'Học sinh'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
