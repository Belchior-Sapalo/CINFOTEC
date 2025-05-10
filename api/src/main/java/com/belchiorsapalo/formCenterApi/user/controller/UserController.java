package com.belchiorsapalo.formCenterApi.user.controller;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.belchiorsapalo.formCenterApi.user.dtos.UserLoginDTO;
import com.belchiorsapalo.formCenterApi.user.dtos.UserLoginResponseDTO;
import com.belchiorsapalo.formCenterApi.user.dtos.UserProfileDTO;
import com.belchiorsapalo.formCenterApi.user.dtos.UserRegisterDTO;
import com.belchiorsapalo.formCenterApi.user.dtos.UserUpdateDTO;
import com.belchiorsapalo.formCenterApi.user.model.User;
import com.belchiorsapalo.formCenterApi.user.service.UserService;

import jakarta.validation.Valid;

@CrossOrigin(origins = "http://localhost:5173/")
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
    @GetMapping("/profile/{id}")
    public ResponseEntity<UserProfileDTO> getUserProfile(@PathVariable UUID id){
        return ResponseEntity.ok().body(userService.getUserProfile(id));
    }

    //Testado, sucesso
    @DeleteMapping("delete/{id}")
    public ResponseEntity<Object> delete(@PathVariable UUID id) throws IOException{
        userService.delete(id);
        return ResponseEntity.ok().build();
    }

    //Testado, sucesso
    @PutMapping("/updatePassword/{id}")
    public ResponseEntity<Object> changePassword(@PathVariable UUID id, @Valid @RequestBody UserUpdateDTO userUpdateDTO){
        userService.changePassword(id, userUpdateDTO);
        return ResponseEntity.ok().build();
    }

    //Testado, sucesso
    @PutMapping("/updateName/{id}")
    public ResponseEntity<Object> updateName(@PathVariable UUID id, @Valid @RequestBody UserUpdateDTO userUpdateDTO){
        userService.updateName(id, userUpdateDTO);
        return ResponseEntity.ok().build();
    }

    //Testado, sucesso
    @PutMapping("/updateEmail/{id}")
    public ResponseEntity<UserLoginResponseDTO> updateEmail(@PathVariable UUID id, @Valid @RequestBody UserUpdateDTO userUpdateDTO){
        return ResponseEntity.ok().body(userService.updateEmail(id, userUpdateDTO, authenticationManager));
    }

    //Testado, sucesso
    @PutMapping("/updateBi/{id}")
    public ResponseEntity<Object> updateBi(@PathVariable UUID id, @Valid @RequestBody UserUpdateDTO userUpdateDTO){
        userService.updateBi(id, userUpdateDTO);
        return ResponseEntity.ok().build();
    }

    //Testado, sucesso
    @PutMapping("/updatePhone/{id}")
    public ResponseEntity<Object> updatePhone(@PathVariable UUID id, @Valid @RequestBody UserUpdateDTO userUpdateDTO){
        userService.updatePhone(id, userUpdateDTO);
        return ResponseEntity.ok().build();
    }
}
