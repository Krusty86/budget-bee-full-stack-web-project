
package com.hmi.exp_inc_tracker.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hmi.exp_inc_tracker.entity.Budget;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, Long> {

    List<Budget> findAllByUserId(Long userId);

    List<Budget> findAllByUserIdAndActiveTrue(Long userId);

    Optional<Budget> findByIdAndUserId(Long id, Long userId);

    List<Budget> findAllByActiveTrueAndEndDateBefore(
            LocalDate date
    );

    List<Budget> findAllByUserIdAndActiveTrueAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
            Long userId,
            LocalDate endDate,
            LocalDate startDate
    );

    boolean existsByUserIdAndNameIgnoreCase(
            Long userId,
            String name
    );
    List<Budget> findAllByUserIdOrderByStartDateDesc(Long userId);
}
