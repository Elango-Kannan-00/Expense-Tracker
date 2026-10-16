package com.expensetracker.controller;

import com.expensetracker.dto.LoginRequest;
import com.expensetracker.dto.SignupRequest;
import com.expensetracker.dto.UserResponse;
import com.expensetracker.entity.User;
import com.expensetracker.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private static final String USER_ID = "userId";

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    public ResponseEntity<UserResponse> signup(@Valid @RequestBody SignupRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.signup(request));
    }

    @PostMapping("/login")
    public UserResponse login(@Valid @RequestBody LoginRequest request, HttpServletRequest servletRequest) {
        User user = authService.authenticate(request);
        HttpSession oldSession = servletRequest.getSession(false);
        if (oldSession != null) {
            oldSession.invalidate();
        }
        servletRequest.getSession(true).setAttribute(USER_ID, user.getId());
        return new UserResponse(user.getId(), user.getName(), user.getEmail());
    }

    @GetMapping("/me")
    public UserResponse currentUser(HttpSession session) {
        Object userId = session.getAttribute(USER_ID);
        if (!(userId instanceof Long id)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Please log in.");
        }
        return authService.getUser(id);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        return ResponseEntity.noContent().build();
    }
}
