package com.shivam.jobPortal.service;

import com.shivam.jobPortal.dto.RegisterRequest;
import com.shivam.jobPortal.entity.User;
import com.shivam.jobPortal.repository.UserRepository;
import io.jsonwebtoken.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.shivam.jobPortal.entity.Role;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;



    public UserService(UserRepository userRepository , PasswordEncoder passwordEncoder, JwtService jwtService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public String register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            return "Email already exists";
        }

        User user = new User(
                request.getName(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                request.getRole()
        );


        userRepository.save(user);

        return "User registered successfully";
    }
}