import { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } from "@env";

export const sendMessageToTelegram = async (message: string) => {
  if (!message.trim()) return;

  try {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
      }),
    });

    const data = await res.json();
    if (!data.ok) {
      console.log("Telegram xatolik:", data);
      throw new Error("Telegramga jo'natilmadi");
    } else {
      console.log("Xabar jo'natildi:", data);
    }
  } catch (error) {
    console.log("Xatolik:", error);
  }
};
