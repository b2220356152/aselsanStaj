package com.bekiremirhanakay;

import com.bekiremirhanakay.Core.DataSender;
import com.bekiremirhanakay.Infrastructure.dto.TraceData;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;
import com.rabbitmq.client.DeliverCallback;

import java.io.IOException;
import java.util.concurrent.TimeoutException;

public class App2 {

    private static final String QUEUE_PREFIX = "data_queue_";
    private static final ObjectMapper objectMapper = new ObjectMapper();
    private static TraceData data;
    private static DataSender dataSender;

    public static void main(String[] args) throws IOException, TimeoutException {
        
        ConnectionFactory factory = new ConnectionFactory();
        factory.setHost("localhost");
        factory.setUsername("guest");
        factory.setPassword("guest");

        // Initialize DataSender
        dataSender = new DataSender();

        try (Connection connection = factory.newConnection()) {
            int counter = 0;

            while (true) {
                String queueName = QUEUE_PREFIX + counter++;
                Channel channel = connection.createChannel();
                channel.queueDeclare(queueName, false, false, false, null);

                DeliverCallback deliverCallback = (consumerTag, delivery) -> {
                    String receivedMessage = new String(delivery.getBody(), "UTF-8");
                    System.out.println("Received message: " + receivedMessage);

                    try {
                        JsonNode jsonMessage = objectMapper.readTree(receivedMessage);
                        String flightId = jsonMessage.get("FlightId").asText();
                        String latitude = jsonMessage.get("Latitude").asText();
                        String longitude = jsonMessage.get("Longitude").asText();
                        String velocity = jsonMessage.get("Velocity").asText();
                        String type = jsonMessage.get("Type").asText();
                        String datatype = jsonMessage.get("DataType").asText();
                        String status = jsonMessage.get("Status").asText();
                        
                        data = new TraceData();
                        data.setDeviceID("A205");
                        data.setFlightID(flightId);
                        data.setLatitude(latitude);
                        data.setLongitude(longitude);
                        data.setVelocity(velocity);
                        data.setType(type);
                        data.setDataType(datatype);
                        data.setStatus(status);
                        
                        dataSender.send(data);
                        
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                };
                channel.basicConsume(queueName, true, deliverCallback, consumerTag -> {});
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        dataSender.open();
    }
}
