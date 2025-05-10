package com.belchiorsapalo.formCenterApi.enrollment.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.belchiorsapalo.formCenterApi.enrollment.model.Enrollment;

public interface EnrollmentRepository extends JpaRepository<Enrollment, UUID>{
    Enrollment findEnrollmentByStudentIdAndCourseId(UUID studentId, UUID courseId);
    List<Enrollment> findEnrollmentByStudentId(UUID studentId);
}
