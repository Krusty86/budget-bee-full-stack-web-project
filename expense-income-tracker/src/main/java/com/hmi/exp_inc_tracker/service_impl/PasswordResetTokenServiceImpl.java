package com.hmi.exp_inc_tracker.service_impl;

import java.time.LocalDateTime;
import java.util.Random;

import org.springframework.stereotype.Service;

import com.hmi.exp_inc_tracker.entity.PasswordResetToken;
import com.hmi.exp_inc_tracker.entity.User;
import com.hmi.exp_inc_tracker.repository.PasswordResetTokenRepository;
import com.hmi.exp_inc_tracker.repository.UserRepository;
import com.hmi.exp_inc_tracker.service.PasswordResetTokenService;
import com.hmi.exp_inc_tracker.util.EmailService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PasswordResetTokenServiceImpl implements PasswordResetTokenService{
	
	private final PasswordResetTokenRepository passwordResetTokenRepository;
	private final UserRepository userRepository;
	private final EmailService emailer;
	
	private static final int OTP_EXP_MINUTES = 5;

	
	@Override
	public PasswordResetToken generateOtp(String email) {
		String code = String.format("%06d", new Random().nextInt(900000)+100000);
		
		User user = userRepository.findByEmail(email).orElse(null);
		System.out.println("OTP CODE: "+code);
		PasswordResetToken token = PasswordResetToken.builder()
				.email(email)
				.otp(code)
				.user(user)
				.expiredAt(LocalDateTime.now().plusMinutes(OTP_EXP_MINUTES))
				.used(false)
				.build();
		emailer.sendOtpEmail(email, code);
		return passwordResetTokenRepository.save(token);
	}

	@Override
	public Boolean verifyOtp(String email, String code) {
		PasswordResetToken token = passwordResetTokenRepository
				.findFirstByEmailAndUsedFalseOrderByIdDesc(email);
		if(token!=null) {
			if(token.getOtp().equals(code) && token.getExpiredAt().isAfter(LocalDateTime.now())) {
				token.setUsed(true);
				passwordResetTokenRepository.save(token);
				return true;
			}
		}
		return false;
	}

	
	@Override
	public void clearUsedOtps() {
		
	}

}
