package com.bekiremirhanakay.Infrastructure.dataReaders;

import com.bekiremirhanakay.Application.Data.IDTO;
import com.bekiremirhanakay.Application.Data.IDataProvider;
import com.bekiremirhanakay.Application.Data.IEventPublisher;
import com.bekiremirhanakay.Infrastructure.dto.ConnectionData;
import com.bekiremirhanakay.Infrastructure.dto.TraceData;
import com.bekiremirhanakay.Infrastructure.rabbitmq.RabbitMQ;
import org.springframework.beans.factory.annotation.Autowired;
import org.xml.sax.SAXException;

import javax.xml.parsers.ParserConfigurationException;
import java.io.BufferedInputStream;
import java.io.DataInputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeoutException;
public class PortDataProvider implements IDataProvider {

    private IEventPublisher queueConnect = new RabbitMQ();
    private IEventPublisher queuePort = new RabbitMQ();
    private Socket          socket   = null;
    private ServerSocket server   = null;
    private DataInputStream in       =  null;
    private ArrayList<ArrayList<String>> data = null;
    public PortDataProvider() throws IOException {
        this.data = new ArrayList<ArrayList<String>>();

        queueConnect.create("connect");
        //socket = server.accept();


    }

    @Override
    public void open() throws IOException {
        server = new ServerSocket(56615);

        System.out.println(server.getLocalPort());
        ServerThread serverThread = new ServerThread();

        queuePort.create("DataProviderPort");
        serverThread.start();
    }
    public void send() throws IOException, TimeoutException, ClassNotFoundException {


        ObjectInputStream inp = new ObjectInputStream(socket.getInputStream());
        IDTO readObject = (IDTO) inp.readObject();
        if(readObject.getDataType().equals("Track")){
            String sendData = "";
            readObject = (TraceData) readObject;
            sendData+= "FlightId" + ":";
            sendData+=((TraceData) readObject).getFlightID() + ":";
            sendData+="Latitude" + ":";
            sendData+=((TraceData) readObject).getLatitude() + ":";
            sendData+="Longitude" + ":";
            sendData+=((TraceData) readObject).getLongitude() + ":";
            sendData+="Velocity" + ":";
            sendData+=((TraceData) readObject).getVelocity() + ":";
            sendData+="Type" + ":";
            sendData+=((TraceData) readObject).getType() + ":";
            sendData+="Status" + ":";
            sendData+=((TraceData) readObject).getStatus() + ":";

            sendData+="Data Type" + ":";

            sendData+=((TraceData) readObject).getDataType() + ":";
            sendData+="Device Unit" + ":";
            sendData+=((TraceData) readObject).getDeviceID();
            System.out.println(sendData);
            ArrayList<String> rowData = new ArrayList<>();
            rowData.add(sendData);
            data.add(rowData);
            queuePort.publish(sendData);
        }
        else{
            readObject = (ConnectionData) readObject;
            System.out.println(readObject.getDataType() + ":" + ((ConnectionData) readObject).getDeviceID());
            queueConnect.publish(readObject.getDataType() + ":" + ((ConnectionData) readObject).getDeviceID());
        }



        inp.close();


    }

    @Override
    public void process() throws IOException, SAXException, ParserConfigurationException {

    }

    @Override
    public ArrayList<ArrayList<String>> sendData() {
        return data;
    }

    @Override
    public void listen() {

    }

    @Override
    public CountDownLatch getSemaphore() {
        return null;
    }

    @Override
    public void setSemaphore(CountDownLatch semaphore) {

    }


    private class ServerThread extends Thread {
        // Server kabul işleminin çalıştığı thread (1 sn de bir çalışır)
        public void run() {
            while (true) {
                try {
                    final PortDataProvider providerServer = PortDataProvider.this;
                    socket = server.accept();
                    providerServer.send();

                    //Thread.sleep(5);
                }  catch (IOException e) {
                    //throw new RuntimeException(e);
                }
                catch (NullPointerException e) {

                } catch (TimeoutException e) {
                    throw new RuntimeException(e);
                } catch (ClassNotFoundException e) {
                    throw new RuntimeException(e);
                }
            }
        }
    }
}
