package com.hmi.exp_inc_tracker.service;

import java.util.List;

import com.hmi.exp_inc_tracker.entity.FinancialAccount;
import com.hmi.exp_inc_tracker.entity.User;

public interface FinancialAccountService {
	FinancialAccount addAccount(FinancialAccount acc);
	FinancialAccount modifyAccount(Long id,FinancialAccount acc);
	void removeAccount(Long id, User user);
	List<FinancialAccount> getAll(User user);
}
