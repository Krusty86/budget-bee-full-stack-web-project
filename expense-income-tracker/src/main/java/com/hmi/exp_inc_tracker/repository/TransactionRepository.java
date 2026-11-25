
package com.hmi.exp_inc_tracker.repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.hmi.exp_inc_tracker.entity.Transaction;
import com.hmi.exp_inc_tracker.enums.TransactionCategory;
import com.hmi.exp_inc_tracker.enums.TransactionType;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

	Optional<Transaction> findByIdAndUserId(Long id, Long userId);

	boolean existsBySubscriptionIdAndUserId(Long subscriptionId, Long userId);

	boolean existsByCategoryAndUserId(TransactionCategory category, Long userId);

	@EntityGraph(attributePaths = { "from_account", "to_account", "subscription" })
	List<Transaction> findAllByUserIdAndCreatedAtGreaterThanEqualAndCreatedAtLessThanOrderByCreatedAtDesc(Long userId,
			LocalDateTime start, LocalDateTime end);

	@Query("""
			    SELECT CASE WHEN COUNT(t) > 0 THEN true ELSE false END
			    FROM Transaction t
			    WHERE t.from_account.id = :accountId
			       OR t.to_account.id = :accountId
			""")
	boolean hasAnyForAccount(@Param("accountId") Long accountId);

	// Calculate expenses for one category and currency.
	@Query("""
			    SELECT COALESCE(SUM(t.amount), 0)
			    FROM Transaction t
			    WHERE t.user.id = :userId
			      AND t.transaction_type = :type
			      AND t.category = :category
			      AND t.createdAt >= :start
			      AND t.createdAt < :end
			      AND t.from_account.currency = :currency
			""")
	BigDecimal calculateCategoryExpense(@Param("userId") Long userId, @Param("type") TransactionType type,
			@Param("category") TransactionCategory category, @Param("start") LocalDateTime start,
			@Param("end") LocalDateTime end, @Param("currency") String currency);

	// Calculate all expenses, regardless of category.
	@Query("""
			    SELECT COALESCE(SUM(t.amount), 0)
			    FROM Transaction t
			    WHERE t.user.id = :userId
			      AND t.transaction_type = :type
			      AND t.createdAt >= :start
			      AND t.createdAt < :end
			      AND t.from_account.currency = :currency
			""")
	BigDecimal calculateOverallExpense(@Param("userId") Long userId, @Param("type") TransactionType type,
			@Param("start") LocalDateTime start, @Param("end") LocalDateTime end, @Param("currency") String currency);

	List<Transaction> findAllByUserIdOrderByCreatedAtDesc(Long userId);

	List<Transaction> findAllByUserIdAndCategoryOrderByCreatedAtDesc(Long userId, TransactionCategory category);

	@Query("""
			    SELECT t
			    FROM Transaction t
			    WHERE t.user.id = :userId
			      AND t.transaction_type = :type
			    ORDER BY t.transactionDate DESC
			""")
	List<Transaction> findAllByUserIdAndTransactionTypeOrderByTransactionDateDesc(Long userId, TransactionType type);

	@Query("""
			SELECT CASE WHEN COUNT(t) > 0 THEN true ELSE false END
			FROM Transaction t
			WHERE (t.from_account.id = :accountId OR t.to_account.id = :accountId)
			  AND t.user.id = :userId
			""")
	boolean hasAnyForAccountAndUser(@Param("accountId") Long accountId, @Param("userId") Long userId);

	@Query("""
			SELECT COALESCE(SUM(t.amount), 0)
			FROM Transaction t
			WHERE t.user.id = :userId
			  AND t.transaction_type IN :types
			  AND (:category IS NULL OR t.category = :category)
			  AND t.transactionDate >= :startDate
			  AND t.transactionDate <= :endDate
			  AND t.from_account.currency = :currency
			""")
	BigDecimal calculateBudgetExpenses(@Param("userId") Long userId, @Param("types") Collection<TransactionType> types,
			@Param("category") TransactionCategory category, @Param("startDate") LocalDate startDate,
			@Param("endDate") LocalDate endDate, @Param("currency") String currency);

	@EntityGraph(attributePaths = { "from_account", "to_account", "subscription" })
	List<Transaction> findAllByUserIdOrderByTransactionDateDesc(Long userId);

	@EntityGraph(attributePaths = { "from_account", "to_account", "subscription" })
	List<Transaction> findAllByUserIdAndCategoryOrderByTransactionDateDesc(Long userId, TransactionCategory category);

	@EntityGraph(attributePaths = { "from_account", "to_account", "subscription" })
	List<Transaction> findAllByUserIdAndTransactionDateBetweenOrderByTransactionDateDesc(Long userId,
			LocalDate startDate, LocalDate endDate);
}
