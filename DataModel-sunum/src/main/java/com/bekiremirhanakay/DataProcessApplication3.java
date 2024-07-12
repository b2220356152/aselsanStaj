package com.bekiremirhanakay;

import com.rabbitmq.client.*;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Collections;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeoutException;

import javax.xml.parsers.ParserConfigurationException;

import org.springframework.beans.factory.config.PropertiesFactoryBean;
import org.springframework.boot.SpringApplication;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.core.io.ClassPathResource;
import org.xml.sax.SAXException;

import com.bekiremirhanakay.Application.Config.IConfigProvider;
import com.bekiremirhanakay.Application.Data.IDataProcess;
import com.bekiremirhanakay.Application.Data.IDataProvider;
import com.bekiremirhanakay.Application.Socket.ISocketProvider;
import com.bekiremirhanakay.Infrastructure.Config.AppProperties;
import com.bekiremirhanakay.Infrastructure.Config.BeanConfigProvider;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

public class DataProcessApplication3 implements IDataProcess {

    private static final String QUEUE_PREFIX = "data_queue_"; 
    private static final String FILE_PATH = "C:/Users/stajyer/Desktop/Aselsan/aselsanStaj/DataModel-sunum/src/main/resources/flightData3.csv";
    private static final ObjectMapper objectMapper = new ObjectMapper();
    public static IConfigProvider configApp= new BeanConfigProvider();

    public static void main(String[] args) throws IOException, TimeoutException {
        ConnectionFactory factory = new ConnectionFactory();
        factory.setHost("localhost"); // RabbitMQ server host
        factory.setUsername("guest");
        factory.setPassword("guest");

        ensureFileAndHeader();

        try (Connection connection = factory.newConnection()) {
            int counter = 0; // Example FlightIDs, replace with actual IDs

            while (true) {
                String queueName = QUEUE_PREFIX + counter++;
                Channel channel = connection.createChannel();
                channel.queueDeclare(queueName, false, false, false, null);

                // Example of consuming data from RabbitMQ
                DeliverCallback deliverCallback = (consumerTag, delivery) -> {
                    String receivedMessage = new String(delivery.getBody(), "UTF-8");
                    System.out.println("Received message: " + receivedMessage);

                    try {
                        // Parse JSON message using Jackson
                        JsonNode jsonMessage = objectMapper.readTree(receivedMessage);
                        String flightId = jsonMessage.get("FlightId").asText();
                        String latitude = jsonMessage.get("Latitude").asText();
                        String longitude = jsonMessage.get("Longitude").asText();
                        String velocity = jsonMessage.get("Velocity").asText();
                        String type = jsonMessage.get("Type").asText();
                        String status = jsonMessage.get("Status").asText();

                        // Writing to CSV file
                        synchronized (DataProcessApplication3.class) {
                            try (BufferedWriter writer = new BufferedWriter(new FileWriter(FILE_PATH, true))) {
                                // Write header if file is empty
                                if (Files.size(Paths.get(FILE_PATH)) == 0) {
                                    writer.write("FlightId,Latitude,Longitude,Velocity,Type,Status\n");
                                }
                                writer.write(flightId + "," + latitude + "," + longitude + ","
                                        + velocity + "," + type + "," + status + "\n");
                                writer.flush(); // Flush the writer to ensure data is written immediately
                            } catch (IOException e) {
                                e.printStackTrace();
                            }
                        }

                        // Delete the queue after processing
                        try {
                            channel.queueDelete(queueName);
                            System.out.println("Deleted queue: " + queueName);
                        } catch (IOException e) {
                            e.printStackTrace();
                        }
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                };
                channel.basicConsume(queueName, true, deliverCallback, consumerTag -> {
                });
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        CountDownLatch semaphore = new CountDownLatch(1);
        AppProperties appProperties  = (AppProperties)configApp.getValue("CsvConfigFile2","portNumber");
        SpringApplication springApplication = new SpringApplication(DataProcessApplicationXml.class);
        springApplication.setDefaultProperties(Collections
                .singletonMap("server.port", appProperties.getPort()));
        springApplication.run(args);

        PropertiesFactoryBean propertiesFactoryBean = new PropertiesFactoryBean();
        propertiesFactoryBean.setLocation(new ClassPathResource("classpath:application.properties"));
        // Veriyi dosyalardan çeken interface tanımı
        IDataProvider data = (IDataProvider)configApp.getValue("CsvConfigFile2","fileType");
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

        ISocketProvider serverDataProvider = (ISocketProvider)configApp.getValue("CsvConfigFile2","DataProviderServerType");
        serverDataProvider.setProvider(data);
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

    private static void ensureFileAndHeader() {
        Path filePath = Paths.get(FILE_PATH);
        try {
            if (!Files.exists(filePath)) {
                Files.createFile(filePath);
                try (BufferedWriter writer = new BufferedWriter(new FileWriter(FILE_PATH))) {
                    writer.write("FlightId,Latitude,Longitude,Velocity,Type,Status\n");
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public ClassPathXmlApplicationContext getAppContext() {
        return appContext;
    }
}
