import AsyncStorage from "@react-native-async-storage/async-storage";
import { User, UserInfo, UserTask } from "../pages/types/userTypes";

/* ---------------------------------------- */
/* LOAD ALL USERS                           */
/* ---------------------------------------- */

export const loadUsers = async (): Promise<User[]> => {
  try {
    const json = await AsyncStorage.getItem("users");
    return json ? JSON.parse(json) : [];
  } catch (err) {
    console.log("loadUsers error:", err);
    return [];
  }
};

/* ---------------------------------------- */
/* SAVE ALL USERS                           */
/* ---------------------------------------- */

export const saveUsers = async (users: User[]) => {
  try {
    await AsyncStorage.setItem("users", JSON.stringify(users));
  } catch (err) {
    console.log("saveUsers error:", err);
  }
};

/* ---------------------------------------- */
/* SET ACTIVE USER                          */
/* ---------------------------------------- */

export const setActiveUser = async (username: string) => {
  try {
    await AsyncStorage.setItem("activeUser", username);
  } catch (err) {
    console.log("setActiveUser error:", err);
  }
};

/* ---------------------------------------- */
/* GET ACTIVE USER                          */
/* ---------------------------------------- */

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

/* ---------------------------------------- */
/* ADD NEW USER                             */
/* ---------------------------------------- */

export const addUser = async (newUser: User): Promise<boolean> => {
  const users = await loadUsers();

  // User oldin mavjudmi?
  if (users.some((u) => u.username === newUser.username)) {
    return false;
  }

  users.push(newUser);
  await saveUsers(users);
  return true;
};

/* ---------------------------------------- */
/* DELETE USER                              */
/* ---------------------------------------- */

export const deleteUser = async (username: string) => {
  const users = await loadUsers();
  const filtered = users.filter((u) => u.username !== username);
  await saveUsers(filtered);
};

/* ---------------------------------------- */
/* UPDATE USER INFO                         */
/* ---------------------------------------- */

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

/* ---------------------------------------- */
/* ADD TASK                                 */
/* ---------------------------------------- */

export const addTask = async (username: string, task: UserTask) => {
  const users = await loadUsers();
  const idx = users.findIndex((u) => u.username === username);
  if (idx === -1) return;

  users[idx].usertasks.push(task);
  await saveUsers(users);
};

/* ---------------------------------------- */
/* UPDATE TASK                              */
/* ---------------------------------------- */

export const updateTask = async (
  username: string,
  taskId: string,
  updated: Partial<UserTask>
) => {
  const users = await loadUsers();
  const idx = users.findIndex((u) => u.username === username);
  if (idx === -1) return;

  users[idx].usertasks = users[idx].usertasks.map((t) =>
    t.id === taskId ? { ...t, ...updated } : t
  );

  await saveUsers(users);
};

/* ---------------------------------------- */
/* SOFT DELETE TASK (isDeleted=true)        */
/* ---------------------------------------- */

export const softDeleteTask = async (username: string, taskId: string) => {
  await updateTask(username, taskId, { isDeleted: true });
};

/* ---------------------------------------- */
/* DELETE TASK COMPLETELY                   */
/* ---------------------------------------- */

export const deleteTask = async (username: string, taskId: string) => {
  const users = await loadUsers();
  const idx = users.findIndex((u) => u.username === username);
  if (idx === -1) return;

  users[idx].usertasks = users[idx].usertasks.filter((t) => t.id !== taskId);

  await saveUsers(users);
};

/* ---------------------------------------- */
/* REPLACE ALL TASKS (bulk update)          */
/* ---------------------------------------- */

export const updateUserTasks = async (
  username: string,
  newTasks: UserTask[]
) => {
  const users = await loadUsers();
  const idx = users.findIndex((u) => u.username === username);
  if (idx === -1) return;

  users[idx].usertasks = newTasks;
  await saveUsers(users);
};
