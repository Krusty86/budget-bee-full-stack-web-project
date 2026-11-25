import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as api from "../api/taskListAPI";

const errorMessage = (e) =>
  e.response?.data?.msg ||
  e.response?.data ||
  e.message ||
  "Task request failed";
const thunk = (type, fn) =>
  createAsyncThunk(type, async (arg, { rejectWithValue }) => {
    try {
      return await fn(arg);
    } catch (e) {
      return rejectWithValue(errorMessage(e));
    }
  });
export const fetchTaskLists = thunk(
  "taskLists/fetchAll",
  async () => (await api.getAllTaskLists()).data,
);
export const fetchTaskList = thunk(
  "taskLists/fetchOne",
  async (id) => (await api.getTaskList(id)).data,
);
export const addTaskList = thunk(
  "taskLists/create",
  async (data) => (await api.createTaskList(data)).data,
);
export const editTaskList = thunk(
  "taskLists/update",
  async ({ id, taskList }) => (await api.updateTaskList(id, taskList)).data,
);
export const deleteTaskList = thunk("taskLists/delete", async (id) => {
  await api.removeTaskList(id);
  return id;
});
export const fetchTasks = thunk("taskLists/fetchTasks", async (id) => ({
  taskListId: id,
  tasks: (await api.getTasksByTaskList(id)).data,
}));
export const addTask = thunk(
  "taskLists/addTask",
  async ({ taskListId, task }) => ({
    taskListId,
    task: (await api.createTask(taskListId, task)).data,
  }),
);
export const editTask = thunk(
  "taskLists/editTask",
  async ({ taskId, task }) => (await api.updateTask(taskId, task)).data,
);
export const setTaskStatus = thunk(
  "taskLists/setTaskStatus",
  async ({ taskId, status }) =>
    (await api.updateTaskStatus(taskId, status)).data,
);
export const deleteTask = thunk("taskLists/deleteTask", async (taskId) => {
  await api.removeTask(taskId);
  return taskId;
});

const slice = createSlice({
  name: "taskLists",
  initialState: {
    items: [],
    selected: null,
    tasksByList: {},
    loading: false,
    error: null,
  },
  reducers: {
    clearTaskError: (state) => {
      state.error = null;
    },
    clearSelectedTaskList: (state) => {
      state.selected = null;
    },
  },
  extraReducers: (builder) => {
    const pending = (state) => {
        state.loading = true;
        state.error = null;
      },
      rejected = (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      };
    builder.addCase(fetchTaskLists.pending, pending)
      .addCase(fetchTaskLists.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(fetchTaskLists.rejected, rejected)
      .addCase(fetchTaskList.pending, pending)
      .addCase(fetchTaskList.fulfilled, (state, action) => {
        state.loading = false;
        state.selected = action.payload;
      })
      .addCase(fetchTaskList.rejected, rejected)
      .addCase(addTaskList.pending, pending)
      .addCase(addTaskList.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
      })
      .addCase(addTaskList.rejected, rejected)
      .addCase(editTaskList.pending, pending)
      .addCase(editTaskList.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.map((x) => (x.id === action.payload.id ? action.payload : x));
        if (state.selected?.id === action.payload.id) state.selected = action.payload;
      })
      .addCase(editTaskList.rejected, rejected)
      .addCase(deleteTaskList.pending, pending)
      .addCase(deleteTaskList.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((x) => x.id !== action.payload);
        delete state.tasksByList[action.payload];
        if (state.selected?.id === action.payload) state.selected = null;
      })
      .addCase(deleteTaskList.rejected, rejected)
      .addCase(fetchTasks.pending, pending)
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasksByList[action.payload.taskListId] = action.payload.tasks || [];
      })
      .addCase(fetchTasks.rejected, rejected)
      .addCase(addTask.pending, pending)
      .addCase(addTask.fulfilled, (state, action) => {
        state.loading = false;
        (state.tasksByList[action.payload.taskListId] ||= []).push(action.payload.task);
      })
      .addCase(addTask.rejected, rejected)
      .addCase(editTask.pending, pending)
      .addCase(editTask.fulfilled, (state, action) => {
        state.loading = false;
        Object.keys(state.tasksByList).forEach((k) => {
          state.tasksByList[k] = state.tasksByList[k].map((t) =>
            t.id === action.payload.id ? action.payload : t,
          );
        });
      })
      .addCase(editTask.rejected, rejected)
      .addCase(setTaskStatus.pending, pending)
      .addCase(setTaskStatus.fulfilled, (state, action) => {
        state.loading = false;
        Object.keys(state.tasksByList).forEach((k) => {
          state.tasksByList[k] = state.tasksByList[k].map((t) =>
            t.id === action.payload.id ? action.payload : t,
          );
        });
      })
      .addCase(setTaskStatus.rejected, rejected)
      .addCase(deleteTask.pending, pending)
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false;
        Object.keys(state.tasksByList).forEach((k) => {
          state.tasksByList[k] = state.tasksByList[k].filter((t) => t.id !== action.payload);
        });
      })
      .addCase(deleteTask.rejected, rejected);
  },
});
export const { clearTaskError, clearSelectedTaskList } = slice.actions;
export default slice.reducer;
