package com.spotbook.auth;

import com.spotbook.auth.dto.AuthResponse;
import com.spotbook.auth.dto.LoginRequest;
import com.spotbook.auth.dto.RegisterRequest;
import com.spotbook.infrastructure.exception.BadRequestException;
import com.spotbook.infrastructure.security.JwtProvider;
import com.spotbook.user.User;
import com.spotbook.user.UserRole;
import com.spotbook.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.Clock;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    private JwtProvider jwtProvider;
    private AuthService authService;

    @BeforeEach
    void setUp() {
        jwtProvider = new JwtProvider(
                "dGhpcy1pcy1hLXZlcnktc2VjdXJlLTI1Ni1iaXQtbG9uZy1zZWNyZXQta2V5LXNwY2U=",
                24,
                Clock.systemUTC()
        );
        authService = new AuthService(userRepository, passwordEncoder, jwtProvider);
    }

    @Test
    void shouldRegisterNewUserSuccessfully() {
        RegisterRequest request = new RegisterRequest("test@spotbook.com", "John Doe", "password123");

        when(userRepository.existsByEmail("test@spotbook.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("encoded_hash");

        User savedUser = User.builder()
                .email("test@spotbook.com")
                .passwordHash("encoded_hash")
                .fullName("John Doe")
                .role(UserRole.ROLE_USER)
                .build();
        savedUser.setId(UUID.randomUUID());

        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        AuthResponse response = authService.register(request);

        assertThat(response).isNotNull();
        assertThat(response.token()).isNotBlank();
        assertThat(response.user().email()).isEqualTo("test@spotbook.com");
        assertThat(response.user().fullName()).isEqualTo("John Doe");
        assertThat(response.user().role()).isEqualTo(UserRole.ROLE_USER);
    }

    @Test
    void shouldThrowWhenRegisteringExistingEmail() {
        RegisterRequest request = new RegisterRequest("existing@spotbook.com", "Jane", "password123");
        when(userRepository.existsByEmail("existing@spotbook.com")).thenReturn(true);

        assertThatThrownBy(() -> authService.register(request))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("already exists");
    }

    @Test
    void shouldAuthenticateValidUser() {
        LoginRequest request = new LoginRequest("user@spotbook.com", "correct_password");

        User user = User.builder()
                .email("user@spotbook.com")
                .passwordHash("hashed_secret")
                .fullName("User Name")
                .role(UserRole.ROLE_USER)
                .build();
        user.setId(UUID.randomUUID());

        when(userRepository.findByEmail("user@spotbook.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("correct_password", "hashed_secret")).thenReturn(true);

        AuthResponse response = authService.login(request);

        assertThat(response.token()).isNotBlank();
        assertThat(response.user().email()).isEqualTo("user@spotbook.com");
    }

    @Test
    void shouldRejectInvalidPassword() {
        LoginRequest request = new LoginRequest("user@spotbook.com", "wrong_password");

        User user = User.builder()
                .email("user@spotbook.com")
                .passwordHash("hashed_secret")
                .fullName("User Name")
                .role(UserRole.ROLE_USER)
                .build();

        when(userRepository.findByEmail("user@spotbook.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrong_password", "hashed_secret")).thenReturn(false);

        assertThatThrownBy(() -> authService.login(request))
                .isInstanceOf(BadCredentialsException.class)
                .hasMessageContaining("Invalid email or password");
    }
}
