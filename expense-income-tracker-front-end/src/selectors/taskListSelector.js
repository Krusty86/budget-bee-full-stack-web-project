export const selectTaskLists = (state) => state.taskLists.items;
export const selectSelectedTaskList = (state) => state.taskLists.selected;
export const selectTasksByListId = (state, id) => state.taskLists.tasksByList[id] || [];
export const selectTaskListLoading = (state) => state.taskLists.loading;
export const selectTaskListError = (state) => state.taskLists.error;
export const selectTaskProgress = (state, id) => {
  const tasks = state.taskLists.tasksByList[id] || [];
  const completed = tasks.filter(task => task.status === true).length;
  return { total: tasks.length, completed, remaining: tasks.length - completed, percentage: tasks.length ? Math.round(completed / tasks.length * 100) : 0 };
};
