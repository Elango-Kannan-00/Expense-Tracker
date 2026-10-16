package com.expensetracker.dto;

import java.math.BigDecimal;

public record ExpenseResponse(Long id, String text, BigDecimal expense, String sector) {
}
