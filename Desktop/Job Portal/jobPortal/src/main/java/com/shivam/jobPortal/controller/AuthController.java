package com.shivam.jobPortal.controller;

import com.shivam.jobPortal.dto.LoginRequest;
import com.shivam.jobPortal.dto.LoginResponse;
import com.shivam.jobPortal.dto.RegisterRequest;
import com.shivam.jobPortal.entity.User;
import com.shivam.jobPortal.exception.ResourceNotFoundException;
import com.shivam.jobPortal.repository.UserRepository;
import com.shivam.jobPortal.service.JwtService;
import com.shivam.jobPortal.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserService userService,
                          JwtService jwtService,
                          UserRepository userRepository,
                          PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(
            @RequestBody RegisterRequest request) {

        String result = userService.register(request);

        return ResponseEntity.ok(result);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @RequestBody LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {

            throw new ResourceNotFoundException("Invalid Credentials");
        }

        String token = jwtService.generateToken(
                user.getEmail(),
                user.getRole().name()
        );

        LoginResponse response = new LoginResponse(
                token,
                user.getName(),
                user.getEmail(),
                user.getRole()
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/profile")
    public ResponseEntity<String> profile() {

        Authentication auth =
                SecurityContextHolder.getContext()
                        .getAuthentication();

        return ResponseEntity.ok(
                "Logged in as: " + auth.getName()
        );
    }
}