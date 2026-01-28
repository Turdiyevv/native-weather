import React from "react";
import TaskList from "../../components/Task/TaskList";
import { UserTask } from "../types/userTypes";

export default function MainPage({ navigation }: any) {
  const filterActiveTasks = (task: UserTask) => {
    return !task.isDeleted && !task.done;
  };

  return (
    <TaskList
      navigation={navigation}
      filterTasks={filterActiveTasks}
      emptyMessage="Bu yerda kun tartibingiz bo'yicha vazifalarni yozishingiz mumkin."
    />
  );
}