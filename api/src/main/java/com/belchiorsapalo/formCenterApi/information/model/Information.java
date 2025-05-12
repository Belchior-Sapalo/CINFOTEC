package com.belchiorsapalo.formCenterApi.information.model;

import java.io.Serializable;
import java.sql.Date;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.belchiorsapalo.formCenterApi.files.model.File;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "TB_INFORMATION")
@Getter
@Setter
@NoArgsConstructor
public class Information implements Serializable {
    private static final long serialVersionUID = 1L;

    public Information(String title, String category, String body) {
        this.body = body;
        this.title = title;
        this.category = category;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @CreationTimestamp
    private Date createdAt;

    @UpdateTimestamp
    private Date updatedAt;

    @Column(nullable = false, unique = true)
    private String title;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String body;

    @OneToOne(mappedBy = "information", cascade = CascadeType.ALL)
    private File image;
}
