package com.belchiorsapalo.formCenterApi.course.controller;

import java.util.List;
import java.util.UUID;

import com.belchiorsapalo.formCenterApi.user.model.User;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.belchiorsapalo.formCenterApi.course.dtos.CourseRegisterDTO;
import com.belchiorsapalo.formCenterApi.course.model.Course;
import com.belchiorsapalo.formCenterApi.course.service.CourseService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/courses")
public class CourseController {

   private final CourseService courseService;

   public CourseController(CourseService courseService) {
      this.courseService = courseService;
   }

   @GetMapping
   public ResponseEntity<List<Course>> getAll() {
      return ResponseEntity.ok().body(courseService.getAll());
   }

   @GetMapping("/{id}")
   public ResponseEntity<Course> getOne(@PathVariable UUID id) {
      return ResponseEntity.ok().body(courseService.getOne(id));
   }

   @PostMapping
   public ResponseEntity<Course> register(@Valid @RequestBody CourseRegisterDTO courseRegisterDTO, @AuthenticationPrincipal User user) {
      return ResponseEntity.status(HttpStatus.CREATED).body(courseService.register(courseRegisterDTO, user));
   }

   @DeleteMapping("/{id}")
   public ResponseEntity<Object> delete(@PathVariable UUID id) {
      courseService.delete(id);
      return ResponseEntity.ok().build();
   }

   @PatchMapping("/{id}")
   public ResponseEntity<Course> update(@Valid @RequestBody CourseRegisterDTO courseRegisterDTO, @PathVariable UUID id){
      return ResponseEntity.ok().body(courseService.update(courseRegisterDTO, id));
   }
}
