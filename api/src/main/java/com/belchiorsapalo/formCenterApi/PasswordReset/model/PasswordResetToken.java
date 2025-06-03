package com.belchiorsapalo.formCenterApi.PasswordReset.model;

import com.belchiorsapalo.formCenterApi.user.model.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "TB_TOKEN")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PasswordResetToken {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String token;

    private LocalDateTime expirationDate;

    @OneToOne
    private User user;
}
