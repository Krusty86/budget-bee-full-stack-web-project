package com.hmi.exp_inc_tracker.service;

import com.hmi.exp_inc_tracker.dto.LoginRequest;
import com.hmi.exp_inc_tracker.dto.RegisterRequest;
import com.hmi.exp_inc_tracker.entity.User;

public interface UserService {
	Boolean login(LoginRequest loginRequest);
	User register(RegisterRequest register);
	User getUserByEmail(String email);
	User resetPassword(User user, String pwd);
}
