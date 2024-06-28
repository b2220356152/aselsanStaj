package com.bekiremirhanakay.Application.Data;

import org.springframework.context.support.ClassPathXmlApplicationContext;

public interface IDataProcess {
    public static ClassPathXmlApplicationContext appContext = null;
    ClassPathXmlApplicationContext getAppContext();
}
