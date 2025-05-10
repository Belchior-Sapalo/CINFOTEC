package com.belchiorsapalo.formCenterApi.enrollment.model;

import java.io.Serializable;
import java.sql.Date;
import java.util.List;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.belchiorsapalo.formCenterApi.course.model.Course;
import com.belchiorsapalo.formCenterApi.files.model.File;
import com.belchiorsapalo.formCenterApi.user.model.User;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "TB_ENROLLMENT")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Enrollment implements Serializable {
   private static final long serialVersionUID = 1L;

   @Id
   @GeneratedValue(strategy = GenerationType.UUID)
   private UUID id;

   @CreationTimestamp
   private Date createdAt;

   @UpdateTimestamp
   private Date updatedAt;

   @Column(nullable = false)
   private EnrollmentStatus status;

   @ManyToOne
   @JoinColumn(name = "student_id")
   private User student;

   @ManyToOne
   @JoinColumn(name = "course_id")
   private Course course;

   @OneToMany(mappedBy = "enrollment", cascade = CascadeType.ALL)
   private List<File> files;
}
