package com.belchiorsapalo.formCenterApi.enrollment.service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.belchiorsapalo.formCenterApi.course.model.Course;
import com.belchiorsapalo.formCenterApi.course.repository.CourseRepository;
import com.belchiorsapalo.formCenterApi.enrollment.model.Enrollment;
import com.belchiorsapalo.formCenterApi.enrollment.model.EnrollmentStatus;
import com.belchiorsapalo.formCenterApi.enrollment.repository.EnrollmentRepository;
import com.belchiorsapalo.formCenterApi.exceptions.AnotherApiException;
import com.belchiorsapalo.formCenterApi.exceptions.ResourceAlreadyExistsException;
import com.belchiorsapalo.formCenterApi.exceptions.ResourceNotFoundException;
import com.belchiorsapalo.formCenterApi.files.service.FileService;
import com.belchiorsapalo.formCenterApi.infra.TokenService;
import com.belchiorsapalo.formCenterApi.user.model.User;
import com.belchiorsapalo.formCenterApi.user.repository.UserRepository;

@Service
public class EnrollmentService {
   private final EnrollmentRepository enrollmentRepository;
   private final CourseRepository courseRepository;
   private final UserRepository userRepository;
   private final FileService fileService;
   private final TokenService tokenService;

   @Autowired
   public EnrollmentService(EnrollmentRepository enrollmentRepository, CourseRepository courseRepository,
         UserRepository userRepository, FileService fileService, TokenService tokenService) {
      this.enrollmentRepository = enrollmentRepository;
      this.courseRepository = courseRepository;
      this.userRepository = userRepository;
      this.fileService = fileService;
      this.tokenService = tokenService;
   }

   @Transactional
   public Enrollment register(String token, UUID courseId, MultipartFile bi, MultipartFile certf,
         MultipartFile photo) throws IOException {
      String studentEmail = tokenService.validateToken(token);
      var foundedStudent = (User) userRepository.findUserByEmail(studentEmail);
      Optional<Course> foundedCourse = courseRepository.findById(courseId);
      if (foundedCourse.isEmpty())
            throw new AnotherApiException("Ocorreu um erro ao inscrever o usuário");
      if (foundedCourse.get().getVacancies() <= 0) {
         throw new AnotherApiException("Já não existem vagas para esse curso");
      }
      courseId = foundedCourse.get().getId();
      Enrollment verifyEnrollment = enrollmentRepository.findEnrollmentByStudentIdAndCourseId(
            foundedStudent.getId(), courseId);

      if (verifyEnrollment != null)
         throw new ResourceAlreadyExistsException("Já tem uma inscrição para esse curso");
      Enrollment createdEnrollment = new Enrollment();
      var enrollCourse = courseRepository.findById(courseId)
            .orElseThrow(() -> new ResourceNotFoundException(
                  "Falha ao se inscrever, curso não encontrado"));
      var enrollStudent = userRepository.findById(foundedStudent.getId())
            .orElseThrow(() -> new AnotherApiException(
                  "Ocorreu um erro ao inscrever o usuário"));
      fileService.upload(bi, enrollStudent, createdEnrollment, "Bilhete");
      fileService.upload(certf, enrollStudent, createdEnrollment, "Certificado");
      fileService.upload(photo, enrollStudent, createdEnrollment, "Fotografia");
      createdEnrollment.setCourse(enrollCourse);
      createdEnrollment.setStudent(enrollStudent);
      createdEnrollment.setStatus(EnrollmentStatus.PENDING);
      return enrollmentRepository.save(createdEnrollment);
   }

   public List<Enrollment> getAll() {
      return enrollmentRepository.findAll();
   }

   public List<Enrollment> getStudentEnrollments(UUID id){
      User foundedUser = userRepository.findById(id).orElseThrow(() -> new AnotherApiException("Usuário não encontrado"));
      return enrollmentRepository.findEnrollmentByStudentId(foundedUser.getId());
   }

   @Transactional
   public Enrollment approveEnrollment(UUID id) {
      var enrollmentToApprove = enrollmentRepository.findById(id)
            .orElseThrow(() -> new AnotherApiException(
                  "Ocorreu um erro ao aprovar inscrição"));
      processEnrollment(enrollmentToApprove);
      enrollmentToApprove.setStatus(EnrollmentStatus.APPROVED);
      enrollmentToApprove.setProcessedAt(LocalDateTime.now());
      return enrollmentRepository.save(enrollmentToApprove);
   }

   private void processEnrollment(Enrollment enrollment) {
      Course course = courseRepository.findById(enrollment.getCourse().getId())
              .orElseThrow(() -> new AnotherApiException("Curso não encontrado ao processar inscrição"));

      if (course.getVacancies() <= 0) {
         throw new AnotherApiException("Já não existem vagas para esse curso");
      }

      User student = userRepository.findById(enrollment.getStudent().getId())
              .orElseThrow(() -> new AnotherApiException("Estudante não encontrado ao processar inscrição"));

      course.getStudents().add(student);
      student.getCourses().add(course);

      course.setVacancies(course.getVacancies() - 1);

      userRepository.save(student);
      courseRepository.save(course);
   }

   public Enrollment rejectEnrollment(UUID id) {
      var enrollmentToReject = enrollmentRepository.findById(id)
            .orElseThrow(() -> new AnotherApiException(
                  "Ocorreu um erro ao rejeitar a inscrição"));
      enrollmentToReject.setStatus(EnrollmentStatus.REJECTED);
      enrollmentToReject.setProcessedAt(LocalDateTime.now());
      return enrollmentRepository.save(enrollmentToReject);
   }

   @Transactional
   public void deleteEnrollment(UUID id) throws IOException {
      var enrollmentToDelete = enrollmentRepository.findById(id)
            .orElseThrow(() -> new AnotherApiException(
                  "Ocorreu um erro ao eliminar a inscrição"));
      utilDeleteEnrollmentFiles(enrollmentToDelete);
      utilUpdateUserAndCourseTableDuringDeletingEnrollment(enrollmentToDelete);
      enrollmentRepository.deleteById(id);
   }

   private void utilDeleteEnrollmentFiles(Enrollment enrollment) throws IOException {
      enrollment.getFiles().stream().forEach(file -> {
         try {
            fileService.delete(file.getFileName());
         } catch (IOException e) {
            e.printStackTrace();
         }
      });
   }

   private void utilUpdateUserAndCourseTableDuringDeletingEnrollment(Enrollment enrollmentToDelete) {
      var enrollCourse = courseRepository.findById(enrollmentToDelete.getCourse().getId())
            .orElseThrow(() -> new AnotherApiException(
                  "Ocorreu um erro ao eliminar a inscrição"));
      var enrollStudent = userRepository.findById(enrollmentToDelete.getStudent().getId())
            .orElseThrow(() -> new AnotherApiException(
                  "Ocorreu um erro ao eliminar a inscrição"));
      enrollCourse.getStudents().remove(enrollStudent);
      enrollStudent.getCourses().remove(enrollCourse);
      userRepository.save(enrollStudent);
      courseRepository.save(enrollCourse);
   }
}
