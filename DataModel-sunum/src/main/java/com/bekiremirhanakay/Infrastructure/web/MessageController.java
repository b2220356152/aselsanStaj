package com.bekiremirhanakay.Infrastructure.web;

import com.bekiremirhanakay.Application.Data.IEventPublisher;

import com.bekiremirhanakay.Infrastructure.rabbitmq.RabbitMQ;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
public class MessageController {

    private IEventPublisher queueCommand = new RabbitMQ();

    public MessageController(){

    }
    @MessageMapping("/csv")
    public void replay(@Payload String message, Principal principal){
        queueCommand.create("CommandQueue");
        System.out.println(message);
        queueCommand.publish(message);

    }

    @MessageMapping("/db")
    public void replayQuery(@Payload String message, Principal principal){
        queueCommand.create("QueryQueue");
        System.out.println(message);
        queueCommand.publish(message);

    }





}






