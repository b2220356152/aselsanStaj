package com.bekiremirhanakay.Core;

import com.bekiremirhanakay.Application.Config.IConfigProvider;
import com.bekiremirhanakay.Application.Data.IEventPublisher;
import com.bekiremirhanakay.Application.Data.IRepository;
import com.bekiremirhanakay.Application.Socket.ISocketProvider;
import com.bekiremirhanakay.Infrastructure.Config.BeanConfigProvider;
import com.mongodb.BasicDBObject;
import com.mongodb.client.FindIterable;
import com.rabbitmq.client.*;
import org.bson.Document;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import java.io.DataInputStream;
import java.io.IOException;
import java.net.Socket;
import java.util.*;

/*
    Verinin veri işleme katmanı servisinden çekilmesini sağlar
 */

public class DataConsumer implements ISocketProvider {
    private Socket socket   = null;
    private DataInputStream input       =  null; // Girdi akışı burdan sağlanır
    private int port;// Soketten gelen veri burda tutulur.
    private IRepository repo;

    private IEventPublisher queueCommand;
    private IEventPublisher queueCommand2;
    private IEventPublisher queueQuery;
    private ServerThread serverThread;
    private ClassPathXmlApplicationContext appContext;
    private boolean disableMode = false;
    HashMap<String, IEventPublisher> map;
    private IConfigProvider configApp= new BeanConfigProvider();
    private ArrayList<Document> processedResult = null;
    public DataConsumer(int port) {
        IEventPublisher queue2 = (IEventPublisher) configApp.getValue("DataModelConfigFile","queueType");
        try {

            queueCommand = (IEventPublisher) queue2.clone();
            queueCommand2 = (IEventPublisher) queue2.clone();
            queueQuery = (IEventPublisher) queue2.clone();
        } catch (CloneNotSupportedException e) {
            throw new RuntimeException(e);
        }
        map = new HashMap<String, IEventPublisher>();
        map.put("CommandQueue",queueCommand);
        map.put("CommandQueue2",queueCommand2);
        map.put("QueryQueue",queueQuery);
        queueCommand2.create("CommandQueue2");
        //serverThread = new ServerThread();
        //serverThread.start();
    }
    @Override
    public void open() throws IOException {
        // Bağlantı açılır
        //this.socket = new Socket("127.0.0.1",port);

    }

    @Override
    public void reicive() throws IOException {
        // Veri bu fonksiyon kullanılarak alınır.

        //queueCommand.setConsumer(consumerCommand);
        //queueCommand.consume();

    }



    @Override
    public void send() {


    }

    @Override
    public ArrayList<ArrayList<String>> getData() {
        return null;
    }
    @Override
    public HashMap<String, IEventPublisher> getDatas() {


        return map;
    }




    @Override
    public void setData(ArrayList<ArrayList<String>> data) {

    }

    @Override
    public void setIRepository(IRepository repo) {
        this.repo = repo;

    }

    public boolean isDisableMode() {
        return disableMode;
    }



    public void setDisableMode(boolean disableMode) {
        this.disableMode = disableMode;
    }

    private class ServerThread extends Thread {
        // Server kabul işleminin çalıştığı thread (1 sn de bir çalışır)
        private int metaDataCounter=0;
        public void run() {
            while (true) {
                try {


                    final DataConsumer dataConsumer = DataConsumer.this;
                    dataConsumer.reicive();

                    Thread.sleep(100);
                    //setMetaDataCounter(getMetaDataCounter() + 1);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                catch (NullPointerException e) {

                } catch (IOException e) {
                    throw new RuntimeException(e);
                }
            }
        }

        public int getMetaDataCounter() {
            return metaDataCounter;
        }

        public void setMetaDataCounter(int metaDataCounter) {
            this.metaDataCounter = metaDataCounter;
        }
    }
    public void setAppContext(ClassPathXmlApplicationContext appContext){
        this.appContext = appContext;
    }
}
