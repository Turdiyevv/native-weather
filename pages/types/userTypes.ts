export interface UserTask {
  id: string;
  title: string;
  description: string;
  done: boolean;
  deadline: string | null;
  time: string;
  status: number;
  isDeleted?: boolean;
  files: any[];
  alarmDate?: string | null;
  notificationId?: string;
  isReturning?: number;
  isReturningAt?: string | null;
}

export interface UserInfo {
  firstName?: string;
  lastName?: string;
  avatar?: string;
  phone?: string;
  job?: string;
  description?: string;
}

export interface BusinessEntry {
  id: string;
  title: string;
  status: boolean;
  total: number;
  date: string;
  time: string;
}
export interface BusinessItem {
  id: string;
  name: string;
  calendar: BusinessEntry[];
}

export type HabitStatus = 0 | 1 | 2;
export interface Habit {
  id: string;
  name: string;
  durationDays: number;
  notificationTime: string;
  status: HabitStatus;
  createdAt: string;
}
export interface User {
  username: string;
  password: string;
  passwordCode?: string;
  userinfo: UserInfo;
  usertasks: UserTask[];
  business?: BusinessItem[];
  habits?: Habit[];
}
export interface CustomHeaderProps {
  firstName?: string;
  username?: string;
  avatar?: string;
  onProfilePress?: () => void;
}