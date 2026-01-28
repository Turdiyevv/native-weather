import React from "react";
import TaskList from "../../components/Task/TaskList";
import { UserTask } from "../types/userTypes";

export default function DeleteTask({ navigation }: any) {
  // Faqat o'chirilgan tasklar
  const filterDeletedTasks = (task: UserTask) => {
    return task.isDeleted === true;
  };

  return (
    <TaskList
      navigation={navigation}
      filterTasks={filterDeletedTasks}
      emptyMessage="O'chirilgan vazifalar yo'q."
    />
  );
}