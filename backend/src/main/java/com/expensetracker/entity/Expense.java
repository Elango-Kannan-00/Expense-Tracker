package com.expensetracker.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "expenses")
public class Expense {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String text;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @Column(nullable = false)
    private String sector;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    protected Expense() {
    }

    public Expense(String text, BigDecimal amount, String sector, User user) {
        this.text = text;
        this.amount = amount;
        this.sector = sector;
        this.user = user;
    }

    @PrePersist
    void setCreatedAt() {
        createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public String getText() {
        return text;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public String getSector() {
        return sector;
    }
}
