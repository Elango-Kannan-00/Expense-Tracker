package com.expensetracker.controller;

import com.expensetracker.dto.ExpenseRequest;
import com.expensetracker.dto.ExpenseResponse;
import com.expensetracker.service.ExpenseService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {
    private static final String USER_ID = "userId";

    private final ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @GetMapping
    public List<ExpenseResponse> getExpenses(HttpSession session) {
        return expenseService.getExpenses(getUserId(session));
    }

    @PostMapping
    public ExpenseResponse addExpense(@Valid @RequestBody ExpenseRequest request, HttpSession session) {
        return expenseService.addExpense(getUserId(session), request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(@PathVariable Long id, HttpSession session) {
        expenseService.deleteExpense(getUserId(session), id);
        return ResponseEntity.noContent().build();
    }

    private Long getUserId(HttpSession session) {
        Object userId = session.getAttribute(USER_ID);
        if (userId instanceof Long id) {
            return id;
        }
        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Please log in.");
    }
}
