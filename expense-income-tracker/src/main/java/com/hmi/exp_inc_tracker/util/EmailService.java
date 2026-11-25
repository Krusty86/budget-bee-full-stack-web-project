package com.hmi.exp_inc_tracker.util;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailService {

	private final JavaMailSender mailSender;
	public void sendOtpEmail(String toEmail, String otpCode) {
        SimpleMailMessage message = new SimpleMailMessage();

		message.setFrom("Budget Bee <noreply@budgetbee.com>");
        message.setTo(toEmail);
        message.setSubject("Your OTP Verification Code");
        // customized text and links
        message.setText("Hello,\n\nYour OTP verification code is: " + otpCode + "\n\nThis code will expire in 5 minutes.");
       
        mailSender.send(message);
    }
	
	public void sendRegisterEmail(String toEmail, String userName) {
		SimpleMailMessage message = new SimpleMailMessage();
		message.setFrom("Budget Bee <noreply@budgetbee.com>");
		message.setTo(toEmail);
		message.setSubject("Account Registration");
		message.setText("Dear"+userName+", \n\nYour account has been successfully created.You can now login to access our services.\n\nBest Regards,\n");
		
		mailSender.send(message);
	}
}
