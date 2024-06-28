package com.bekiremirhanakay.Infrastructure.mongo;

import com.bekiremirhanakay.Application.Data.IRepository;
import com.mongodb.*;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;

import static com.mongodb.client.model.Filters.eq;

import org.bson.Document;

import java.util.*;
/*
    CSV formatında gelen veriler veri tabanına aktarılır
 */
public class RepositoryCSV extends MongoRepository implements IRepository {
    private ArrayList<String> colNames;
    MongoCollection<Document> collection;
    public RepositoryCSV(){
        super();
    }
    @Override
    public Document addRow(ArrayList<String> row) {
        Document addedRow = super.addRow(row);
        if(super.isComitted()){

            return addedRow;
        }
        return null;

    }

    @Override
    public void addAll(ArrayList<ArrayList<String>> data) {
        super.addAll(data);
        if(super.isComitted()){
            //super.getQueue().queueMany(data);
        }

    }


    @Override
    public void delete(String key,String value) {
        super.delete(key,value);
    }

    @Override
    public void update(String key,String findValue,Document updateValues) {
        super.update(key,findValue,updateValues);
    }

    @Override
    public FindIterable<Document> select(BasicDBObject  query) {
        this.collection = super.getDatabase().getCollection("dataType1");
        FindIterable<Document> documents = this.collection.find(query);
        return documents;
    }


    @Override
    public void selectAll() {
        this.collection = super.getDatabase().getCollection("dataType1");
        FindIterable<Document> documents = this.collection.find();
        for (Document document : documents){
            System.out.println(document);

        }
    }


    public ArrayList<String> getColNames() {
        return colNames;
    }

    public void setColNames(ArrayList<String> colNames) {
        this.colNames = colNames;
    }

    @Override
    public ArrayList<ArrayList<String>> getData() {
        return null;
    }

    @Override
    public void deleteAll() {
        super.deleteAll();
    }
}
