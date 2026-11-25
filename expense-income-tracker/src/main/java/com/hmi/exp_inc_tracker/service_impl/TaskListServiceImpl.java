package com.hmi.exp_inc_tracker.service_impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hmi.exp_inc_tracker.entity.TaskList;
import com.hmi.exp_inc_tracker.entity.User;
import com.hmi.exp_inc_tracker.exception.BadRequestException;
import com.hmi.exp_inc_tracker.exception.ResourceNotFoundException;
import com.hmi.exp_inc_tracker.repository.TaskListRepository;
import com.hmi.exp_inc_tracker.service.TaskListService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class TaskListServiceImpl implements TaskListService {

    private final TaskListRepository taskListRepo;

    @Override
    public TaskList createTaskList(TaskList taskList, User user) {
        validateUser(user);

        if (taskList == null || taskList.getName() == null
                || taskList.getName().isBlank()) {
            throw new BadRequestException("Task-list name is required");
        }

        String name = taskList.getName().trim();
        if (taskListRepo.existsByNameIgnoreCaseAndUserId(name, user.getId())) {
            throw new BadRequestException("A task list with this name already exists");
        }

        taskList.setId(null);
        taskList.setName(name);
        taskList.setUser(user);

        // Do not accept child tasks supplied through the task-list create request.
        taskList.setTasks(new ArrayList<>());

        return taskListRepo.save(taskList);
    }

    @Override
    public TaskList updateTaskList(Long id, TaskList request, User user) {
        validateUser(user);

        if (request == null) {
            throw new BadRequestException("Task-list details are required");
        }

        TaskList existing = getTaskList(id, user);

        if (request.getName() != null) {
            String name = request.getName().trim();
            if (name.isBlank()) {
                throw new BadRequestException("Task-list name cannot be blank");
            }

            boolean duplicate = taskListRepo
                    .existsByNameIgnoreCaseAndUserIdAndIdNot(
                            name, user.getId(), id);

            if (duplicate) {
                throw new BadRequestException("A task list with this name already exists");
            }
            existing.setName(name);
        }

        if (request.getDescription() != null) {
            existing.setDescription(request.getDescription().trim());
        }

        // Ownership and child tasks are deliberately not changed by this operation.
        return taskListRepo.save(existing);
    }

    @Override
    public void deleteTaskList(Long id, User user) {
        TaskList taskList = getTaskList(id, user);
        // CascadeType.ALL + orphanRemoval on TaskList.tasks deletes its tasks.
        taskListRepo.delete(taskList);
    }

    @Override
    @Transactional(readOnly = true)
    public TaskList getTaskList(Long id, User user) {
        validateUser(user);

        return taskListRepo.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Task list not found"));
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskList> getAllTaskLists(User user) {
        validateUser(user);
        return taskListRepo.findAllByUserIdOrderByCreatedAtDesc(user.getId());
    }

    private void validateUser(User user) {
        if (user == null || user.getId() == null) {
            throw new BadRequestException("Authenticated user is required");
        }
    }
}
