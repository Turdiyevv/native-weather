import * as Notifications from "expo-notifications";

export const scheduleHabitDayNotification = async (
  habitName: string,
  habitDay: {
    id: string;
    date: string;          // YYYY-MM-DD
    notificationTime: string; // HH:mm
    status: number;
  }
): Promise<string | null> => {
  // agar bajarilgan yoki skip bo‘lsa → notification yo‘q
  if (habitDay.status !== 0) return null;
  const [year, month, day] = habitDay.date.split("-").map(Number);
  const [hour, minute] = habitDay.notificationTime.split(":").map(Number);
  const triggerDate = new Date(
    year,
    month - 1,
    day,
    hour,
    minute,
    0
  );
  // o‘tib ketgan vaqt bo‘lsa → notification qo‘ymaslik
  if (triggerDate <= new Date()) {
    return null;
  }
  const notificationId =
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "⏰ Odat vaqti",
        body: habitName,
        sound: true,
        data: {
          habitDayId: habitDay.id,
        },
      },
        //@ts-ignore
      trigger: triggerDate,
    });

  return notificationId;
};
