package com.belchiorsapalo.formCenterApi.files.service;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.belchiorsapalo.formCenterApi.enrollment.model.Enrollment;
import com.belchiorsapalo.formCenterApi.exceptions.AnotherApiException;
import com.belchiorsapalo.formCenterApi.exceptions.ResourceNotFoundException;
import com.belchiorsapalo.formCenterApi.files.config.FileStorageProperties;
import com.belchiorsapalo.formCenterApi.files.model.File;
import com.belchiorsapalo.formCenterApi.files.repository.FileRepository;
import com.belchiorsapalo.formCenterApi.information.model.Information;
import com.belchiorsapalo.formCenterApi.user.model.User;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;

@Service
public class FileService {
   private final Path fileStorageLocation;
   private final FileRepository fileRepository;

   public FileService(FileStorageProperties fileStorageProperties, FileRepository fileRepository) {
      this.fileStorageLocation = Paths.get(fileStorageProperties.getUploadDir()).toAbsolutePath().normalize();
      this.fileRepository = fileRepository;
   }

   @Transactional
   public void upload(MultipartFile file, User student, Enrollment enrollment, String type) throws IOException {
      LocalDateTime now = LocalDateTime.now();
      DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd_HH-mm-ss");
      String fileName = StringUtils
            .cleanPath(type + "_" + student.getName() + "_" + now.format(formatter) + "_"
                  + Objects.requireNonNull(file.getOriginalFilename()).replace(" ", "_"));

      Path targetLocation = fileStorageLocation.resolve(fileName);
      try {
         file.transferTo(targetLocation);
         String fileDownloadUri = ServletUriComponentsBuilder
               .fromCurrentContextPath()
               .path("/files/download/")
               .path(fileName).toUriString();
         File newFile = new File(fileName, type, fileDownloadUri, student, enrollment);
         fileRepository.save(newFile);
      } catch (IOException e) {
         throw new AnotherApiException("Ocorreu um erro ao fazer o upload do arquivo");
      }

   }

   @Transactional
   public File upload(MultipartFile file, String type, Information information) throws IOException {
      LocalDateTime now = LocalDateTime.now();
      DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd_HH-mm-ss");
      String fileName = StringUtils
            .cleanPath(type + "_" + now.format(formatter) + "_" + Objects.requireNonNull(file.getOriginalFilename()).replace(" ", "_"));

      Path targetLocation = fileStorageLocation.resolve(fileName);
      try {
         file.transferTo(targetLocation);
         String fileDownloadUri = ServletUriComponentsBuilder
               .fromCurrentContextPath()
               .path("/files/download/")
               .path(fileName).toUriString();
         File newFile = new File(fileName, type, fileDownloadUri, information);
         return fileRepository.save(newFile);
      } catch (IOException e) {
         throw new AnotherApiException("Ocorreu um erro ao fazer o upload do arquivo");
      }

   }

   /*public File uploadTest(MultipartFile file, String type){
      LocalDateTime now  = LocalDateTime.now();
      DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyy-MM-dd_HH-mm-ss");

      String fileName = StringUtils.cleanPath(type + "_" + now.format(formatter) + "_" + file.getOriginalFilename().replace(" ", "_"));

      Path targetLOcation = fileStorageLocation.resolve(fileName);

      try {
         file.transferTo(targetLOcation);
         String fileDownloadUri = ServletUriComponentsBuilder
            .fromCurrentContextPath()
            .path("/files/download/")
            .path(fileName).toUriString();

            File newFile = new File(fileName, type, fileDownloadUri);
            return fileRepository.save(newFile);
      } catch (IOException e) {
         e.printStackTrace();
         throw new AnotherApiException(e.getMessage());
      }
   }/* */

   public ResponseEntity<Resource> download(String fileName, HttpServletRequest request)
         throws IOException {
      Path filePath = fileStorageLocation.resolve(fileName).normalize();
      try {
         Resource resource = new UrlResource(filePath.toUri());
         String contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());

         if (contentType == null)
            contentType = "application/octet-stream";
         return ResponseEntity.ok()
               .contentType(MediaType.parseMediaType(contentType))
               .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
               .body(resource);
      } catch (IOException e) {
         throw new AnotherApiException("Ocorreu um erro ao descarregar arquivo");
      }
   }

   public Resource getImg(String fileName) throws MalformedURLException {
      Path filePath = fileStorageLocation.resolve(fileName).normalize();
      Resource resource = new UrlResource(filePath.toUri());

      if (!resource.exists())
         throw new ResourceNotFoundException("Ocorreu um erro ao carregar informação");
      return resource;
   }

   public void delete(String fileName) throws IOException {
      Path filePath = fileStorageLocation.resolve(fileName).normalize();
      Files.delete(filePath);
   }
}
