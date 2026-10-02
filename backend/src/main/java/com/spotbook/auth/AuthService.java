package com.spotbook.auth;

import com.spotbook.auth.dto.AuthResponse;
import com.spotbook.auth.dto.LoginRequest;
import com.spotbook.auth.dto.RegisterRequest;
import com.spotbook.auth.dto.UserResponse;
import com.spotbook.infrastructure.exception.BadRequestException;
import com.spotbook.infrastructure.security.JwtProvider;
import com.spotbook.user.User;
import com.spotbook.user.UserRole;
import com.spotbook.user.UserRepository;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtProvider jwtProvider
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtProvider = jwtProvider;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new BadRequestException("User with email " + request.email() + " already exists");
        }

        User user = User.builder()
                .email(request.email().toLowerCase().trim())
                .passwordHash(passwordEncoder.encode(request.password()))
                .fullName(request.fullName().trim())
                .role(UserRole.ROLE_USER)
                .build();

        User savedUser = userRepository.save(user);
        String token = jwtProvider.generateToken(savedUser);

        return new AuthResponse(
                token,
                new UserResponse(savedUser.getId(), savedUser.getEmail(), savedUser.getFullName(), savedUser.getRole())
        );
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email().toLowerCase().trim())
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new BadCredentialsException("Invalid email or password");
        }

        String token = jwtProvider.generateToken(user);

        return new AuthResponse(
                token,
                new UserResponse(user.getId(), user.getEmail(), user.getFullName(), user.getRole())
        );
    }
}
