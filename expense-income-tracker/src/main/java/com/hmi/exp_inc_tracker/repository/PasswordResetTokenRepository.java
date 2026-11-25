package com.hmi.exp_inc_tracker.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hmi.exp_inc_tracker.entity.PasswordResetToken;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long>{
	PasswordResetToken findFirstByEmailAndUsedFalseOrderByIdDesc(String email);
	void deleteByUsedTrue();
}
