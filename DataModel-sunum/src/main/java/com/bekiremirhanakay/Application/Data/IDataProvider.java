package com.bekiremirhanakay.Application.Data;

import org.xml.sax.SAXException;

import javax.xml.parsers.ParserConfigurationException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.concurrent.CountDownLatch;

/*
Bu interface çeşitli dosya formatları için temel oluşturur.
 */
public interface IDataProvider {
    public void process() throws IOException, SAXException, ParserConfigurationException;

    public ArrayList<ArrayList<String>> sendData();
    public void listen();
    public CountDownLatch getSemaphore();
    public void setSemaphore(CountDownLatch semaphore);
    default void open() throws IOException {

    }

}
