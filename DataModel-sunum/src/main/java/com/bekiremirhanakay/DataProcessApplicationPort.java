package com.bekiremirhanakay;

import com.bekiremirhanakay.Application.Socket.ISocketProvider;
import com.bekiremirhanakay.Application.Config.IConfigProvider;
import com.bekiremirhanakay.Application.Data.IDataProcess;
import com.bekiremirhanakay.Application.Data.IDataProvider;
import com.bekiremirhanakay.Infrastructure.Config.AppProperties;
import com.bekiremirhanakay.Infrastructure.Config.BeanConfigProvider;
import org.springframework.beans.factory.config.PropertiesFactoryBean;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.xml.sax.SAXException;

import javax.xml.parsers.ParserConfigurationException;
import java.io.IOException;
import java.util.Collections;


@SpringBootApplication
@PropertySource("classpath:application.properties")
@ComponentScan("com")
@Configuration
public class DataProcessApplicationPort implements IDataProcess {

    public static IConfigProvider configApp= new BeanConfigProvider();
    public static void main(String[] args) throws IOException {
        // Aynı anda okuma yazma durumları yaşanmaması içim semafor yazılmıştır.
        AppProperties appProperties  = (AppProperties)configApp.getValue("PortConfigFile","portNumber");
        SpringApplication springApplication = new SpringApplication(DataProcessApplicationXml.class);
        springApplication.setDefaultProperties(Collections
                .singletonMap("server.port", appProperties.getPort()));
        springApplication.run(args);
        PropertiesFactoryBean propertiesFactoryBean = new PropertiesFactoryBean();
        // Veriyi dosyalardan çeken interface tanımı
        IDataProvider data = (IDataProvider)configApp.getValue("PortConfigFile","fileType");
        data.open();
        try {
            data.process(); // veri dosyadan çekilip işlenir
        } catch (IOException e) {
            throw new RuntimeException(e);
        } catch (SAXException e) {
            throw new RuntimeException(e);
        } catch (ParserConfigurationException e) {
            throw new RuntimeException(e);
        }


        /*ISocketProvider serverDataProvider = (ISocketProvider)configApp.getValue("PortConfigFile","DataProviderServerType");
        serverDataProvider.setProvider(data);
        System.out.println("----");

        serverDataProvider.setAppContext(appContext);
        try {
            System.out.println("----");

            serverDataProvider.open(); // Veri tabanı için soket bağlantısı açar
            System.out.println("----");
            serverDataProvider.send(); // Veri tabanı katmanına veri gönderilir.
        } catch (IOException e) {
            throw new RuntimeException(e);
        } catch (TimeoutException e) {
            throw new RuntimeException(e);
        }*/

    }

    public ClassPathXmlApplicationContext getAppContext() {
        return appContext;
    }

}
