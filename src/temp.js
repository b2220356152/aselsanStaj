import logo from './logo.svg';
import './App.css';
import RowHeader from "./RowHeader";
import SockJS from "sockjs-client"
import $ from "jquery";
import {Stomp} from "@stomp/stompjs";
import 'bootstrap/dist/css/bootstrap.css'
import {useEffect, useState} from "react";
import React from 'react';
import SockJsClient from 'react-stomp';
import StompServer from "./StompServer";
import L from "leaflet";
import ms from "milsymbol"
import leafGreen from "./assets/leaf-green.png";
import leafShadow from "./assets/leaf-shadow.png";
import friend from "./assets/30030100001101000000 - Fixed Wing - Not Applicable.png";
import pending from "./assets/30000100001101000000 - Fixed Wing - Not Applicable.png";
import unknown from "./assets/30010100001101000000 - Fixed Wing - Not Applicable.png";
import enemy from "./assets/30060100001101000000 - Unit Name - Fixed Wing - Not Applicable.png";
import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";

var stompClient = "";
var socket = "";
let y=9;

let latitude = 39.772790
let longitude=35.772790
let statusV=friend



let state;
state = {
    greenIcon: {
        lat: 39.772790,
        lng: 35.772790,
    },
    zoom: 13
};
let grenIcon;
grenIcon = L.icon({
    iconUrl: leafGreen,
    shadowUrl: leafShadow,
    iconSize: [38, 95], // size of the icon
    shadowSize: [50, 64], // size of the shadow
    iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor: [-3, -76]
});




function App() {

    connect();

    const initialvalues = {
        id: 1,
        lat: 39.772790,
        lng: 35.772790,
        status: L.icon({
            iconUrl: statusV,
            shadowUrl: leafShadow,
            iconSize: [38, 45], // size of the icon
            shadowSize: [0, 0], // size of the shadow
            iconAnchor: [22, 44], // point of the icon which will correspond to marker's location
            shadowAnchor: [0, 0],  // the same for the shadow
            popupAnchor: [-3, -86]
        })
    };
    const initialvalues2 = {
        id: 2,
        lat: 39.772790,
        lng: 35.772790,
        status: L.icon({
            iconUrl: statusV,
            shadowUrl: leafShadow,
            iconSize: [38, 45], // size of the icon
            shadowSize: [0, 0], // size of the shadow
            iconAnchor: [22, 44], // point of the icon which will correspond to marker's location
            shadowAnchor: [0, 0],  // the same for the shadow
            popupAnchor: [-3, -86]
        })
    };

    const [markers, setmarkers] = useState([initialvalues,initialvalues2]);
    let [updated,setupdated] = useState(false);
    let [message,setmessage] = useState("");

    function showMessage(message,id){
        //if(type===1) $("#messages").append("<tr class=table-primary><td>" + message + "</td></tr>");
        //else $("#messages").append("<tr class=table-secondary><td>" + message + "</td></tr>");

        console.log("-*=* > " + latitude);
        console.log(message)
        let a = message
        latitude=a.split(" ")[3]
        let stat = a.split(" ")[12];
        longitude =a.split(" ")[5];
        if(stat==="PENDING"){
            statusV=pending
        }
        else if(stat==="UNKNOWN"){
            statusV=unknown
        }
        else if(stat==="FRIEND"){
            statusV=friend
        }
        else if(stat==="ENEMY"){
            statusV=enemy
        }
        markers.at(id).lat = latitude;
        markers.at(id).lng = longitude;
        markers.at(id).status = L.icon({
            iconUrl: statusV,
            shadowUrl: leafShadow,
            iconSize: [38, 45], // size of the icon
            shadowSize: [0, 0], // size of the shadow
            iconAnchor: [22, 44], // point of the icon which will correspond to marker's location
            shadowAnchor: [0, 0],  // the same for the shadow
            popupAnchor: [-3, -86]
        });
        setmarkers(markers)
        setupdated(true);



    }
    function showMessage2(message,id){
        //if(type===1) $("#messages").append("<tr class=table-primary><td>" + message + "</td></tr>");
        //else $("#messages").append("<tr class=table-secondary><td>" + message + "</td></tr>");


        console.log(message)
        let a = message
        latitude=a.split(" ")[3]
        let stat = a.split(" ")[12];
        longitude =a.split(" ")[5];
        if(stat==="PENDING"){
            statusV=pending
        }
        else if(stat==="UNKNOWN"){
            statusV=unknown
        }
        else if(stat==="FRIEND"){
            statusV=friend
        }
        else if(stat==="ENEMY"){
            statusV=enemy
        }

        markers.at(id).lat = latitude;
        markers.at(id).lng = longitude;
        markers.at(id).status = L.icon({
            iconUrl: statusV,
            shadowUrl: leafShadow,
            iconSize: [38, 45], // size of the icon
            shadowSize: [0, 0], // size of the shadow
            iconAnchor: [22, 44], // point of the icon which will correspond to marker's location
            shadowAnchor: [0, 0],  // the same for the shadow
            popupAnchor: [-3, -86]
        });
        setmarkers(markers)
        setupdated(true);



    }
    function connect(){
        console.log(socket.connected)
        if(stompClient.connected && socket){
            console.log("lşaskfşls")
        }else{
            socket = new SockJS("http://localhost:10100/our-websocket")
            stompClient = Stomp.over(socket);
            stompClient.connect({}, function (frame) {
                console.log("Connected: " + frame);
                stompClient.subscribe("/topic/csv", function (message) {
                    console.log(message.body)
                    setmessage(message.body)

                });
                stompClient.subscribe("/topic/xml", function (message) {
                    console.log(message.body)
                    //console.log("-----------------------------------------" + markers.length)
                    setupdated(true);
                    setmessage(message.body)

                });
            });
        }


    }




    useEffect(() => {
        console.log("---:)")
        markers.map(item => console.log(item));
        setupdated(false);
        showMessage(message, 0);
        showMessage(message, 1);
        return ;
    }, [updated]);



    const positionGreenIcon = [state.greenIcon.lat, state.greenIcon.lng];
    const positionOrangeIcon = [markers.at(0).lat, markers.at(0).lng];
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
                        <button id="send" align="right" className="btn btn-default" type="button" >Send</button> </form> </div></div>
            <MapContainer className="map" center={positionGreenIcon} zoom={state.zoom}>
                <TileLayer
                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {
                    markers.map(item =>
                        <Marker position={[item.lat,item.lng]} icon={item.status}> </Marker>)
                }

            </MapContainer>
        </div>
    );
}

export default App;
