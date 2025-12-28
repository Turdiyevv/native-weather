import {loadUsers, saveUsers} from "./storage";
import {Habit, HabitStatus} from "../pages/types/userTypes";
import {generateId} from "./business";

export const getHabits = async (
  username: string
): Promise<Habit[]> => {
  const users = await loadUsers();
  const user = users.find(u => u.username === username);
  if (!user) return [];
  return user.habits || [];
};
export const addHabit = async (
  username: string,
  habit: Omit<Habit, "id" | "status" | "createdAt">
) => {
  const users = await loadUsers();
  const userIndex = users.findIndex(u => u.username === username);
  if (userIndex === -1) return;
  const habits = users[userIndex].habits || [];
  const newHabit: Habit = {
    id: generateId(),
    name: habit.name,
    durationDays: habit.durationDays,
    notificationTime: habit.notificationTime,
    status: 0,
    createdAt: new Date().toISOString(),
  };
  habits.push(newHabit);
  users[userIndex].habits = habits;
  await saveUsers(users);
};
export const updateHabit = async (
  username: string,
  habitId: string,
  updated: Partial<Habit>
) => {
  const users = await loadUsers();
  const userIndex = users.findIndex(u => u.username === username);
  if (userIndex === -1) return;
  const habits = users[userIndex].habits || [];
  users[userIndex].habits = habits.map(h =>
    h.id === habitId ? { ...h, ...updated } : h
  );
  await saveUsers(users);
};
export const updateHabitStatus = async (
  username: string,
  habitId: string,
  status: HabitStatus
) => {
  const users = await loadUsers();
  const userIndex = users.findIndex(u => u.username === username);
  if (userIndex === -1) return;
  const habits = users[userIndex].habits || [];
  users[userIndex].habits = habits.map(h =>
    h.id === habitId ? { ...h, status } : h
  );
  await saveUsers(users);
};
