package com.hmi.exp_inc_tracker.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import lombok.NoArgsConstructor;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileResponse {
	private String email;
	private String fullName;
	private String phone;
	private String userName;
		
}
