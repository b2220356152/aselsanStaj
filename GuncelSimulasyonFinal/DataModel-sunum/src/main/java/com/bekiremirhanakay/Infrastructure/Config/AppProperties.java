package com.bekiremirhanakay.Infrastructure.Config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.annotation.PropertySources;
import org.springframework.stereotype.Component;

@Component
@PropertySource("classpath:application-csv.properties")

public class AppProperties {

  @Value("${port}")
  private String port;


  public String getPort() {
    return port;
  }

  public void setPort(String port) {
    this.port = port;
  }
}