package com.hmi.exp_inc_tracker.controller;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.RestController;

import com.hmi.exp_inc_tracker.entity.PasswordResetToken;
import com.hmi.exp_inc_tracker.entity.User;
import com.hmi.exp_inc_tracker.service.PasswordResetTokenService;
import com.hmi.exp_inc_tracker.service.UserService;
import com.hmi.exp_inc_tracker.util.AuthenticatedUserService;


import com.hmi.exp_inc_tracker.dto.*;
import lombok.RequiredArgsConstructor;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {
	private final UserService service;
	private final PasswordResetTokenService pwdService;
	private final AuthenticatedUserService authService;
	
	@GetMapping("/profile")
	public ResponseEntity<?> getProfile(){
		User user = authService.getCurrentUser();
		System.out.println("Inside UserController Get Profile");
		if(user!=null) {
			user = service.getUserByEmail(user.getEmail());
			if(user!=null)
				user.setPassword(null);
			
				return ResponseEntity.status(HttpStatus.OK)
						.body(user);
		}
		return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED)
				.body(Map.of("msg","Failed to Request User Information"));
	}
	
	@PostMapping("/modify")
	public ResponseEntity<?> modifyUserProfile(@RequestBody User newUser){
		System.out.println("Inside User Info Update");
		User user = authService.getCurrentUser();
		user = service.modifyUserInfo(newUser, user.getEmail());
		if(user!=null)
			return ResponseEntity.status(HttpStatus.OK)
					.body(user);
		return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED)
				.body(Map.of("msg","Failed to Change Profile Settings."));
	}
	
	@GetMapping("/request-otp")
	public ResponseEntity<?> getOtp(){
		
		User user = authService.getCurrentUser();
		if(user!=null) {
			PasswordResetToken token = pwdService.generateOtp(user.getEmail());
			if(token!=null)
				return ResponseEntity.status(HttpStatus.OK)
						.body(token);
		}
		return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED)
				.body(Map.of("msg","Failed to Request OTP code."));
	}
	
	@PostMapping("/change-password")
	public ResponseEntity<?> changePassword(@RequestBody PasswordResetRequest req){
		
		Boolean status = pwdService.verifyOtp(req.getEmail(), req.getCode());
		User user = service.getUserByEmail(req.getEmail());
		
		if(user!=null && status) {
			System.out.println("Inside Change Password Mapping");
			if(service.checkPwd(user.getPassword(), req.getOldPwd())) {
				user = service.resetPassword(user, req.getNewPwd());
				System.out.println("Inside Final Check");
				if(user!=null)
					return ResponseEntity.status(HttpStatus.OK)
							.body(user);
			}
		}
		return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED)
				.body(Map.of("msg","Invalid OTP or Password."));
	}

}
