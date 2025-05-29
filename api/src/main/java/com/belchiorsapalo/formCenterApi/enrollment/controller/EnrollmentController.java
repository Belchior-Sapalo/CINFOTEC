package com.belchiorsapalo.formCenterApi.enrollment.controller;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.UUID;

import com.belchiorsapalo.formCenterApi.pdf.services.PdfGeneratorService;
import com.belchiorsapalo.formCenterApi.user.model.User;
import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.belchiorsapalo.formCenterApi.enrollment.model.Enrollment;
import com.belchiorsapalo.formCenterApi.enrollment.service.EnrollmentService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/enrollments")
public class EnrollmentController {
   private final EnrollmentService enrollmentService;
   private final PdfGeneratorService pdfGeneratorService;

   public EnrollmentController(EnrollmentService enrollmentService, PdfGeneratorService pdfGeneratorService) {
      this.enrollmentService = enrollmentService;
      this.pdfGeneratorService = pdfGeneratorService;
   }

   @GetMapping
   public ResponseEntity<List<Enrollment>> getAll() {
      return ResponseEntity.ok().body(enrollmentService.getAll());
   }

   @GetMapping("/me")
   public ResponseEntity<List<Enrollment>> getStudentEnrollments(@AuthenticationPrincipal User user){
      return ResponseEntity.ok().body(enrollmentService.getStudentEnrollments(user.getId()));
   }

   @PostMapping()
   public ResponseEntity<Enrollment> register(
         @RequestParam("token") String token,
         @RequestParam("courseId") UUID courseId,
         @RequestParam("bi") MultipartFile bi,
         @RequestParam("certf") MultipartFile certf,
         @RequestParam("photo") MultipartFile photo) throws IOException {
      return ResponseEntity.status(HttpStatus.CREATED)
            .body(enrollmentService.register(token, courseId, bi, certf, photo));
   }

   @PatchMapping("/{id}/approve")
   public ResponseEntity<Enrollment> approve(@PathVariable UUID id) {
      return ResponseEntity.ok().body(enrollmentService.approveEnrollment(id));
   }

   @PatchMapping("/{id}/reject")
   public ResponseEntity<Enrollment> reject(@PathVariable UUID id) {
      return ResponseEntity.ok().body(enrollmentService.rejectEnrollment(id));
   }

   @DeleteMapping("/{id}")
   public ResponseEntity<Object> delete(@PathVariable UUID id) throws IOException {
      enrollmentService.deleteEnrollment(id);
      return ResponseEntity.ok().build();
   }

   @GetMapping("/proof/{id}")
   public ResponseEntity<byte[]> generateEnrollmentProof(@PathVariable UUID id, @AuthenticationPrincipal User user) {

      byte[] pdf = enrollmentService.generateProof(id);
      String fileName = user.getName() + "_" + "comprovativo-inscricao-cinfotec.pdf";
      ContentDisposition contentDisposition = ContentDisposition
              .builder("attachment")
              .filename(fileName, StandardCharsets.UTF_8)
              .build();
      HttpHeaders headers = new HttpHeaders();
      headers.setContentType(MediaType.APPLICATION_PDF);
      headers.setContentDisposition(contentDisposition);

      return new ResponseEntity<>(pdf, headers, HttpStatus.OK);
   }
}
