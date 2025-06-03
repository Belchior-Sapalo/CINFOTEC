package com.belchiorsapalo.formCenterApi.PasswordReset.service;

import com.belchiorsapalo.formCenterApi.PasswordReset.model.PasswordResetToken;
import com.belchiorsapalo.formCenterApi.PasswordReset.repository.PasswordResetTokenRepository;
import com.belchiorsapalo.formCenterApi.exceptions.AnotherApiException;
import com.belchiorsapalo.formCenterApi.exceptions.ResourceNotFoundException;
import com.belchiorsapalo.formCenterApi.user.model.User;
import com.belchiorsapalo.formCenterApi.user.repository.UserRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.transaction.Transactional;
import org.hibernate.cache.spi.entry.StructuredCacheEntry;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class PasswordResetService {

    private final UserRepository userRepository;

    private final PasswordResetTokenRepository tokenRepository;

    private final JavaMailSender mailSender;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    public PasswordResetService(UserRepository userRepository, PasswordResetTokenRepository tokenRepository, JavaMailSender mailSender) {
        this.userRepository = userRepository;
        this.tokenRepository = tokenRepository;
        this.mailSender = mailSender;
    }

    @Transactional
    public void createPasswordResetToken(String email) {
        User user = (User) userRepository.findUserByEmail(email);

        if (user == null) throw new ResourceNotFoundException("Se o e-mail fornecido estiver cadastrado, você receberá instruções para redefinir a senha.");

        tokenRepository.deleteByUser(user);

        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = PasswordResetToken
                .builder()
                .token(token)
                .user(user)
                .expirationDate(LocalDateTime.now().plusMinutes(15)).build();
        tokenRepository.save(resetToken);

        String resetLink = frontendUrl + "?token=" + token;
        try {
            sendResetEmail(user.getEmail(), resetLink);
        } catch (MessagingException e) {
            throw new AnotherApiException("Ocorreu um erro ao enviar email de reposição");
        }
    }

    private void sendResetEmail(String email, String resetLink) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setTo(email);
        helper.setSubject("Redefinição de senha - CINFOTEC");

        String htmlContent = getResetPasswordEmailHtml(resetLink);
        helper.setText(htmlContent, true);

        mailSender.send(message);
    }

    private String getResetPasswordEmailHtml(String link) {
        return """
            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
              <meta charset="UTF-8">
              <style>
                body {
                  font-family: sans-serif;
                  background-color: #f9f9f9;
                  padding: 20px;
                }
                .container {
                  max-width: 500px;
                  margin: auto;
                  background-color: #ffffff;
                  border-radius: 8px;
                  padding: 30px;
                  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                }
                .button {
                  background-color: #0A84FF;
                  color: white;
                  padding: 12px 24px;
                  border-radius: 6px;
                  text-decoration: none;
                  display: inline-block;
                  font-weight: bold;
                }
                .footer {
                  margin-top: 20px;
                  font-size: 12px;
                  color: #777;
                  text-align: center;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <h2>Olá!</h2>
                <p>Recebemos uma solicitação para redefinir sua senha.</p>
                <p>Para continuar, clique no botão abaixo:</p>
                <p style="text-align: center;">
                  <a class="button" href="%s">Redefinir Senha</a>
                </p>
                <p>Se você não solicitou essa ação, ignore este e-mail.</p>
                <div class="footer">
                  &copy; 2025 CINFOTEC. Todos os direitos reservados.
                </div>
              </div>
            </body>
            </html>
            """.formatted(link);
    }

    public void resetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new AnotherApiException("Token inválido."));

        if (resetToken.getExpirationDate().isBefore(LocalDateTime.now())) {
            tokenRepository.delete(resetToken);
            throw new AnotherApiException("Token expirado, solicite outro.");
        }

        User user = resetToken.getUser();
        user.setPassword(new BCryptPasswordEncoder().encode(newPassword));
        userRepository.save(user);

        tokenRepository.delete(resetToken);
    }
}
