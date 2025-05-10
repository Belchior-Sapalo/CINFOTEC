package com.belchiorsapalo.formCenterApi.exceptions;

import java.io.IOException;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GeneralExceptionHandler {

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(ResourceAlreadyExistsException.class)
    public ApiError hanldeResourseAlreadyExistsException(ResourceAlreadyExistsException e) {
        return new ApiError(e.getMessage());
    }

    @ResponseStatus(HttpStatus.NOT_FOUND)
    @ExceptionHandler(ResourceNotFoundException.class)
    public ApiError handleResourceNotFoundException(ResourceNotFoundException e) {
        return new ApiError(e.getMessage());
    }

    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    @ExceptionHandler(UnauthorizedUserException.class)
    public ApiError handleUnauthorizedUserException(UnauthorizedUserException e) {
        return new ApiError(e.getMessage());
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(IOException.class)
    public ApiError handleIOException(IOException e) {
        return new ApiError(e.getMessage());
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(RuntimeException.class)
    public ApiError handleRumtimeException(RuntimeException e) {
        return new ApiError(e.getMessage());
    }

    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ExceptionHandler(AnotherApiException.class)
    public ApiError handleAnotherApiException(AnotherApiException e){
        return new ApiError(e.getMessage());
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ApiError handleMethodArgumentNotValidException(MethodArgumentNotValidException e){
        return new ApiError(e.getBindingResult().getFieldError().getDefaultMessage());
    }
}
