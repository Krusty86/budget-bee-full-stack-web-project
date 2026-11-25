package com.hmi.exp_inc_tracker.entity;
import java.math.BigDecimal;
import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.hmi.exp_inc_tracker.enums.BillingCycle;
import com.hmi.exp_inc_tracker.enums.SubscriptionStatus;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name="subscriptions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Subscription extends BaseEntity{
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@ManyToOne
	@JsonIgnore
	private	User user;
	@ManyToOne
	@JsonIgnore
	private FinancialAccount account;
	private String name;
	private BigDecimal amount;
	@Enumerated(EnumType.STRING)
	private SubscriptionStatus status;
	@Enumerated(EnumType.STRING)
	private BillingCycle billingCycle;
	private LocalDate nextPaymentDate;
	
	@OneToOne(mappedBy = "subscription")
	private PaymentReminder paymentReminder;
}
