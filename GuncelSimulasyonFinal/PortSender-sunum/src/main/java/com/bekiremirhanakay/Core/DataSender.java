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

    // finally bloğu ile exception olsa bile objectOutputStream'in kapanması sağlandı.
    public void send() {
        ObjectOutputStream objectOutputStream = null;
        try {
            socket = new Socket("localhost", 56615);
            objectOutputStream = new ObjectOutputStream(socket.getOutputStream());
            IDTO data = menu.getData();
            menu.setData(null);
            objectOutputStream.writeObject(data);
        } catch (IOException e) {
            
        } finally {
            try {
                if (objectOutputStream != null) {
                    objectOutputStream.close();
                }
            } catch (IOException e) { 
            }
        }
    }

    public static void sendWithExternal(IDTO data) throws IOException {
        Socket socket = new Socket("localhost", 56615);
        ObjectOutputStream objectOutputStream = new ObjectOutputStream(socket.getOutputStream());
        try {
            objectOutputStream.writeObject(data);
        } catch (IOException e) {
            
        } finally {
            objectOutputStream.close();
        }
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
                        // System.exit her zaman sağlanır. (try-with-resources bloğu ile.)
                        try (ObjectOutputStream objectOutputStream = new ObjectOutputStream(socket.getOutputStream())) {
                            ConnectionData connectionData = new ConnectionData();
                            connectionData.setDataType("Close");
                            connectionData.setDeviceID("A205");
                            objectOutputStream.writeObject(connectionData);
                        }
                        System.exit(0);
                    }
                    else{
                        socket = new Socket("localhost", 56615);
                        try (ObjectOutputStream objectOutputStream = new ObjectOutputStream(socket.getOutputStream())) {
                            ConnectionData connectionData = new ConnectionData();
                            connectionData.setDataType("Connection");
                            connectionData.setDeviceID("A205");
                            objectOutputStream.writeObject(connectionData);
                        }
                    }

                    Thread.sleep(2000); // bir sonraki dönüş öncesinde 2sn. beklenir.
                } catch (InterruptedException | IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }
}
