import React from "react";
import TaskList from "../../components/Task/TaskList";
import { UserTask } from "../types/userTypes";
import { useLanguage } from "../../i18n/LanguageContext";

export default function MainPage({ navigation }: any) {
  const { t } = useLanguage();
  const filterActiveTasks = (task: UserTask) => {
    return !task.isDeleted && !task.done;
  };

  return (
    <TaskList
      navigation={navigation}
      filterTasks={filterActiveTasks}
      emptyMessage={t("noTasks")}
    />
  );
}