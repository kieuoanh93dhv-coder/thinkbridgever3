export type UserRole = 'student' | 'teacher';

export type RiskLevel = 'green' | 'yellow' | 'red';

export interface StudentProfile {
  id: string;
  name: string;
  avatar: string;
  grade: string;
  chestnuts: number;
  effortPoints: number;
  rank: 'bronze' | 'silver' | 'gold' | 'platinum';
  selfAttemptRate: number; // Percentage e.g. 78%
  activeInitiativeRate: number; // e.g. 85%
  stepsSubmittedWeekly: number; // e.g. 24
  riskLevel: RiskLevel;
  lastActive: string;
  recentExercise: string;
  solutionRushCount: number; // Times clicked solution too early
  interventionNote?: string;
  interventionDate?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  stepNumber?: number;
  isSelfAttempt?: boolean;
  awardedChestnuts?: number;
  image?: string;
}

export interface WeeklyGoal {
  title: string;
  current: number;
  target: number;
  unit: string;
  encouragement: string;
}

export interface StoreItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  icon: string;
  category: 'sticker' | 'avatar' | 'perk' | 'stationery';
  claimed?: boolean;
}

export interface SampleExercise {
  id: string;
  subject: string;
  title: string;
  question: string;
  grade: string;
  sampleStepPrompt: string;
}
