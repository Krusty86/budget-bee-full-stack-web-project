package com.hmi.exp_inc_tracker.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hmi.exp_inc_tracker.entity.PaymentReminder;

@Repository
public interface PaymentReminderRepository extends JpaRepository<PaymentReminder, Long>{

}
