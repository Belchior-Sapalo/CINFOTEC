package com.belchiorsapalo.formCenterApi.PasswordReset.repository;

import com.belchiorsapalo.formCenterApi.PasswordReset.model.PasswordResetToken;
import com.belchiorsapalo.formCenterApi.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, UUID> {
    Optional<PasswordResetToken> findByToken(String token);
    void deleteByUser(User user);
}
