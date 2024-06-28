package com.bekiremirhanakay;

import com.bekiremirhanakay.Application.Config.IConfigProvider;
import com.bekiremirhanakay.Application.Data.IEventPublisher;
import com.bekiremirhanakay.Application.Data.IRepository;
import com.bekiremirhanakay.Core.DataConsumer;
import com.bekiremirhanakay.Infrastructure.Config.AppProperties;
import com.bekiremirhanakay.Infrastructure.Config.BeanConfigProvider;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.IOException;
import java.util.Collections;
import java.util.HashMap;

@SpringBootApplication
public class DataModelApplication {
    public static IConfigProvider configApp= new BeanConfigProvider();
    public static void main(String[] args) throws IOException {

        AppProperties appProperties  = (AppProperties)configApp.getValue("DataModelConfigFile","portNumber");
        SpringApplication springApplication = new SpringApplication(DataProcessApplicationXml.class);
        springApplication.setDefaultProperties(Collections
                .singletonMap("server.port", appProperties.getPort()));
        springApplication.run(args);
        IRepository dataRepository = (IRepository)configApp.getValue("DataModelConfigFile","dbType");
        DataConsumer client = new DataConsumer(5000);
        client.setIRepository(dataRepository);
        client.open();
        client.reicive();
        HashMap<String, IEventPublisher> datas = client.getDatas();



    }

}
