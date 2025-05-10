package com.belchiorsapalo.formCenterApi.course.model;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

import com.belchiorsapalo.formCenterApi.course.dtos.CourseRegisterDTO;
import com.belchiorsapalo.formCenterApi.enrollment.model.Enrollment;
import com.belchiorsapalo.formCenterApi.user.model.User;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "TB_COURSE")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Course implements Serializable {
   private static final long serialVersionUID = 1L;

   @Id
   @GeneratedValue(strategy = GenerationType.UUID)
   private UUID id;

   @Column(nullable = false)
   private String title;

   @Column(nullable = false)
   private String duration;

   @Column(nullable = false, columnDefinition = "TEXT")
   private String description;

   @Column(nullable = false)
   private boolean isPayed;

   @Column(nullable = true)
   private BigDecimal price;

   public Course(CourseRegisterDTO courseRegisterDTO) {
      this.title = courseRegisterDTO.title();
      this.description = courseRegisterDTO.description();
      this.duration = courseRegisterDTO.duration();
      this.price = courseRegisterDTO.price();
      this.isPayed = courseRegisterDTO.price() != null ? true : false;
   }

   @ManyToMany
   @JoinTable(name = "tb_course_students", joinColumns = @JoinColumn(name = "course_id"), inverseJoinColumns = @JoinColumn(name = "student_id"))
   private Set<User> students = new HashSet<>();

   @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
   @OneToMany(mappedBy = "course", cascade = CascadeType.ALL)
   private Set<Enrollment> enrollments = new HashSet<>();

}
