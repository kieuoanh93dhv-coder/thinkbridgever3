import React, { useState } from 'react';
import { StudentProfile, StoreItem } from '../types';
import { Trophy, Gift, Sparkles, CheckCircle2, ShoppingBag, ShieldCheck, Star, ArrowRight, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playRewardChime, playPopChime } from '../utils/sound';

interface LeaderboardAndStoreTabProps {
  student: StudentProfile;
  studentsList: StudentProfile[];
  storeItems: StoreItem[];
  onRedeemItem: (item: StoreItem) => void;
  claimedItems: StoreItem[];
}

export const LeaderboardAndStoreTab: React.FC<LeaderboardAndStoreTabProps> = ({
  student,
  studentsList,
  storeItems,
  onRedeemItem,
  claimedItems,
}) => {
  const [subTab, setSubTab] = useState<'leaderboard' | 'store'>('store');
  const [redeemSuccessMsg, setRedeemSuccessMsg] = useState<string | null>(null);

  // Sort students by effortPoints descending
  const sortedStudents = [...studentsList].sort((a, b) => b.effortPoints - a.effortPoints);

  const getRankBadge = (rank: 'bronze' | 'silver' | 'gold' | 'platinum') => {
    switch (rank) {
      case 'platinum':
        return { label: 'Bạch Kim', color: 'from-cyan-400 to-blue-500 text-slate-950', icon: '💎' };
      case 'gold':
        return { label: 'Vàng', color: 'from-amber-400 to-yellow-500 text-slate-950', icon: '🥇' };
      case 'silver':
        return { label: 'Bạc', color: 'from-slate-300 to-slate-400 text-slate-950', icon: '🥈' };
      default:
        return { label: 'Đồng', color: 'from-amber-700 to-amber-800 text-white', icon: '🥉' };
    }
  };

  const handleRedeem = (item: StoreItem) => {
    if (student.chestnuts < item.cost) {
      alert(`Em cần thêm ${item.cost - student.chestnuts} Hạt dẻ nữa để đổi món quà này nhé! Hãy tự thử thêm vài bài tập nữa nha 🌰`);
      return;
    }

    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#f97316', '#10b981', '#6366f1'],
      });
      playRewardChime();
    } catch (e) {}

    onRedeemItem(item);
    setRedeemSuccessMsg(`Chúc mừng em đã đổi thành công "${item.name}"! Quà đã lưu vào Kho quà.`);
    setTimeout(() => setRedeemSuccessMsg(null), 4000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Tab Switcher Pills */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex p-1 rounded-2xl bg-slate-900 border border-blue-900/50">
          <button
            onClick={() => {
              setSubTab('store');
              playPopChime();
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              subTab === 'store'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Gift className="w-4 h-4" />
            <span>Cửa Hàng Hạt Dẻ 🌰</span>
          </button>

          <button
            onClick={() => {
              setSubTab('leaderboard');
              playPopChime();
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              subTab === 'leaderboard'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Bảng Xếp Hạng Tự Lực 🏆</span>
          </button>
        </div>

        {/* Current Wallet */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40">
          <span className="text-2xl">🌰</span>
          <div>
            <div className="text-[11px] text-amber-200">Số dư hạt dẻ của em:</div>
            <div className="text-lg font-black text-amber-300 leading-none">
              {student.chestnuts} Hạt dẻ
            </div>
          </div>
        </div>
      </div>

      {redeemSuccessMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-900/60 border border-emerald-500/40 text-emerald-200 text-xs sm:text-sm font-semibold flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <span>{redeemSuccessMsg}</span>
          </div>
          <button
            onClick={() => setRedeemSuccessMsg(null)}
            className="text-emerald-300 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* STORE VIEW */}
      {subTab === 'store' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-950/60 via-slate-900 to-blue-950/80 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                Đổi quà khích lệ
              </span>
              <h3 className="text-2xl font-black text-white mt-1">
                Cửa Hàng Quà Tặng ThinkBridge
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Đổi những phần quà thú vị và các quyền lợi học đường bằng hạt dẻ thông thái em đã tích lũy!
              </p>
            </div>
            <div className="text-xs text-amber-300 font-semibold bg-slate-900/80 px-3.5 py-2 rounded-xl border border-amber-500/20">
              💡 Mỗi bài tự thử = +15 hạt dẻ
            </div>
          </div>

          {/* Store Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {storeItems.map((item) => {
              const canAfford = student.chestnuts >= item.cost;
              const isClaimed = claimedItems.some((c) => c.id === item.id);

              return (
                <div
                  key={item.id}
                  className={`p-5 rounded-3xl border transition-all flex flex-col justify-between ${
                    isClaimed
                      ? 'bg-slate-900/50 border-emerald-500/30'
                      : canAfford
                      ? 'bg-slate-900/90 border-amber-500/40 hover:border-amber-400 shadow-lg'
                      : 'bg-slate-900/60 border-slate-800'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-3xl shadow-inner">
                        {item.icon}
                      </div>
                      <span className="font-black text-amber-400 text-sm flex items-center gap-1 bg-amber-500/10 px-2.5 py-1 rounded-xl border border-amber-500/20">
                        <span>🌰</span>
                        <span>{item.cost}</span>
                      </span>
                    </div>

                    <h4 className="font-bold text-sm sm:text-base text-white mb-1">{item.name}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed mb-4">{item.description}</p>
                  </div>

                  <div>
                    {isClaimed ? (
                      <div className="w-full py-2 px-3 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-xs font-bold text-center flex items-center justify-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Đã sở hữu trong kho quà</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleRedeem(item)}
                        disabled={!canAfford}
                        className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                          canAfford
                            ? 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 shadow-md shadow-orange-500/20 active:scale-95'
                            : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                        }`}
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>
                          {canAfford ? 'Đổi quà ngay' : `Thiếu ${item.cost - student.chestnuts} 🌰`}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Claimed Inventory */}
          {claimedItems.length > 0 && (
            <div className="p-5 rounded-3xl bg-slate-900/90 border border-emerald-500/30">
              <h4 className="font-bold text-sm text-emerald-300 flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Kho Quà Đã Nhận Của Em ({claimedItems.length} món)</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {claimedItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center gap-3 text-xs"
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <div className="truncate">
                      <div className="font-bold text-white truncate">{item.name}</div>
                      <div className="text-[11px] text-emerald-400">Trạng thái: Sẵn sàng sử dụng</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* LEADERBOARD VIEW */}
      {subTab === 'leaderboard' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-950/80 via-slate-900 to-indigo-950 border border-blue-700/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
                Vinh danh tinh thần tự học
              </span>
              <h3 className="text-2xl font-black text-white mt-1">
                Bảng Xếp Hạng 4 Hạng: Đồng – Bạc – Vàng – Bạch Kim
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Điểm xếp hạng dựa trên <span className="text-amber-300 font-bold">Điểm Nỗ Lực &amp; Tự Thử</span>, không chỉ là điểm số lý thuyết!
              </p>
            </div>

            {/* 4 Tiers Legend */}
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-xl bg-cyan-900/60 border border-cyan-400 text-cyan-200 font-bold flex items-center gap-1">
                💎 Bạch Kim (&gt;1400)
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-amber-900/60 border border-amber-400 text-amber-200 font-bold flex items-center gap-1">
                🥇 Vàng (900-1399)
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-slate-800 border border-slate-400 text-slate-200 font-bold flex items-center gap-1">
                🥈 Bạc (500-899)
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-orange-950 border border-amber-700 text-orange-200 font-bold flex items-center gap-1">
                🥉 Đồng (&lt;500)
              </span>
            </div>
          </div>

          {/* Student Leaderboard Table */}
          <div className="bg-slate-900/90 border border-blue-900/40 rounded-3xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase text-[11px] font-bold">
                    <th className="py-3.5 px-4 text-center w-14">Hạng</th>
                    <th className="py-3.5 px-4">Học sinh</th>
                    <th className="py-3.5 px-4">Danh hiệu</th>
                    <th className="py-3.5 px-4 text-center">Tỷ lệ tự thử</th>
                    <th className="py-3.5 px-4 text-right">Điểm nỗ lực</th>
                    <th className="py-3.5 px-4 text-right">Hạt dẻ 🌰</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {sortedStudents.map((st, idx) => {
                    const isCurrent = st.id === student.id;
                    const rankInfo = getRankBadge(st.rank);
                    return (
                      <tr
                        key={st.id}
                        className={`transition-colors ${
                          isCurrent
                            ? 'bg-blue-950/70 border-l-4 border-l-amber-400 font-medium'
                            : 'hover:bg-slate-800/40'
                        }`}
                      >
                        <td className="py-3.5 px-4 text-center font-black">
                          {idx === 0 ? (
                            <span className="text-xl">🥇</span>
                          ) : idx === 1 ? (
                            <span className="text-xl">🥈</span>
                          ) : idx === 2 ? (
                            <span className="text-xl">🥉</span>
                          ) : (
                            <span className="text-slate-400">#{idx + 1}</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <span className="text-2xl">{st.avatar}</span>
                            <div>
                              <div className="font-bold text-white flex items-center gap-1.5">
                                <span>{st.name}</span>
                                {isCurrent && (
                                  <span className="text-[10px] bg-amber-500 text-slate-950 font-black px-1.5 py-0.2 rounded-full">
                                    Em (Bạn)
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] text-slate-400">{st.grade}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-gradient-to-r ${rankInfo.color} shadow-sm`}
                          >
                            <span>{rankInfo.icon}</span>
                            <span>{rankInfo.label}</span>
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center font-bold">
                          <span
                            className={
                              st.selfAttemptRate >= 80
                                ? 'text-emerald-400'
                                : st.selfAttemptRate >= 50
                                ? 'text-amber-300'
                                : 'text-rose-400'
                            }
                          >
                            {st.selfAttemptRate}%
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right font-black text-amber-300">
                          {st.effortPoints} pts
                        </td>
                        <td className="py-3.5 px-4 text-right font-bold text-orange-400">
                          {isCurrent ? student.chestnuts : st.chestnuts} 🌰
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
