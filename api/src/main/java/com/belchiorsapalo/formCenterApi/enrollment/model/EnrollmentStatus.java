package com.belchiorsapalo.formCenterApi.enrollment.model;

public enum EnrollmentStatus{
    APPROVED("aprovado"), PENDING("pendente"), REJECTED("rejeitado");
    private String status;

    private EnrollmentStatus(String status){
        this.status = status;
    }

    public String getStatus(){
        return status;
    }
}