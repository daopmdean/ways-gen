import type { CalendarCell, CheckInEntry, MonthlyStats } from '../types/checkin.ts';

export const WEEKDAY_LABELS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'] as const;

export function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

export function toDateStr(year: number, month: number, day: number): string {
  return `${year}-${pad2(month)}-${pad2(day)}`;
}

export function formatDisplayDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-');
  if (!year || !month || !day) return dateStr;
  return `${day}/${month}/${year}`;
}

export function formatMonthYear(month: number, year: number): string {
  return `${pad2(month)}/${year}`;
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

export function sortCheckInEntriesDesc(entries: CheckInEntry[]): CheckInEntry[] {
  return [...entries].sort((a, b) => {
    const dateCompare = b.date.localeCompare(a.date);
    if (dateCompare !== 0) return dateCompare;
    return b.time.localeCompare(a.time);
  });
}

export function sortCheckInEntriesAsc(entries: CheckInEntry[]): CheckInEntry[] {
  return [...entries].sort((a, b) => {
    const dateCompare = a.date.localeCompare(b.date);
    if (dateCompare !== 0) return dateCompare;
    return a.time.localeCompare(b.time);
  });
}

export function calculateMonthlyStats(
  year: number,
  month: number,
  allEntries: CheckInEntry[],
  referenceNow: Date = new Date()
): MonthlyStats {
  const daysInMonth = getDaysInMonth(year, month);
  const monthPrefix = `${year}-${pad2(month)}-`;

  const monthEntries = allEntries.filter((entry) => entry.date.startsWith(monthPrefix));
  const trainedDaysSet = new Set<number>();

  for (const entry of monthEntries) {
    const dayNum = Number(entry.date.split('-')[2]);
    if (dayNum >= 1 && dayNum <= daysInMonth) {
      trainedDaysSet.add(dayNum);
    }
  }

  const nowYear = referenceNow.getFullYear();
  const nowMonth = referenceNow.getMonth() + 1;
  const nowDay = referenceNow.getDate();

  const isPastMonth = year < nowYear || (year === nowYear && month < nowMonth);
  const isCurrentMonth = year === nowYear && month === nowMonth;

  const maxTrainedDay = trainedDaysSet.size > 0 ? Math.max(...trainedDaysSet) : 0;

  let elapsedCutoffDay = 0;
  let highlightedTodayDay: number | null = null;

  if (isPastMonth) {
    elapsedCutoffDay = daysInMonth;
    highlightedTodayDay = null;
  } else if (isCurrentMonth) {
    if (maxTrainedDay > nowDay) {
      elapsedCutoffDay = maxTrainedDay;
      highlightedTodayDay = maxTrainedDay < daysInMonth ? maxTrainedDay : null;
    } else {
      elapsedCutoffDay = nowDay;
      highlightedTodayDay = nowDay;
    }
  } else {
    // Future month: if user added check-ins, count full month so summary stats match a completed month preview
    elapsedCutoffDay = trainedDaysSet.size > 0 ? daysInMonth : 0;
    highlightedTodayDay = null;
  }

  let untrainedCount = 0;
  for (let d = 1; d <= elapsedCutoffDay; d++) {
    if (!trainedDaysSet.has(d)) {
      untrainedCount++;
    }
  }

  const trainedCount = trainedDaysSet.size;

  // Build Monday-first (T2..CN) calendar grid
  const firstDayJs = new Date(year, month - 1, 1).getDay(); // 0=Sun..6=Sat
  const leadingCount = (firstDayJs + 6) % 7; // 0=Mon..6=Sun

  const prevMonthYear = month === 1 ? year - 1 : year;
  const prevMonth = month === 1 ? 12 : month - 1;
  const prevMonthDays = getDaysInMonth(prevMonthYear, prevMonth);

  const cells: CalendarCell[] = [];

  for (let i = leadingCount - 1; i >= 0; i--) {
    const day = prevMonthDays - i;
    cells.push({
      day,
      dateStr: toDateStr(prevMonthYear, prevMonth, day),
      isCurrentMonth: false,
      isTrained: false,
      isToday: false,
    });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({
      day: d,
      dateStr: toDateStr(year, month, d),
      isCurrentMonth: true,
      isTrained: trainedDaysSet.has(d),
      isToday: highlightedTodayDay === d,
    });
  }

  const nextMonthYear = month === 12 ? year + 1 : year;
  const nextMonth = month === 12 ? 1 : month + 1;
  const trailingCount = (7 - (cells.length % 7)) % 7;

  for (let d = 1; d <= trailingCount; d++) {
    cells.push({
      day: d,
      dateStr: toDateStr(nextMonthYear, nextMonth, d),
      isCurrentMonth: false,
      isTrained: false,
      isToday: false,
    });
  }

  // History list shows entries for the displayed month sorted newest-first
  const sortedLogs = sortCheckInEntriesDesc(monthEntries);

  return {
    trainedCount,
    untrainedCount,
    cells,
    monthLogs: sortedLogs,
  };
}
