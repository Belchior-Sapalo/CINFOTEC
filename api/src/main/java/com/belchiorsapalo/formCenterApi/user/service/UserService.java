package com.belchiorsapalo.formCenterApi.user.service;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

import com.belchiorsapalo.formCenterApi.user.dtos.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.belchiorsapalo.formCenterApi.exceptions.AnotherApiException;
import com.belchiorsapalo.formCenterApi.exceptions.ResourceAlreadyExistsException;
import com.belchiorsapalo.formCenterApi.exceptions.ResourceNotFoundException;
import com.belchiorsapalo.formCenterApi.exceptions.UnauthorizedUserException;
import com.belchiorsapalo.formCenterApi.files.service.FileService;
import com.belchiorsapalo.formCenterApi.infra.TokenService;
import com.belchiorsapalo.formCenterApi.user.model.User;
import com.belchiorsapalo.formCenterApi.user.model.UserRole;
import com.belchiorsapalo.formCenterApi.user.repository.UserRepository;

@Service
public class UserService implements UserDetailsService {
    private final UserRepository userRepository;
    private final TokenService tokenService;
    private final FileService fileService;

    @Autowired
    public UserService(UserRepository userRepository,
            TokenService tokenService, FileService fileService) {
        this.userRepository = userRepository;
        this.tokenService = tokenService;
        this.fileService = fileService;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findUserByEmail(email);
    }

    public User register(UserRegisterDTO userDTO, boolean isAnAdmin) {

        validateInformations(userDTO);
            
        String encryptedPassword = new BCryptPasswordEncoder().encode(userDTO.password());
        User createdUser = isAnAdmin ? new User(userDTO, encryptedPassword, UserRole.ADMIN)
                : new User(userDTO, encryptedPassword, UserRole.STUDENT);
        return userRepository.save(createdUser);
    }

    private void validateInformations(UserRegisterDTO uDto){
        if (userRepository.existsByEmail(uDto.email())) throw new ResourceAlreadyExistsException("Este email já existe, tente outro");

        if (userRepository.existsByBi(uDto.bi())) throw new ResourceAlreadyExistsException("Este BI já existe, tente outro");

        if (userRepository.existsByPhoneNumber(uDto.phoneNumber())) throw new ResourceAlreadyExistsException("Este número de telefone já existe, tente outro");
    }

    public UserLoginResponseDTO login(UserLoginDTO userDTO, AuthenticationManager authenticationManager) {
        if (!userRepository.existsByEmail(userDTO.email())) throw new ResourceNotFoundException("Este email não existe");
        var usernamepassword = new UsernamePasswordAuthenticationToken(userDTO.email(), userDTO.password());
        var auth = authenticationManager.authenticate(usernamepassword);
        String token = tokenService.generateToken((User) auth.getPrincipal());
        var authenticatedUser = (User) auth.getPrincipal();
        return new UserLoginResponseDTO(token, authenticatedUser.getRole(), authenticatedUser.getId());
    }

    public List<User> getAll(boolean students, String adminBi) {
        return students ? userRepository.findAll().stream().filter(user -> user.getRole().equals(UserRole.STUDENT) && !user.getCourses().isEmpty()).toList() :
                userRepository.findAll().stream().filter(user -> user.getRole().equals(UserRole.ADMIN) && !user.getBi().equals(adminBi)).toList();
    }

    public UserProfileDTO getUserProfile(UUID id) {
        var foundedUser = userRepository.findById(id)
                .orElseThrow(() -> new AnotherApiException("Ocorreu um erro ao carregar perfil"));
        return new UserProfileDTO(foundedUser.getName(), foundedUser.getEmail(), foundedUser.getBi(),
                foundedUser.getPhoneNumber(), foundedUser.getRole());
    }

    public void delete(UUID id) throws IOException {
        if (!userRepository.existsById(id)) throw new ResourceNotFoundException("Ocorreu um erro ao eliminar usuário");
        var userToDelete = userRepository.findById(id)
                .orElseThrow(() -> new AnotherApiException("Ocorreu um erro ao eliminar usuário"));
        utilDeleteUserFiles(userToDelete);
        userRepository.deleteById(id);
    }

    private void utilDeleteUserFiles(User user) throws IOException {
        user.getFiles().stream().forEach(file -> {
            try {
                fileService.delete(file.getFileName());
            } catch (IOException e) {
                e.printStackTrace();
            }
        });
    }

    public void changePassword(UUID id, UpdatePasswordDTO dto) {
        var userToUpdate = userRepository.findById(id)
                .orElseThrow(() -> new AnotherApiException("Ocorreu um erro ao atualizar senha"));
        var currentPassword = dto.password();
        var newPassword = dto.newPassword();

        BCryptPasswordEncoder bcrypt = new BCryptPasswordEncoder();
        boolean isPasswordCorrect = bcrypt.matches(currentPassword, userToUpdate.getPassword());

        if (isPasswordCorrect) {
            if (!currentPassword.equals(newPassword)) {
                userToUpdate.setPassword(bcrypt.encode(newPassword));
                userRepository.save(userToUpdate);
            }
        } else {
            throw new UnauthorizedUserException("A senha actual está incorreta");
        }
    }

    public void updateName(UUID id, UpdateNameDTO dto) {
        var userToUpdate = userRepository.findById(id)
                .orElseThrow(() -> new AnotherApiException("Ocorreu um erro ao atualizar nome"));
        var currentName = userToUpdate.getName();
        var newName = dto.name();
        if (!currentName.equals(newName)) {
            userToUpdate.setName(newName);
            userRepository.save(userToUpdate);
        }
    }

    public UserLoginResponseDTO updateEmail(UUID id, UpdateEmailDTO dto,
            AuthenticationManager authenticationManager) {
        if (userRepository.existsByEmail(dto.email())) throw new ResourceAlreadyExistsException("Este email já existe, tente outro");

        var userToUpdate = userRepository.findById(id)
                .orElseThrow(() -> new AnotherApiException("Ocorreu um erro ao atualizar email"));
        var newEmail = dto.email();
        BCryptPasswordEncoder bcrypt = new BCryptPasswordEncoder();
        boolean isPasswordCorrect = bcrypt.matches(dto.password(), userToUpdate.getPassword());
        if (!isPasswordCorrect)
            throw new UnauthorizedUserException("Senha incorreta, não pode continuar!");
        userToUpdate.setEmail(newEmail);
        userRepository.save(userToUpdate);
        return login(new UserLoginDTO(userToUpdate.getEmail(), dto.password()), authenticationManager);
    }

    public void updateBi(UUID id, UpdateBiDTO dto) {
        var userToUpdate = userRepository.findById(id)
                .orElseThrow(() -> new AnotherApiException("Ocorreu um erro ao atualizar BI"));
         User verifyUserByBi = userRepository.findUserByBi(dto.bi());
        if (verifyUserByBi != null)
            throw new ResourceAlreadyExistsException("Este BI já existe, tente outro");
        var currentBi = userToUpdate.getBi();
        var newBi = dto.bi();
        if (!currentBi.equals(newBi)) {
            userToUpdate.setBi(newBi);
            userRepository.save(userToUpdate);
        }
    }

    public void updatePhone(UUID id, UpdatePhoneDTO dto) {
        var userToUpdate = userRepository.findById(id)
                .orElseThrow(() -> new AnotherApiException("Ocorreu um erro ao atualizar telefone"));
        User verifyPhoneNumber = userRepository.findUserByPhoneNumber(dto.phoneNumber());
        if (verifyPhoneNumber != null)
            throw new ResourceAlreadyExistsException("Este número de telefone já existe, tente outro");
        var currentPhone = userToUpdate.getPhoneNumber();
        var newPhone = dto.phoneNumber();
        if (!currentPhone.equals(newPhone)) {
            userToUpdate.setPhoneNumber(newPhone);
            userRepository.save(userToUpdate);
        }
    }
}
