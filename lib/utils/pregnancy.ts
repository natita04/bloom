import { differenceInDays, addDays, format, parseISO } from 'date-fns';

export function getPregnancyWeek(dueDate: string): number {
  const due = parseISO(dueDate);
  const conception = addDays(due, -280); // 40 weeks before due date
  const today = new Date();
  const daysPregnant = differenceInDays(today, conception);
  const week = Math.floor(daysPregnant / 7) + 1;
  return Math.max(1, Math.min(42, week));
}

export function getDaysIntoWeek(dueDate: string): number {
  const due = parseISO(dueDate);
  const conception = addDays(due, -280);
  const today = new Date();
  const daysPregnant = differenceInDays(today, conception);
  return daysPregnant % 7;
}

export function getTrimester(week: number): 1 | 2 | 3 {
  if (week <= 13) return 1;
  if (week <= 26) return 2;
  return 3;
}

export function getDaysUntilDue(dueDate: string): number {
  const due = parseISO(dueDate);
  const today = new Date();
  return Math.max(0, differenceInDays(due, today));
}

export function getWeeksUntilDue(dueDate: string): number {
  return Math.floor(getDaysUntilDue(dueDate) / 7);
}

export function formatDueDate(dueDate: string): string {
  return format(parseISO(dueDate), 'MMMM d, yyyy');
}

export function getProgressPercent(week: number): number {
  return Math.min(100, Math.round((week / 40) * 100));
}

export function trimesterLabel(trimester: 1 | 2 | 3): string {
  return `Trimester ${trimester}`;
}

export function trimesterWeekRange(trimester: 1 | 2 | 3): string {
  if (trimester === 1) return 'Weeks 1–13';
  if (trimester === 2) return 'Weeks 14–26';
  return 'Weeks 27–40';
}
