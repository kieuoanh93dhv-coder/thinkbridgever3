import React, { useState } from 'react';
import { StudentProfile, RiskLevel } from '../types';
import {
  ShieldAlert,
  Filter,
  Search,
  CheckCircle2,
  AlertTriangle,
  Flame,
  FileEdit,
  Save,
  Clock,
  BookOpen,
  UserCheck,
  TrendingUp,
  X,
  Sparkles,
} from 'lucide-react';
import { playPopChime } from '../utils/sound';

interface TeacherDashboardTabProps {
  students: StudentProfile[];
  onUpdateInterventionNote: (studentId: string, note: string) => void;
  teacherInfo: any;
}

export const TeacherDashboardTab: React.FC<TeacherDashboardTabProps> = ({
  students,
  onUpdateInterventionNote,
  teacherInfo,
}) => {
  const [timeRange, setTimeRange] = useState<'today' | '7days' | 'month'>('7days');
  const [riskFilter, setRiskFilter] = useState<'all' | RiskLevel>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);
  const [noteText, setNoteText] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Filter students
  const filteredStudents = students.filter((st) => {
    const matchesRisk = riskFilter === 'all' || st.riskLevel === riskFilter;
    const matchesSearch = st.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.recentExercise.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRisk && matchesSearch;
  });

  // Calculate dynamic stats based on time filter
  const timeMultiplier = timeRange === 'today' ? 0.3 : timeRange === '7days' ? 1 : 3.5;
  const redCount = students.filter((s) => s.riskLevel === 'red').length;
  const yellowCount = students.filter((s) => s.riskLevel === 'yellow').length;
  const greenCount = students.filter((s) => s.riskLevel === 'green').length;
  const avgSelfAttempt = Math.round(
    students.reduce((acc, s) => acc + s.selfAttemptRate, 0) / students.length
  );

  const handleOpenDetail = (st: StudentProfile) => {
    setSelectedStudent(st);
    setNoteText(st.interventionNote || '');
    setSaveSuccess(false);
    playPopChime();
  };

  const handleSaveNote = () => {
    if (!selectedStudent) return;
    onUpdateInterventionNote(selectedStudent.id, noteText);
    setSaveSuccess(true);
    playPopChime();
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const quickNotes = [
    'Cần kèm riêng dạng giải bài toán bằng cách lập phương trình vào tiết phụ đạo.',
    'Hẹn em gặp trao đổi 5 phút giờ ra chơi để hướng dẫn cách đọc gợi ý bước 1.',
    'Đã khen ngợi trước lớp vì tiến bộ tự thử 3 bài liên tục trong tuần.',
    'Nhắc nhở nhẹ nhàng phụ huynh hỗ trợ giám sát thói quen tự giải bài ở nhà.',
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Teacher Dashboard Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 border border-indigo-700/50 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider mb-1">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>Bảng Theo Dõi Học Tập &amp; Can Thiệp Sư Phạm</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Lớp 8A – Chủ nhiệm: {teacherInfo.name}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Giúp thầy cô phát hiện sớm thói quen phụ thuộc AI để kịp thời đồng hành cùng học sinh.
          </p>
        </div>

        {/* Time Filter Toggle */}
        <div className="flex items-center p-1 rounded-2xl bg-slate-900/90 border border-slate-700">
          <button
            onClick={() => {
              setTimeRange('today');
              playPopChime();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              timeRange === 'today'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Hôm nay
          </button>
          <button
            onClick={() => {
              setTimeRange('7days');
              playPopChime();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              timeRange === '7days'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            7 ngày qua
          </button>
          <button
            onClick={() => {
              setTimeRange('month');
              playPopChime();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              timeRange === 'month'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Tháng này
          </button>
        </div>
      </div>

      {/* Class Overview Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: Sĩ số */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-blue-900/40 shadow-lg">
          <div className="text-[11px] font-semibold text-slate-400 mb-1">Sĩ số theo dõi</div>
          <div className="text-2xl font-black text-white">{students.length} / 35 HS</div>
          <div className="text-[11px] text-blue-300 mt-1 flex items-center gap-1">
            <UserCheck className="w-3 h-3 text-blue-400" />
            <span>100% tài khoản hoạt động</span>
          </div>
        </div>

        {/* Card 2: Tỷ lệ tự thử */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-blue-900/40 shadow-lg">
          <div className="text-[11px] font-semibold text-slate-400 mb-1">Tỷ lệ tự thử trung bình</div>
          <div className="text-2xl font-black text-amber-300">{avgSelfAttempt}%</div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>Tăng 8% sau khi bật Cổng tự thử</span>
          </div>
        </div>

        {/* Card 3: Cần can thiệp */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-rose-900/40 shadow-lg">
          <div className="text-[11px] font-semibold text-slate-400 mb-1">Học sinh cần quan tâm</div>
          <div className="text-2xl font-black text-rose-400">
            {redCount} Đỏ <span className="text-sm font-semibold text-amber-400">&amp; {yellowCount} Vàng</span>
          </div>
          <div className="text-[11px] text-rose-300 mt-1">
            Hay xem đáp án vội &lt; 30 giây
          </div>
        </div>

        {/* Card 4: Tự giác cao */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-emerald-900/40 shadow-lg">
          <div className="text-[11px] font-semibold text-slate-400 mb-1">Tự giác cao (Xanh)</div>
          <div className="text-2xl font-black text-emerald-400">{greenCount} Học sinh</div>
          <div className="text-[11px] text-emerald-300 mt-1">
            Tự giải &gt;80% bài trước khi hỏi
          </div>
        </div>
      </div>

      {/* Filter Toolbar: Risk levels + Search */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Risk Filter Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-bold text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Lọc rủi ro:
          </span>

          <button
            onClick={() => setRiskFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              riskFilter === 'all'
                ? 'bg-slate-700 text-white'
                : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            Tất cả ({students.length})
          </button>

          <button
            onClick={() => setRiskFilter('red')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
              riskFilter === 'red'
                ? 'bg-rose-600 text-white'
                : 'bg-rose-950/50 border border-rose-800/60 text-rose-300 hover:bg-rose-900/60'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-400"></span>
            <span>🔴 Rủi ro cao ({redCount})</span>
          </button>

          <button
            onClick={() => setRiskFilter('yellow')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
              riskFilter === 'yellow'
                ? 'bg-amber-600 text-white'
                : 'bg-amber-950/50 border border-amber-800/60 text-amber-300 hover:bg-amber-900/60'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span>🟡 Cần nhắc ({yellowCount})</span>
          </button>

          <button
            onClick={() => setRiskFilter('green')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
              riskFilter === 'green'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-950/50 border border-emerald-800/60 text-emerald-300 hover:bg-emerald-900/60'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>🟢 Tự giác ({greenCount})</span>
          </button>
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm tên hoặc bài tập..."
            className="w-full bg-slate-950 border border-slate-700 rounded-xl py-1.5 pl-9 pr-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-400"
          />
        </div>
      </div>

      {/* Students List Table */}
      <div className="bg-slate-900/90 border border-blue-900/40 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase text-[11px] font-bold">
                <th className="py-3.5 px-4">Học sinh</th>
                <th className="py-3.5 px-4">Mức độ rủi ro</th>
                <th className="py-3.5 px-4 text-center">Tỷ lệ tự thử</th>
                <th className="py-3.5 px-4 text-center">Lần xem vội</th>
                <th className="py-3.5 px-4">Bài tập gần nhất</th>
                <th className="py-3.5 px-4 text-center">Ghi chú can thiệp</th>
                <th className="py-3.5 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredStudents.map((st) => {
                const isRed = st.riskLevel === 'red';
                const isYellow = st.riskLevel === 'yellow';

                return (
                  <tr
                    key={st.id}
                    className={`transition-colors hover:bg-slate-800/40 ${
                      isRed ? 'bg-rose-950/15' : isYellow ? 'bg-amber-950/10' : ''
                    }`}
                  >
                    {/* Student Info */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{st.avatar}</span>
                        <div>
                          <div className="font-bold text-white">{st.name}</div>
                          <span className="text-[11px] text-slate-400">{st.grade}</span>
                        </div>
                      </div>
                    </td>

                    {/* Risk Badge */}
                    <td className="py-3.5 px-4">
                      {isRed ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">
                          <span>🔴 Báo động</span>
                        </span>
                      ) : isYellow ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          <span>🟡 Cần nhắc nhở</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          <span>🟢 Tự giác cao</span>
                        </span>
                      )}
                    </td>

                    {/* Self-attempt rate */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="font-extrabold text-sm text-slate-200">
                        {st.selfAttemptRate}%
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {st.stepsSubmittedWeekly} bước/tuần
                      </span>
                    </td>

                    {/* Solution Rush Count */}
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`font-black text-xs px-2 py-0.5 rounded-lg ${
                          st.solutionRushCount > 4
                            ? 'bg-rose-900/60 text-rose-300 border border-rose-700'
                            : st.solutionRushCount > 0
                            ? 'bg-amber-900/60 text-amber-300'
                            : 'bg-emerald-950 text-emerald-300'
                        }`}
                      >
                        {st.solutionRushCount} lần
                      </span>
                    </td>

                    {/* Recent Exercise */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="text-xs text-slate-300 line-clamp-1 italic">
                        "{st.recentExercise}"
                      </p>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" />
                        {st.lastActive}
                      </span>
                    </td>

                    {/* Intervention Status */}
                    <td className="py-3.5 px-4 text-center">
                      {st.interventionNote ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-300 font-medium bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-lg">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>Đã có ghi chú</span>
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-500 italic">Chưa ghi chú</span>
                      )}
                    </td>

                    {/* Action Button */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleOpenDetail(st)}
                        className="py-1.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition cursor-pointer flex items-center gap-1 ml-auto"
                      >
                        <FileEdit className="w-3.5 h-3.5" />
                        <span>Can thiệp</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal / Drawer for Student Intervention Detail */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-slate-900 border-2 border-indigo-500/50 rounded-3xl shadow-2xl p-6 text-white overflow-hidden max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setSelectedStudent(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-full hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-start gap-4 mb-5 pb-4 border-b border-slate-800">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-3xl flex-shrink-0 shadow-inner">
                {selectedStudent.avatar}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-white">{selectedStudent.name}</h3>
                  <span className="text-xs text-slate-400">({selectedStudent.grade})</span>
                </div>
                <div className="flex items-center gap-3 mt-1.5 text-xs">
                  <span>
                    Tỷ lệ tự thử:{' '}
                    <strong className="text-amber-300">{selectedStudent.selfAttemptRate}%</strong>
                  </span>
                  <span>•</span>
                  <span>
                    Hạt dẻ tích lũy:{' '}
                    <strong className="text-orange-400">{selectedStudent.chestnuts} 🌰</strong>
                  </span>
                  <span>•</span>
                  <span>
                    Hoạt động:{' '}
                    <span className="text-slate-300">{selectedStudent.lastActive}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Assessment Box */}
            <div
              className={`p-4 rounded-2xl mb-4 border ${
                selectedStudent.riskLevel === 'red'
                  ? 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                  : selectedStudent.riskLevel === 'yellow'
                  ? 'bg-amber-950/40 border-amber-500/40 text-amber-200'
                  : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-xs uppercase mb-1">
                <ShieldAlert className="w-4 h-4" />
                <span>
                  {selectedStudent.riskLevel === 'red'
                    ? 'Chẩn đoán: Nguy cơ phụ thuộc AI cao'
                    : selectedStudent.riskLevel === 'yellow'
                    ? 'Chẩn đoán: Cần khích lệ kiên trì hơn'
                    : 'Chẩn đoán: Thói quen tự học rất tốt'}
                </span>
              </div>
              <p className="text-xs leading-relaxed">
                {selectedStudent.riskLevel === 'red'
                  ? 'Học sinh có thói quen bấm "Xem lời giải" ngay trong vòng dưới 30 giây mà không đọc gợi ý bước 1. Cần can thiệp sư phạm để tạo thói quen đặt bút viết thử.'
                  : selectedStudent.riskLevel === 'yellow'
                  ? 'Học sinh có tự thử ở một số bài dễ, nhưng khi gặp bài toán thực tế hoặc hình học thường bấm mở đáp án sớm. Cần giao thêm gợi ý định hướng sơ đồ.'
                  : 'Học sinh luôn chủ động dùng nút "Gợi ý thêm" và đã gửi nhiều bước tự giải. Tiếp tục duy trì và khen thưởng để làm gương cho lớp!'}
              </p>
            </div>

            {/* Recent Exercise Detail */}
            <div className="mb-4 p-3.5 bg-slate-950/60 rounded-2xl border border-slate-800 text-xs">
              <span className="font-bold text-slate-400 block mb-1">Bài tập gần nhất của em:</span>
              <p className="text-slate-200 italic">"{selectedStudent.recentExercise}"</p>
            </div>

            {/* Teacher Intervention Note Editor */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-white flex items-center gap-1.5">
                  <FileEdit className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Ô ghi chú can thiệp sư phạm của giáo viên:</span>
                </label>
                {selectedStudent.interventionDate && (
                  <span className="text-[10px] text-slate-400">
                    Cập nhật lần cuối: {selectedStudent.interventionDate}
                  </span>
                )}
              </div>

              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Ví dụ: Đã nhắc nhở em vào giờ sinh hoạt; Cho thêm bài tập mẫu tương tự để em tự giải..."
                rows={3}
                className="w-full bg-slate-950 border border-slate-700 focus:border-indigo-400 rounded-xl p-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
              />

              {/* Quick suggestion notes */}
              <div>
                <span className="text-[11px] text-slate-400 block mb-1">
                  Chọn nhanh ghi chú mẫu:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {quickNotes.map((q, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setNoteText(q)}
                      className="text-left text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-indigo-200 transition"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {saveSuccess && (
              <div className="mb-4 p-2.5 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Đã lưu ghi chú can thiệp sư phạm thành công!</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-800">
              <button
                onClick={() => setSelectedStudent(null)}
                className="py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition cursor-pointer"
              >
                Đóng
              </button>
              <button
                onClick={handleSaveNote}
                className="py-2 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-lg shadow-indigo-600/20"
              >
                <Save className="w-4 h-4" />
                <span>Lưu ghi chú can thiệp</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
