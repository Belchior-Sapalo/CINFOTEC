package com.belchiorsapalo.formCenterApi.enrollment.controller;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.belchiorsapalo.formCenterApi.enrollment.model.Enrollment;
import com.belchiorsapalo.formCenterApi.enrollment.service.EnrollmentService;

@CrossOrigin(origins = "http://localhost:5173/")
@RestController
@RequestMapping("/enrollments")
public class EnrollmentController {
   private final EnrollmentService enrollmentService;

   public EnrollmentController(EnrollmentService enrollmentService) {
      this.enrollmentService = enrollmentService;
   }

   @GetMapping
   public ResponseEntity<List<Enrollment>> getAll() {
      return ResponseEntity.ok().body(enrollmentService.getAll());
   }

   @GetMapping("/student/{token}")
   public ResponseEntity<List<Enrollment>> getStudentEnrollments(@PathVariable String token){
      return ResponseEntity.ok().body(enrollmentService.getStudentEnrollments(token));
   }

   @PostMapping("/register")
   public ResponseEntity<Enrollment> register(
         @RequestParam("token") String token,
         @RequestParam("courseId") UUID courseId,
         @RequestParam("bi") MultipartFile bi,
         @RequestParam("certf") MultipartFile certf,
         @RequestParam("photo") MultipartFile photo) throws IOException {
      return ResponseEntity.status(HttpStatus.CREATED)
            .body(enrollmentService.register(token, courseId, bi, certf, photo));
   }

   @PutMapping("/approve/{id}")
   public ResponseEntity<Enrollment> approve(@PathVariable UUID id) {
      return ResponseEntity.ok().body(enrollmentService.approveEnrollment(id));
   }

   @PutMapping("/reject/{id}")
   public ResponseEntity<Enrollment> reject(@PathVariable UUID id) {
      return ResponseEntity.ok().body(enrollmentService.rejectEnrollment(id));
   }

   @DeleteMapping("/delete/{id}")
   public ResponseEntity<Object> delete(@PathVariable UUID id) throws IOException {
      enrollmentService.deleteEnrollment(id);
      return ResponseEntity.ok().build();
   }
}
