package com.hmi.exp_inc_tracker.service_impl;

import java.math.BigDecimal;
import java.util.List;
import java.util.Locale;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hmi.exp_inc_tracker.entity.FinancialAccount;
import com.hmi.exp_inc_tracker.entity.User;
import com.hmi.exp_inc_tracker.enums.SubscriptionStatus;
import com.hmi.exp_inc_tracker.exception.BadRequestException;
import com.hmi.exp_inc_tracker.repository.FinancialAccountRepository;
import com.hmi.exp_inc_tracker.repository.SubscriptionRepository;
import com.hmi.exp_inc_tracker.repository.TransactionRepository;
import com.hmi.exp_inc_tracker.service.FinancialAccountService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FinancialAccountServiceImpl implements FinancialAccountService{
	private final FinancialAccountRepository repo;
	private final TransactionRepository transactionRepo;
	private final SubscriptionRepository subRepo;
	
	
	@Override
	@Transactional
	public FinancialAccount addAccount(FinancialAccount account) {
		if (account == null || account.getUser() == null
                || account.getUser().getId() == null) {
            throw new BadRequestException("Authenticated user is required");
        }

        validateAccountData(account);

        account.setId(null);
        account.setCurrency(normalizeCurrency(account.getCurrency()));
        if (account.getBalance() == null) {
            account.setBalance(BigDecimal.ZERO);
        }

        return repo.save(account);
	}

	@Override
	public FinancialAccount modifyAccount(Long id,FinancialAccount acc) {
		// TODO Auto-generated method stub
		FinancialAccount a = repo.findById(id).orElse(null);
		
		// check for any records related to this account
		boolean hasLinkedRecords = transactionRepo.hasAnyForAccount(acc.getId())
				|| subRepo.existsByAccountIdAndUserId(acc.getId(), acc.getUser().getId());
		if(hasLinkedRecords && (acc.getCurrency().equalsIgnoreCase(a.getCurrency()) || a.getAccount_type()!= acc.getAccount_type()))
			return null;
		a.setBalance(acc.getBalance()==null?a.getBalance():acc.getBalance());
		a.setAccname(acc.getAccname());
		a.setAccount_type(acc.getAccount_type());
		String currency = normalizeCurrency(acc.getCurrency());
		a.setCurrency(currency);
		
		
		return repo.save(a);
	}

	@Override
	@Transactional
	public void removeAccount(Long id, User user) {

	    FinancialAccount account = repo.findById(id)
	            .orElseThrow(() -> new BadRequestException("Account not found"));

	    if (!account.getUser().getId().equals(user.getId())) {
	        throw new BadRequestException("You cannot remove another user's account");
	    }

	    if (subRepo.existsByAccountIdAndUserIdAndStatus(
	            id, user.getId(), SubscriptionStatus.ACTIVE)) {

	        throw new BadRequestException(
	                "Change or Cancel active recurring subscriptions before removing this account.");
	    }

	    repo.delete(account);
	}
	@Override
	public List<FinancialAccount> getAll(User user) {
		// TODO Auto-generated method stub
		return repo.findAllByUser(user);
	}
	private void validateAccountData(FinancialAccount account) {
        if (account.getAccname() == null || account.getAccname().isBlank()) {
            throw new BadRequestException("Account name is required");
        }
        if (account.getAccount_type() == null) {
            throw new BadRequestException("Account type is required");
        }
        if (account.getBalance() != null
                && account.getBalance().compareTo(BigDecimal.ZERO) < 0) {
            throw new BadRequestException("Opening balance cannot be negative");
        }
        normalizeCurrency(account.getCurrency());
    }

    private String normalizeCurrency(String currency) {
        if (currency == null || currency.trim().length() != 3) {
            throw new BadRequestException("Currency must be a 3-letter currency code");
        }
        return currency.trim().toUpperCase(Locale.ROOT);
    }

    private void validateUser(User user) {
        if (user == null || user.getId() == null) {
            throw new BadRequestException("Authenticated user is required");
        }
    }
}
