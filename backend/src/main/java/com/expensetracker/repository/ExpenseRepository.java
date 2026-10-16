package com.expensetracker.repository;

import com.expensetracker.entity.Expense;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findAllByUserIdOrderByCreatedAtDesc(Long userId);

    Optional<Expense> findByIdAndUserId(Long id, Long userId);
}
