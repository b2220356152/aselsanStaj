package com.bekiremirhanakay;

import com.bekiremirhanakay.Application.Config.IConfigProvider;
import com.bekiremirhanakay.Application.Data.IDataProcess;
import com.bekiremirhanakay.Application.Data.IEventPublisher;
import com.bekiremirhanakay.Application.Socket.ISocketProvider;
import com.bekiremirhanakay.Core.DataProviderServer;
import com.bekiremirhanakay.Infrastructure.Config.BeanConfigProvider;
import com.bekiremirhanakay.Application.Data.IDataProvider;
import com.bekiremirhanakay.Infrastructure.Config.AppProperties;
import com.bekiremirhanakay.Infrastructure.rabbitmq.RabbitMQ;
import org.springframework.beans.factory.config.PropertiesFactoryBean;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.core.io.ClassPathResource;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.xml.sax.SAXException;

import javax.xml.parsers.ParserConfigurationException;
import java.io.IOException;
import java.util.Collections;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeoutException;

@SpringBootApplication
@PropertySource("classpath:application.properties")
@ComponentScan("com")
@Configuration
@EnableScheduling
@Lazy(false)
public class DataProcessApplication implements IDataProcess {
    public static IConfigProvider configApp= new BeanConfigProvider();
    public static void main(String[] args) {
        // Aynı anda okuma yazma durumları yaşanmaması içim semafor yazılmıştır.
        CountDownLatch semaphore = new CountDownLatch(1);
        AppProperties appProperties  = (AppProperties)configApp.getValue("CsvConfigFile","portNumber");
        SpringApplication springApplication = new SpringApplication(DataProcessApplicationXml.class);
        springApplication.setDefaultProperties(Collections
                .singletonMap("server.port", appProperties.getPort()));
        springApplication.run(args);

        PropertiesFactoryBean propertiesFactoryBean = new PropertiesFactoryBean();
        propertiesFactoryBean.setLocation(new ClassPathResource("classpath:application.properties"));
        // Veriyi dosyalardan çeken interface tanımı
        IDataProvider data = (IDataProvider)configApp.getValue("CsvConfigFile","fileType");
        System.out.println(data);
        data.setSemaphore(semaphore);
        try {
            data.process(); // veri dosyaldan çekilip işlenir
        } catch (IOException e) {
            throw new RuntimeException(e);
        } catch (SAXException e) {
            throw new RuntimeException(e);
        } catch (ParserConfigurationException e) {
            throw new RuntimeException(e);
        }
        try {
            semaphore.await();
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        ISocketProvider serverDataProvider = (ISocketProvider)configApp.getValue("CsvConfigFile","DataProviderServerType");
        serverDataProvider.setProvider(data);
        serverDataProvider = (DataProviderServer) serverDataProvider;
        ((DataProviderServer) serverDataProvider).setConnectString("Connect:A256");
        //serverDataProvider.setData();
        try {


            serverDataProvider.open(); // Veri tabanı için soket bağlantısı açar
            serverDataProvider.send(); // Veri tabanı katmanına veri gönderilir.
        } catch (IOException e) {
            throw new RuntimeException(e);
        } catch (TimeoutException e) {
            throw new RuntimeException(e);
        }

    }


    public ClassPathXmlApplicationContext getAppContext() {
        return appContext;
    }


}
