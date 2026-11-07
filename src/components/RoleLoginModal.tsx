import React from 'react';
import { UserRole } from '../types';
import { User, GraduationCap, ArrowRight, X, Sparkles, CheckCircle2 } from 'lucide-react';
import { playPopChime } from '../utils/sound';

interface RoleLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  studentName: string;
  teacherName: string;
}

export const RoleLoginModal: React.FC<RoleLoginModalProps> = ({
  isOpen,
  onClose,
  currentRole,
  onSelectRole,
  studentName,
  teacherName,
}) => {
  if (!isOpen) return null;

  const handleChoose = (role: UserRole) => {
    playPopChime();
    onSelectRole(role);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-blue-900/60 rounded-3xl shadow-2xl p-6 text-white overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-full hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-3xl shadow-lg shadow-orange-500/20 border border-amber-300">
            🌰
          </div>
          <h3 className="text-xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            Chọn Vai Trò Trải Nghiệm Demo
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Chuyển đổi góc nhìn giữa Học sinh và Giáo viên bất kỳ lúc nào
          </p>
        </div>

        {/* Two Role Cards */}
        <div className="space-y-3.5 mb-6">
          {/* Student Role Card */}
          <button
            onClick={() => handleChoose('student')}
            className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-start gap-3.5 group cursor-pointer ${
              currentRole === 'student'
                ? 'bg-blue-950/90 border-blue-500 shadow-lg shadow-blue-500/20'
                : 'bg-slate-800/70 border-slate-700 hover:border-slate-500 hover:bg-slate-800'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">
              🐿️
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-100 group-hover:text-amber-300 transition text-sm">
                  Học sinh: {studentName}
                </span>
                {currentRole === 'student' && (
                  <CheckCircle2 className="w-4 h-4 text-blue-400" />
                )}
              </div>
              <p className="text-xs text-slate-300 mt-0.5 line-clamp-1">
                Lớp 8A • Đang có 125 hạt dẻ • Hạng Bạc
              </p>
              <div className="flex items-center gap-2 mt-2 text-[11px] text-amber-300 font-medium">
                <span>Hỏi bài AI từng bước</span>
                <span>•</span>
                <span>Cổng tự thử</span>
                <span>•</span>
                <span>Đổi quà</span>
              </div>
            </div>
          </button>

          {/* Teacher Role Card */}
          <button
            onClick={() => handleChoose('teacher')}
            className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-start gap-3.5 group cursor-pointer ${
              currentRole === 'teacher'
                ? 'bg-blue-950/90 border-blue-500 shadow-lg shadow-blue-500/20'
                : 'bg-slate-800/70 border-slate-700 hover:border-slate-500 hover:bg-slate-800'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">
              👩‍🏫
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-100 group-hover:text-blue-300 transition text-sm">
                  Giáo viên: {teacherName}
                </span>
                {currentRole === 'teacher' && (
                  <CheckCircle2 className="w-4 h-4 text-blue-400" />
                )}
              </div>
              <p className="text-xs text-slate-300 mt-0.5 line-clamp-1">
                GV Toán &amp; Chủ nhiệm 8A • 35 Học sinh
              </p>
              <div className="flex items-center gap-2 mt-2 text-[11px] text-blue-300 font-medium">
                <span>Bảng điều khiển rủi ro</span>
                <span>•</span>
                <span>Ghi chú can thiệp sư phạm</span>
              </div>
            </div>
          </button>
        </div>

        {/* Footnote */}
        <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-[11px] text-slate-400 text-center">
          💡 Bạn có thể bấm vào tên người dùng ở góc trên bên phải màn hình bất cứ lúc nào để đổi vai.
        </div>
      </div>
    </div>
  );
};
