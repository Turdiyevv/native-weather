import * as Notifications from "expo-notifications";

/* 🔔 GLOBAL HANDLER (1 marta) */
Notifications.setNotificationHandler({
  handleNotification: async (): Promise<Notifications.NotificationBehavior> => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/* ✅ PERMISSION */
export const ensureNotificationPermission = async (): Promise<boolean> => {
  const settings = await Notifications.getPermissionsAsync();

  if (settings.status !== Notifications.PermissionStatus.GRANTED) {
    const req = await Notifications.requestPermissionsAsync();
    return req.status === Notifications.PermissionStatus.GRANTED;
  }
  return true;
};

/* ⏰ SCHEDULE — MANA YETISHMAYOTGAN QISM */
export const scheduleHabitDayNotification = async (
  habitName: string,
  habitDay: {
    id: string;
    date: string;            // YYYY-MM-DD
    notificationTime: string; // HH:mm
    status: number;
  }
): Promise<string | null> => {
  try {
    if (habitDay.status !== 0) return null;

    const [year, month, day] = habitDay.date.split("-").map(Number);
    const [hour, minute] = habitDay.notificationTime.split(":").map(Number);

    const triggerDate = new Date(year, month - 1, day, hour, minute);

    if (triggerDate.getTime() <= Date.now()) return null;

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: "⏰ Odat vaqti",
        body: habitName,
        sound: "default",
        data: { habitDayId: habitDay.id },
      },
        //@ts-ignore
      trigger: triggerDate,
    });

    return id;
  } catch (e) {
    console.log("NOTIFICATION ERROR:", e);
    return null;
  }
};
