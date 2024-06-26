package com.bekiremirhanakay;

import com.bekiremirhanakay.Application.Config.IConfigProvider;
import com.bekiremirhanakay.Application.Data.IEventPublisher;
import com.bekiremirhanakay.Infrastructure.Config.BeanConfigProvider;
import com.bekiremirhanakay.Core.RequestData;
import com.bekiremirhanakay.Infrastructure.Config.AppProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import java.io.IOException;
import java.util.Collections;
import java.util.HashMap;

@SpringBootApplication
public class FrontendApplication {
    public static ClassPathXmlApplicationContext appContext;
    public static HashMap<String, IEventPublisher> map;
    public static IConfigProvider configApp= new BeanConfigProvider();

    public static void main(String[] args) {
        AppProperties appProperties  = (AppProperties)configApp.getValue("FrontendConfigFile","portNumber");
        SpringApplication springApplication = new SpringApplication(DataProcessApplicationXml.class);
        springApplication.setDefaultProperties(Collections.singletonMap("server.port", appProperties.getPort()));
        springApplication.run(args);
    }

}
