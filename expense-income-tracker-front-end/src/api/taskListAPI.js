import authAPI from "./authAPI";

const API = "/api/task-list";

export const createTaskList = (taskList) => {
    return authAPI.post(`${API}/create`, taskList)
}
export const getAllTaskLists = () => {
    return authAPI.get(`${API}/getall`)
}
export const getTaskList = (id) => {
    return authAPI.get(`${API}/get/${id}`)
}
export const updateTaskList = (id, taskList) => {
    return authAPI.put(`${API}/update/${id}`, taskList)
}
export const removeTaskList = (id) => {
    return authAPI.delete(`${API}/remove/${id}`)
}

export const createTask = (taskListId, task) => {
    return authAPI.post(`${API}/${taskListId}/tasks/create`, task)
}
export const getTasksByTaskList = (taskListId) => {
    return authAPI.get(`${API}/${taskListId}/tasks`)
}
export const updateTask = (taskId, task) => {
    return authAPI.put(`${API}/tasks/${taskId}`, task)
}
export const updateTaskStatus = (taskId, status) =>{
  return authAPI.patch(`${API}/tasks/${taskId}/status`, { status })
}
export const removeTask = (taskId) => {
    return authAPI.delete(`${API}/tasks/${taskId}/remove`)
}
