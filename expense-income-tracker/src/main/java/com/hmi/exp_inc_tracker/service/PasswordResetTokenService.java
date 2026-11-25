package com.hmi.exp_inc_tracker.service;

import com.hmi.exp_inc_tracker.entity.PasswordResetToken;

public interface PasswordResetTokenService {
	
	PasswordResetToken generateOtp(String email);
	
	Boolean verifyOtp(String email, String code);
	
	void clearUsedOtps();
}
