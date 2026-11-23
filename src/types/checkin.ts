export interface CheckInEntry {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm (24h)
  location: string;
}

export interface GeneratorConfig {
  month: number; // 1-12
  year: number;
  defaultLocation: string;
  notificationCount: number;
  entries: CheckInEntry[];
}

export interface CalendarCell {
  day: number;
  dateStr: string; // YYYY-MM-DD
  isCurrentMonth: boolean;
  isTrained: boolean;
  isToday: boolean;
}

export interface MonthlyStats {
  trainedCount: number;
  untrainedCount: number;
  cells: CalendarCell[];
  monthLogs: CheckInEntry[];
}
