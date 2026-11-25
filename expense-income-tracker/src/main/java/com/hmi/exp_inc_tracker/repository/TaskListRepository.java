
package com.hmi.exp_inc_tracker.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hmi.exp_inc_tracker.entity.TaskList;
import com.hmi.exp_inc_tracker.entity.User;

@Repository
public interface TaskListRepository	extends JpaRepository<TaskList, Long> {

    List<TaskList> findByUser(User user);

    Optional<TaskList> findByIdAndUserId(
            Long id,
            Long userId
    );

    boolean existsByNameIgnoreCaseAndUserId(
            String name,
            Long userId
    );

    List<TaskList> findAllByUserIdOrderByCreatedAtDesc(
            Long userId
    );
    boolean existsByNameIgnoreCaseAndUserIdAndIdNot(
            String name, Long userId, Long id);

}
