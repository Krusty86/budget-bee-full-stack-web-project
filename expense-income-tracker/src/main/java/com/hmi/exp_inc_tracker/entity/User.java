package com.hmi.exp_inc_tracker.entity;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name="users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User extends BaseEntity{

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(nullable = false)
	private String userName;
	
	@Column(nullable = false, unique = true)
	private String email;
	
	private String fullName;
	
	@Column(nullable = false, columnDefinition = "text")
	private String password;
	
	private String phone;
	
	
	@OneToMany(mappedBy = "user")
	private List<TaskList> tasklists;
	
	@OneToMany(mappedBy = "user")
	private List<PasswordResetToken> passwordresettokens;
	
	@OneToMany(mappedBy = "user")
	private List<Transaction> transactions;
	
	@OneToMany(mappedBy = "user")
	private List<FinancialAccount> financialaccounts;

	@OneToMany(mappedBy = "user")
	private List<Budget> budgets;
	
	@OneToMany(mappedBy = "user")
	private List<Subscription> subscriptions;
	
	@OneToMany(mappedBy = "user")
	private List<PaymentReminder> paymentreminders;
}
