package com.belchiorsapalo.formCenterApi.user.controller;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

import com.belchiorsapalo.formCenterApi.user.dtos.*;
import org.springframework.beans.factory.annotation.Autowired;
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

    @Autowired
    public UserController(UserService userService, AuthenticationManager authenticationManager){
        this.userService = userService;
        this.authenticationManager = authenticationManager;
    }

    //Testado, sucesso
    @GetMapping
    public ResponseEntity<List<User>> getAll(){
        return ResponseEntity.ok().body(userService.getAll());
    }
    
    //Testado, sucesso
    @PostMapping("/auth/register")
    public ResponseEntity<User> register(@Valid @RequestBody UserRegisterDTO user){
        return ResponseEntity.ok().body(userService.register(user, false));
    }

    //Testado, sucesso
    @PostMapping("/auth/admin/register")
    public ResponseEntity<User> registerAdmin(@Valid @RequestBody UserRegisterDTO user){
        return ResponseEntity.ok().body(userService.register(user, true));
    }

    //Testado, sucesso
    @PostMapping("/auth/login")
    public ResponseEntity<UserLoginResponseDTO> login(@Valid @RequestBody UserLoginDTO user){
        return ResponseEntity.ok().body(userService.login(user, authenticationManager));
    }

    //Testado, sucesso
    @GetMapping("/me")
    public ResponseEntity<UserProfileDTO> getUserProfile(@AuthenticationPrincipal User user){
        return ResponseEntity.ok().body(userService.getUserProfile(user.getId()));
    }

    //Testado, sucesso
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> delete(@PathVariable UUID id) throws IOException{
        userService.delete(id);
        return ResponseEntity.ok().build();
    }

    //Testado, sucesso
    @PatchMapping("/me/password")
    public ResponseEntity<Object> changePassword(@AuthenticationPrincipal User user, @Valid @RequestBody UpdatePasswordDTO dto){
        userService.changePassword(user.getId(), dto);
        return ResponseEntity.ok().build();
    }

    //Testado, sucesso
    @PatchMapping("/me/name")
    public ResponseEntity<Object> updateName(@AuthenticationPrincipal User user, @Valid @RequestBody UpdateNameDTO dto){
        userService.updateName(user.getId(), dto);
        return ResponseEntity.ok().build();
    }

    //Testado, sucesso
    @PatchMapping("/me/email")
    public ResponseEntity<UserLoginResponseDTO> updateEmail(@AuthenticationPrincipal User user, @Valid @RequestBody UpdateEmailDTO dto){
        return ResponseEntity.ok().body(userService.updateEmail(user.getId(), dto, authenticationManager));
    }

    //Testado, sucesso
    @PatchMapping("/me/bi")
    public ResponseEntity<Object> updateBi(@AuthenticationPrincipal User user, @Valid @RequestBody UpdateBiDTO dto){
        userService.updateBi(user.getId(), dto);
        return ResponseEntity.ok().build();
    }

    //Testado, sucesso
    @PatchMapping("/me/phone")
    public ResponseEntity<Object> updatePhone(@AuthenticationPrincipal User user, @Valid @RequestBody UpdatePhoneDTO dto){
        userService.updatePhone(user.getId(), dto);
        return ResponseEntity.ok().build();
    }
}
