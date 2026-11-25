package com.hmi.exp_inc_tracker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class ExpenseIncomeTrackerApplication {

	public static void main(String[] args) {
		SpringApplication.run(ExpenseIncomeTrackerApplication.class, args);
	}

}
