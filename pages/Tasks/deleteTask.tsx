import React from "react";
import TaskList from "../../components/Task/TaskList";
import { UserTask } from "../types/userTypes";
import { useLanguage } from "../../i18n/LanguageContext";

export default function DeleteTask({ navigation }: any) {
  const { t } = useLanguage();
  // Faqat o'chirilgan tasklar
  const filterDeletedTasks = (task: UserTask) => {
    return task.isDeleted === true;
  };

  return (
    <TaskList
      navigation={navigation}
      filterTasks={filterDeletedTasks}
      emptyMessage={t("deletedTasks")}
    />
  );
}