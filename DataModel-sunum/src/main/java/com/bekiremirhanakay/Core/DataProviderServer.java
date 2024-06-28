package com.bekiremirhanakay.Core;

import com.bekiremirhanakay.Application.Config.IConfigProvider;
import com.bekiremirhanakay.Application.Data.IEventPublisher;
import com.bekiremirhanakay.Application.Socket.ISocketProvider;
import com.bekiremirhanakay.Infrastructure.Config.BeanConfigProvider;
import com.bekiremirhanakay.Application.Data.IDataProvider;
import com.bekiremirhanakay.Infrastructure.rabbitmq.RabbitMQ;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

import java.io.DataOutputStream;
import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.ArrayList;
import java.util.HashMap;

/*
    Verinin dosyalardan işlenip alındıktan sonra veritabınına gönderen servis

 */
@EnableScheduling
@Lazy(false)
public class DataProviderServer extends Thread implements ISocketProvider {

    private Socket socket   = null; // Soketin tutulduğu değişken
    private ServerSocket server   = null; // Server'ın tanımlanması
    private DataOutputStream outputStream = null; // Veri akışını gerçekleştirir
    private int type;
    private IDataProvider dataProvider = null; // İşlenen datanın tutulduğu sınıf
    private ArrayList<ArrayList<String>> data = null;
    @Autowired
    private IEventPublisher queueCsv;
    private String connectString = "";

    private IEventPublisher queueXml;
    private IEventPublisher queuePort;
    private IConfigProvider configApp;

    private IEventPublisher queueConnect = new RabbitMQ();
    private ClassPathXmlApplicationContext appContext;
    public DataProviderServer(IDataProvider dataProvider, int type){
        // Server kabul mekanizması için thread tanımlanır ve veri çekilir
        this.dataProvider = dataProvider;
        this.type = type;
        this.configApp = new BeanConfigProvider();
        queueConnect.create("connect");


    }


    @Override
    public void open() throws IOException {
        // Server oluşturulur
        IEventPublisher queue2 = (IEventPublisher) this.configApp.getValue("CsvConfigFile","queueType");
        try {
            queueCsv = (IEventPublisher) queue2.clone();
            queueXml = (IEventPublisher) queue2.clone();
            queuePort = (IEventPublisher) queue2.clone();
        } catch (CloneNotSupportedException e) {
            throw new RuntimeException(e);
        }
        this.data = dataProvider.sendData();
        queueCsv.create("DataProviderCsv");
        queueXml.create("DataProviderXml");
        queuePort.create("DataProviderPort");
        ServerThread serverThread = new ServerThread();
        serverThread.start();
        //this.send();


    }

    @Override
    public void reicive() throws IOException {

    }


    @Override

    public void send() throws IOException {
        // Veri veri tabanına outputStream aracılığı ile gönderilir.
            String sentData = "";
            queueConnect.publish(connectString);
            if (data!=null && !data.isEmpty()) {

                data.get(0);
                for (String column : data.get(0)) {
                    sentData += column + ":";
                }
                sentData = sentData.substring(0, sentData.length() - 1);
                System.out.println("Sended data: " + sentData);
                if(type==1)
                    queueXml.publish(sentData);
                else if(type==0)
                    queueCsv.publish(sentData);
                else{
                    queuePort.publish(sentData);
                }
                data.remove(0);
            }


    }

    @Override
    public ArrayList<ArrayList<String>> getData() {
        return null;
    }

    @Override
    public void setData(ArrayList<ArrayList<String>> data) {

    }
    @Override
    public void setProvider(IDataProvider dataProvider){
        this.dataProvider = dataProvider;
    }

    @Override
    public void setAppContext(ClassPathXmlApplicationContext appContext) {
        this.appContext = appContext;
    }

    @Override
    public HashMap<String, IEventPublisher> getDatas() {
        return null;
    }

    public String getConnectString() {
        return connectString;
    }

    public void setConnectString(String connectString) {
        this.connectString = connectString;
    }


    private class ServerThread extends Thread {
        // Server kabul işleminin çalıştığı thread (1 sn de bir çalışır)
        public void run() {
            while (true) {
                try {
                    final DataProviderServer providerServer = DataProviderServer.this;
                    providerServer.send();
                    Thread.sleep(100);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }
                catch (NullPointerException e) {

                }
            }
        }
    }
    public Socket getSocket() {
        return socket;
    }

    public void setSocket(Socket socket) {
        this.socket = socket;
    }


}
