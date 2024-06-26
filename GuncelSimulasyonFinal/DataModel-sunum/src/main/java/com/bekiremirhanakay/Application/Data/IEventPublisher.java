package com.bekiremirhanakay.Application.Data;

import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Consumer;

import java.util.ArrayList;

public interface IEventPublisher extends Cloneable {
    public void publish(String sentData);
    public void consume();
    public void create(String queueName);
    public Channel getChannel();
    public void setConsumer(Consumer consumer);
    public Object clone() throws CloneNotSupportedException;
    public void add(ArrayList<String> row);
    public ArrayList<ArrayList<String>> getData();
    public void setData(ArrayList<ArrayList<String>> data);

    public String getQueueName();

}
