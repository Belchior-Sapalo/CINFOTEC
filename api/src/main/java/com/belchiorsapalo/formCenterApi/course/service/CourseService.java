package com.belchiorsapalo.formCenterApi.course.service;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.belchiorsapalo.formCenterApi.course.dtos.CourseRegisterDTO;
import com.belchiorsapalo.formCenterApi.course.model.Course;
import com.belchiorsapalo.formCenterApi.course.repository.CourseRepository;
import com.belchiorsapalo.formCenterApi.enrollment.model.Enrollment;
import com.belchiorsapalo.formCenterApi.exceptions.AnotherApiException;
import com.belchiorsapalo.formCenterApi.exceptions.ResourceAlreadyExistsException;
import com.belchiorsapalo.formCenterApi.exceptions.ResourceNotFoundException;
import com.belchiorsapalo.formCenterApi.files.service.FileService;

@Service
public class CourseService {

   private final CourseRepository courseRepository;
   private final FileService fileService;

   @Autowired
   public CourseService(CourseRepository courseRepository, FileService fileService) {
      this.courseRepository = courseRepository;
      this.fileService = fileService;
   }

   public Course register(CourseRegisterDTO courseDTO) {
      if (courseRepository.existsByTitle(courseDTO.title())) throw new ResourceAlreadyExistsException("Já existe um curso com esse título");
      Course createdCourse = new Course(courseDTO);
      return courseRepository.save(createdCourse);
   }

   public Course update(CourseRegisterDTO courseDTO, UUID id) {
      Optional<Course> courOptional = courseRepository.findById(id);
      if (courOptional.isEmpty())
         throw new AnotherApiException("Ocorreu um erro ao atualizar curso");
      Course courseToUpdate = courOptional.get();
      if (!courseDTO.title().equals(courseToUpdate.getTitle()))
         courseToUpdate.setTitle(courseDTO.title());

      if (!courseDTO.description().equals(courseToUpdate.getDescription()))
         courseToUpdate.setDescription(courseDTO.description());

      if (!courseDTO.duration().equals(courseToUpdate.getDuration()))
         courseToUpdate.setDuration(courseDTO.duration());

      courseToUpdate.setPayed(courseDTO.price() != null ? true : false);
      courseToUpdate.setPrice(courseDTO.price());

      return courseRepository.save(courseToUpdate);
   }

   public List<Course> getAll() {
      return courseRepository.findAll();
   }

   public Course getOne(UUID id) {
      var foundedCourse = courseRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Curso não encontrado"));
      return foundedCourse;
   }

   public void delete(UUID id) {
      Optional<Course> foundedCourse = courseRepository.findById(id);
      if (foundedCourse.isEmpty())
         throw new AnotherApiException("Ocorreu um erro ao eliminar curso");
      Course courseToDelete = foundedCourse.get();
      deleteCourseEnrollmentsFiles(courseToDelete.getEnrollments());
      courseRepository.deleteById(id);
   }

   private void deleteCourseEnrollmentsFiles(Set<Enrollment> enrollmentList) {
      enrollmentList.stream().forEach(enroll -> {
         enroll.getFiles().stream().forEach(file -> {
            try {
               fileService.delete(file.getFileName());
            } catch (IOException e) {
                  throw new AnotherApiException("Ocorreu um erro ao eliminar curso");
            }
         });
      });
   }
}
