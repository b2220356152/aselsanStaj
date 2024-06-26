package com.bekiremirhanakay.Infrastructure.dataReaders;

import com.bekiremirhanakay.Application.Data.IDataProvider;
import com.bekiremirhanakay.Application.Data.IEventPublisher;
import com.bekiremirhanakay.Infrastructure.rabbitmq.RabbitMQ;
import org.springframework.beans.factory.annotation.Value;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.concurrent.CountDownLatch;



/*
 Bu class Xml dosya formatından gelen okur ve veriyi uygun veri formatına dönüştürür

 */

public class XmlDataProvider implements IDataProvider {
    File xmlFile = null; // Dosyanın tutulacağı işaretçi
    DocumentBuilderFactory documentBuilderFactory = null; // Okunan dosyayı döküman haline getirir
    private ArrayList<ArrayList<String>> data = null; // Okunan dosyadaki verinin atanacağı yer
    private CountDownLatch semaphore = null;
    DocumentBuilder documentBuilder = null;
    private IEventPublisher queueConnect = new RabbitMQ();

    Document xmlDocument = null;

    @Value("${FilePath}")
    private String FilePath;

    public String getFilePath() {
        return FilePath;
    }

    public void setFilePath(String xmlFilePath) {
        this.FilePath = xmlFilePath;
    }
    public XmlDataProvider() throws ParserConfigurationException, IOException, SAXException {
        /*
        Döküman işlenmeye hazır hale getirilir
         */
        queueConnect.create("connect");
        this.documentBuilderFactory = DocumentBuilderFactory.newInstance();

        this.documentBuilder = this.documentBuilderFactory.newDocumentBuilder();


    }
    @Override
    public void process() throws IOException, SAXException, ParserConfigurationException {
        /*
            Dosya satır satır gezilir ve data adlı değişkene atanır
         */
        queueConnect.publish("Connect:A257");
        this.xmlFile = new File(getFilePath());
        this.xmlDocument = documentBuilder.parse(this.xmlFile);
        this.xmlDocument.getDocumentElement().normalize();
        this.data = new ArrayList<ArrayList<String>>();

        NodeList xmlDataList = this.xmlDocument.getElementsByTagName("*");
        int counter = 0;
        int columnNumber=0;
        ArrayList<String> tempData = new ArrayList<String>();
        for (int index=0; index<xmlDataList.getLength(); index++) {
            Element xmlDataElement = (Element) xmlDataList.item(index);

            Node xmlDataNode = xmlDataElement.getFirstChild();
            if (!xmlDataNode.getNodeValue().isBlank()){

                tempData.add(xmlDataElement.getTagName() + ":" + xmlDataNode.getNodeValue());

                counter++;
            }
            else
                if(counter>0){
                    columnNumber = counter;
                    counter=0;
                    tempData.add("Data Type" + ":" + "track");
                    tempData.add("Device unit" + ":" + "A257");
                    this.data.add(tempData);
                    tempData = new ArrayList<String>();
                }
        }

        tempData = new ArrayList<String>();
        for (int index=xmlDataList.getLength()-columnNumber; index<xmlDataList.getLength(); index++) {
            Element xmlDataElement = (Element) xmlDataList.item(index);
            Node xmlDataNode = xmlDataElement.getFirstChild();
            tempData.add(xmlDataElement.getTagName() + ":" + xmlDataNode.getNodeValue());
        }
        tempData.add("Data Type" + ":" + "track");
        tempData.add("Device unit" + ":" + "A257");
        this.data.add(tempData);
        tempData = new ArrayList<String>();
        for (int index=xmlDataList.getLength()-1; index>xmlDataList.getLength()-1-columnNumber; index--) {
            Element xmlDataElement = (Element) xmlDataList.item(index);

            Node xmlDataNode = xmlDataElement.getFirstChild();
            tempData.add(0,xmlDataElement.getTagName());
        }

        this.data.add(0,tempData);
        this.semaphore.countDown();
    }

    @Override
    public ArrayList<ArrayList<String>> sendData() {
        // Verinin başka sınıflara gönderilmesi
        return this.data;
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
        this.semaphore = semaphore;
    }


}
