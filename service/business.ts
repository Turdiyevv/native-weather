
export const generateId = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2);

import { BusinessItem, BusinessEntry, User } from "../pages/types/userTypes";
import { loadUsers, saveUsers } from "./storage";

/**
 * 📌 Kun uchun BusinessItem olib keladi
 * bo‘lmasa — yaratadi
 */
export const getOrCreateBusinessByDate = async (
  username: string,
  date: string // masalan: "2025-12-18"
): Promise<BusinessItem | null> => {
  const users = await loadUsers();
  const userIndex = users.findIndex(u => u.username === username);
  if (userIndex === -1) return null;

  let business = users[userIndex].business || [];

  let item = business.find(b => b.id === date);

  if (!item) {
    item = {
      id: date, // 👉 sana = unikal ID
      name: date,
      calendar: [],
    };

    business.push(item);
    users[userIndex].business = business;
    await saveUsers(users);
  }

  return item;
};

/**
 * ➕ BusinessEntry qo‘shish
 */
export const addBusinessEntry = async (
  username: string,
  date: string,
  entry: Omit<BusinessEntry, "id">
) => {
  const users = await loadUsers();
  const userIndex = users.findIndex(u => u.username === username);
  if (userIndex === -1) return;

  const business =
    users[userIndex].business || [];

  let item = business.find(b => b.id === date);

  if (!item) {
    item = {
      id: date,
      name: date,
      calendar: [],
    };
    business.push(item);
  }

  const newEntry: BusinessEntry = {
    id: generateId(),
    ...entry,
  };

  item.calendar.push(newEntry);

  users[userIndex].business = business;
  await saveUsers(users);
};

/**
 * ✏️ BusinessEntry update
 */
export const updateBusinessEntry = async (
  username: string,
  date: string,
  entryId: string,
  updated: Partial<BusinessEntry>
) => {
  const users = await loadUsers();
  const userIndex = users.findIndex(u => u.username === username);
  if (userIndex === -1) return;

  const item = users[userIndex].business?.find(b => b.id === date);
  if (!item) return;

  item.calendar = item.calendar.map(e =>
    e.id === entryId ? { ...e, ...updated } : e
  );

  await saveUsers(users);
};

/**
 * ❌ BusinessEntry ochirish
 */
export const deleteBusinessEntry = async (
  username: string,
  date: string,
  entryId: string
) => {
  const users = await loadUsers();
  const userIndex = users.findIndex(u => u.username === username);
  if (userIndex === -1) return;

  const item = users[userIndex].business?.find(b => b.id === date);
  if (!item) return;

  item.calendar = item.calendar.filter(e => e.id !== entryId);

  await saveUsers(users);
};

/**
 * 📖 Kun bo‘yicha barcha entrylar
 */
export const getBusinessEntriesByDate = async (
  username: string,
  date: string
): Promise<BusinessEntry[]> => {
  const users = await loadUsers();
  const user = users.find(u => u.username === username);
  if (!user) return [];

  const item = user.business?.find(b => b.id === date);
  return item?.calendar || [];
};
