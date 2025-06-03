package com.belchiorsapalo.formCenterApi.user.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;

import com.belchiorsapalo.formCenterApi.user.model.User;

public interface UserRepository extends JpaRepository<User, UUID> {
    UserDetails findUserByEmail(String email);
    User findByBi(String bi);
    User findByPhoneNumber(String phoneNumber);
    boolean existsByEmail(String email);
    boolean existsByPhoneNumber(String phoneNumber);
    boolean existsByBi(String bi);
}
