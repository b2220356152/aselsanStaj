package com.bekiremirhanakay.Core;

import com.bekiremirhanakay.Application.Config.IConfigProvider;
import com.bekiremirhanakay.Application.Data.IEventPublisher;
import com.bekiremirhanakay.Application.Socket.ISocketProvider;
import com.bekiremirhanakay.Infrastructure.Config.BeanConfigProvider;
import com.rabbitmq.client.AMQP;
import com.rabbitmq.client.DefaultConsumer;
import com.rabbitmq.client.Envelope;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;

public class RequestData implements ISocketProvider {
    private IEventPublisher queueCsv;
    private IEventPublisher queueXml;
    private IEventPublisher queuePort;
    private IEventPublisher queueConnection;
    private ServerThread serverThread;
    HashMap<String, IEventPublisher> map;
    private ClassPathXmlApplicationContext appContext;
    private IConfigProvider configApp= new BeanConfigProvider();
    public RequestData(){
        IEventPublisher queue2 = (IEventPublisher) configApp.getValue("FrontendConfigFile","queueType");
        try {
            queueCsv = (IEventPublisher) queue2.clone();
            queueXml = (IEventPublisher) queue2.clone();
            queuePort = (IEventPublisher) queue2.clone();
            queueConnection = (IEventPublisher) queue2.clone();
        } catch (CloneNotSupportedException e) {
            throw new RuntimeException(e);
        }
        map = new HashMap<String, IEventPublisher>();
        map.put("CsvQueue",queueCsv);
        map.put("XmlQueue",queueXml);
        map.put("PortQueue",queuePort);
        map.put("ConnectQueue",queueConnection);
        queueCsv.setData(new ArrayList<>());
        queueXml.setData(new ArrayList<>());
        queuePort.setData(new ArrayList<>());
        queueConnection.setData(new ArrayList<>());
        serverThread = new ServerThread();
        serverThread.start();

    }


    @Override
    public void open() throws IOException {
        queueCsv.create("CsvQueue2");
        queueXml.create("XmlQueue2");
        queuePort.create("PortQueue2");
        queueConnection.create("connect");

    }

    @Override
    public void reicive() throws IOException {
        DefaultConsumer consumerCsv = channelSetting(queueCsv);
        DefaultConsumer consumerXml = channelSetting(queueXml);
        DefaultConsumer consumerPort = channelSetting(queuePort);
        DefaultConsumer consumerConnection = channelSetting(queueConnection);


        queueConnection.setConsumer(consumerConnection);
        queueConnection.consume();
    }
    private DefaultConsumer channelSetting(IEventPublisher queue) {
        DefaultConsumer consumer = new DefaultConsumer(queue.getChannel()) {
            @Override
            public void handleDelivery(
                    String consumerTag,
                    Envelope envelope,
                    AMQP.BasicProperties properties,
                    byte[] body) throws IOException {

                String message = new String(body, "UTF-8");
                String[] row = message.split(":");
                List<String> rowList = Arrays.asList(row);
                ArrayList<String> rowData = new ArrayList<String>(rowList);
                //System.out.println(rowData);
                    queue.add(rowData);
                    System.out.println("Consumed: " + message);
                    System.out.println("Waiting data for " + queue.getQueueName() + ": " + queue.getData().size());
                }
        };
        return consumer;
    }

    @Override
    public void send() throws IOException {

    }

    @Override
    public ArrayList<ArrayList<String>> getData() {
        return null;
    }

    @Override
    public void setData(ArrayList<ArrayList<String>> data) {

    }



    @Override
    public void setAppContext(ClassPathXmlApplicationContext appContext) {
        this.appContext = appContext;
    }

    @Override
    public HashMap<String, IEventPublisher> getDatas() {
        return map;
    }

    private class ServerThread extends Thread {
        // Server kabul işleminin çalıştığı thread (1 sn de bir çalışır)
        private int metaDataCounter = 0;

        public void run() {
            while (true) {
                try {

                    final RequestData dataConsumer = RequestData.this;
                    dataConsumer.reicive();

                    Thread.sleep(100);
                    //setMetaDataCounter(getMetaDataCounter() + 1);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                } catch (NullPointerException e) {

                } catch (IOException e) {
                    throw new RuntimeException(e);
                }
            }
        }

    }
}
