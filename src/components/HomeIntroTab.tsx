import React from 'react';
import { ArrowRight, HelpCircle, BrainCircuit, Gift, Sparkles, CheckCircle2, ShieldCheck, Flame, Users, BookOpen } from 'lucide-react';
import { Mascot } from './Mascot';

interface HomeIntroTabProps {
  onStartChat: () => void;
  onOpenJournal: () => void;
  onOpenStore: () => void;
  onOpenTeacherDashboard: () => void;
  currentRole: 'student' | 'teacher';
}

export const HomeIntroTab: React.FC<HomeIntroTabProps> = ({
  onStartChat,
  onOpenJournal,
  onOpenStore,
  onOpenTeacherDashboard,
  currentRole,
}) => {
  return (
    <div className="space-y-8 pb-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 border border-blue-800/40 p-6 sm:p-10 shadow-2xl">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Phương pháp Socratic: AI định hướng từng bước tư duy</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Cầu Nối Tư Duy{' '}
            <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              ThinkBridge
            </span>
          </h1>

          <p className="mt-3 text-lg sm:text-xl font-semibold text-amber-200">
            "Hỏi AI thông minh – Tự nghĩ trước khi xem đáp án"
          </p>

          <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            Không làm hộ bài, không chép vẹt. ThinkBridge đóng vai trò người gia sư kiên nhẫn, dẫn dắt em tự tìm ra lời giải từng bước, tích lũy hạt dẻ thông thái và rèn luyện phản xạ học tập suốt đời.
          </p>

          {/* Call to action buttons */}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={onStartChat}
              className="py-3 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold text-sm sm:text-base flex items-center gap-2.5 shadow-lg shadow-orange-500/25 active:scale-95 transition cursor-pointer"
            >
              <span>Vào phòng hỏi AI ngay</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            {currentRole === 'student' ? (
              <button
                onClick={onOpenJournal}
                className="py-3 px-5 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-white font-semibold text-sm sm:text-base flex items-center gap-2 transition cursor-pointer"
              >
                <BrainCircuit className="w-4 h-4 text-amber-400" />
                <span>Xem nhật ký tư duy của em</span>
              </button>
            ) : (
              <button
                onClick={onOpenTeacherDashboard}
                className="py-3 px-5 rounded-2xl bg-indigo-900/80 hover:bg-indigo-800 border border-indigo-700 text-white font-semibold text-sm sm:text-base flex items-center gap-2 transition cursor-pointer"
              >
                <Users className="w-4 h-4 text-indigo-300" />
                <span>Xem bảng điều khiển Lớp 8A</span>
              </button>
            )}
          </div>
        </div>

        {/* Mascot Banner inside Hero */}
        <div className="mt-8 pt-6 border-t border-slate-800/80">
          <Mascot mood="happy" />
        </div>
      </div>

      {/* 3 Steps: How to use */}
      <div>
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            Quy trình học 3 bước
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
            Học tập có trách nhiệm trong kỷ nguyên AI
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Mỗi thao tác trên ThinkBridge được thiết kế để kích hoạt tư duy chủ động
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Step 1 */}
          <div className="relative group p-6 rounded-3xl bg-slate-900/80 border border-blue-900/40 hover:border-blue-500/50 transition-all shadow-xl hover:-translate-y-1">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-300 font-black text-xl mb-4 group-hover:scale-110 transition-transform">
              1
            </div>
            <div className="flex items-center gap-2 mb-2">
              <HelpCircle className="w-5 h-5 text-blue-400" />
              <h3 className="font-bold text-lg text-white">Hỏi bài tập khó</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Chụp ảnh bài tập trong sách hoặc gõ đề bài Toán, Lý, Hóa, Văn... Hệ thống sẽ nhận diện và chia nhỏ bài toán thành các nấc thang tư duy.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-blue-300 font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
              <span>Hỗ trợ ảnh chụp + đề gõ tay</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative group p-6 rounded-3xl bg-slate-900/80 border border-amber-500/40 hover:border-amber-400 transition-all shadow-xl hover:-translate-y-1 bg-gradient-to-b from-slate-900 via-amber-950/20 to-slate-900">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 font-black text-xl mb-4 group-hover:scale-110 transition-transform">
              2
            </div>
            <div className="flex items-center gap-2 mb-2">
              <BrainCircuit className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-lg text-amber-200">Tự thử với gợi ý</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              AI gợi mở từng bước mà không đưa ngay kết quả. Bấm <span className="text-amber-300 font-semibold">Gợi ý thêm</span>, <span className="text-amber-300 font-semibold">Tiếp tục</span>, hoặc vượt qua <span className="text-orange-400 font-semibold">Cổng tự thử</span> bằng việc viết ra suy nghĩ của mình.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-amber-300 font-medium flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Cổng tự thử chặn xem đáp án vội</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative group p-6 rounded-3xl bg-slate-900/80 border border-orange-900/40 hover:border-orange-500/50 transition-all shadow-xl hover:-translate-y-1">
            <div className="w-12 h-12 rounded-2xl bg-orange-600/20 border border-orange-500/30 flex items-center justify-center text-orange-300 font-black text-xl mb-4 group-hover:scale-110 transition-transform">
              3
            </div>
            <div className="flex items-center gap-2 mb-2">
              <Gift className="w-5 h-5 text-orange-400" />
              <h3 className="font-bold text-lg text-white">Nhận thưởng có trách nhiệm</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Càng tự tay thử nhiều bước, học sinh càng nhận được nhiều <span className="text-amber-300 font-semibold">Hạt dẻ thông thái 🌰</span>. Tích hạt dẻ để thăng hạng Đồng – Bạc – Vàng – Bạch kim và đổi quà thật!
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-orange-300 font-medium flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-orange-400" />
              <span>Khen ngợi nỗ lực, không tạo áp lực</span>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
        {/* For Students */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-blue-900/50 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-blue-400 font-bold text-sm mb-2">
              <BookOpen className="w-4 h-4" />
              <span>DÀNH CHO HỌC SINH</span>
            </div>
            <h4 className="text-xl font-bold text-white mb-2">
              Tự tin giải bài – Không sợ điểm kém
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
              Bạn luôn có một người gia sư AI không bao giờ cáu gắt, luôn sẵn sàng giải thích lại bằng ngôn ngữ gần gũi nhất cho đến khi bạn thật sự hiểu bản chất.
            </p>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Nhật ký tư duy ghi nhận nỗ lực từng ngày</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Cửa hàng đổi quà hạt dẻ (Sticker, Thẻ miễn bài, Bút xinh...)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Bảng xếp hạng tôn vinh tinh thần tự học</span>
              </li>
            </ul>
          </div>
          <button
            onClick={onStartChat}
            className="mt-6 w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold text-xs sm:text-sm text-white transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Bắt đầu phiên học ngay</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* For Teachers */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-indigo-900/50 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm mb-2">
              <Users className="w-4 h-4" />
              <span>DÀNH CHO GIÁO VIÊN &amp; NHÀ TRƯỜNG</span>
            </div>
            <h4 className="text-xl font-bold text-white mb-2">
              Bảng điều khiển rủi ro phụ thuộc AI
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
              Giáo viên không cấm đoán AI mà theo dõi được bạn nào đang học chủ động, bạn nào có thói quen xem đáp án vội để kịp thời có biện pháp can thiệp sư phạm.
            </p>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <span className="text-indigo-400 font-bold">✓</span>
                <span>Phân loại rủi ro 3 mức: 🟢 Xanh - 🟡 Vàng - 🔴 Đỏ</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-indigo-400 font-bold">✓</span>
                <span>Bộ lọc theo thời gian: Hôm nay, 7 ngày qua, Tháng này</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-indigo-400 font-bold">✓</span>
                <span>Ô ghi chú can thiệp sư phạm lưu trữ trực tiếp</span>
              </li>
            </ul>
          </div>
          <button
            onClick={onOpenTeacherDashboard}
            className="mt-6 w-full py-2.5 rounded-xl bg-indigo-700 hover:bg-indigo-600 font-semibold text-xs sm:text-sm text-white transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Mở Bảng điều khiển Giáo viên</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
