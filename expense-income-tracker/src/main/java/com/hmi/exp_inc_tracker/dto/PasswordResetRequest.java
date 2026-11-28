package com.hmi.exp_inc_tracker.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PasswordResetRequest {
	private String email;
	private String code;
	private String newPwd;
	private String oldPwd;
}
