import logo from './logo.svg';
import './App.css';
import RowHeader from "./RowHeader";
import SockJS from "sockjs-client"
import $ from "jquery";
import {Stomp} from "@stomp/stompjs";
//var Stomp = require('stomp-client');
import 'bootstrap/dist/css/bootstrap.css'
import ListNew from "./ListNew";
import WorldMap from "./worldMap";
import {useState} from "react";
import React from 'react';
import SockJsClient from 'react-stomp';
import StompServer from "./StompServer";

var stompClient = null;
var socket = new SockJS("http://localhost:10100/our-websocket");


var tmp = 12
function con (frame){
    console.log("Connected: " + frame);
    stompClient.subscribe("/topic/csv",function (message){
        console.log(JSON.parse(message.body).content)
        var a = JSON.parse(message.body).content

        console.log(JSON.parse(message.body).content)
        console.log(a.split(" ")[3])

    });
};
function sendMessage(){
    console.log("sending message");


    stompClient.send("/ws/csv",{},JSON.stringify({'messageContent':$("#message").val()}));
    tmp = JSON.stringify({'messageContent':$("#message").val()});
    console.log("--------> " + tmp)
    console.log(stompClient)

}
function bb(){
    sendMessage();
}

function showMessage(message,type){
    if(type===1) $("#messages").append("<tr class=table-primary><td>" + message + "</td></tr>");
    else $("#messages").append("<tr class=table-secondary><td>" + message + "</td></tr>");
    console.log(message)


}
function App() {
    stompClient=Stomp.over(socket);
    console.log(stompClient)
    stompClient.connect({}, function (frame){
        console.log("Connected: " + frame);
        stompClient.subscribe("/topic/xml",function (message){
            showMessage(JSON.parse(message.body).content,1);
        });

        stompClient.subscribe("/topic/csv",function (message){

            showMessage(JSON.parse(message.body).content,0);
        });
    });
    socket.onopen = () => {
        console.log(stompClient)



    }

    socket.onmessage = e => {
        console.log(e)
    }

    //stompClient.send("/ws/xml",{},JSON.stringify({'messageContent':$("#message").val()}));
    //stompClient.send("/ws/csv",{},JSON.stringify({'messageContent':$("#message").val()}));
    return (

        <div className="App">
            <RowHeader></RowHeader>
            <div className="row" align="right">
                <div className="col-md-12" align="right">
                    <form className="form-inline" align="right">
                        <div className="form-group" align="right"> <label htmlFor="message"> <input type="text" id="message"
                                                                                                    className="form-control"
                                                                                                    placeholder="Enter your message here..."></input>
                            Message</label>
                        </div>
                        <button id="send" align="right" className="btn btn-default" type="button"  onClick={bb}>Send</button> </form> </div></div>
            <WorldMap lngN={tmp} latN={12}></WorldMap>
        </div>
    );
}

export default App;
