package com.belchiorsapalo.formCenterApi.files.model;

import java.io.Serializable;
import java.util.UUID;

import com.belchiorsapalo.formCenterApi.enrollment.model.Enrollment;
import com.belchiorsapalo.formCenterApi.information.model.Information;
import com.belchiorsapalo.formCenterApi.user.model.User;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "TB_FILE")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class File implements Serializable {
    private static final long serialVersionUID = 1L;

    public File(String fileName, String type, String downloadLink, User user, Enrollment enrollment){
        this.fileName = fileName;
        this.type = type;
        this.downloadLink = downloadLink;
        this.user = user;
        this.enrollment = enrollment;
    }

    public File(String fileName, String type, String downloadLink, Information information){
        this.type = type;
        this.fileName = fileName;
        this.downloadLink = downloadLink;
        this.information = information;
    }

    public File(String fileName, String type, String downloadLink){
        this.type = type;
        this.fileName = fileName;
        this.downloadLink = downloadLink;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String fileName;

    @Column(nullable = false)
    private String type;

    @Column(nullable = false)
    private String downloadLink;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id")
    private User user;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "enrollment_id")
    private Enrollment enrollment;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @OneToOne
    @JoinColumn(name = "info_id")
    private Information information;
}
