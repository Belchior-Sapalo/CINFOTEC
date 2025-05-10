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
                        .requestMatchers(HttpMethod.POST, "users/auth/admin/register").permitAll()
                        .requestMatchers(HttpMethod.GET, "/users").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "users/profile/{id}").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "users/delete/{id}").authenticated()
                        .requestMatchers(HttpMethod.PUT, "users/updatePassword/{id}").authenticated()
                        .requestMatchers(HttpMethod.PUT, "users/updatePhone/{id}").authenticated()
                        .requestMatchers(HttpMethod.PUT, "users/updateBi/{id}").authenticated()
                        .requestMatchers(HttpMethod.PUT, "users/updateName/{id}").authenticated()
                        .requestMatchers(HttpMethod.PUT, "users/updateEmail/{id}").authenticated()
                        .requestMatchers(HttpMethod.POST, "courses/register").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/courses").permitAll()
                        .requestMatchers(HttpMethod.GET, "/courses/{id}").permitAll()
                        .requestMatchers(HttpMethod.DELETE, "courses/delete/{id}").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "courses/update/{id}").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/enrollments/register").hasRole("USER")
                        .requestMatchers(HttpMethod.GET, "/enrollments/student/{token}").hasRole("USER")
                        .requestMatchers(HttpMethod.GET, "/enrollments").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "enrollments/approve/{id}").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "enrollments/reject/{id}").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "enrollments/delete/{id}").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "informations/register").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "informations").permitAll()
                        .requestMatchers(HttpMethod.GET, "informations/image/{id}").permitAll()
                        .requestMatchers(HttpMethod.GET, "informations/{id}").permitAll()
                        .requestMatchers(HttpMethod.PUT, "informations/update/{id}").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "informations/delete/{id}").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "files/upload").hasRole("USER")
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
