package com.hmi.exp_inc_tracker.service_impl;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.hmi.exp_inc_tracker.dto.LoginRequest;
import com.hmi.exp_inc_tracker.dto.RegisterRequest;
import com.hmi.exp_inc_tracker.entity.User;
import com.hmi.exp_inc_tracker.repository.UserRepository;
import com.hmi.exp_inc_tracker.service.UserService;
import com.hmi.exp_inc_tracker.util.EmailService;

import lombok.RequiredArgsConstructor;
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService{
	
	private final UserRepository userRepository;
	private final PasswordEncoder pwdEncoder;
	private final EmailService emailer;
	
	@Override
	public Boolean login(LoginRequest loginRequest) {
		// TODO Auto-generated method stub
		return userRepository.findByEmail(loginRequest.getEmail())
				.map(user->pwdEncoder.matches(loginRequest.getPassword(), user.getPassword()))
				.orElse(false);
	}

	@Override
	public User register(RegisterRequest register) {
		// TODO Auto-generated method stub
		User user = new User();
		user.setUserName(register.getUsername());
		user.setEmail(register.getEmail());
		user.setPhone(register.getPhone());
		String encodedPwd = pwdEncoder.encode(register.getPassword());
		user.setPassword(encodedPwd);
		user= userRepository.save(user);
		if(user.getId()!=null) {
			emailer.sendRegisterEmail(user.getEmail(), user.getUserName());
			return userRepository.save(user);
		}
		return null;
	}

	@Override
	public User getUserByEmail(String email) {
		// TODO Auto-generated method stub
		return userRepository.findByEmail(email)
				.orElse(null);
	}

	@Override
	public User resetPassword(User user, String pwd) {
		// TODO Auto-generated method stub
		String encodedPwd = pwdEncoder.encode(pwd);
		if(!encodedPwd.equals(user.getPassword())) {
			user.setPassword(encodedPwd);
			return userRepository.save(user);
		}
		return null;
	}

	@Override
	public User modifyUserInfo(User newUser, String email) {
		// TODO Auto-generated method stub
		User user = userRepository.findByEmail(email).orElse(null);
		if(user!=null) {
			if(!newUser.getFullName().equals(null))
				user.setFullName(newUser.getFullName());
			if(!newUser.getPhone().equals(null))
				user.setPhone(newUser.getPhone());
			return userRepository.save(user);
		}
		return null;
	}

	@Override
	public Boolean checkPwd(String oldPwd, String confirmOldPwd) {
		// TODO Auto-generated method stub
//		String encodedPwd = pwdEncoder.encode(confirmOldPwd);
		boolean status = pwdEncoder.matches(confirmOldPwd, oldPwd);
		System.out.println("PasswordCheck:: "+status);
		if(status)
			return true;
		return false;
	}

}
