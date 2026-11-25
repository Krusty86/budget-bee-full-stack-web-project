
package com.hmi.exp_inc_tracker.service;

import java.util.List;

import com.hmi.exp_inc_tracker.entity.TaskList;
import com.hmi.exp_inc_tracker.entity.User;

public interface TaskListService {

    TaskList createTaskList(TaskList taskList, User user);

    TaskList updateTaskList(
            Long id, TaskList taskList, User user);

    void deleteTaskList(Long id, User user);

    TaskList getTaskList(Long id, User user);

    List<TaskList> getAllTaskLists(User user);
}
