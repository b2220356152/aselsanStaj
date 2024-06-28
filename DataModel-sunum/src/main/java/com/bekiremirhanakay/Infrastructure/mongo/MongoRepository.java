package com.bekiremirhanakay.Infrastructure.mongo;

import com.bekiremirhanakay.Application.Data.BaseRepository;
import com.mongodb.*;
import com.mongodb.MongoClient;
import com.mongodb.client.*;
import com.mongodb.client.model.UpdateOptions;
import com.mongodb.client.model.Updates;
import com.mongodb.client.result.DeleteResult;
import com.mongodb.client.result.UpdateResult;
import org.bson.Document;
import org.bson.conversions.Bson;
import org.bson.types.ObjectId;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

import static com.mongodb.client.model.Filters.eq;

public abstract class MongoRepository extends BaseRepository {
    /*
    Mongodb için yazılmış temel sınıftır mongodb ile ilgili temel operasyonlar bu sınıftan miras alır
     */
    private MongoDatabase database; // Veri tabanı
    private ArrayList<String> colNames; // verilerin sütun isimlerinin tutulduğu yer
    private MongoCollection<Document> collection; // Verilerin tutulduğu tablo/koleksiyon
    private MongoCredential credential; // Güvenlik bileşenlerini(Kullanıcı adı / şifre ...) içerir
    private MongoClient mongo; // Veri tabanı içim bağlantı kurar
    private ClientSession session; // transaction sağlar

    public MongoRepository() {
        //Yukarıda açıklanan değişkenlerin atamaları yapılır.

        mongo = new MongoClient("localhost", 27017);
        System.out.println(mongo.getMongoClientOptions());
        session = (ClientSession) this.mongo.startSession();
        MongoCredential credential;
        credential = MongoCredential.createCredential("User", "DB",
                "pass".toCharArray());
        database = mongo.getDatabase("Database-1");

        this.setCollection(getDatabase().getCollection("dataType1"));
    }

    @SuppressWarnings("resource")
    @Transactional
    public Document addRow(ArrayList<String> row) {
        // Bir satır değerinde veri gönderilir
        try {
            //getSession().startTransaction(TransactionOptions.builder().writeConcern(WriteConcern.MAJORITY).build());
            Document newDocument = new Document();
            newDocument.append("_id", new ObjectId());
            for (int index = 0; index < row.size(); index+=2) {
                newDocument.append(row.get(index), row.get(index+1));
            }

            this.getCollection().insertOne(newDocument);

            //getSession().commitTransaction();

            super.setComitted(true);
            return newDocument;
        } catch (Exception exception) {
            super.setComitted(false);

            System.out.println(exception);
        }
        return null;
    }

    @Transactional
    public void addAll(ArrayList<ArrayList<String>> data) {
        // Birden çok satır değerinde veri gönderilir
        List<Document> dataList = new ArrayList<>();
        try {
            getSession().startTransaction(TransactionOptions.builder().writeConcern(WriteConcern.MAJORITY).build());
            for (ArrayList<String> list : data) {
                Document newDocument = new Document();
                newDocument.append("_id", new ObjectId());
                for (int index = 0; index < getColNames().size(); index++) {
                    newDocument.append(getColNames().get(index), list.get(index));
                }
                dataList.add(newDocument);
            }
            this.getCollection().insertMany(dataList);
            getSession().commitTransaction();
            super.setComitted(true);
        } catch (Exception exception) {
            super.setComitted(false);
            System.out.println(exception);
            session.abortTransaction();
        }


    }

    public void delete(String key, String value) {
        // Bir veri birimi silinir
        this.collection = database.getCollection("dataType1");
        Bson searchQuery = eq(key, value);


        try {
            DeleteResult result = collection.deleteOne(searchQuery);


        } catch (MongoException mongoException) {
            System.out.println(mongoException);
        }

    }

    public void update(String key, String findValue, Document updateValues) {
        // Bir veri birimi güncellenir

        try {
            this.collection = database.getCollection("dataType1");
            Set<String> keys = updateValues.keySet();
            Iterator<String> iteratorKey = keys.iterator();
            ArrayList<Bson> updateFields = new ArrayList<>();
            while (iteratorKey.hasNext()) {
                System.out.println();
                String tempKey = iteratorKey.next();
                updateFields.add(Updates.set(tempKey, updateValues.get(tempKey)));
            }
            Bson updates = Updates.combine(updateFields);
            UpdateOptions options = new UpdateOptions().upsert(true);
            UpdateResult result = this.collection.updateOne(this.collection.find(eq(key, findValue)).first(), updates, options);
        } catch (IllegalArgumentException illegalArgumentException) {
            System.out.println(illegalArgumentException);
        }
    }

    public MongoDatabase getDatabase() {
        return database;
    }

    public void setDatabase(MongoDatabase database) {
        this.database = database;
    }

    public ArrayList<String> getColNames() {
        return colNames;
    }

    public void setColNames(ArrayList<String> colNames) {
        this.colNames = colNames;
    }

    public MongoCollection<Document> getCollection() {
        return collection;
    }

    public void setCollection(MongoCollection<Document> collection) {
        this.collection = collection;
    }

    public MongoCredential getCredential() {
        return credential;
    }

    public void setCredential(MongoCredential credential) {
        this.credential = credential;
    }

    public void deleteAll() {
        // Veri tabanındaki tüm veriler silinir.
        this.collection = database.getCollection("dataType1");
        FindIterable<Document> documents = collection.find();
        for (Document document : documents) {
            Document deletedDocument = new Document();
            deletedDocument.append("_id", document.values().iterator().next());
            collection.deleteMany(deletedDocument);
        }
    }

    public ClientSession getSession() {
        return session;
    }

    public void setSession(ClientSession session) {
        this.session = session;
    }


}