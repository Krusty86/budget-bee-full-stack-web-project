
package com.hmi.exp_inc_tracker.service;

import java.util.List;

import com.hmi.exp_inc_tracker.entity.Subscription;
import com.hmi.exp_inc_tracker.entity.User;
import com.hmi.exp_inc_tracker.enums.SubscriptionStatus;

public interface SubscriptionService {

	Subscription createSubscription(Subscription subscription, User user);

	Subscription updateSubscription(Long id, Subscription subscription, User user);

	void cancelSubscription(Long id, User user);

	void pauseSubscription(Long id, User user);

	void resumeSubscription(Long id, User user);

	Subscription getSubscription(Long id, User user);

	List<Subscription> getAllSubscriptions(User user);

	List<Subscription> getSubscriptionsByStatus(User user, SubscriptionStatus status);
}
