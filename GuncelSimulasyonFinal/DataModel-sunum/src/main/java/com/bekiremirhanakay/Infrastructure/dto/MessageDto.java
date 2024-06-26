package com.bekiremirhanakay.Infrastructure.dto;

import com.bekiremirhanakay.Application.Data.IDTO;

public class MessageDto implements IDTO {
    private String id;
    private String lat;
    private String lng;
    private String velocity;
    private String type;
    private String status;
    private String dataType;
    private String device;


    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getLat() {
        return lat;
    }

    public void setLat(String lat) {
        this.lat = lat;
    }

    public String getLng() {
        return lng;
    }

    public void setLng(String lng) {
        this.lng = lng;
    }

    public String getVelocity() {
        return velocity;
    }

    public void setVelocity(String vel) {
        this.velocity = vel;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDataType() {
        return dataType;
    }

    public void setDataType(String dataType) {
        this.dataType = dataType;
    }

    public String getDevice() {
        return device;
    }

    public void setDevice(String device) {
        this.device = device;
    }
}
