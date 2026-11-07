import React, { useState, useEffect } from 'react';
import { UserRole, StudentProfile, StoreItem, WeeklyGoal } from './types';
import {
  INITIAL_STUDENT,
  INITIAL_TEACHER,
  INITIAL_STUDENTS_LIST,
  INITIAL_WEEKLY_GOAL,
  INITIAL_STORE_ITEMS,
} from './data/mockData';
import { Header } from './components/Header';
import { HomeIntroTab } from './components/HomeIntroTab';
import { AiChatTab } from './components/AiChatTab';
import { JournalTab } from './components/JournalTab';
import { LeaderboardAndStoreTab } from './components/LeaderboardAndStoreTab';
import { TeacherDashboardTab } from './components/TeacherDashboardTab';
import { RoleLoginModal } from './components/RoleLoginModal';
import { playPopChime } from './utils/sound';

export default function App() {
  // Load state from localStorage or defaults
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    return (localStorage.getItem('tb_role') as UserRole) || 'student';
  });

  const [activeTab, setActiveTab] = useState<string>(() => {
    const savedRole = localStorage.getItem('tb_role') as UserRole;
    return savedRole === 'teacher' ? 'dashboard' : 'home';
  });

  const [student, setStudent] = useState<StudentProfile>(() => {
    const saved = localStorage.getItem('tb_student');
    return saved ? JSON.parse(saved) : INITIAL_STUDENT;
  });

  const [studentsList, setStudentsList] = useState<StudentProfile[]>(() => {
    const saved = localStorage.getItem('tb_students_list');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS_LIST;
  });

  const [weeklyGoal, setWeeklyGoal] = useState<WeeklyGoal>(() => {
    const saved = localStorage.getItem('tb_goal');
    return saved ? JSON.parse(saved) : INITIAL_WEEKLY_GOAL;
  });

  const [storeItems, setStoreItems] = useState<StoreItem[]>(() => {
    const saved = localStorage.getItem('tb_store_items');
    return saved ? JSON.parse(saved) : INITIAL_STORE_ITEMS;
  });

  const [claimedItems, setClaimedItems] = useState<StoreItem[]>(() => {
    const saved = localStorage.getItem('tb_claimed_items');
    if (saved) return JSON.parse(saved);
    return INITIAL_STORE_ITEMS.filter((i) => i.claimed);
  });

  const [recentAttempts, setRecentAttempts] = useState<
    Array<{ id: string; title: string; stepText: string; time: string; reward: number }>
  >(() => {
    const saved = localStorage.getItem('tb_recent_attempts');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'att-1',
            title: 'Giải bài toán bằng cách lập phương trình: Hai ô tô chuyển động',
            stepText: 'Em đã gọi x là quãng đường AB (x > 0) và lập tỉ số thời gian x/40 - x/50 = 1/2',
            time: '15 phút trước',
            reward: 15,
          },
          {
            id: 'att-2',
            title: 'Chứng minh hình chữ nhật trong tam giác vuông',
            stepText: 'Em nhận thấy hai đường chéo AD và BC cắt nhau tại trung điểm M và góc BAC vuông',
            time: 'Hôm qua',
            reward: 15,
          },
        ];
  });

  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('tb_role', currentRole);
  }, [currentRole]);

  useEffect(() => {
    localStorage.setItem('tb_student', JSON.stringify(student));
  }, [student]);

  useEffect(() => {
    localStorage.setItem('tb_students_list', JSON.stringify(studentsList));
  }, [studentsList]);

  useEffect(() => {
    localStorage.setItem('tb_goal', JSON.stringify(weeklyGoal));
  }, [weeklyGoal]);

  useEffect(() => {
    localStorage.setItem('tb_claimed_items', JSON.stringify(claimedItems));
  }, [claimedItems]);

  useEffect(() => {
    localStorage.setItem('tb_recent_attempts', JSON.stringify(recentAttempts));
  }, [recentAttempts]);

  // Switch Role
  const handleSwitchRole = (role: UserRole) => {
    setCurrentRole(role);
    if (role === 'teacher') {
      setActiveTab('dashboard');
    } else {
      setActiveTab('home');
    }
  };

  // Earn chestnuts & effort
  const handleEarnChestnuts = (amount: number, reason: string) => {
    setStudent((prev) => {
      const updatedChestnuts = prev.chestnuts + amount;
      const updatedEffort = prev.effortPoints + amount * 10;
      let newRank = prev.rank;
      if (updatedEffort >= 1400) newRank = 'platinum';
      else if (updatedEffort >= 900) newRank = 'gold';
      else if (updatedEffort >= 500) newRank = 'silver';

      return {
        ...prev,
        chestnuts: updatedChestnuts,
        effortPoints: updatedEffort,
        rank: newRank,
        stepsSubmittedWeekly: prev.stepsSubmittedWeekly + 1,
        selfAttemptRate: Math.min(99, prev.selfAttemptRate + 2),
      };
    });

    // Update students list as well
    setStudentsList((prev) =>
      prev.map((s) => (s.id === student.id ? { ...s, chestnuts: s.chestnuts + amount } : s))
    );
  };

  // Record a self-attempt
  const handleRecordStepAttempt = (stepText: string) => {
    const newAttempt = {
      id: `att-${Date.now()}`,
      title: 'Bài tập vừa giải cùng AI Gia sư',
      stepText,
      time: 'Vừa xong',
      reward: 15,
    };
    setRecentAttempts((prev) => [newAttempt, ...prev]);

    // Increment weekly goal
    setWeeklyGoal((prev) => ({
      ...prev,
      current: Math.min(prev.target, prev.current + 1),
    }));
  };

  // Redeem item from store
  const handleRedeemItem = (item: StoreItem) => {
    if (student.chestnuts < item.cost) return;

    setStudent((prev) => ({
      ...prev,
      chestnuts: prev.chestnuts - item.cost,
    }));

    setClaimedItems((prev) => [...prev, item]);
  };

  // Update teacher intervention note
  const handleUpdateInterventionNote = (studentId: string, note: string) => {
    const nowStr = new Date().toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    setStudentsList((prev) =>
      prev.map((s) =>
        s.id === studentId
          ? {
              ...s,
              interventionNote: note,
              interventionDate: nowStr,
              riskLevel: s.riskLevel === 'red' ? 'yellow' : s.riskLevel,
            }
          : s
      )
    );

    if (student.id === studentId) {
      setStudent((prev) => ({
        ...prev,
        interventionNote: note,
        interventionDate: nowStr,
      }));
    }
  };

  return (
    <div className="min-h-screen bg-[#0b192c] text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950 font-sans">
      {/* Header Navigation with Slogan and Role Switcher */}
      <Header
        currentRole={currentRole}
        onSwitchRole={handleSwitchRole}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        student={student}
        teacher={INITIAL_TEACHER}
        onOpenRoleModal={() => setIsRoleModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
        {activeTab === 'home' && (
          <HomeIntroTab
            onStartChat={() => {
              setActiveTab('chat');
              playPopChime();
            }}
            onOpenJournal={() => {
              setActiveTab('journal');
              playPopChime();
            }}
            onOpenStore={() => {
              setActiveTab('store');
              playPopChime();
            }}
            onOpenTeacherDashboard={() => {
              setCurrentRole('teacher');
              setActiveTab('dashboard');
              playPopChime();
            }}
            currentRole={currentRole}
          />
        )}

        {activeTab === 'chat' && (
          <AiChatTab
            onEarnChestnuts={handleEarnChestnuts}
            onRecordStepAttempt={handleRecordStepAttempt}
            currentChestnuts={student.chestnuts}
          />
        )}

        {activeTab === 'journal' && (
          <JournalTab
            student={student}
            weeklyGoal={weeklyGoal}
            recentAttempts={recentAttempts}
          />
        )}

        {activeTab === 'store' && (
          <LeaderboardAndStoreTab
            student={student}
            studentsList={studentsList}
            storeItems={storeItems}
            onRedeemItem={handleRedeemItem}
            claimedItems={claimedItems}
          />
        )}

        {activeTab === 'dashboard' && (
          <TeacherDashboardTab
            students={studentsList}
            onUpdateInterventionNote={handleUpdateInterventionNote}
            teacherInfo={INITIAL_TEACHER}
          />
        )}
      </main>

      {/* Role Switcher Modal */}
      <RoleLoginModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        currentRole={currentRole}
        onSelectRole={handleSwitchRole}
        studentName={student.name}
        teacherName={INITIAL_TEACHER.name}
      />

      {/* Footer */}
      <footer className="bg-slate-950/90 border-t border-blue-900/40 py-6 px-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-base">🌰</span>
            <span className="font-bold text-slate-200">ThinkBridge Việt Nam</span>
            <span>– Cầu nối rèn luyện tư duy độc lập</span>
          </div>

          <p className="text-amber-300 font-medium">
            "Hỏi AI thông minh – Tự nghĩ trước khi xem đáp án"
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsRoleModalOpen(true)}
              className="text-slate-300 hover:text-amber-300 underline font-semibold transition"
            >
              Chuyển vai Demo ({currentRole === 'student' ? 'Học sinh' : 'Giáo viên'})
            </button>
            <span>•</span>
            <span className="text-slate-500">Bản demo tương tác</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
