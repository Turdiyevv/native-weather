import { loadUsers, saveUsers } from "./storage";
import { Habit, HabitDay, HabitStatus } from "../pages/types/userTypes";
import { generateId } from "./business";

/* ===================== GET ===================== */

export const getHabits = async (username: string): Promise<Habit[]> => {
  const users = await loadUsers();
  const user = users.find(u => u.username === username);
  return user?.habits || [];
};

export const getHabitDays = async (
  username: string,
  habitId: string
): Promise<HabitDay[]> => {
  const users = await loadUsers();
  const user = users.find(u => u.username === username);
  const habit = user?.habits?.find(h => h.id === habitId);
  return habit?.habitDays || [];
};

/* ===================== ADD ===================== */

export const addHabit = async (
  username: string,
  data: {
    name: string;
    durationDays: number;
    notificationTime: string;
  }
) => {
  const users = await loadUsers();
  const userIndex = users.findIndex(u => u.username === username);
  if (userIndex === -1) return;

  const createdAt = new Date().toISOString();

  const habitDays: HabitDay[] = [];

  for (let i = 0; i < data.durationDays; i++) {
    const date = new Date(createdAt);
    date.setDate(date.getDate() + i);

    habitDays.push({
      id: generateId(),
      habitId: "", // keyin to‘ldiriladi
      date: date.toISOString().split("T")[0],
      notificationTime: data.notificationTime,
      status: 0,
    });
  }

  const habitId = generateId();

  const newHabit: Habit = {
    id: habitId,
    name: data.name,
    durationDays: data.durationDays,
    createdAt,
    habitDays: habitDays.map(d => ({
      ...d,
      habitId,
    })),
  };

  users[userIndex].habits = [
    ...(users[userIndex].habits || []),
    newHabit,
  ];

  await saveUsers(users);
};

/* ===================== UPDATE HABIT ===================== */

export const updateHabit = async (
  username: string,
  habitId: string,
  updated: Partial<Omit<Habit, "habitDays">>
) => {
  const users = await loadUsers();
  const userIndex = users.findIndex(u => u.username === username);
  if (userIndex === -1) return;

  users[userIndex].habits = (users[userIndex].habits || []).map(h =>
    h.id === habitId ? { ...h, ...updated } : h
  );

  await saveUsers(users);
};

/* ===================== UPDATE DAY STATUS ===================== */

export const updateHabitDayStatus = async (
  username: string,
  habitId: string,
  habitDayId: string,
  status: HabitStatus
) => {
  const users = await loadUsers();
  const userIndex = users.findIndex(u => u.username === username);
  if (userIndex === -1) return;

  users[userIndex].habits = (users[userIndex].habits || []).map(habit => {
    if (habit.id !== habitId) return habit;

    return {
      ...habit,
      habitDays: habit.habitDays.map(day =>
        day.id === habitDayId ? { ...day, status } : day
      ),
    };
  });

  await saveUsers(users);
};

/* ===================== DELETE ===================== */

export const deleteHabit = async (
  username: string,
  habitId: string
) => {
  const users = await loadUsers();
  const userIndex = users.findIndex(u => u.username === username);
  if (userIndex === -1) return;

  users[userIndex].habits =
    (users[userIndex].habits || []).filter(h => h.id !== habitId);

  await saveUsers(users);
};
