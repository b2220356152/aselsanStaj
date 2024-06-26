package com.bekiremirhanakay.Infrastructure.rabbitmq;

import com.bekiremirhanakay.Application.Data.IEventPublisher;
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;
import com.rabbitmq.client.Consumer;

import java.io.IOException;
import java.util.ArrayList;
import java.util.concurrent.TimeoutException;

public class RabbitMQ implements IEventPublisher,Cloneable {
    private ConnectionFactory factory;
    private Channel channel;
    private String queueName = "DataProvider3";
    private Consumer consumer;
    private ArrayList<ArrayList<String>> data = null;
    String sentData;
    Connection connection;

    @Override
    public void publish(String sentData) {
        try {
            channel.basicPublish("", queueName, null,sentData.getBytes());


        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void consume() {
        try {
            channel.basicConsume(queueName,true, consumer);

        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void add(ArrayList<String> row){
        data.add(row);
    }
    public ArrayList<ArrayList<String>> getData(){
        return data;
    }

    @Override
    public void setData(ArrayList<ArrayList<String>> data) {
        this.data = data;
    }

    @Override
    public void create(String queueName) {
        factory = new ConnectionFactory();
        factory.setHost("localhost");
        this.queueName = queueName;
        try {
            this.connection = factory.newConnection();
            channel = connection.createChannel();
            channel.queueDeclare(this.queueName, false, false, false, null);

        } catch (IOException e) {
            System.out.println("----------------------");
            throw new RuntimeException(e);
        } catch (TimeoutException e) {
            throw new RuntimeException(e);
        }

    }
    public void setConsumer(Consumer consumer){
        this.consumer=consumer;
    }
    public Channel getChannel(){
        return channel;
    }
    @Override
    public Object clone()
            throws CloneNotSupportedException
    {
        return super.clone();
    }

    @Override
    public String getQueueName() {
        return queueName;
    }
}
