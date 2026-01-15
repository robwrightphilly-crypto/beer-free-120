
export interface DayLog {
  date: string; // ISO format YYYY-MM-DD
  isNoBeerDay: boolean;
  note?: string;
}

export interface UserStats {
  completedDays: number;
  totalGoal: number;
  streak: number;
  percentage: number;
  monthlyBreakdown: Record<string, number>;
}

export enum ViewMode {
  DASHBOARD = 'DASHBOARD',
  CALENDAR = 'CALENDAR',
  ANALYTICS = 'ANALYTICS',
  COACH = 'COACH'
}
