package com.belchiorsapalo.formCenterApi.information.service;

import java.io.IOException;
import java.net.MalformedURLException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.belchiorsapalo.formCenterApi.exceptions.AnotherApiException;
import com.belchiorsapalo.formCenterApi.exceptions.ResourceAlreadyExistsException;
import com.belchiorsapalo.formCenterApi.exceptions.ResourceNotFoundException;
import com.belchiorsapalo.formCenterApi.files.model.File;
import com.belchiorsapalo.formCenterApi.files.service.FileService;
import com.belchiorsapalo.formCenterApi.information.dtos.InfoRegisterDTO;
import com.belchiorsapalo.formCenterApi.information.model.Information;
import com.belchiorsapalo.formCenterApi.information.repository.InformationRepository;

import jakarta.transaction.Transactional;

@Service
public class InformationService {
    private final InformationRepository informationRepository;
    private final FileService fileService;

    public InformationService(InformationRepository informationRepository, FileService fileService) {
        this.informationRepository = informationRepository;
        this.fileService = fileService;
    }

    @Transactional
    public Information register(String title, String category, String body, MultipartFile atachImg) {
        File savedFile;
        if (informationRepository.existsByTitle(title)) throw new ResourceAlreadyExistsException("Já existe uma informação com esse título");

        Information createdInfo = new Information(title, category, body);
        try {
            savedFile = fileService.upload(atachImg, "atachment", createdInfo);
        } catch (IOException e) {
            throw new AnotherApiException("Falha ao registrar informação");
        }
        createdInfo.setImage(savedFile);
        return informationRepository.save(createdInfo);
    }

    public void update(UUID id, InfoRegisterDTO infoRegisterDTO){
       Information infoToUpdate = informationRepository.findById(id).orElseThrow(() -> new AnotherApiException("Ocorreu um erro ao atualizar informação"));

        if (!infoRegisterDTO.title().equalsIgnoreCase(infoToUpdate.getTitle()))
            infoToUpdate.setTitle(infoRegisterDTO.title());
        if (!infoRegisterDTO.category().equalsIgnoreCase(infoToUpdate.getCategory()))
            infoToUpdate.setCategory(infoRegisterDTO.category());
        if (!infoRegisterDTO.body().equalsIgnoreCase(infoToUpdate.getBody()))
            infoToUpdate.setBody(infoRegisterDTO.body());
        informationRepository.save(infoToUpdate);
    }

    public List<Information> getAll() {
        return informationRepository.findAll();
    }

    public Information getOne(UUID id) {
        return informationRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Informação não encontrada")
        );
    }

    public Resource getInfoImg(UUID id) throws MalformedURLException{
        Information information = informationRepository.findById(id).orElseThrow(
                () -> new AnotherApiException("Ocorreu um erro ao carregar anexo da informação")
        );
        String fileName = information.getImage().getFileName();
        return fileService.getImg(fileName);
    }

    public void delete(UUID id) {
        Information information = informationRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Falha ao eliminar informação, informação não encontrada"));
        try {
            fileService.delete(information.getImage().getFileName());
        } catch (IOException e) {
            throw new AnotherApiException("Ocorreu um erro ao eliminar informação, tente novamente mais tarde");
        }
        informationRepository.delete(information);
    }

}
