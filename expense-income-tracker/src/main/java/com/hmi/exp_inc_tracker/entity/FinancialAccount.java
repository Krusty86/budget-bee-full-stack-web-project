package com.hmi.exp_inc_tracker.entity;

import java.math.BigDecimal;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.hmi.exp_inc_tracker.enums.FinancialAccountType;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name="financialaccounts")
public class FinancialAccount extends BaseEntity{
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String accname;
	@Enumerated(EnumType.STRING)
	private FinancialAccountType account_type;
	private String currency;
	private BigDecimal balance;
	
	@ManyToOne
	@JsonIgnore
	private User user;
	
	@OneToMany(mappedBy = "from_account")
	@JsonIgnore
	private List<Transaction> from_accounts;
	
	@OneToMany(mappedBy = "to_account")
	@JsonIgnore
	private List<Transaction> to_accounts;
	
	@OneToMany(mappedBy = "account")
	@JsonIgnore
	private List<Subscription> subscriptions;
}
