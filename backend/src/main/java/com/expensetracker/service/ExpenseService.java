package com.expensetracker.service;

import com.expensetracker.dto.ExpenseRequest;
import com.expensetracker.dto.ExpenseResponse;
import com.expensetracker.entity.Expense;
import com.expensetracker.entity.User;
import com.expensetracker.repository.ExpenseRepository;
import com.expensetracker.repository.UserRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ExpenseService {
    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;

    public ExpenseService(ExpenseRepository expenseRepository, UserRepository userRepository) {
        this.expenseRepository = expenseRepository;
        this.userRepository = userRepository;
    }

    public List<ExpenseResponse> getExpenses(Long userId) {
        return expenseRepository.findAllByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::toResponse)
                .toList();
    }

    public ExpenseResponse addExpense(Long userId, ExpenseRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Please log in."));
        Expense expense = expenseRepository.save(new Expense(
                request.text().trim(),
                request.expense(),
                request.sector(),
                user));
        return toResponse(expense);
    }

    public void deleteExpense(Long userId, Long expenseId) {
        Expense expense = expenseRepository.findByIdAndUserId(expenseId, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Expense not found."));
        expenseRepository.delete(expense);
    }

    private ExpenseResponse toResponse(Expense expense) {
        return new ExpenseResponse(expense.getId(), expense.getText(), expense.getAmount(), expense.getSector());
    }
}
