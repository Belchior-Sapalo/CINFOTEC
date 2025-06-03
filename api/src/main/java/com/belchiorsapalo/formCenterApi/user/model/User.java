package com.belchiorsapalo.formCenterApi.user.model;

import java.io.Serial;
import java.util.*;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.belchiorsapalo.formCenterApi.course.model.Course;
import com.belchiorsapalo.formCenterApi.enrollment.model.Enrollment;
import com.belchiorsapalo.formCenterApi.files.model.File;
import com.belchiorsapalo.formCenterApi.user.dtos.UserRegisterDTO;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "TB_USER")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class User implements UserDetails {
    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false, unique = true)
    private String bi;

    @Column(nullable = false, unique = true)
    private String phoneNumber;

    @Column(nullable = false)
    private UserRole role;

    @Column(nullable = false)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    public User(UserRegisterDTO userCreationDTO, String encryptedPassword, UserRole role) {
        this.name = userCreationDTO.name();
        this.email = userCreationDTO.email();
        this.bi = userCreationDTO.bi();
        this.phoneNumber = userCreationDTO.phoneNumber();
        this.role = role;
        this.password = encryptedPassword;
    }

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @ManyToMany(mappedBy = "students", fetch = FetchType.LAZY)
    private Set<Course> courses = new HashSet<>();

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @OneToMany(mappedBy = "student", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Set<Enrollment> enrollments = new HashSet<>();

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<File> files;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        List<SimpleGrantedAuthority> authorities = new ArrayList<>();

        if (this.role == UserRole.SUPER){
            authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
            authorities.add(new SimpleGrantedAuthority("ROLE_SUPER"));
        } else if (this.role == UserRole.ADMIN) {
            authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
        }else  {
            authorities.add(new SimpleGrantedAuthority("ROLE_STUDENT"));
        }
        return authorities;
    }

    @Override
    public String getUsername() {
        return this.email;
    }
}
