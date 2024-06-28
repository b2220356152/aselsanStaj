package com.bekiremirhanakay.Core;

import com.bekiremirhanakay.Application.IDTO;
import com.bekiremirhanakay.Infrastructure.dto.TraceData;
import com.bekiremirhanakay.Presentation.MainMenu;
import com.bekiremirhanakay.Infrastructure.dto.ConnectionData;

import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.ObjectOutputStream;
import java.net.Socket;

public class DataSender {
    private Socket socket = null;
    private DataInputStream input = null;
    private MainMenu menu;
    //private String
    private DataOutputStream out = null;
    private ObjectOutputStream out2 = null;
    public DataSender(MainMenu menu) throws IOException {
        this.menu = menu;
        socket = new Socket("localhost", 56615);
        ObjectOutputStream objectOutputStream = new ObjectOutputStream(socket.getOutputStream());
        ConnectionData connectionData = new ConnectionData();
        connectionData.setDataType("Connection");
        connectionData.setDeviceID("A205");
        objectOutputStream.writeObject(connectionData);
        objectOutputStream.close();

        ServerThread serverThread = new ServerThread();
        serverThread.start();
        HeartBitThread heartBitThread = new HeartBitThread();
        heartBitThread.start();

    }
    public void open() throws IOException {


    }
    public void send()  {
        try {
            socket = new Socket("localhost", 56615);
            ObjectOutputStream objectOutputStream = new ObjectOutputStream(socket.getOutputStream());
            IDTO data = menu.getData();
            menu.setData(null);
            objectOutputStream.writeObject(data);


            objectOutputStream.close();
        } catch (IOException e) {
        }


    }
    public static void sendWithExternal(IDTO data) throws IOException {
        Socket socket = new Socket("localhost", 56615);

        ObjectOutputStream objectOutputStream = new ObjectOutputStream(socket.getOutputStream());
        objectOutputStream.writeObject(data);


        objectOutputStream.close();

    }


    private class ServerThread extends Thread {
        // Server kabul işleminin çalıştığı thread (1 sn de bir çalışır)
        public void run() {
            while (true) {
                try {
                    final DataSender providerServer = DataSender.this;
                    providerServer.send();
                    Thread.sleep(25);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }
    }
    private class HeartBitThread extends Thread {
        // Server kabul işleminin çalıştığı thread (1 sn de bir çalışır)
        public void run() {
            while (true) {
                try {
                    final DataSender providerServer = DataSender.this;
                    if(menu.isClosed()){
                        socket = new Socket("localhost", 56615);
                        ObjectOutputStream objectOutputStream = new ObjectOutputStream(socket.getOutputStream());
                        ConnectionData connectionData = new ConnectionData();
                        connectionData.setDataType("Close");
                        connectionData.setDeviceID("A205");
                        objectOutputStream.writeObject(connectionData);
                        objectOutputStream.close();

                        System.exit(0);
                    }
                    else{
                        socket = new Socket("localhost", 56615);
                        ObjectOutputStream objectOutputStream = new ObjectOutputStream(socket.getOutputStream());
                        ConnectionData connectionData = new ConnectionData();
                        connectionData.setDataType("Connection");
                        connectionData.setDeviceID("A205");
                        objectOutputStream.writeObject(connectionData);
                        objectOutputStream.close();


                    }
                    Thread.sleep(2000);

                } catch (InterruptedException | IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }
}
