package com.hmi.exp_inc_tracker.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
	private String username;
	private String email;
	private String password;
	private String phone;
}
