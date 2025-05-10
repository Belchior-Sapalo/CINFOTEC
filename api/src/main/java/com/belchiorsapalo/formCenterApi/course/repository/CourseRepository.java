package com.belchiorsapalo.formCenterApi.course.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.belchiorsapalo.formCenterApi.course.model.Course;

public interface CourseRepository extends JpaRepository<Course, UUID>{
    boolean existsByTitle(String title);
}
