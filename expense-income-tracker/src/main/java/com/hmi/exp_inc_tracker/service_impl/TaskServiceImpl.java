package com.hmi.exp_inc_tracker.service_impl;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hmi.exp_inc_tracker.entity.Task;
import com.hmi.exp_inc_tracker.entity.TaskList;
import com.hmi.exp_inc_tracker.entity.User;
import com.hmi.exp_inc_tracker.exception.BadRequestException;
import com.hmi.exp_inc_tracker.exception.ResourceNotFoundException;
import com.hmi.exp_inc_tracker.repository.TaskListRepository;
import com.hmi.exp_inc_tracker.repository.TaskRepository;
import com.hmi.exp_inc_tracker.service.TaskService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepo;
    private final TaskListRepository taskListRepo;

    @Override
    public Task createTask(Long taskListId, Task task, User user) {
        validateUser(user);

        if (task == null || task.getName() == null || task.getName().isBlank()) {
            throw new BadRequestException("Task name is required");
        }

        TaskList taskList = taskListRepo.findByIdAndUserId(taskListId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Task list not found"));

        validatePrice(task.getPrice());

        task.setId(null);
        task.setName(task.getName().trim());
        task.setTasklist(taskList);
        task.setStatus(task.getStatus() == null ? Boolean.FALSE : task.getStatus());

        return taskRepo.save(task);
    }

    @Override
    public Task updateTask(Long taskId, Task request, User user) {
        validateUser(user);

        if (request == null) {
            throw new BadRequestException("Task details are required");
        }

        Task existing = getOwnedTask(taskId, user);

        if (request.getName() != null) {
            if (request.getName().isBlank()) {
                throw new BadRequestException("Task name cannot be blank");
            }
            existing.setName(request.getName().trim());
        }

        if (request.getPrice() != null) {
            validatePrice(request.getPrice());
            existing.setPrice(request.getPrice());
        }

        if (request.getStatus() != null) {
            existing.setStatus(request.getStatus());
        }

        // Do not allow a request body to move a task to another user's task list.
        return taskRepo.save(existing);
    }

    @Override
    public void deleteTask(Long taskId, User user) {
        Task task = getOwnedTask(taskId, user);
        taskRepo.delete(task);
    }

    @Override
    @Transactional(readOnly = true)
    public Task getTask(Long taskId, User user) {
        return getOwnedTask(taskId, user);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Task> getTasksByTaskList(Long taskListId, User user) {
        validateUser(user);

        // Verify ownership before using the task-list ID in a task query.
        taskListRepo.findByIdAndUserId(taskListId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Task list not found"));

        return taskRepo.findAllByTasklistIdOrderByCreatedAtDesc(taskListId);
    }

    @Override
    public Task updateTaskStatus(Long taskId, Boolean status, User user) {
        if (status == null) {
            throw new BadRequestException("Task status is required");
        }

        Task task = getOwnedTask(taskId, user);
        task.setStatus(status);
        return taskRepo.save(task);
    }

    private Task getOwnedTask(Long taskId, User user) {
        validateUser(user);

        Task task = taskRepo.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        if (task.getTasklist() == null
                || task.getTasklist().getUser() == null
                || !user.getId().equals(task.getTasklist().getUser().getId())) {
            // Use the same response as a missing task to avoid disclosing other users' data.
            throw new ResourceNotFoundException("Task not found");
        }

        return task;
    }

    private void validatePrice(BigDecimal price) {
        if (price != null && price.compareTo(BigDecimal.ZERO) < 0) {
            throw new BadRequestException("Task price cannot be negative");
        }
    }

    private void validateUser(User user) {
        if (user == null || user.getId() == null) {
            throw new BadRequestException("Authenticated user is required");
        }
    }
}
