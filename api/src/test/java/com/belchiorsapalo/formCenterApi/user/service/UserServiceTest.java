package com.belchiorsapalo.formCenterApi.user.service;

import com.belchiorsapalo.formCenterApi.exceptions.ResourceAlreadyExistsException;
import com.belchiorsapalo.formCenterApi.exceptions.ResourceNotFoundException;
import com.belchiorsapalo.formCenterApi.files.service.FileService;
import com.belchiorsapalo.formCenterApi.infra.TokenService;
import com.belchiorsapalo.formCenterApi.user.dtos.UserLoginDTO;
import com.belchiorsapalo.formCenterApi.user.dtos.UserRegisterDTO;
import com.belchiorsapalo.formCenterApi.user.model.User;
import com.belchiorsapalo.formCenterApi.user.model.UserRole;
import com.belchiorsapalo.formCenterApi.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private TokenService tokenService;

    @Mock
    private FileService fileService;

    @Mock
    private AuthenticationManager authenticationManager;

    @InjectMocks
    private UserService userService;

    private UserRegisterDTO validUserDTO;
    private User validUser;

    @BeforeEach
    void setUp() {
        validUserDTO = new UserRegisterDTO(
            "Test User",
            "test@example.com",
            "password123",
            "123456789",
            "987654321"
        );

        validUser = new User(validUserDTO, "encodedPassword", UserRole.STUDENT);
    }

    @Test
    void registerShouldCreateNewUserWhenValidData() {
        // Arrange
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(userRepository.existsByBi(anyString())).thenReturn(false);
        when(userRepository.existsByPhoneNumber(anyString())).thenReturn(false);
        when(userRepository.save(any(User.class))).thenReturn(validUser);

        // Act
        User result = userService.register(validUserDTO, false);

        // Assert
        assertNotNull(result);
        assertEquals(validUserDTO.email(), result.getEmail());
        assertEquals(UserRole.STUDENT, result.getRole());
        verify(userRepository).save(any(User.class));
    }

    @Test
    void registerShouldThrowExceptionWhenEmailExists() {
        // Arrange
        when(userRepository.existsByEmail(anyString())).thenReturn(true);

        // Act & Assert
        assertThrows(ResourceAlreadyExistsException.class,
            () -> userService.register(validUserDTO, false));
    }

    @Test
    void loginShouldReturnTokenWhenValidCredentials() {
        // Arrange
        UserLoginDTO loginDTO = new UserLoginDTO(validUserDTO.email(), validUserDTO.password());
        Authentication auth = new UsernamePasswordAuthenticationToken(validUser, null);
        
        when(userRepository.existsByEmail(loginDTO.email())).thenReturn(true);
        when(authenticationManager.authenticate(any())).thenReturn(auth);
        when(tokenService.generateToken(any())).thenReturn("valid-token");

        // Act
        var result = userService.login(loginDTO, authenticationManager);

        // Assert
        assertNotNull(result);
        assertEquals("valid-token", result.token());
        assertEquals(validUser.getRole(), result.role());
    }

    @Test
    void loginShouldThrowExceptionWhenEmailNotFound() {
        // Arrange
        UserLoginDTO loginDTO = new UserLoginDTO("nonexistent@example.com", "password");
        when(userRepository.existsByEmail(loginDTO.email())).thenReturn(false);

        // Act & Assert
        assertThrows(ResourceNotFoundException.class,
            () -> userService.login(loginDTO, authenticationManager));
    }
}