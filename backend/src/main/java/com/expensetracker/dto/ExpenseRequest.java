package com.expensetracker.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public record ExpenseRequest(
        @NotBlank @Size(max = 200) String text,
        @NotNull @Positive @Digits(integer = 10, fraction = 2) BigDecimal expense,
        @NotBlank @Pattern(regexp = "Food & Groceries|Transportation|Medical/Healthcare|Entertainment|Others")
        String sector) {
}
