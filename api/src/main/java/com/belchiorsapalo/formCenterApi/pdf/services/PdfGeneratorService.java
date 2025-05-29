package com.belchiorsapalo.formCenterApi.pdf.services;

import com.belchiorsapalo.formCenterApi.enrollment.model.Enrollment;
import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class PdfGeneratorService {
    private final TemplateEngine templateEngine;
    public PdfGeneratorService(TemplateEngine templateEngine) {
        this.templateEngine = templateEngine;
    }

    public byte[] generateEnrollmentProof(Enrollment enrollment) {

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
        String createdAt = enrollment.getCreatedAt().toLocalDate().format(formatter);
        String processedAt = enrollment.getProcessedAt().format(formatter);
        String generationDate = LocalDateTime.now().format(formatter);

        Context context = new Context();
        context.setVariable("numero", enrollment.getId());
        context.setVariable("nome", enrollment.getStudent().getName());
        context.setVariable("Bilhete", enrollment.getStudent().getBi());
        context.setVariable("email", enrollment.getStudent().getEmail());
        context.setVariable("curso", enrollment.getCourse().getTitle());
        context.setVariable("createdAt", createdAt);
        context.setVariable("processedAt", processedAt);
        context.setVariable("generationDate", generationDate);

        String htmlContent = templateEngine.process("enrollmentProof", context);

        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            PdfRendererBuilder builder = new PdfRendererBuilder();
            builder.useFastMode();
            builder.withHtmlContent(htmlContent, null);
            builder.toStream(outputStream);
            builder.run();

            return outputStream.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Erro ao gerar comprovativo PDF", e);
        }
    }
}
