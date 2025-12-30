import AsyncStorage from "@react-native-async-storage/async-storage";
import { User, UserInfo, UserTask} from "../pages/types/userTypes";
import {ThemeName} from "../theme/theme";

export const loadUsers = async (): Promise<User[]> => {
  try {
    const json = await AsyncStorage.getItem("users");
    return json ? JSON.parse(json) : [];
  } catch (err) {
    console.log("loadUsers error:", err);
    return [];
  }
};
export const saveUsers = async (users: User[]) => {
  try {
    await AsyncStorage.setItem("users", JSON.stringify(users));
  } catch (err) {
    console.log("saveUsers error:", err);
  }
};
export const setActiveUser = async (username: string) => {
  try {
    await AsyncStorage.setItem("activeUser", username);
  } catch (err) {
    console.log("setActiveUser error:", err);
  }
};

export const getActiveUser = async (): Promise<User | null> => {
  try {
    const username = await AsyncStorage.getItem("activeUser");
    if (!username) return null;

    const users = await loadUsers();
    return users.find((u) => u.username === username) || null;
  } catch (err) {
    console.log("getActiveUser error:", err);
    return null;
  }
};
export const addUser = async (newUser: User): Promise<boolean> => {
  const users = await loadUsers();

  if (users.some((u) => u.username === newUser.username)) {
    return false;
  }
  users.push(newUser);
  await saveUsers(users);
  return true;
};
export const deleteUser = async (username: string) => {
  const users = await loadUsers();
  const filtered = users.filter((u) => u.username !== username);
  await saveUsers(filtered);
  try {
    const keys = await AsyncStorage.getAllKeys();
    const userKeys = keys.filter(key => key.startsWith(username + "_"));
    await AsyncStorage.multiRemove(userKeys);
  } catch (error) {
    console.log("Ma'lumotlarni o'chirish xatosi:", error);
  }
};
export const updateUserInfo = async (username: string, newInfo: Partial<UserInfo>) => {
  const users = await loadUsers();
  const idx = users.findIndex((u) => u.username === username);
  if (idx === -1) return;

  users[idx].userinfo = {
    ...users[idx].userinfo,
    ...newInfo,
  };

  await saveUsers(users);
};

export const addTask = async (username: string, task: UserTask) => {
  const users = await loadUsers();
  const idx = users.findIndex((u) => u.username === username);
  if (idx === -1) return;
  users[idx].usertasks.push({
      ...task,
      alarmDate: task.alarmDate ?? null,
      notificationId: task.notificationId ?? null,
  });
  await saveUsers(users);
};
export const updateTask = async (username: string, taskId: string, updated: Partial<UserTask>) => {
  const users = await loadUsers();
  const idx = users.findIndex((u) => u.username === username);
  if (idx === -1) return;
  users[idx].usertasks = users[idx].usertasks.map((t) =>
    t.id === taskId ? { ...t, ...updated } : t
  );
  await saveUsers(users);
};
export const softDeleteTask = async (username: string, taskId: string) => {
  await updateTask(username, taskId, { isDeleted: true });
};
export const deleteTask = async (username: string, taskId: string) => {
  const users = await loadUsers();
  const idx = users.findIndex((u) => u.username === username);
  if (idx === -1) return;
  users[idx].usertasks = users[idx].usertasks.filter((t) => t.id !== taskId);
  await saveUsers(users);
};
export const updateUserTasks = async (username: string, newTasks: UserTask[]) => {
  const users = await loadUsers();
  const idx = users.findIndex((u) => u.username === username);
  if (idx === -1) return;

  users[idx].usertasks = newTasks;
  await saveUsers(users);
};


const THEME_KEY = "appTheme";
export const loadTheme = async (): Promise<ThemeName | null> => {
  try {
    const theme = await AsyncStorage.getItem(THEME_KEY);
    return theme as ThemeName | null;
  } catch (e) {
    console.log("loadTheme error:", e);
    return null;
  }
};
export const saveTheme = async (theme: ThemeName) => {
  try {
    await AsyncStorage.setItem(THEME_KEY, theme);
  } catch (e) {
    console.log("saveTheme error:", e);
  }
};
