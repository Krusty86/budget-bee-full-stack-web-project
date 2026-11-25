package com.hmi.exp_inc_tracker.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hmi.exp_inc_tracker.entity.FinancialAccount;
import java.util.List;
import java.util.Optional;

import com.hmi.exp_inc_tracker.entity.User;


@Repository
public interface FinancialAccountRepository extends JpaRepository<FinancialAccount, Long>{
	List<FinancialAccount> findAllByUser(User user);
	Optional<FinancialAccount> findByIdAndUserId(Long id, Long userId);
}
