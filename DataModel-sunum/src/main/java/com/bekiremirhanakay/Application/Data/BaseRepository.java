package com.bekiremirhanakay.Application.Data;

public abstract class BaseRepository {
    /*
     Repository için temel sınıftır. Tüm veritabanı servis türleri bu sınıftan miras almalıdır
     */
    private boolean isComitted;
    public boolean isComitted() {
        return isComitted;
    } // transection işlemi gerçekleşme durumunu bildirir
    public void setComitted(boolean comitted) {
        isComitted = comitted;
    }
}
