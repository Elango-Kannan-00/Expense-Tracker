package com.expensetracker.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.expensetracker.dto.LoginRequest;
import com.expensetracker.dto.SignupRequest;
import com.expensetracker.entity.User;
import com.expensetracker.repository.UserRepository;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

class AuthServiceTest {
    @Test
    void signupHashesPasswordAndLoginChecksTheHash() {
        UserRepository userRepository = org.mockito.Mockito.mock(UserRepository.class);
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        AuthService authService = new AuthService(userRepository, passwordEncoder);
        String password = "not-stored-as-plain-text";

        when(userRepository.existsByEmail("user@example.com")).thenReturn(false);
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        authService.signup(new SignupRequest("Test User", "USER@example.com", password, "9876543210"));

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());
        User savedUser = userCaptor.getValue();
        assertNotEquals(password, savedUser.getPasswordHash());
        assertTrue(passwordEncoder.matches(password, savedUser.getPasswordHash()));
        assertEquals("user@example.com", savedUser.getEmail());

        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(savedUser));
        assertSame(savedUser, authService.authenticate(new LoginRequest("USER@example.com", password)));
    }
}
