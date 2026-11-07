import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, SampleExercise } from '../types';
import { SAMPLE_EXERCISES } from '../data/mockData';
import { SelfAttemptModal } from './SelfAttemptModal';
import { Mascot } from './Mascot';
import {
  Send,
  Image as ImageIcon,
  Lightbulb,
  ArrowRight,
  Unlock,
  Sparkles,
  HelpCircle,
  RotateCcw,
  BookOpen,
  Camera,
  CheckCircle,
  Loader2,
  X,
  FileQuestion,
  ChevronRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playRewardChime, playPopChime } from '../utils/sound';

interface AiChatTabProps {
  onEarnChestnuts: (amount: number, reason: string) => void;
  onRecordStepAttempt: (stepText: string) => void;
  currentChestnuts: number;
}

export const AiChatTab: React.FC<AiChatTabProps> = ({
  onEarnChestnuts,
  onRecordStepAttempt,
  currentChestnuts,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-0',
      role: 'assistant',
      content: `👋 **Chào bạn học sinh chăm chỉ! Thầy/Cô gia sư ThinkBridge đây!**\n\nEm đang gặp khó khăn ở bài tập Toán, Lý, Hóa, Văn hay Tiếng Anh nào? Hãy gửi đề bài (hoặc tải ảnh bài tập lên) nhé.\n\n💡 *Thầy/Cô sẽ gợi ý cho em từng bước để em tự tìm ra đáp án và nhận thật nhiều **Hạt dẻ thông thái 🌰** nhé!*`,
      timestamp: 'Vừa xong',
      stepNumber: 0,
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [hasSelfAttempted, setHasSelfAttempted] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<SampleExercise | null>(null);
  const [showSelfAttemptModal, setShowSelfAttemptModal] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [recentCelebration, setRecentCelebration] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        playPopChime();
      };
      reader.readAsDataURL(file);
    }
  };

  // Select sample exercise
  const handleSelectSample = (ex: SampleExercise) => {
    setSelectedExercise(ex);
    setInputPrompt(ex.question);
    playPopChime();
  };

  // Send message to AI Tutor
  const sendMessage = async ({
    promptText,
    action = 'ask',
    attemptText = '',
  }: {
    promptText?: string;
    action?: 'ask' | 'hint_more' | 'next_step' | 'request_solution' | 'submit_attempt';
    attemptText?: string;
  }) => {
    const textToSend = promptText !== undefined ? promptText : inputPrompt;
    if (!textToSend.trim() && !uploadedImage && action === 'ask') return;

    let userMessageContent = textToSend;
    if (action === 'hint_more') {
      userMessageContent = '💡 Em muốn xin thêm gợi ý cho bước này ạ!';
    } else if (action === 'next_step') {
      userMessageContent = '⏩ Em đã hiểu bước này rồi, xin thầy/cô hướng dẫn bước tiếp theo!';
    } else if (action === 'request_solution') {
      userMessageContent = '🔓 Em muốn xem bài giải chi tiết ạ!';
    } else if (action === 'submit_attempt') {
      userMessageContent = `✍️ [BƯỚC TỰ THỬ CỦA EM]: ${attemptText}`;
    }

    const newMsgId = `m-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: newMsgId,
      role: 'user',
      content: userMessageContent,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      image: action === 'ask' && uploadedImage ? uploadedImage : undefined,
      isSelfAttempt: action === 'submit_attempt',
    };

    setMessages((prev) => [...prev, userMsg]);
    if (action === 'ask') {
      setInputPrompt('');
      setUploadedImage(null);
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/tutor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend || messages.find((m) => m.role === 'user')?.content || 'Bài toán',
          action,
          stepNumber: currentStep,
          studentAttempt: attemptText,
          imageData: uploadedImage,
          conversationHistory: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await response.json();
      const replyText = data.reply || 'Thầy/Cô đang phân tích thêm, em hãy thử xem lại bước vừa rồi nhé!';
      const awardedChestnuts = data.awardedChestnuts || (action === 'submit_attempt' ? 15 : 5);

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: replyText,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        stepNumber: action === 'next_step' ? currentStep + 1 : currentStep,
        awardedChestnuts: action === 'submit_attempt' ? awardedChestnuts : undefined,
      };

      setMessages((prev) => [...prev, botMsg]);

      if (action === 'next_step') {
        setCurrentStep((prev) => prev + 1);
      }

      if (action === 'submit_attempt') {
        setHasSelfAttempted(true);
        onEarnChestnuts(awardedChestnuts, 'Tự thử trước khi xem lời giải');
        onRecordStepAttempt(attemptText);
        setRecentCelebration(`+${awardedChestnuts} Hạt dẻ thông thái! Bé Sóc rất tự hào về em!`);
      }
    } catch (err) {
      // In case server fails
      const fallbackBotMsg: ChatMessage = {
        id: `bot-fallback-${Date.now()}`,
        role: 'assistant',
        content: `✨ **Rất khen ngợi tinh thần học của em!**\n\nEm hãy quan sát kỹ các dữ kiện đã biết. Đặt bút viết thử 1 phép tính ra nháp nhé!`,
        timestamp: 'Vừa xong',
        stepNumber: currentStep,
      };
      setMessages((prev) => [...prev, fallbackBotMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // When user clicks "Xem lời giải" (Request Solution)
  const handleRequestSolution = () => {
    // If student hasn't self-attempted or is still at early step (< 3)
    if (!hasSelfAttempted && currentStep < 3) {
      setShowSelfAttemptModal(true);
      return;
    }
    // Otherwise unlock solution directly
    sendMessage({ action: 'request_solution' });
  };

  // When student submits their self-attempt from modal
  const handleModalSubmitAttempt = (attemptText: string) => {
    setShowSelfAttemptModal(false);
    sendMessage({ action: 'submit_attempt', attemptText });
    // After submitting attempt, also reveal the detailed solution seamlessly!
    setTimeout(() => {
      sendMessage({ action: 'request_solution', attemptText });
    }, 1200);
  };

  // Reset conversation
  const handleResetChat = () => {
    setMessages([
      {
        id: `m-init-${Date.now()}`,
        role: 'assistant',
        content: `👋 **Sẵn sàng cho bài tập mới!**\n\nEm hãy chọn một bài mẫu bên trên hoặc nhập đề bài của em vào đây nhé. Hãy nhớ: *Hỏi AI thông minh là rèn luyện cách nghĩ, không chép vẹt!*`,
        timestamp: 'Vừa xong',
        stepNumber: 0,
      },
    ]);
    setCurrentStep(1);
    setHasSelfAttempted(false);
    setSelectedExercise(null);
    setInputPrompt('');
    setUploadedImage(null);
    setRecentCelebration(null);
  };

  return (
    <div className="space-y-4">
      {/* Self Attempt Modal */}
      <SelfAttemptModal
        isOpen={showSelfAttemptModal}
        onClose={() => setShowSelfAttemptModal(false)}
        onSubmitAttempt={handleModalSubmitAttempt}
        onRequestHintInstead={() => sendMessage({ action: 'hint_more' })}
        exerciseTitle={selectedExercise?.title || inputPrompt}
      />

      {/* Top Helper Banner with Quick Exercises */}
      <div className="bg-slate-900/90 border border-blue-900/50 rounded-2xl p-3 sm:p-4 shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              Chọn nhanh đề bài mẫu để demo:
            </span>
          </div>
          <button
            onClick={handleResetChat}
            className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 transition"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Xóa làm bài mới</span>
          </button>
        </div>

        {/* Sample Exercise Chips */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {SAMPLE_EXERCISES.map((ex) => (
            <button
              key={ex.id}
              onClick={() => handleSelectSample(ex)}
              className={`text-left p-2.5 rounded-xl border transition text-xs flex flex-col justify-between ${
                selectedExercise?.id === ex.id
                  ? 'bg-blue-900/60 border-amber-400 text-amber-200 shadow-sm'
                  : 'bg-slate-800/60 border-slate-700/80 hover:bg-slate-800 text-slate-300'
              }`}
            >
              <div className="font-semibold text-slate-100 flex items-center justify-between gap-1 mb-1">
                <span className="truncate">{ex.subject}</span>
                <span className="text-[10px] px-1 rounded bg-slate-700 text-slate-300 font-normal">
                  {ex.grade}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-1 italic">{ex.title}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="bg-slate-900/95 border border-blue-900/50 rounded-3xl shadow-2xl flex flex-col h-[650px] overflow-hidden">
        {/* Chat Header Status */}
        <div className="px-4 py-3 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border-b border-blue-900/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-lg shadow-inner">
              🐿️
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>Gia sư AI ThinkBridge</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>
              <div className="text-[10px] text-amber-300/90">
                Phương pháp gợi mở • Không lộ đáp án vội
              </div>
            </div>
          </div>

          {/* Current Step Tracker Pill */}
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 rounded-full bg-blue-900/70 border border-blue-700 text-[11px] font-semibold text-blue-200 flex items-center gap-1.5">
              <span>Đang ở</span>
              <span className="text-amber-400 font-extrabold">Bước {currentStep}</span>
              {hasSelfAttempted && (
                <span className="ml-1 text-[10px] text-emerald-400 flex items-center gap-0.5">
                  <CheckCircle className="w-3 h-3" /> Đã tự thử
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Messages Stream Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-base flex-shrink-0 mt-1 shadow-md">
                    🌰
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? msg.isSelfAttempt
                        ? 'bg-gradient-to-r from-amber-900/80 to-orange-950 border-2 border-amber-500/60 text-amber-100 shadow-md'
                        : 'bg-blue-600 text-white rounded-br-sm shadow-md'
                      : 'bg-slate-800/90 border border-slate-700/80 text-slate-100 rounded-bl-sm shadow-md'
                  }`}
                >
                  {/* Step label if applicable */}
                  {msg.stepNumber !== undefined && msg.stepNumber > 0 && !isUser && (
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-900/80 border border-blue-700/60 text-blue-200 text-[10px] font-bold mb-2 uppercase tracking-wide">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>Bước tư duy #{msg.stepNumber}</span>
                    </div>
                  )}

                  {/* Self-attempt tag */}
                  {msg.isSelfAttempt && (
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black mb-2 uppercase">
                      <CheckCircle className="w-3 h-3" />
                      <span>Bước tự thử được công nhận (+15 🌰)</span>
                    </div>
                  )}

                  {/* Attached image if any */}
                  {msg.image && (
                    <div className="mb-2 rounded-xl overflow-hidden border border-white/20 max-h-48">
                      <img src={msg.image} alt="Bài tập tải lên" className="w-full h-auto object-cover" />
                    </div>
                  )}

                  {/* Formatted Text */}
                  <div className="whitespace-pre-wrap font-normal space-y-1.5">
                    {msg.content.split('\n').map((line, lIdx) => {
                      if (!line.trim()) return <div key={lIdx} className="h-1"></div>;
                      // Format bold tokens
                      const parts = line.split(/(\*\*.*?\*\*)/g);
                      return (
                        <p key={lIdx} className="leading-relaxed">
                          {parts.map((p, pIdx) => {
                            if (p.startsWith('**') && p.endsWith('**')) {
                              return (
                                <strong key={pIdx} className="font-bold text-amber-200">
                                  {p.slice(2, -2)}
                                </strong>
                              );
                            }
                            return p;
                          })}
                        </p>
                      );
                    })}
                  </div>

                  {/* Award badge */}
                  {msg.awardedChestnuts && (
                    <div className="mt-3 pt-2 border-t border-amber-500/30 flex items-center justify-between text-xs font-bold text-amber-300">
                      <span>🌰 Thưởng nỗ lực tự thử:</span>
                      <span className="bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/40">
                        +{msg.awardedChestnuts} Hạt dẻ
                      </span>
                    </div>
                  )}

                  <div
                    className={`text-[10px] mt-2 text-right ${
                      isUser ? 'text-blue-200/80' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-blue-700 flex items-center justify-center text-sm font-bold text-white flex-shrink-0 mt-1">
                    🐿️
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-base">
                🌰
              </div>
              <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-3.5 flex items-center gap-2.5 text-xs text-amber-300">
                <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                <span>Gia sư AI đang phân tích và chuẩn bị gợi ý bước tiếp theo...</span>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Celebration Banner if awarded */}
        {recentCelebration && (
          <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-600 text-slate-950 font-bold text-xs py-1.5 px-4 text-center flex items-center justify-center gap-2 shadow-inner">
            <span>🎉 {recentCelebration}</span>
            <button
              onClick={() => setRecentCelebration(null)}
              className="text-slate-900 hover:text-black font-extrabold ml-2"
            >
              ✕
            </button>
          </div>
        )}

        {/* 3 Core Action Buttons: Gợi ý thêm | Tiếp tục | Xem lời giải */}
        <div className="bg-slate-950/80 border-t border-blue-900/40 p-2.5 sm:px-4 flex items-center justify-between gap-2">
          {/* Button 1: Gợi ý thêm */}
          <button
            disabled={isLoading}
            onClick={() => sendMessage({ action: 'hint_more' })}
            className="flex-1 py-2 px-2.5 sm:px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-amber-500/30 text-amber-200 hover:text-amber-100 text-xs font-semibold flex items-center justify-center gap-1.5 transition active:scale-95 disabled:opacity-50 cursor-pointer"
            title="Nhận gợi ý sâu hơn cho bước hiện tại mà không lộ đáp án"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <span className="truncate">Gợi ý thêm</span>
          </button>

          {/* Button 2: Tiếp tục */}
          <button
            disabled={isLoading}
            onClick={() => sendMessage({ action: 'next_step' })}
            className="flex-1 py-2 px-2.5 sm:px-3 rounded-xl bg-blue-700 hover:bg-blue-600 border border-blue-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition active:scale-95 disabled:opacity-50 cursor-pointer"
            title="Đã hiểu bước này, chuyển sang bước tiếp theo"
          >
            <ArrowRight className="w-3.5 h-3.5 text-blue-200 flex-shrink-0" />
            <span className="truncate">Tiếp tục</span>
          </button>

          {/* Button 3: Xem lời giải (with Self-Attempt Gate) */}
          <button
            disabled={isLoading}
            onClick={handleRequestSolution}
            className="flex-1 py-2 px-2.5 sm:px-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95 disabled:opacity-50 cursor-pointer shadow-md"
            title="Mở toàn bộ lời giải chi tiết (Có cổng tự thử nếu chưa làm)"
          >
            <Unlock className="w-3.5 h-3.5 text-slate-950 flex-shrink-0" />
            <span className="truncate">Xem lời giải</span>
          </button>
        </div>

        {/* Input Box & Image Attachment */}
        <div className="p-3 sm:p-4 bg-slate-900 border-t border-slate-800">
          {uploadedImage && (
            <div className="mb-2 flex items-center gap-2 p-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-300">
              <img src={uploadedImage} alt="Preview" className="w-10 h-10 object-cover rounded-lg" />
              <div className="flex-1 truncate">
                <span className="font-semibold text-amber-300">Đã đính kèm ảnh bài tập</span>
                <p className="text-[11px] text-slate-400">AI sẽ phân tích đề bài từ ảnh này</p>
              </div>
              <button
                onClick={() => setUploadedImage(null)}
                className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="flex items-center gap-2">
            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />

            {/* Photo upload trigger */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-amber-400 transition flex items-center gap-1 text-xs"
              title="Tải ảnh đề bài tập (chụp từ sách/vở)"
            >
              <Camera className="w-4 h-4" />
              <span className="hidden sm:inline">Chụp/Ảnh</span>
            </button>

            {/* Prompt input field */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage({ action: 'ask' });
                  }
                }}
                placeholder="Nhập đề bài hoặc câu hỏi em đang thắc mắc..."
                className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 rounded-xl py-2.5 pl-3 pr-10 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition"
              />
            </div>

            {/* Submit button */}
            <button
              disabled={isLoading || (!inputPrompt.trim() && !uploadedImage)}
              onClick={() => sendMessage({ action: 'ask' })}
              className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer shadow-md shadow-orange-500/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
