import logo from './logo.svg';
import './App.css';
import RowHeader from "./RowHeader";
import SockJS from "sockjs-client"
import $ from "jquery";
import {Stomp} from "@stomp/stompjs";
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import Popper from 'popper.js';
import {useEffect, useState,useRef} from "react";
import React from 'react';
import SockJsClient from 'react-stomp';
import StompServer from "./StompServer";
import L from "leaflet";
import ms from "milsymbol"
import leafGreen from "./assets/leaf-green.png";
import leafShadow from "./assets/leaf-shadow.png";
import friend from "./assets/FIXED WING-FRIEND.png";

import {MapContainer, Marker, Popup, TileLayer, Tooltip} from "react-leaflet";
import B from "./b";
import {Button} from "bootstrap/js/index.esm";

var stompClient = "";
var socket = "";
let y=9;

let latitude = 39.772790
let longitude=35.772790
let statusV=friend



let stateCurrent = {
    centerTheMap: {
        lat: 39.772790,
        lng: 35.772790,
    },
    zoom: 20
};

/*
let currentMarker = {
    type: "",
    settype(item.type)
setid(item.id)
setvelocity(item.velocity)
setdevice(item.device)


}*/




function App() {

    //connect();
    let [layer,setLayerMap] = useState("http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}");
    let [query,setQuery] = useState("")
    let [markers, setmarkers] = useState([]);
    let [replayMarkers, setreplayMarkers] = useState([]);
    let [connections, setconnections] = useState([]);
    let [updated,setupdated] = useState(false);
    let [id,setid] = useState("");
    let [popup,setpopup] = useState(false);
    let [menu,setmenu] = useState(true);
    let [type,settype] = useState("");
    let [velocity,setvelocity] = useState("");
    let [device,setdevice] = useState("");
    let [dev,setdev] = useState("");
    let [connectList,setconnectList] = useState(false);
    let [markerList,setmarkerList] = useState(false)
    let [isReplay,setIsReplay] = useState(false)
    let [state,setState] = useState(stateCurrent);
    let [zoom,setZoom] = useState(30);

    const [alert, setAlert] = useState(false);
    const [alertClose, setAlertClosed] = useState(false);
function goToTrack() {
    state.zoom=30;
    state.centerTheMap.lat=0;
    state.centerTheMap.lng=0;
    setState(state)
    setZoom(10)
    setupdated(true)

}
    function openStreet(){
       setLayerMap("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")
    }
    function openSatellite(){
       setLayerMap("http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}")
    }
    function openGoogleHybrid(){
            setLayerMap("http://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}&s=Ga")
        }
    function openGoogleSatellite(){
        setLayerMap("http://mt0.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}&s=Ga")
    }
    function openGoogleStreet(){
        setLayerMap("http://mt0.google.com/vt/lyrs=r&hl=en&x={x}&y={y}&z={z}&s=Ga")
    }
    function showList(){
        setconnectList(true)
    }
    function closeList(){
        setconnectList(false)
    }
    function showMarkerList(){
        setmarkerList(true)
    }
    function closeMarkerList(){
        setmarkerList(false)
    }

    function replayMode(){
        replayMarkers=[]
        setreplayMarkers(replayMarkers);
        setIsReplay(true)
        stompClient.send("/ws/csv",{},"replay");
        replayMarkers=[]
        setreplayMarkers(replayMarkers);
    }
    function playMode(){
        markers=[]
        setmarkers(markers)

        setIsReplay(false)


        stompClient.send("/ws/csv",{},"play");
    }
    const handleChange = (event) => {
        setQuery(event.target.value);
    };
    function replay(){
        //console.log(query)

        replayMarkers=[]
        setreplayMarkers(replayMarkers);
        stompClient.send("/ws/db",{},query);
    }
    function showMessage(message,id){
        //if(type===1) $("#messages").append("<tr class=table-primary><td>" + message + "</td></tr>");
        //else $("#messages").append("<tr class=table-secondary><td>" + message + "</td></tr>");
        function getIndex(id) {
            return markers.findIndex(obj => obj.id === id);
        }
        let index = getIndex(id);

        latitude=JSON.parse(message.body).lat
        let stat = JSON.parse(message.body).status;
        longitude =JSON.parse(message.body).lng;
        statusV = require("./assets/" +JSON.parse(message.body).type + "-" + JSON.parse(message.body).status +".png")

        markers.at(index).lat = latitude;
        markers.at(index).lng = longitude;
        //console.log(longitude)
        markers.at(index).status = L.icon({
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


    function showMessageReplay(message,id){
        function getIndex(id) {
            return replayMarkers.findIndex(obj => obj.id === id);
        }
        let index = getIndex(id);

        latitude=JSON.parse(message.body).lat
        ////console.log("->>>>>>>>>"  + message.body)
        let stat = JSON.parse(message.body).status;
        longitude =JSON.parse(message.body).lng;
        statusV = require("./assets/" +JSON.parse(message.body).type + "-" + JSON.parse(message.body).status +".png")

        replayMarkers.at(index).lat = latitude;
        replayMarkers.at(index).lng = longitude;
        replayMarkers.at(index).status = L.icon({
            iconUrl: statusV,
            shadowUrl: leafShadow,
            iconSize: [38, 45], // size of the icon
            shadowSize: [0, 0], // size of the shadow
            iconAnchor: [22, 44], // point of the icon which will correspond to marker's location
            shadowAnchor: [0, 0],  // the same for the shadow
            popupAnchor: [-3, -86]
        });
        setreplayMarkers(replayMarkers)
        setupdated(true);
    }

    function connect(){
        //console.log(socket.connected)
        if(stompClient.connected && socket){
            //console.log("lşaskfşls")
        }else{

            socket = new SockJS("http://localhost:10100/our-websocket")
            stompClient = Stomp.over(socket);

            stompClient.connect({}, function (frame) {

                //console.log("Connected: " + frame);
                stompClient.subscribe("/topic/csv", function (message) {
                    let a = message.body
                    let id=JSON.parse(message.body).id
                    let type=JSON.parse(message.body).type;
                    let vel = JSON.parse(message.body).velocity
                    let dev= JSON.parse(message.body).device;

                    let found = markers.find(obj => {
                        return obj.id === id;
                    });
                    if(typeof(found) === 'undefined'){
                        var initialvalues = {
                            id: id,
                            lat: latitude,
                            lng: longitude,
                            type:type,
                            device:dev,
                            velocity:vel,
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
                        markers.push(initialvalues);
                        setmarkers([...markers, initialvalues]);

                    }
                    showMessage(message, id);
                    setupdated(true);
                });
                stompClient.subscribe("/topic/xml", function (message) {
                    let a = message.body
                    let id=JSON.parse(message.body).id
                    let type=JSON.parse(message.body).type;
                    let vel = JSON.parse(message.body).velocity
                    let dev= JSON.parse(message.body).device;
                    let found = markers.find(obj => {
                        return obj.id === id;
                    });
                    if(typeof(found) === 'undefined'){
                        var initialvalues2 = {
                            id: id,
                            lat: latitude,
                            type:type,
                            lng: longitude,
                            velocity:vel,
                            device:dev,
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
                        markers.push(initialvalues2);
                        setmarkers((markers) => [...markers, initialvalues2]);


                    }

                    //console.log(message.body)
                    showMessage(message, id);
                    setupdated(true);
                });
                stompClient.subscribe("/topic/port", function (message) {
                    let id=JSON.parse(message.body).id;
                    //console.log("laslfasasfafsaf")
                    let type=JSON.parse(message.body).type;
                    let vel = JSON.parse(message.body).velocity
                    let dev= JSON.parse(message.body).device;
                    let found = markers.find(obj => {
                        return obj.id === id;
                    });
                    if(typeof(found) === 'undefined'){
                        var initialvalues3 = {
                            id: id,
                            lat: latitude,
                            type:type,
                            lng: longitude,
                            velocity: vel,
                            device:dev,
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
                        markers.push(initialvalues3);
                        setmarkers((markers) => [...markers, initialvalues3]);


                    }

                    //console.log("-> <- " + JSON.parse(message.body).velocity)
                    showMessage(message, id);
                    setupdated(true);
                });
                stompClient.subscribe("/topic/connect-req", function (message) {
                    setdev(JSON.parse(message.body).deviceID)
                    let types = JSON.parse(message.body).dataType
                    ////console.log(JSON.parse(message.body).deviceID)
                    let devId = JSON.parse(message.body).deviceID;
                    //connections.push(devId);
                    //console.log(types)
                    if(types==="Close"){
                        const index = connections.indexOf(devId);
                        setconnections(connections.filter((obj) => obj !== devId))

                        setAlertClosed(true);
                    }
                    else{
                        let found = connections.find(obj => {
                            return obj === devId;
                        });
                        //console.log(typeof(found) === 'undefined')
                        if(typeof(found) === 'undefined'){
                            connections.push(devId)
                            setconnections((connections) => [...connections,devId]);

                            setAlert(true)
                        }
                    }


                });
                stompClient.subscribe("/topic/replay", function (message) {

                    //console.log(message.body)
                    setmarkers([])
                    markers=[]
                    replayMarkers=[]
                    setreplayMarkers(replayMarkers)

                });
                stompClient.subscribe("/topic/query", function (message) {

                    let id=JSON.parse(message.body).id;
                    //console.log("->" + id + " " + JSON.parse(message.body).lat + " " + JSON.parse(message.body).lng)
                    let type=JSON.parse(message.body).type;
                    let vel = JSON.parse(message.body).velocity
                    let dev= JSON.parse(message.body).device;
                    let found = replayMarkers.find(obj => {
                        return obj.id === id;
                    });
                    if(typeof(found) === 'undefined'){
                        var initialvalues3 = {
                            id: id,
                            lat: latitude,
                            type:type,
                            lng: longitude,
                            velocity: vel,
                            device:dev,
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
                        replayMarkers.push(initialvalues3);
                        setreplayMarkers((replayMarkers) => [...replayMarkers, initialvalues3]);


                    }
                    showMessageReplay(message, id);
                    setupdated(true);

                });
            });

        }


    }

    useEffect(() => {
        // when the component is mounted, the alert is displayed for 3 seconds
        setTimeout(() => {
            setAlert(false);
        }, 5000);
    }, [alert]);
    useEffect(() => {
        // when the component is mounted, the alert is displayed for 3 seconds
        setTimeout(() => {
            setAlertClosed(false);
        }, 5000);
    }, [alertClose]);

    useEffect(() => {
        connect();
        return ()=> {};
    }, []);


    useEffect(() => {

        //markers.map(item => console.log(item));
        console.log(state.zoom)
        setupdated(false);
        return ;
    }, [updated]);

    function closePop(){
        setpopup(false);
    }
    return (

        <div className="App">

            {isReplay ? <div id="myModal2" className="modal"  style={{display:'inline-block',width:'200px',left: '10px',top: '80%'}}>
                <div className="modal-content" style={{backgroundColor: '#C0C0C0'}}>
                    <div >
                        <tr style={{display:'inline-block'}}>Enter Id</tr>
                        <input style={{display:'inline-block'}}
                               type="text"
                               id="message"
                               name="message"
                               onChange={handleChange}
                        />
                    </div >

                    <button  data-toggle="collapse" data-target="#navbarNavDropdown">
                        <span style={{display:'inline-block',width:'200px'}} className="close" onClick={replay}>Replay</span>
                    </button>
                </div>
            </div> : null


            }



            {alert ?
                <div id="myModal4" className="modal"  style={{display:'inline-block',width:'200px', left: '750px',top: '10px' } }>
                    <div className="modal-content" style={{backgroundColor: '#C0C0C0'}}>
                        {dev} is connected to server

                    </div>
                </div> : null
            }
            {alertClose ?
                <div id="myModal5" className="modal"  style={{display:'inline-block',width:'200px', left: '750px',top: '10px' } }>
                    <div className="modal-content" style={{backgroundColor: '#C0C0C0'}}>
                        {dev} is leaved from server

                    </div>
                </div> : null
            }
            <div id="myModal2" className="modal"  style={{display:'inline-block',width:'200px',  left: '1%',top: '1%',height:'50px'}}>
                <div className="modal-content" style={{backgroundColor: '#C0C0C0'}}>

                    <p>Track Count : {markers.length}</p>
                </div>
            </div>



            {connectList ? <div id="myModal2" className="modal"  style={{display:'inline-block',height:'150px',width:'200px',left: '89%',top: '1%'}}>
                <div className="modal-content" style={{backgroundColor: '#C0C0C0'}}>
                    <span className="close" onClick={closeList}>&times;</span>
                    <ul className="list-group">
                        {
                            connections.map(item => <li className="list-group-item">{item}</li>)

                        }
                    </ul>
                </div>
            </div> : null}


            {markerList ? <div id="myModal2" className="modal"  style={{display:'inline-block',height:'150px',width:'300px',left: '84%',top: '550px'}}>
                <div className="modal-content" style={{backgroundColor: '#C0C0C0'}}>
                    <span className="close" onClick={closeMarkerList}>&times;</span>
                    <ul className="list-group">
                        {
                            <table className="table table-striped">
                                <thead>
                                <tr>
                                    <th scope="col">ID</th>
                                    <th scope="col">Latitude</th>
                                    <th scope="col">Longitude</th>
                                    <th scope="col">Unit</th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    markers.map(item =>
                                        <tr>
                                            <th scope="row">{item.id}</th>
                                            <td>{item.lat}</td>
                                            <td>{item.lng}</td>
                                            <td>{item.device}</td>
                                        </tr>
                                    )

                                }

                                </tbody>
                            </table>



                        }
                    </ul>
                </div>
            </div> : null}

            { popup ? <div id="myModal" className="modal"  style={{display:'inline-block',width:'200px', left: '89%',top: '25%',height:'250px' } }>
                <div className="modal-content" style={{backgroundColor: '#C0C0C0'}}>
                    <span className="close" onClick={closePop}>&times;</span>
                    <table className="table table-striped">
                        <tbody>
                        <tr>
                            <th scope="row">ID</th>
                            <td>{id}</td>
                        </tr>

                        <tr>
                            <th scope="row">Type</th>
                            <td>{type}</td>
                        </tr>

                        <tr>
                            <th scope="row">Velocity</th>
                            <td>{velocity}</td>
                        </tr>
                        <tr>
                            <th scope="row">Unit</th>
                            <td>{device}</td>
                        </tr>
                        <tr >
                            <th scope="row">Action</th>
                        <button onClick={goToTrack} style={{display:'inline-block',width:'120px'}}>
                            Go to Track
                        </button>
                        </tr>
                        </tbody>
                    </table>


                </div>
            </div> : null}

            <MapContainer className="map" center={state.centerTheMap} zoom={zoom} zoomControl={false} attributionControl={false}  >

                <TileLayer
                    url={layer}
                />
                { isReplay===false ?
                    markers.map(item =>
                        <Marker key={item.id}  eventHandlers={{
                            click: (e) => {
                                //console.log('id : ', item.type)
                                setpopup(true)
                                settype(item.type)
                                setid(item.id)
                                setvelocity(item.velocity)
                                setdevice(item.device)

                            },
                        }}  position={[item.lat,item.lng]} icon={item.status}>
                            <Tooltip direction="right" offset={[0, 0]} opacity={1} permanent>{item.id}</Tooltip>

                        </Marker>) : null
                }

                { isReplay ?
                    replayMarkers.map(item =>
                        <Marker key={item.id}  eventHandlers={{
                            click: (e) => {
                                //console.log('id : ', item.type)
                                setpopup(true)
                                settype(item.type)
                                setid(item.id)
                                setvelocity(item.velocity)
                                setdevice(item.device)

                            },
                        }}  position={[item.lat,item.lng]} icon={item.status}>
                            <Tooltip direction="right" offset={[0, 0]} opacity={1} permanent>{item.id}</Tooltip>
                        </Marker>) : null
                }

            </MapContainer>


            { menu ? <div id="myModal3" className="modal"  style={{backgroundColor: '#C0C0C0' ,display:'inline-block',width:'620px',height:"55px", left: '1%',top: '92%',opacity: 0.9}}>

                <nav className="navbar navbar-expand-lg navbar-light bg-light" style={ {backgroundColor: '#C0C0C0' ,display:'inline-block',width:'700px',opacity: 0.5}}>
                    <div className="collapse navbar-collapse" id="navbarNavDropdown">
                        <button data-toggle="collapse" data-target="#navbarNavDropdown">
                            <span  className="close" onClick={showList}>Show  Unit List</span>
                        </button>


                        <button data-toggle="collapse" data-target="#navbarNavDropdown" style={{display:'block'} }>
                            <span  className="close" onClick={showMarkerList}>Show Track List</span>
                        </button>

                        <button data-toggle="collapse" data-target="#navbarNavDropdown">
                            <span  className="close" onClick={replayMode}>Replay Mode</span>
                        </button>

                        {
                            isReplay ? <button data-toggle="collapse" style={{display:'block',position: 'fixed',left: '470px'}} data-target="#navbarNavDropdown">
                                <span  className="close" onClick={playMode}>Play Mode</span>
                            </button> : null
                        }
                        <div className="btn-group dropup"   style={{display:'block',position: 'fixed',left: '360px'} }>
                            <button type="button" className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                Map Type
                            </button>
                            <div className="dropdown-menu">
                                <li><button class="btn btn-outline-success" onClick={openStreet}>Open Street</button></li>
                                <li><button class="btn btn-outline-success" onClick={openSatellite}>Open Street Satellite</button></li>
                                <li><button class="btn btn-outline-success" onClick={openGoogleHybrid}>Google hybrid</button></li>
                                <li><button  class="btn btn-outline-success" onClick={openGoogleSatellite}>Google Satellite </button></li>
                                <li><button  class="btn btn-outline-success" onClick={openGoogleStreet}>Google Street </button></li>
                            </div>
                        </div>


                    </div>
                </nav></div> : null
            }
        </div>

    );
}
//'http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}'
//https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
//http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}
export default App;
//style={{display:'inline-block',width:'200px', left: '770px',top: '10px' ,height:'170px'} }