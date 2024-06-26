package com.bekiremirhanakay.Application.Data;

import com.mongodb.BasicDBObject;
import com.mongodb.client.FindIterable;
import org.bson.Document;

import java.util.ArrayList;
/*
 Repository çeşitlerini ve onların CRUD operasyonlarını tanımlar (Örnek: postgre,mongodb,oracle...)
 */
public interface IRepository {
    public Document addRow(ArrayList<String> row); // sadece 1 satır değerinde veriyi ekler
    public void addAll(ArrayList<ArrayList<String>> data); // Verilen tüm veriyi veri tabınına ekler
    public void delete(String key,String value);
    public void update(String key, String findValue, Document updateValues);
    public FindIterable<Document> select(BasicDBObject query);
    public void selectAll();
    public ArrayList<String> getColNames();
    public void setColNames(ArrayList<String> colNames);
    public ArrayList<ArrayList<String>> getData();
    public void deleteAll();

}
