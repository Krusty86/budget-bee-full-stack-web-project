package com.hmi.exp_inc_tracker.controller;

import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.hmi.exp_inc_tracker.entity.Task;
import com.hmi.exp_inc_tracker.entity.TaskList;
import com.hmi.exp_inc_tracker.entity.User;
import com.hmi.exp_inc_tracker.service.TaskListService;
import com.hmi.exp_inc_tracker.service.TaskService;
import com.hmi.exp_inc_tracker.util.AuthenticatedUserService;
import lombok.RequiredArgsConstructor;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/task-list")
@RequiredArgsConstructor
public class TaskListController {
    private final TaskListService service;
    private final TaskService taskService;
    private final AuthenticatedUserService authService;

    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody TaskList taskList) {
        User user = authService.getCurrentUser();
        TaskList saved = service.createTaskList(taskList, user);
        if (saved != null) return ResponseEntity.status(HttpStatus.OK).body(saved);
        return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(Map.of("msg", "Failed To Create Task List"));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody TaskList taskList) {
        User user = authService.getCurrentUser();
        TaskList updated = service.updateTaskList(id, taskList, user);
        if (updated != null) return ResponseEntity.status(HttpStatus.OK).body(updated);
        return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(Map.of("msg", "Failed To Update Task List"));
    }

    @GetMapping("/getall")
    public ResponseEntity<?> getAll() {
        User user = authService.getCurrentUser();
        List<TaskList> lists = service.getAllTaskLists(user);
        if (lists != null) return ResponseEntity.status(HttpStatus.OK).body(lists);
        return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(Map.of("msg", "Failed To Get Task Lists"));
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<?> getOne(@PathVariable Long id) {
        User user = authService.getCurrentUser();
        return ResponseEntity.ok(service.getTaskList(id, user));
    }

    @DeleteMapping("/remove/{id}")
    public ResponseEntity<?> remove(@PathVariable Long id) {
        User user = authService.getCurrentUser();
        service.deleteTaskList(id, user);
        return ResponseEntity.ok(Map.of("msg", "Task List Removed Successfully"));
    }

    @PostMapping("/{id}/tasks/create")
    public ResponseEntity<?> createTask(@PathVariable Long id, @RequestBody Task task) {
        User user = authService.getCurrentUser();
        Task saved = taskService.createTask(id, task, user);
        return ResponseEntity.status(HttpStatus.OK).body(saved);
    }

    @GetMapping("/{id}/tasks")
    public ResponseEntity<?> getTasks(@PathVariable Long id) {
        User user = authService.getCurrentUser();
        return ResponseEntity.ok(taskService.getTasksByTaskList(id, user));
    }

    @PutMapping("/tasks/{taskId}")
    public ResponseEntity<?> updateTask(@PathVariable Long taskId, @RequestBody Task task) {
        User user = authService.getCurrentUser();
        return ResponseEntity.ok(taskService.updateTask(taskId, task, user));
    }

    @PatchMapping("/tasks/{taskId}/status")
    public ResponseEntity<?> updateTaskStatus(@PathVariable Long taskId, @RequestBody Map<String, Boolean> body) {
        User user = authService.getCurrentUser();
        return ResponseEntity.ok(taskService.updateTaskStatus(taskId, body.get("status"), user));
    }

    @DeleteMapping("/tasks/{taskId}/remove")
    public ResponseEntity<?> removeTask(@PathVariable Long taskId) {
        User user = authService.getCurrentUser();
        taskService.deleteTask(taskId, user);
        return ResponseEntity.ok(Map.of("msg", "Task Removed Successfully"));
    }
}
