package com.belchiorsapalo.formCenterApi.user.controller;

import com.belchiorsapalo.formCenterApi.user.dtos.*;
import com.belchiorsapalo.formCenterApi.user.model.User;
import com.belchiorsapalo.formCenterApi.user.model.UserRole;
import com.belchiorsapalo.formCenterApi.user.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private UserService userService;

    @MockBean
    private AuthenticationManager authenticationManager;

    private UserRegisterDTO validUserDTO;
    private User validUser;
    private UUID userId;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
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
    void registerShouldReturnCreatedStatus() throws Exception {
        when(userService.register(any(UserRegisterDTO.class), eq(false)))
            .thenReturn(validUser);

        mockMvc.perform(post("/api/users/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validUserDTO)))
                .andExpect(status().isCreated());
    }

    @Test
    void loginShouldReturnToken() throws Exception {
        UserLoginDTO loginDTO = new UserLoginDTO("test@example.com", "password123");
        UserLoginResponseDTO responseDTO = new UserLoginResponseDTO("test-token", UserRole.STUDENT, userId);

        when(userService.login(any(UserLoginDTO.class), any(AuthenticationManager.class)))
            .thenReturn(responseDTO);

        mockMvc.perform(post("/api/users/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("test-token"))
                .andExpect(jsonPath("$.role").value("STUDENT"));
    }

    @Test
    void getAllShouldReturnUsersList() throws Exception {
        when(userService.getAll(eq(true), any()))
            .thenReturn(Arrays.asList(validUser));

        mockMvc.perform(get("/api/users")
                .param("students", "true")
                .param("adminBi", "123456"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].email").value(validUser.getEmail()));
    }

    @Test
    void getProfileShouldReturnUserProfile() throws Exception {
        UserProfileDTO profileDTO = new UserProfileDTO(
            validUser.getName(),
            validUser.getEmail(),
            validUser.getBi(),
            validUser.getPhoneNumber(),
            validUser.getRole()
        );

        when(userService.getUserProfile(any(UUID.class)))
            .thenReturn(profileDTO);

        mockMvc.perform(get("/api/users/profile/{id}", userId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value(validUser.getEmail()));
    }

    @Test
    void updatePasswordShouldReturnNoContent() throws Exception {
        UpdatePasswordDTO passwordDTO = new UpdatePasswordDTO("oldPassword", "newPassword");

        mockMvc.perform(patch("/api/users/{id}/password", userId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(passwordDTO)))
                .andExpect(status().isNoContent());
    }

    @Test
    void updateEmailShouldReturnNewToken() throws Exception {
        UpdateEmailDTO emailDTO = new UpdateEmailDTO("new@example.com", "password123");
        UserLoginResponseDTO responseDTO = new UserLoginResponseDTO("new-token", UserRole.STUDENT, userId);

        when(userService.updateEmail(any(UUID.class), any(UpdateEmailDTO.class), any(AuthenticationManager.class)))
            .thenReturn(responseDTO);

        mockMvc.perform(patch("/api/users/{id}/email", userId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(emailDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("new-token"));
    }
}
