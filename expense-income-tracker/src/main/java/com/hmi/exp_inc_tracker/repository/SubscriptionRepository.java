
package com.hmi.exp_inc_tracker.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hmi.exp_inc_tracker.entity.Subscription;
import com.hmi.exp_inc_tracker.enums.SubscriptionStatus;

@Repository
public interface SubscriptionRepository
        extends JpaRepository<Subscription, Long> {

    List<Subscription> findAllByUserId(Long userId);

    List<Subscription> findAllByUserIdAndStatus(
            Long userId,
            SubscriptionStatus status
    );

    Optional<Subscription> findByIdAndUserId(
            Long id,
            Long userId
    );

    boolean existsByAccountIdAndUserId(
            Long accountId,
            Long userId
    );

    boolean existsByAccountIdAndUserIdAndStatus(
            Long accountId,
            Long userId,
            SubscriptionStatus status
    );

   
    List<Subscription> findAllByStatusAndNextPaymentDateLessThanEqual(
            SubscriptionStatus status,
            LocalDate date
    );
    List<Subscription> findAllByUserIdAndNextPaymentDateBetween(
            Long userId,
            LocalDate start,
            LocalDate end
    );
}
