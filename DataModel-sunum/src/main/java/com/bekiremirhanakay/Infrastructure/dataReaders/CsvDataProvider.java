package com.bekiremirhanakay.Infrastructure.dataReaders;

import com.bekiremirhanakay.Application.Data.IDataProvider;
import com.bekiremirhanakay.Application.Data.IEventPublisher;
import com.bekiremirhanakay.Infrastructure.dto.ConnectionData;
import com.bekiremirhanakay.Infrastructure.rabbitmq.RabbitMQ;
import org.springframework.beans.factory.annotation.Value;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.Scanner;
import java.util.concurrent.CountDownLatch;

/*
 Bu class Csv dosya formatından gelen okur ve veriyi uygun veri formatına dönüştürür

 */

public class CsvDataProvider implements IDataProvider {
    /*
        Döküman işlenmeye hazır hale getirilir
         */
    private Scanner csvReader = null; // Dosyanın tutulacağı işaretçi

    private ArrayList<ArrayList<String>> data = null;  // Okunan dosyayı döküman haline getirir
    private CountDownLatch latch = null; // Okunan dosyadaki verinin atanacağı yer
    private IEventPublisher queueConnect = new RabbitMQ();
    @Value("${FilePath}")
    private String filePath;
    public CsvDataProvider(){
        this.data = new ArrayList<ArrayList<String>>();
        queueConnect.create("connect");


    }
    @Override
    public void process() {
        /*
            Dosya satır satır gezilir ve data adlı değişkene atanır
         */
        queueConnect.publish("Connect:A256");
        try {
            this.csvReader = new Scanner(new File(filePath));

        } catch (FileNotFoundException e) {
            throw new RuntimeException(e);
        }
        csvReader.useDelimiter(",");
        String[] metaData = csvReader.nextLine().split(",");

        while (csvReader.hasNext())
        {

            String[] dataOneColumn = csvReader.nextLine().split(",");
            ArrayList<String> tempData = new ArrayList<String>();
            int metaDataIndex=0;
            for(String s : dataOneColumn){
                tempData.add(metaData[metaDataIndex++] + ":" + s);
            }
            tempData.add("Data Type" + ":" + "track");
            tempData.add("Device unit" + ":" + "A256");
            this.data.add(tempData);

        }
        csvReader.close();
        latch.countDown();
    }

    @Override
    public ArrayList<ArrayList<String>> sendData() {
        // Verinin başka sınıflara gönderilmesi
        System.out.println(data.size());
        return this.data;
    }

    @Override
    public void listen() {

    }

    public CountDownLatch getSemaphore() {
        return this.latch;
    }

    public void setSemaphore(CountDownLatch semaphore) {
        this.latch = semaphore;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }
}
