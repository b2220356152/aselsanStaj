package com.bekiremirhanakay.Infrastructure.Config;

import com.bekiremirhanakay.Application.Config.IConfigProvider;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.support.ClassPathXmlApplicationContext;


@Configuration
public class BeanConfigProvider implements IConfigProvider {

    public static ClassPathXmlApplicationContext applicationContext;

    public BeanConfigProvider(){

    }
    @Override
    public Object getValue(String path, String key) {
        applicationContext
                = new ClassPathXmlApplicationContext("classpath:" + path + ".xml");
        return applicationContext.getBean(key);

    }
}
