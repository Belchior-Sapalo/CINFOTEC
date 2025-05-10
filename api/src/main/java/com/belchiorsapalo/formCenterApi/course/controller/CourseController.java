package com.belchiorsapalo.formCenterApi.course.controller;

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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.belchiorsapalo.formCenterApi.course.dtos.CourseRegisterDTO;
import com.belchiorsapalo.formCenterApi.course.model.Course;
import com.belchiorsapalo.formCenterApi.course.service.CourseService;

@CrossOrigin(origins = "http://localhost:5173/")
@RestController
@RequestMapping("/courses")
public class CourseController {

   private final CourseService courseService;

   public CourseController(CourseService courseService) {
      this.courseService = courseService;
   }

   //Teatsdo, sucesso
   @GetMapping
   public ResponseEntity<List<Course>> getAll() {
      return ResponseEntity.ok().body(courseService.getAll());
   }

   //Teatsdo, sucesso
   @GetMapping("/{id}")
   public ResponseEntity<Course> getOne(@PathVariable UUID id) {
      return ResponseEntity.ok().body(courseService.getOne(id));
   }

   //Teatsdo, sucesso
   @PostMapping("/register")
   public ResponseEntity<Course> register(@RequestBody CourseRegisterDTO courseRegisterDTO) {
      return ResponseEntity.status(HttpStatus.CREATED).body(courseService.register(courseRegisterDTO));
   }

   //Teatsdo, sucesso
   @DeleteMapping("/delete/{id}")
   public ResponseEntity<Object> delete(@PathVariable UUID id) {
      courseService.delete(id);
      return ResponseEntity.ok().build();
   }

   //Teatsdo, sucesso
   @PutMapping("/update/{id}")
   public ResponseEntity<Course> update(@RequestBody CourseRegisterDTO courseRegisterDTO, @PathVariable UUID id){
      return ResponseEntity.ok().body(courseService.update(courseRegisterDTO, id));
   }
}
