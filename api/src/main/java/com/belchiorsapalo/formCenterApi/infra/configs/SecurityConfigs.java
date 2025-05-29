package com.belchiorsapalo.formCenterApi.infra.configs;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfigs {
    private SecurityFilter securityFilter;

    @Autowired
    public SecurityConfigs(SecurityFilter securityFilter) {
        this.securityFilter = securityFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        return httpSecurity
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers(HttpMethod.POST, "/users/auth/register").permitAll()
                        .requestMatchers(HttpMethod.POST, "/users/auth/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/users/auth/admin/register").hasRole("SUPER")
                        .requestMatchers(HttpMethod.GET, "/users/admins").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/users/students").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "users/me").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "users/me").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "users/{id}").hasRole("SUPER")
                        .requestMatchers(HttpMethod.PATCH, "users/me/password").authenticated()
                        .requestMatchers(HttpMethod.PATCH, "users/me/phone").authenticated()
                        .requestMatchers(HttpMethod.PATCH, "users/me/bi").authenticated()
                        .requestMatchers(HttpMethod.PATCH, "users/me/name").authenticated()
                        .requestMatchers(HttpMethod.PATCH, "users/me/email").authenticated()
                        .requestMatchers(HttpMethod.POST, "/courses").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/courses").permitAll()
                        .requestMatchers(HttpMethod.GET, "/courses/{id}").permitAll()
                        .requestMatchers(HttpMethod.DELETE, "courses/{id}").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "courses/{id}").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/enrollments").hasRole("STUDENT")
                        .requestMatchers(HttpMethod.GET, "/enrollments/me").hasRole("STUDENT")
                        .requestMatchers(HttpMethod.GET, "/enrollments").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/enrollments/proof/{id}").authenticated()
                        .requestMatchers(HttpMethod.PATCH, "enrollments/{id}/approve").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "enrollments/{id}/reject").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "enrollments/{id}").authenticated()
                        .requestMatchers(HttpMethod.POST, "/informations").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "informations").permitAll()
                        .requestMatchers(HttpMethod.GET, "informations/image/{id}").permitAll()
                        .requestMatchers(HttpMethod.GET, "informations/{id}").permitAll()
                        .requestMatchers(HttpMethod.PATCH, "informations/{id}").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "informations/{id}").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "files/upload").hasRole("STUDENT")
                        .requestMatchers(HttpMethod.GET, "files/download/{fileName:.+}").permitAll()
                        .requestMatchers(HttpMethod.GET, "files/list").hasRole("ADMIN"))
                .addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration)
            throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
