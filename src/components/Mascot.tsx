import React, { useState } from 'react';
import { MASCOT_ENCOURAGEMENTS } from '../data/mockData';
import { Sparkles, MessageCircleHeart } from 'lucide-react';
import { playPopChime } from '../utils/sound';

interface MascotProps {
  mood?: 'idle' | 'happy' | 'thinking' | 'celebrate';
  customMessage?: string;
  className?: string;
}

export const Mascot: React.FC<MascotProps> = ({
  mood = 'idle',
  customMessage,
  className = '',
}) => {
  const [quoteIdx, setQuoteIdx] = useState(0);

  const nextQuote = () => {
    playPopChime();
    setQuoteIdx((prev) => (prev + 1) % MASCOT_ENCOURAGEMENTS.length);
  };

  const currentText = customMessage || MASCOT_ENCOURAGEMENTS[quoteIdx];

  const moodEmojis = {
    idle: '🐿️',
    happy: '🐿️✨',
    thinking: '🐿️💭',
    celebrate: '🐿️🎉',
  };

  return (
    <div className={`relative flex items-center gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-blue-950/80 to-slate-900/90 border border-amber-500/30 backdrop-blur-sm shadow-md ${className}`}>
      {/* Mascot Avatar with animation */}
      <button
        onClick={nextQuote}
        title="Bấm vào Bé Sóc Nutty để nhận lời khuyên truyền cảm hứng!"
        className="relative group flex-shrink-0"
      >
        <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-3xl shadow-lg shadow-orange-500/25 border-2 border-amber-200 group-hover:scale-110 active:scale-95 transition-transform animate-mascot">
          {moodEmojis[mood] || '🐿️'}
        </div>
        <div className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-full border border-white flex items-center gap-0.5">
          <span>🌰 Nutty</span>
        </div>
      </button>

      {/* Speech Bubble */}
      <div className="flex-1">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
            <MessageCircleHeart className="w-3.5 h-3.5 text-amber-400" />
            Bé Sóc Nutty đồng hành:
          </span>
          <span className="text-[10px] text-slate-400">(chạm sóc để đổi lời khuyên)</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-200 italic font-medium leading-relaxed">
          "{currentText}"
        </p>
      </div>
    </div>
  );
};
