// service/business.ts
import { BusinessDay, BusinessEntry, BusinessItem, User } from "../pages/types/userTypes";
import { getActiveUser, updateUserBusiness } from "./storage";

/**
 * Berilgan sana va business bo‘yicha kunni olish yoki yaratish
 */
export const getOrCreateBusinessDay = async (
  businessId: string,
  dateStr: string
): Promise<BusinessDay> => {
  const user = await getActiveUser();
  if (!user) throw new Error("Active user not found");

  // Business topish yoki yaratish
  let business = user.business.find(b => b.id === businessId);
  if (!business) {
    business = { id: businessId, name: businessId, calendar: [] };
    user.business.push(business);
  }

  // Day topish yoki yaratish
  let day = business.calendar.find(d => d.date === dateStr);
  if (!day) {
    day = { date: dateStr, entries: [] };
    business.calendar.push(day);
    await updateUserBusiness(user.username, user.business);
  }

  return day;
};

/**
 * Yangi entry qo‘shish
 */
export const addEntryToBusinessDay = async (
  businessId: string,
  dateStr: string,
  entry: Omit<BusinessEntry, "id" | "time">
): Promise<BusinessEntry> => {
  const user = await getActiveUser();
  if (!user) throw new Error("Active user not found");

  // Business topish yoki yaratish
  let business = user.business.find(b => b.id === businessId);
  if (!business) {
    business = { id: businessId, name: businessId, calendar: [] };
    user.business.push(business);
  }

  // Day topish yoki yaratish
  let day = business.calendar.find(d => d.date === dateStr);
  if (!day) {
    day = { date: dateStr, entries: [] };
    business.calendar.push(day);
  }

  // Yangi entry yaratish
  const newEntry: BusinessEntry = {
    id: Date.now().toString(),
    time: new Date().toTimeString().slice(0, 5), // HH:MM
    ...entry,
  };

  day.entries.push(newEntry);

  // User business ni update qilish
  await updateUserBusiness(user.username, user.business);

  return newEntry;
};

/**
 * Berilgan business va sana bo‘yicha barcha entrylarni olish
 */
export const getEntriesForBusinessDay = async (
  businessId: string,
  dateStr: string
): Promise<BusinessEntry[]> => {
  const user = await getActiveUser();
  if (!user) return [];

  const business = user.business.find(b => b.id === businessId);
  if (!business) return [];

  const day = business.calendar.find(d => d.date === dateStr);
  return day ? day.entries : [];
};

/**
 * Entry ni yangilash (masalan summa yoki izohni o'zgartirish)
 */
export const updateEntryInBusinessDay = async (
  businessId: string,
  dateStr: string,
  entryId: string,
  updated: Partial<BusinessEntry>
): Promise<BusinessEntry | null> => {
  const user = await getActiveUser();
  if (!user) return null;

  const business = user.business.find(b => b.id === businessId);
  if (!business) return null;

  const day = business.calendar.find(d => d.date === dateStr);
  if (!day) return null;

  const entryIndex = day.entries.findIndex(e => e.id === entryId);
  if (entryIndex === -1) return null;

  day.entries[entryIndex] = { ...day.entries[entryIndex], ...updated };
  await updateUserBusiness(user.username, user.business);

  return day.entries[entryIndex];
};

/**
 * Entry ni o'chirish
 */
export const deleteEntryFromBusinessDay = async (
  businessId: string,
  dateStr: string,
  entryId: string
) => {
  const user = await getActiveUser();
  if (!user) return;

  const business = user.business.find(b => b.id === businessId);
  if (!business) return;

  const day = business.calendar.find(d => d.date === dateStr);
  if (!day) return;

  day.entries = day.entries.filter(e => e.id !== entryId);
  await updateUserBusiness(user.username, user.business);
};
