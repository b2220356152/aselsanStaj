package com.bekiremirhanakay.Application.Socket;

import org.springframework.messaging.simp.stomp.StompHeaders;
import org.springframework.messaging.simp.stomp.StompSession;

public interface IWebService {
    public void connect();
    public void send(String roomId);
    default void validateConnected(StompSession session, StompHeaders connectedHeaders){

    }
    public void recieve(String roomId);

}
