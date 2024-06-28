package com.bekiremirhanakay.Infrastructure.dto;


import com.bekiremirhanakay.Application.Data.IDTO;

import java.io.Serializable;

public class ConnectionData implements IDTO, Serializable {
    private static final long serialVersionUID = 6529685098267757690L;
    private String deviceID;
    private String dataType;

    public String getDeviceID() {
        return deviceID;
    }

    public void setDeviceID(String deviceID) {
        this.deviceID = deviceID;
    }

    public String getDataType() {
        return dataType;
    }

    public void setDataType(String dataType) {
        this.dataType = dataType;
    }
}
