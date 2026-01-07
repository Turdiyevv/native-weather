import * as Notifications from "expo-notifications";

type HabitDay = {
  id: string;
  date: string;             // YYYY-MM-DD
  notificationTime: string; // HH:mm
  status: number;
};

export const scheduleHabitDayNotification = async (
  habitName: string,
  habitDay: HabitDay
): Promise<string | null> => {
  try {
    // faqat bajarilmagan kunlar
    if (habitDay.status !== 0) return null;

    const [hour, minute] = habitDay.notificationTime
      .split(":")
      .map(Number);

    const triggerDate = new Date(habitDay.date);
    triggerDate.setHours(hour, minute, 0, 0);

    // ❗ O‘tmish bo‘lsa qo‘ymaymiz
    if (triggerDate.getTime() <= Date.now()) {
      return null;
    }

    const trigger = {
      type: "date",
      date: triggerDate,
    };

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
        trigger,
      });

    return notificationId;
  } catch (e) {
    console.log("HABIT NOTIFICATION ERROR:", e);
    return null;
  }
};
