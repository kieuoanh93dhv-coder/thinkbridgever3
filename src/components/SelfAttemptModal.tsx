import React, { useState } from 'react';
import { ShieldCheck, Sparkles, Lightbulb, ArrowRight, X, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playRewardChime } from '../utils/sound';

interface SelfAttemptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitAttempt: (attemptText: string) => void;
  onRequestHintInstead: () => void;
  exerciseTitle?: string;
}

export const SelfAttemptModal: React.FC<SelfAttemptModalProps> = ({
  isOpen,
  onClose,
  onSubmitAttempt,
  onRequestHintInstead,
  exerciseTitle,
}) => {
  const [attemptText, setAttemptText] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const quickChips = [
    'Em đã tóm tắt được các đại lượng đã biết và ẩn cần tìm...',
    'Em áp dụng công thức v = s / t để thiết lập phương trình...',
    'Em biến đổi vế trái: gom các hạng tử đồng dạng lại...',
    'Em nhận thấy hai tam giác có chung góc và hai cạnh tỉ lệ...',
  ];

  const handleSubmit = () => {
    if (attemptText.trim().length < 8) {
      setErrorMsg('Bạn hãy viết ít nhất một bước làm cụ thể (tối thiểu 8 ký tự) nhé!');
      return;
    }
    setErrorMsg('');
    
    // Confetti effect!
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#f97316', '#3b82f6', '#10b981'],
      });
      playRewardChime();
    } catch (e) {}

    onSubmitAttempt(attemptText.trim());
    setAttemptText('');
  };

  const handleSelectChip = (chip: string) => {
    setAttemptText(chip);
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 border-2 border-amber-500/50 rounded-3xl shadow-2xl overflow-hidden p-6 text-white">
        {/* Glow corner */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-full hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-3.5 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-2xl flex-shrink-0 shadow-inner">
            🛡️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-amber-300">Cổng Tự Thử ThinkBridge</h3>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 uppercase tracking-wide">
                +15 🌰 Thưởng
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Tự nghĩ trước – Nhận thức sâu – Tránh phụ thuộc AI
            </p>
          </div>
        </div>

        {/* Pedagogical Notice */}
        <div className="p-3.5 rounded-2xl bg-blue-900/40 border border-blue-500/30 text-xs text-blue-100 leading-relaxed mb-4 flex gap-2.5">
          <Sparkles className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-200 mb-1">
              Khoan đã bạn nhé! Hãy rèn luyện nếp tư duy độc lập:
            </p>
            <p>
              Xem đáp án quá sớm sẽ làm não bộ giảm phản xạ giải quyết vấn đề. Hãy viết ít nhất <span className="text-amber-300 font-bold">1 bước làm, giả thiết hoặc công thức</span> bạn đã thử nghiệm!
            </p>
          </div>
        </div>

        {exerciseTitle && (
          <div className="text-xs text-slate-300 bg-slate-800/60 px-3 py-1.5 rounded-xl border border-slate-700/60 mb-3 truncate">
            <span className="font-semibold text-slate-400">Bài tập đang giải: </span>
            <span className="text-slate-200 italic">{exerciseTitle}</span>
          </div>
        )}

        {/* Textarea Input */}
        <div className="mb-3">
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Bước làm hoặc suy nghĩ của bạn:
          </label>
          <textarea
            value={attemptText}
            onChange={(e) => {
              setAttemptText(e.target.value);
              if (errorMsg) setErrorMsg('');
            }}
            placeholder="Ví dụ: Em đã xác định dữ kiện x là quãng đường... hoặc Em thử áp dụng công thức..."
            rows={3}
            className="w-full bg-slate-950/70 border border-amber-500/30 focus:border-amber-400 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition resize-none"
          />
          {errorMsg && (
            <div className="flex items-center gap-1.5 text-xs text-rose-400 mt-1.5 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Quick sample chips */}
        <div className="mb-5">
          <div className="text-[11px] font-medium text-slate-400 mb-1.5">
            Hoặc chọn gợi ý mẫu để hoàn thiện nhanh:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {quickChips.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectChip(chip)}
                className="text-left text-[11px] px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-amber-200 transition"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2.5 pt-2 border-t border-slate-800">
          <button
            onClick={handleSubmit}
            className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 font-bold text-sm text-slate-950 flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 active:scale-98 transition cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-slate-950" />
            <span>Gửi tự thử & Mở lời giải (+15 🌰)</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onRequestHintInstead();
            }}
            className="py-2.5 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-xs font-semibold text-blue-200 hover:text-white flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <span>Chưa nghĩ ra, gợi ý thêm!</span>
          </button>
        </div>
      </div>
    </div>
  );
};
