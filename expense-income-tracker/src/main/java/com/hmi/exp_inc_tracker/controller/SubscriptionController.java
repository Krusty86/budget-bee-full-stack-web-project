package com.hmi.exp_inc_tracker.controller;

import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.hmi.exp_inc_tracker.entity.Subscription;
import com.hmi.exp_inc_tracker.entity.User;
import com.hmi.exp_inc_tracker.enums.SubscriptionStatus;
import com.hmi.exp_inc_tracker.service.SubscriptionService;
import com.hmi.exp_inc_tracker.util.AuthenticatedUserService;
import lombok.RequiredArgsConstructor;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/subscription")
@RequiredArgsConstructor
public class SubscriptionController {
	private final SubscriptionService service;
	private final AuthenticatedUserService authService;

	@PostMapping("/create")
	public ResponseEntity<?> create(@RequestBody Subscription subscription) {
		User user = authService.getCurrentUser();
		Subscription saved = service.createSubscription(subscription, user);
		if (saved != null)
			return ResponseEntity.status(HttpStatus.OK).body(saved);
		return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED)
				.body(Map.of("msg", "Failed To Create Subscription"));
	}

	@PutMapping("/update/{id}")
	public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Subscription subscription) {
		User user = authService.getCurrentUser();
		Subscription updated = service.updateSubscription(id, subscription, user);
		if (updated != null)
			return ResponseEntity.status(HttpStatus.OK).body(updated);
		return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED)
				.body(Map.of("msg", "Failed To Update Subscription"));
	}

	@GetMapping("/getall")
	public ResponseEntity<?> getAll() {
		User user = authService.getCurrentUser();
		List<Subscription> subscriptions = service.getAllSubscriptions(user);
		if (subscriptions != null)
			return ResponseEntity.status(HttpStatus.OK).body(subscriptions);
		return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(Map.of("msg", "Failed To Get Subscriptions"));
	}

	@GetMapping("/get/{id}")
	public ResponseEntity<?> getOne(@PathVariable Long id) {
		User user = authService.getCurrentUser();
		return ResponseEntity.ok(service.getSubscription(id, user));
	}

	@GetMapping("/status/{status}")
	public ResponseEntity<?> getByStatus(@PathVariable SubscriptionStatus status) {
		User user = authService.getCurrentUser();
		return ResponseEntity.ok(service.getSubscriptionsByStatus(user, status));
	}

	@PatchMapping("/{id}/pause")
	public ResponseEntity<?> pause(@PathVariable Long id) {
		User user = authService.getCurrentUser();
		service.pauseSubscription(id, user);
		return ResponseEntity.ok(Map.of("msg", "Subscription Paused Successfully"));
	}

	@PatchMapping("/{id}/resume")
	public ResponseEntity<?> resume(@PathVariable Long id) {
		User user = authService.getCurrentUser();
		service.resumeSubscription(id, user);
		return ResponseEntity.ok(Map.of("msg", "Subscription Resumed Successfully"));
	}

	@PatchMapping("/{id}/cancel")
	public ResponseEntity<?> cancel(@PathVariable Long id) {
		User user = authService.getCurrentUser();
		service.cancelSubscription(id, user);
		return ResponseEntity.ok(Map.of("msg", "Subscription Cancelled Successfully"));
	}
}
