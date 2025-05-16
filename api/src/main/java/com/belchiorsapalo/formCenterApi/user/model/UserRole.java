package com.belchiorsapalo.formCenterApi.user.model;

public enum UserRole {
    ADMIN("admin"), STUDENT("student"), SUPER("super");
    private String role;

    private UserRole(String role){
        this.role = role;
    }

    public String getRole(){
        return this.role;
    }
}
