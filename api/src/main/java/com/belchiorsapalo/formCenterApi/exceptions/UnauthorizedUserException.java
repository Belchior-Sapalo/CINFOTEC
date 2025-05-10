package com.belchiorsapalo.formCenterApi.exceptions;

public class UnauthorizedUserException extends RuntimeException{
    public UnauthorizedUserException(String msg){
        super(msg);
    }
}
