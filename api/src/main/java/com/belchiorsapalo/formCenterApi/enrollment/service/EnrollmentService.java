package com.belchiorsapalo.formCenterApi.enrollment.service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.belchiorsapalo.formCenterApi.pdf.services.PdfGeneratorService;
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
   private final PdfGeneratorService pdfGeneratorService;

   @Autowired
   public EnrollmentService(EnrollmentRepository enrollmentRepository, CourseRepository courseRepository,
         UserRepository userRepository, FileService fileService, TokenService tokenService, PdfGeneratorService pdfGeneratorService) {
      this.enrollmentRepository = enrollmentRepository;
      this.courseRepository = courseRepository;
      this.userRepository = userRepository;
      this.fileService = fileService;
      this.tokenService = tokenService;
      this.pdfGeneratorService = pdfGeneratorService;
   }

   @Transactional
   public Enrollment register(String token, UUID courseId, MultipartFile bi, MultipartFile certf,
         MultipartFile photo) throws IOException {
      String studentEmail = tokenService.validateToken(token);
      var student = (User) userRepository.findUserByEmail(studentEmail);
      if (student == null) throw  new AnotherApiException(
              "Ocorreu um erro ao inscrever o usuário");
      Course course = courseRepository.findById(courseId).orElseThrow(() -> new AnotherApiException("Ocorreu um erro ao inscrever o usuário"));

      if (course.getVacancies() <= 0) {
         throw new AnotherApiException("Já não existem vagas para esse curso");
      }
      Enrollment verifyEnrollment = enrollmentRepository.findByStudentIdAndCourseId(
              student.getId(), course.getId());

      if (verifyEnrollment != null)
         throw new ResourceAlreadyExistsException("Já tem uma inscrição para esse curso");

      Enrollment createdEnrollment = new Enrollment();
      fileService.upload(bi, student, createdEnrollment, "Bilhete");
      fileService.upload(certf, student, createdEnrollment, "Certificado");
      fileService.upload(photo, student, createdEnrollment, "Fotografia");
      createdEnrollment.setCourse(course);
      createdEnrollment.setStudent(student);
      createdEnrollment.setStatus(EnrollmentStatus.PENDING);
      return enrollmentRepository.save(createdEnrollment);
   }

   public List<Enrollment> getAll() {
      return enrollmentRepository.findAll();
   }

   public List<Enrollment> getStudentEnrollments(UUID id){
      User foundedUser = userRepository.findById(id).orElseThrow(() -> new AnotherApiException("Usuário não encontrado"));
      return enrollmentRepository.findByStudentId(foundedUser.getId());
   }

   @Transactional
   public Enrollment approveEnrollment(UUID id) {
      var enrollmentToApprove = enrollmentRepository.findByIdAndStatus(id, EnrollmentStatus.PENDING)
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
      var enrollment = enrollmentRepository.findByIdAndStatus(id, EnrollmentStatus.PENDING)
            .orElseThrow(() -> new AnotherApiException(
                  "Ocorreu um erro ao rejeitar a inscrição"));
      enrollment.setStatus(EnrollmentStatus.REJECTED);
      enrollment.setProcessedAt(LocalDateTime.now());
      return enrollmentRepository.save(enrollment);
   }

   public byte[] generateProof(UUID id){
      Enrollment enrollment = enrollmentRepository.findById(id).orElseThrow(() -> new AnotherApiException("Ocorreu um erro ao gerar comprovativo de inscrição"));
      if (!enrollment.getStatus().equals(EnrollmentStatus.APPROVED))
         throw new AnotherApiException("Não é possível gerar comprovativo de uma inscrição não aprovada");
      return pdfGeneratorService.generateEnrollmentProof(enrollment);
   }

   @Transactional
   public void deleteEnrollment(UUID id) throws IOException {
      var enrollmentToDelete = enrollmentRepository.findById(id)
            .orElseThrow(() -> new AnotherApiException(
                  "Ocorreu um erro ao eliminar a inscrição"));
      deleteEnrollmentFiles(enrollmentToDelete);
      processEnrollmentDeletion(enrollmentToDelete);
      enrollmentRepository.deleteById(id);
   }

   private void deleteEnrollmentFiles(Enrollment enrollment) throws IOException {
      enrollment.getFiles().forEach(file -> {
         try {
            fileService.delete(file.getFileName());
         } catch (IOException e) {
            throw new AnotherApiException(
                    "Ocorreu um erro ao eliminar a inscrição");
         }
      });
   }

   private void processEnrollmentDeletion(Enrollment enrollmentToDelete) {
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
