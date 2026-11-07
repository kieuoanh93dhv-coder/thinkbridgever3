import React from 'react';
import { StudentProfile, WeeklyGoal } from '../types';
import { Sparkles, Target, Award, CheckCircle2, TrendingUp, Calendar, HeartHandshake, Zap, Brain } from 'lucide-react';
import { Mascot } from './Mascot';

interface JournalTabProps {
  student: StudentProfile;
  weeklyGoal: WeeklyGoal;
  recentAttempts: Array<{ id: string; title: string; stepText: string; time: string; reward: number }>;
}

export const JournalTab: React.FC<JournalTabProps> = ({
  student,
  weeklyGoal,
  recentAttempts,
}) => {
  const goalPercentage = Math.min(100, Math.round((weeklyGoal.current / weeklyGoal.target) * 100));

  const badges = [
    {
      id: 'b1',
      title: 'Chiến binh Tự Thử',
      desc: 'Tự viết ít nhất 1 bước giải trước khi mở đáp án',
      icon: '🛡️',
      unlocked: true,
      color: 'from-amber-500 to-orange-600',
    },
    {
      id: 'b2',
      title: 'Kho Hạt Dẻ Trù Phú',
      desc: 'Tích lũy hơn 100 Hạt dẻ thông thái',
      icon: '🌰',
      unlocked: student.chestnuts >= 100,
      color: 'from-amber-600 to-yellow-600',
    },
    {
      id: 'b3',
      title: 'Bậc Thầy Socratic',
      desc: 'Dùng gợi ý từng bước để tự hoàn thành bài',
      icon: '🧠',
      unlocked: true,
      color: 'from-blue-600 to-indigo-600',
    },
    {
      id: 'b4',
      title: 'Kiên Trì Bền Bỉ',
      desc: 'Đạt trên 80% mục tiêu tư duy tuần',
      icon: '🔥',
      unlocked: goalPercentage >= 80,
      color: 'from-emerald-600 to-teal-600',
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border border-blue-800/40 p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Brain className="w-4 h-4" />
            <span>Hồ sơ năng lực tư duy</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Nhật Ký Tư Duy: {student.name}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Mỗi nỗ lực tự suy nghĩ đều quý giá hơn mười lần nhìn trước đáp án.
          </p>
        </div>

        {/* Positive reinforcement badge */}
        <div className="px-4 py-2.5 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-200 flex items-center gap-2.5 shadow-md">
          <Sparkles className="w-5 h-5 text-amber-400 flex-shrink-0" />
          <div className="text-xs">
            <span className="font-bold text-white block">Triết lý ThinkBridge:</span>
            <span>Khen ngợi nỗ lực • Không phạt lỗi sai</span>
          </div>
        </div>
      </div>

      {/* 3 Weekly Metrics Cards */}
      <div>
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-amber-400" />
          <span>3 Chỉ số tư duy trong tuần</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Metric 1 */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-blue-900/40 shadow-lg relative overflow-hidden group hover:border-blue-500/50 transition">
            <div className="text-xs font-semibold text-slate-400 mb-1">
              Tỷ lệ tự thử trước khi hỏi
            </div>
            <div className="text-3xl font-black text-amber-300 flex items-baseline gap-1">
              <span>{student.selfAttemptRate}%</span>
              <span className="text-xs font-bold text-emerald-400">↑ 12% so tuần trước</span>
            </div>
            <p className="text-[11px] text-slate-300 mt-2">
              Em đã luôn đặt bút thử nghiệm trước khi mở lời giải ở 4/5 bài tập.
            </p>
            <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${student.selfAttemptRate}%` }}
              ></div>
            </div>
          </div>

          {/* Metric 2 */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-blue-900/40 shadow-lg relative overflow-hidden group hover:border-blue-500/50 transition">
            <div className="text-xs font-semibold text-slate-400 mb-1">
              Tỷ lệ học chủ động
            </div>
            <div className="text-3xl font-black text-blue-300 flex items-baseline gap-1">
              <span>{student.activeInitiativeRate}%</span>
              <span className="text-xs font-bold text-emerald-400">Xuất sắc</span>
            </div>
            <p className="text-[11px] text-slate-300 mt-2">
              Dùng nút "Gợi ý thêm" và "Tiếp tục" thay vì xin lời giải hoàn chỉnh ngay.
            </p>
            <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${student.activeInitiativeRate}%` }}
              ></div>
            </div>
          </div>

          {/* Metric 3 */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-blue-900/40 shadow-lg relative overflow-hidden group hover:border-blue-500/50 transition">
            <div className="text-xs font-semibold text-slate-400 mb-1">
              Số bước làm đã gửi
            </div>
            <div className="text-3xl font-black text-emerald-300 flex items-baseline gap-1">
              <span>{student.stepsSubmittedWeekly}</span>
              <span className="text-xs font-normal text-slate-400">bước tuần này</span>
            </div>
            <p className="text-[11px] text-slate-300 mt-2">
              Mỗi bước làm là một nấc thang củng cố nền tảng kiến thức vững chắc.
            </p>
            <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (student.stepsSubmittedWeekly / 30) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Goal Card: Encouraging, Never Punitive */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-950/70 via-slate-900 to-blue-950/80 border border-indigo-700/50 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-xl">
              🎯
            </div>
            <div>
              <h4 className="text-base font-bold text-white">{weeklyGoal.title}</h4>
              <p className="text-xs text-slate-300">
                Tiến độ: <span className="text-amber-300 font-bold">{weeklyGoal.current}</span> /{' '}
                {weeklyGoal.target} {weeklyGoal.unit} ({goalPercentage}%)
              </p>
            </div>
          </div>

          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            {goalPercentage >= 100 ? 'Đã hoàn thành xuất sắc 🎉' : 'Đang tiến rất nhanh! 🚀'}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-950/80 h-3.5 rounded-full p-0.5 border border-slate-700 overflow-hidden mb-3">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-400 transition-all duration-700 shadow-sm"
            style={{ width: `${goalPercentage}%` }}
          ></div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-amber-200 flex items-start gap-2.5">
          <HeartHandshake className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-white">Lời nhắn động viên từ thầy cô: </strong>
            {weeklyGoal.encouragement}
          </p>
        </div>
      </div>

      {/* Badges & Milestones */}
      <div>
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-400" />
          <span>Huy hiệu tư duy đã mở khóa</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {badges.map((b) => (
            <div
              key={b.id}
              className={`p-4 rounded-2xl border transition-all flex items-start gap-3 ${
                b.unlocked
                  ? 'bg-slate-900/90 border-amber-500/30 shadow-md'
                  : 'bg-slate-900/40 border-slate-800 opacity-60'
              }`}
            >
              <div className="text-2xl p-2 rounded-xl bg-slate-800/80 border border-slate-700">
                {b.icon}
              </div>
              <div>
                <h5 className="font-bold text-xs sm:text-sm text-slate-100">{b.title}</h5>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{b.desc}</p>
                <div className="mt-2 text-[10px] font-bold">
                  {b.unlocked ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Đã đạt được
                    </span>
                  ) : (
                    <span className="text-slate-500">Chưa mở khóa</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Self-Attempt History */}
      <div>
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-amber-400" />
          <span>Nhật ký các bài tập đã tự thử gần đây</span>
        </h3>

        <div className="bg-slate-900/90 border border-blue-900/40 rounded-3xl p-4 sm:p-5 shadow-lg space-y-3">
          {recentAttempts.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400">
              Chưa có bài tập tự thử nào hôm nay. Hãy vào mục "Hỏi bài AI" và thử sức với một bài tập nhé!
            </div>
          ) : (
            recentAttempts.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5"
              >
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{item.title}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                      Đã tự thử ✅
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 italic">
                    "{item.stepText}"
                  </p>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <span className="text-amber-400 font-bold bg-amber-500/10 px-2.5 py-1 rounded-xl border border-amber-500/20">
                    +{item.reward} 🌰
                  </span>
                  <span className="text-slate-400 text-[11px]">{item.time}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Mascot bottom cheer */}
      <Mascot mood="celebrate" />
    </div>
  );
};
