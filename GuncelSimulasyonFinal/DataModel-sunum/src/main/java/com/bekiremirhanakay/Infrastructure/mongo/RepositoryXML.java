package com.bekiremirhanakay.Infrastructure.mongo;

import com.bekiremirhanakay.Application.Data.IRepository;
import com.mongodb.BasicDBObject;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;

import java.util.ArrayList;

import static com.mongodb.client.model.Filters.eq;

public class RepositoryXML extends MongoRepository implements IRepository {
    private MongoDatabase database;
    private ArrayList<String> colNames;
    MongoCollection<Document> collection;
    public  RepositoryXML(){
        super();
        //super();
    }

    @Override
    public Document addRow(ArrayList<String> row) {
        Document addedRow = super.addRow(row);
        System.out.println();
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
    public FindIterable<Document> select(BasicDBObject query) {
        this.collection = database.getCollection("dataType1");
        FindIterable<Document> documents = this.collection.find();
        return null;
    }

    @Override
    public void selectAll() {
        this.collection = database.getCollection("dataType1");
        FindIterable<Document> documents = this.collection.find();
        for (Document doc : documents){
            System.out.println(doc);

        }
    }

    @Override
    public ArrayList<String> getColNames() {
        return colNames;
    }

    @Override
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
