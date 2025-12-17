import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import { getActiveUser } from "./storage";

export const exportTasksAsTxt = async (): Promise<void> => {
  try {
    const activeUser = await getActiveUser();
    if (!activeUser || !activeUser.usertasks) return;
    const tasks = activeUser.usertasks;
    // 1. Fayl nomini yaratamiz
    const fileName = `tasks_${activeUser.username}_${Date.now()}.txt`;
    // 2. Faylni yaratamiz
    const file = new File(Paths.document, fileName);
    // 3. Faylga yoziladigan matnni tayyorlaymiz
    const fileContent = tasks
      .map(
        (t, i) =>
          `${i + 1}. ${t.title}
Description: ${t.description || "No description"}
Status: ${t.done ? "Done" : "Active"}
Deleted: ${t.isDeleted ? "Yes" : "No"}
Date: ${new Date(t.time).toLocaleString()}
Username: ${activeUser.username}
--------------------------`
      )
      .join("\n");

    // 4. Faylga yozish
    await file.write(fileContent);

    // 5. Agar sharing mavjud bo'lsa, faylni ulashish
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(file.uri);
    }
  } catch (e) {
    console.error("Export tasks error:", e);
  }
};
