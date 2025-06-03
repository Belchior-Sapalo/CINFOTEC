package com.belchiorsapalo.formCenterApi.enrollment.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.belchiorsapalo.formCenterApi.enrollment.model.EnrollmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import com.belchiorsapalo.formCenterApi.enrollment.model.Enrollment;

public interface EnrollmentRepository extends JpaRepository<Enrollment, UUID>{
    Enrollment findByStudentIdAndCourseId(UUID studentId, UUID courseId);
    List<Enrollment> findByStudentId(UUID studentId);
    Optional<Enrollment> findByIdAndStatus(UUID id, EnrollmentStatus status);
}
