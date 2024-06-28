package com.bekiremirhanakay.Application.Socket;

import com.bekiremirhanakay.Application.Data.IDataProvider;
import com.bekiremirhanakay.Application.Data.IEventPublisher;
import com.bekiremirhanakay.Application.Data.IRepository;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.concurrent.TimeoutException;

/*
Bu interface çeşitli soket formatları için temel oluşturur.
 */
public interface ISocketProvider {
    public void open() throws IOException;
    public void reicive() throws IOException;
    public void send() throws IOException, TimeoutException;
    public ArrayList<ArrayList<String>> getData();


    public void setData(ArrayList<ArrayList<String>> data);


    default void setIRepository(IRepository repo){

    }
    default void setAppContext(ClassPathXmlApplicationContext appContext){

    }
    public HashMap<String, IEventPublisher> getDatas();


    default void setProvider(IDataProvider dataProvider){

    }

}
