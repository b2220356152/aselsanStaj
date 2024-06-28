package com.bekiremirhanakay.Application.Config;

public interface IConfigProvider {
    public Object getValue(String path, String key);
}
