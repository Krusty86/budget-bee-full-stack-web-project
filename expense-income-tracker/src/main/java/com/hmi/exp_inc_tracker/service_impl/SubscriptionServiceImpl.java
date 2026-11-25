package com.hmi.exp_inc_tracker.service_impl;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hmi.exp_inc_tracker.entity.FinancialAccount;
import com.hmi.exp_inc_tracker.entity.Subscription;
import com.hmi.exp_inc_tracker.entity.User;
import com.hmi.exp_inc_tracker.enums.SubscriptionStatus;
import com.hmi.exp_inc_tracker.exception.BadRequestException;
import com.hmi.exp_inc_tracker.exception.ResourceNotFoundException;
import com.hmi.exp_inc_tracker.repository.FinancialAccountRepository;
import com.hmi.exp_inc_tracker.repository.SubscriptionRepository;
import com.hmi.exp_inc_tracker.service.SubscriptionService;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class SubscriptionServiceImpl implements SubscriptionService {

    private final SubscriptionRepository subscriptionRepo;
    private final FinancialAccountRepository accountRepo;

    @Override
    public Subscription createSubscription(Subscription request, User user) {
        validateRequest(request);
        Subscription subscription = new Subscription();
        copyFields(request, subscription);
        subscription.setUser(user);
        subscription.setStatus(request.getStatus() == null ? SubscriptionStatus.ACTIVE : request.getStatus());
        subscription.setAccount(resolveAccount(request.getAccount(), user));
        return subscriptionRepo.save(subscription);
    }

    @Override
    public Subscription updateSubscription(Long id, Subscription request, User user) {
        validateRequest(request);
        Subscription existing = getSubscription(id, user);
        copyFields(request, existing);
        if (request.getAccount() != null) existing.setAccount(resolveAccount(request.getAccount(), user));
        // Status transitions are handled by pause/resume/cancel endpoints.
        return subscriptionRepo.save(existing);
    }

    @Override
    public void cancelSubscription(Long id, User user) {
        Subscription subscription = getSubscription(id, user);
        if (subscription.getStatus() == SubscriptionStatus.CANCELLED)
            throw new BadRequestException("Subscription is already cancelled");
        subscription.setStatus(SubscriptionStatus.CANCELLED);
        subscriptionRepo.save(subscription);
    }

    @Override
    public void pauseSubscription(Long id, User user) {
        Subscription subscription = getSubscription(id, user);
        if (subscription.getStatus() != SubscriptionStatus.ACTIVE)
            throw new BadRequestException("Only active subscriptions can be paused");
        subscription.setStatus(SubscriptionStatus.PAUSED);
        subscriptionRepo.save(subscription);
    }

    @Override
    public void resumeSubscription(Long id, User user) {
        Subscription subscription = getSubscription(id, user);
        if (subscription.getStatus() != SubscriptionStatus.PAUSED)
            throw new BadRequestException("Only paused subscriptions can be resumed");
        subscription.setStatus(SubscriptionStatus.ACTIVE);
        subscriptionRepo.save(subscription);
    }

    @Override
    @Transactional(readOnly = true)
    public Subscription getSubscription(Long id, User user) {
        return subscriptionRepo.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Subscription not found"));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Subscription> getAllSubscriptions(User user) {
        return subscriptionRepo.findAllByUserId(user.getId());
    }

    @Override
    @Transactional(readOnly = true)
    public List<Subscription> getSubscriptionsByStatus(User user, SubscriptionStatus status) {
        if (status == null) throw new BadRequestException("Subscription status is required");
        return subscriptionRepo.findAllByUserIdAndStatus(user.getId(), status);
    }

    private FinancialAccount resolveAccount(FinancialAccount requested, User user) {
        if (requested == null || requested.getId() == null)
            throw new BadRequestException("A financial account is required for this subscription");
        return accountRepo.findByIdAndUserId(requested.getId(), user.getId())
                .orElseThrow(() -> new BadRequestException("Selected account does not belong to this user"));
    }

    private void validateRequest(Subscription request) {
        if (request == null) throw new BadRequestException("Subscription data is required");
        if (request.getName() == null || request.getName().isBlank())
            throw new BadRequestException("Subscription name is required");
        if (request.getAmount() == null || request.getAmount().compareTo(BigDecimal.ZERO) <= 0)
            throw new BadRequestException("Subscription amount must be greater than zero");
        if (request.getBillingCycle() == null)
            throw new BadRequestException("Billing cycle is required");
        if (request.getNextPaymentDate() == null)
            throw new BadRequestException("Next payment date is required");
    }

    private void copyFields(Subscription source, Subscription target) {
        target.setName(source.getName().trim());
        target.setAmount(source.getAmount());
        target.setBillingCycle(source.getBillingCycle());
        target.setNextPaymentDate(source.getNextPaymentDate());
    }
}
