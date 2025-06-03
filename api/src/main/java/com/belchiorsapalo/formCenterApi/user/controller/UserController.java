package com.belchiorsapalo.formCenterApi.user.controller;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import com.belchiorsapalo.formCenterApi.PasswordReset.dtos.ForgotPasswordRequest;
import com.belchiorsapalo.formCenterApi.PasswordReset.dtos.ResetPasswordRequest;
import com.belchiorsapalo.formCenterApi.PasswordReset.service.PasswordResetService;
import com.belchiorsapalo.formCenterApi.user.dtos.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.belchiorsapalo.formCenterApi.user.model.User;
import com.belchiorsapalo.formCenterApi.user.service.UserService;

import jakarta.validation.Valid;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final PasswordResetService passwordResetService;

    @Autowired
    public UserController(UserService userService, AuthenticationManager authenticationManager, PasswordResetService passwordResetService){
        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.passwordResetService = passwordResetService;
    }

    @GetMapping("/students")
    public ResponseEntity<List<User>> getAllStudents(){
        return ResponseEntity.ok().body(userService.getAll(true, null));
    }

    @GetMapping("/admins")
    public ResponseEntity<List<User>> getAllAdmins(@AuthenticationPrincipal User user){
        return ResponseEntity.ok().body(userService.getAll(false, user.getBi()));
    }
    
    @PostMapping("/auth/register")
    public ResponseEntity<User> register(@Valid @RequestBody UserRegisterDTO user){
        return ResponseEntity.ok().body(userService.register(user, false));
    }

    @PostMapping("/auth/admin/register")
    public ResponseEntity<User> registerAdmin(@Valid @RequestBody UserRegisterDTO user){
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.register(user, true));
    }

    @PostMapping("/auth/login")
    public ResponseEntity<UserLoginResponseDTO> login(@Valid @RequestBody UserLoginDTO user){
        return ResponseEntity.ok().body(userService.login(user, authenticationManager));
    }

    @GetMapping("/me")
    public ResponseEntity<UserProfileDTO> getUserProfile(@AuthenticationPrincipal User user){
        return ResponseEntity.ok().body(userService.getUserProfile(user.getId()));
    }

    @PatchMapping("/me/password")
    public ResponseEntity<Object> changePassword(@AuthenticationPrincipal User user, @Valid @RequestBody UpdatePasswordDTO dto){
        userService.changePassword(user.getId(), dto);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/me/name")
    public ResponseEntity<Object> updateName(@AuthenticationPrincipal User user, @Valid @RequestBody UpdateNameDTO dto){
        userService.updateName(user.getId(), dto);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/me/email")
    public ResponseEntity<UserLoginResponseDTO> updateEmail(@AuthenticationPrincipal User user, @Valid @RequestBody UpdateEmailDTO dto){
        return ResponseEntity.ok().body(userService.updateEmail(user.getId(), dto, authenticationManager));
    }

    @PatchMapping("/me/bi")
    public ResponseEntity<Object> updateBi(@AuthenticationPrincipal User user, @Valid @RequestBody UpdateBiDTO dto){
        userService.updateBi(user.getId(), dto);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/me/phone")
    public ResponseEntity<Object> updatePhone(@AuthenticationPrincipal User user, @Valid @RequestBody UpdatePhoneDTO dto){
        userService.updatePhone(user.getId(), dto);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/auth/forgot-password")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody ForgotPasswordRequest body) {
        passwordResetService.createPasswordResetToken(body.email());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/auth/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequest body) {
        passwordResetService.resetPassword(body.token(), body.newPassword());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/me")
    public ResponseEntity<Object> delete(@AuthenticationPrincipal User user) throws IOException{
        userService.delete(user.getId());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteAdmin(@PathVariable UUID id) throws IOException{
        userService.delete(id);
        return ResponseEntity.ok().build();
    }
}
