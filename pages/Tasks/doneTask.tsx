import React from "react";
import TaskList from "../../components/Task/TaskList";
import { UserTask } from "../types/userTypes";

export default function DeleteTask({ navigation }: any) {
  const filterDeletedTasks = (task: UserTask) => {
    return task.done === true;
  };

  return (
    <TaskList
      navigation={navigation}
      filterTasks={filterDeletedTasks}
      emptyMessage="O'chirilgan vazifalar yo'q."
    />
  );
}