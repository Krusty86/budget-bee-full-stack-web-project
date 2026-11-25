
package com.hmi.exp_inc_tracker.service;

import java.util.List;

import com.hmi.exp_inc_tracker.entity.Task;
import com.hmi.exp_inc_tracker.entity.User;

public interface TaskService {

    Task createTask(
            Long taskListId, Task task, User user);

    Task updateTask(
            Long taskId, Task task, User user);

    void deleteTask(Long taskId, User user);

    Task getTask(Long taskId, User user);

    List<Task> getTasksByTaskList(
            Long taskListId, User user);

    Task updateTaskStatus(
            Long taskId, Boolean status, User user);
}
