
package com.hmi.exp_inc_tracker.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hmi.exp_inc_tracker.entity.FinancialAccount;
import com.hmi.exp_inc_tracker.entity.User;
import com.hmi.exp_inc_tracker.exception.BadRequestException;
import com.hmi.exp_inc_tracker.service.FinancialAccountService;
import com.hmi.exp_inc_tracker.util.AuthenticatedUserService;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/financial-account")
@RequiredArgsConstructor
public class FinancialAccountController {

	private final FinancialAccountService service;
	private final AuthenticatedUserService authService;

	@PostMapping("/create")
	public ResponseEntity<?> create(@RequestBody FinancialAccount acc) {

		User user = authService.getCurrentUser();
		acc.setUser(user);

		FinancialAccount account = service.addAccount(acc);

		if (account != null)
			return ResponseEntity.status(HttpStatus.OK).body(account);
		else
			return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(Map.of("msg", "Failed To Add Account"));
	}

	@PutMapping("/update/{id}")
	public ResponseEntity<?> updateAccount(@PathVariable Long id, @RequestBody FinancialAccount acc) {
		User user = authService.getCurrentUser();
		acc.setUser(user);
		FinancialAccount account = service.modifyAccount(id, acc);
		if (account != null)
			return ResponseEntity.status(HttpStatus.OK).body(account);
		else
			return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(Map.of("msg",
					"Failed to Update Account. Please make sure the currency or the account type is the same after making records with this account."));
	}

	@GetMapping("/getall")
	public ResponseEntity<?> getAll() {

		User user = authService.getCurrentUser();

		List<FinancialAccount> accounts = service.getAll(user);

		if (accounts != null)
			return ResponseEntity.status(HttpStatus.OK).body(accounts);
		else
			return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(Map.of("msg", "Failed To Get Accounts"));
	}

	@DeleteMapping("/remove/{id}")
	public ResponseEntity<?> remove(@PathVariable Long id) {

		try {
			User user = authService.getCurrentUser();

			service.removeAccount(id, user);

			return ResponseEntity.status(HttpStatus.OK).body(Map.of("msg", "Account Removed Successfully"));

		} catch (BadRequestException e) {

			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("msg", e.getMessage()));
		}
	}
}
