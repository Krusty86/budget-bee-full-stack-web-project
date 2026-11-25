package com.hmi.exp_inc_tracker.util;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.hmi.exp_inc_tracker.entity.User;
import com.hmi.exp_inc_tracker.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthenticatedUserService {

    private final UserRepository userRepo;

    public User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null ||
                !authentication.isAuthenticated() ||
                authentication.getPrincipal().equals("anonymousUser")) {
            throw new RuntimeException("User is not authenticated");
        }

        String email = authentication.getName();

        return userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}