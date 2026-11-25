package com.hmi.exp_inc_tracker.controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/password-reset")
@RequiredArgsConstructor
public class PasswordResetTokenController {

}
