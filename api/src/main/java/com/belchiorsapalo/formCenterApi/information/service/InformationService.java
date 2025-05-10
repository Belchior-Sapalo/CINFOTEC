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
    public Information register(String title, String category, String infoText, MultipartFile atachImg) {
        File savedFile;
        if (informationRepository.existsByTitle(title)) throw new ResourceAlreadyExistsException("Já existe uma informação com esse título");

        Information createdInfo = new Information(title, category, infoText);
        try {
            savedFile = fileService.upload(atachImg, "atachment", createdInfo);
        } catch (IOException e) {
            throw new AnotherApiException("Falha ao registrar informação");
        }
        createdInfo.setImage(savedFile);
        return informationRepository.save(createdInfo);
    }

    public void update(UUID id, InfoRegisterDTO infoRegisterDTO){
        Optional<Information> verifyInfo = informationRepository.findById(id);

        if (verifyInfo.isEmpty())
            throw new AnotherApiException("Ocorreu um erro ao atualizar informação");
        Information infoToUpdate = verifyInfo.get();

        if (!infoRegisterDTO.title().equalsIgnoreCase(infoToUpdate.getTitle()))
            infoToUpdate.setTitle(infoRegisterDTO.title());
        if (!infoRegisterDTO.category().equalsIgnoreCase(infoToUpdate.getCategory()))
            infoToUpdate.setCategory(infoRegisterDTO.category());
        if (!infoRegisterDTO.information().equalsIgnoreCase(infoToUpdate.getInformation()))
            infoToUpdate.setInformation(infoRegisterDTO.information());
        informationRepository.save(infoToUpdate);
    }

    public List<Information> getAll() {
        return informationRepository.findAll();
    }

    public Information getOne(UUID id) {
        Optional<Information> verifyInfo = informationRepository.findById(id);
        if (verifyInfo.isEmpty())
            throw new ResourceNotFoundException("Informação não encontrada");
        return verifyInfo.get();
    }

    public Resource getInfoImg(UUID id) throws MalformedURLException{
        Optional<Information> infoOptional = informationRepository.findById(id);
        if (infoOptional.isEmpty())
            throw new AnotherApiException("Ocorreu um erro ao carregar anexo da informação");
        String fileName = infoOptional.get().getImage().getFileName();
        return fileService.getImg(fileName);
    }

    public void delete(UUID id) {
        Optional<Information> verifyInfo = informationRepository.findById(id);
        if (verifyInfo.isEmpty())
            throw new ResourceNotFoundException("Falha ao eliminar informação, informação não encontrada");
        Information infoToDelete = verifyInfo.get();
        try {
            fileService.delete(infoToDelete.getImage().getFileName());
        } catch (IOException e) {
            throw new AnotherApiException(e.getMessage());
        }
        informationRepository.delete(infoToDelete);
    }

}
