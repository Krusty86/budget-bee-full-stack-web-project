
package com.hmi.exp_inc_tracker.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hmi.exp_inc_tracker.entity.Task;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findAllByTasklistId(Long taskListId);

    List<Task> findAllByTasklistIdOrderByCreatedAtDesc(
            Long taskListId
    );

    Optional<Task> findByIdAndTasklistId(
            Long taskId,
            Long taskListId
    );

    List<Task> findAllByTasklistIdAndStatus(
            Long taskListId,
            Boolean status
    );

    long countByTasklistIdAndStatus(
            Long taskListId,
            Boolean status
    );

    void deleteAllByTasklistId(Long taskListId);
}
