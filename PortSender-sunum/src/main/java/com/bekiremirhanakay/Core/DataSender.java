package com.bekiremirhanakay.Core;

import com.bekiremirhanakay.Application.IDTO;
import com.bekiremirhanakay.Infrastructure.dto.ConnectionData;
import com.bekiremirhanakay.Infrastructure.dto.TraceData;
import com.bekiremirhanakay.Presentation.MainMenu;

import java.io.IOException;
import java.io.ObjectOutputStream;
import java.net.Socket;

public class DataSender {
    private Socket socket = null;
    private MainMenu menu;
    private ObjectOutputStream out2 = null;
    
    // Constructor with MainMenu
    public DataSender(MainMenu menu) throws IOException {
        this.menu = menu;
        initializeConnection();
    }

    // Alternative constructor without MainMenu
    public DataSender() throws IOException {
        initializeConnection();
    }

    private void initializeConnection() throws IOException {
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

    public void send(IDTO data) {
        try {
            socket = new Socket("localhost", 56615);
            ObjectOutputStream objectOutputStream = new ObjectOutputStream(socket.getOutputStream());
            objectOutputStream.writeObject(data);
            objectOutputStream.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static void sendWithExternal(IDTO data) throws IOException {
        Socket socket = new Socket("localhost", 56615);
        ObjectOutputStream objectOutputStream = new ObjectOutputStream(socket.getOutputStream());
        objectOutputStream.writeObject(data);
        objectOutputStream.close();
    }

    private class ServerThread extends Thread {
        public void run() {
            while (true) {
                try {
                    send(null);  // Send whatever data is needed periodically
                    Thread.sleep(25);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    private class HeartBitThread extends Thread {
        public void run() {
            while (true) {
                try {
                    socket = new Socket("localhost", 56615);
                    ObjectOutputStream objectOutputStream = new ObjectOutputStream(socket.getOutputStream());
                    ConnectionData connectionData = new ConnectionData();
                    connectionData.setDataType("Connection");
                    connectionData.setDeviceID("A205");
                    objectOutputStream.writeObject(connectionData);
                    objectOutputStream.close();

                    Thread.sleep(2000);
                } catch (InterruptedException | IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }
    public void open() throws IOException {


    }

}
