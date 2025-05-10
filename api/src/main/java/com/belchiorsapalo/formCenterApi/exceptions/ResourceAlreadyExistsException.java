package com.belchiorsapalo.formCenterApi.exceptions;

public class ResourceAlreadyExistsException extends RuntimeException{
    public ResourceAlreadyExistsException(String msg){
        super(msg);
    }
}
