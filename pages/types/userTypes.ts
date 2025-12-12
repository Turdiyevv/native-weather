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
  isReturning?: number;
}

export interface UserInfo {
  firstName: string;
  lastName: string;
  avatar: string;
  phone: string;
  job: string;
  description: string;
}

export interface User {
  username: string;
  password: string;
  passwordCode: string;
  userinfo: UserInfo;
  usertasks: UserTask[];
}
