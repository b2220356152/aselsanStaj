import logo from './logo.svg';
import './App.css';
import RowHeader from "./RowHeader";
import SockJS from "sockjs-client"
import $ from "jquery";
import {Stomp} from "@stomp/stompjs";
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import 'bootstrap/dist/js/bootstrap.js';
import Popper from 'popper.js';
import {useEffect, useState,useRef} from "react";
import 'react-leaflet-markercluster/dist/styles.min.css';
import 'leaflet/dist/leaflet.css';
import React from 'react';
import SockJsClient from 'react-stomp';
import StompServer from "./StompServer";
import L from "leaflet";
import ms from "milsymbol"
import leafGreen from "./assets/leaf-green.png";
import CanvasMarkersLayer from 'react-leaflet-canvas-markers/build/index';
import leafShadow from "./assets/leaf-shadow.png";
import friend from "./assets/FIXED WING-FRIEND.png";
import { useMap } from 'react-leaflet/hooks'
import "leaflet/src/dom/"
import TrackCount from "./components/TrackCount";
import MarkerList from "./components/MarkerList";
import DropDownMenu from "./components/DropDownMenu";
import ConnectionList from "./components/ConnectionList";
import Alert from "./components/Alert";
import TrackDetail from "./components/TrackDetail";
import Replay from "./components/Replay";
import MarkerClusterGroup from 'react-leaflet-markercluster';
import {MapContainer, Marker, Popup, TileLayer, Tooltip,Polyline,FeatureGroup} from "react-leaflet";
import B from "./b";
import {Button} from "bootstrap/js/index.esm";
import * as signalR from '@microsoft/signalr';

let connection;
var stompClient = "";
var socket = "";
let y=9;

let latitude = 39.772790
let longitude=35.772790
let statusV=friend
const polyline = [
    [51.505, -0.09],
    [51.51, -0.1],
    [51.51, -0.12],
]
const limeOptions = { color: 'lime' }



let stateCurrent = {
    centerTheMap: {
        lat: 39.742790,
        lng: 32.962790,
    },
    zoom: 10
};


const MyContext = React.createContext();
function App() {
let [connectList,setconnectList] = useState(false);
    let [layer,setLayerMap] = useState("http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}");
    let [query,setQuery] = useState("")
    let [markers, setmarkers] = useState([]);
    let [replayMarkers, setreplayMarkers] = useState([]);
    let [connections, setconnections] = useState([]);
    let [updated,setupdated] = useState(false);
    let [id,setid] = useState("");
    let [popup,setpopup] = useState(false);
    
    let mapList = [<li><a className="nav-link" href="#" onClick={openStreet}>Open Street</a></li>,
        <li><a className="nav-link" href="#" onClick={openSatellite}>Open Street Satellite</a></li>,
        <li><a className="nav-link" href="#" onClick={openGoogleHybrid}>Google hybrid</a></li>,
        <li><a className="nav-link" href="#" onClick={openGoogleSatellite}>Google Satellite </a></li>,
        <li><a className="nav-link" href="#" onClick={openGoogleStreet}>Google Street </a></li>]
    
    let showListNames = [<li><a className="nav-link" href="#" onClick={showList}>Show Unit List</a></li>,
        <li><a className="nav-link" href="#" onClick={showMarkerList}>Show Track List</a></li>]
    
    let [menu,setmenu] = useState(true);
    let [type,settype] = useState("");
    let [velocity,setvelocity] = useState("");
    let [device,setdevice] = useState("");
    let [dev,setdev] = useState("");
    let [optionMenu,setoptionMenu] = useState(false)
    let [markerList,setmarkerList] = useState(false)
    let [isReplay,setIsReplay] = useState(false)
    let [constantGUI,setconstantGUI] = useState(true)
    let [popGUI,setpopGUI] = useState(false)
    let [go,setGo] = useState(false)
    let [state,setState] = useState(stateCurrent);
    let [zoom,setZoom] = useState(30);
    let [styleB,setstyleB] = useState("bi bi-caret-right-fill");
    let [leftB,setLeftB] = useState('82');
    let [colors,setColor] = useState(true);
    let [indis,setIndis] = useState(0);
    const [selectedOption, setSelectedOption] = useState('Constant GUI');

    const [alert, setAlert] = useState(false);
    const [alertClose, setAlertClosed] = useState(false);
function goToTrack() {
    setGo(true)
}
function contentMenu(){
    if(styleB==="bi bi-caret-right-fill"){
        setconstantGUI(false)
        setLeftB('97.5')
        setstyleB("bi bi-caret-left-fill")
        setupdated(true)
    }
    else{
        setconstantGUI(true)
        setLeftB('82')
        setstyleB("bi bi-caret-right-fill")
        setupdated(true)
    }

}





    function MyComponent() {
        const map = useMap()
        if (go) {
            map.flyTo( state.centerTheMap,state.zoom)
            setGo(false)
        }

        return null
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
        setLayerMap("http://mt0.google.com/vt/lyrs=p&hl=en&x={x}&y={y}&z={z}&s=Ga")
    }
    function listMarkerEvent(item){
        setpopup(true)
        settype(item.type)
        setid(item.id)
        setvelocity(item.velocity)
        setdevice(item.device)
        setIndis(item.id)
        setColor(false)
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
        replayMarkers=[]
        setreplayMarkers(replayMarkers);
        stompClient.send("/ws/db",{},query);
    }
    function showMessage(dto,id){
        function getIndex(id) {
            return markers.findIndex(obj => obj.id === id);
        }
        let index = getIndex(id);

        latitude=dto.lat
        let stat = dto.status;
        longitude =dto.lng;
        statusV = require("./assets/" +dto.type + "-" + dto.status +".png")

        markers.at(index).lat = latitude;
        markers.at(index).lng = longitude;
        let temp = markers.at(index).positions
        temp.push([latitude,longitude])
        temp.shift();
        markers.at(index).positions = temp
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

    }


    function showMessageReplay(dto,id){
        function getIndex(id) {
            return replayMarkers.findIndex(obj => obj.id === id);
        }
        let index = getIndex(id);

        latitude=dto.lat
        let stat = dto.status;
        longitude =dto.lng;
        statusV = require("./assets/" +dto.type + "-" + dto.status +".png")

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


            connection = new signalR.HubConnectionBuilder()
            .withUrl("https://localhost:7045/myhub")
            .withAutomaticReconnect()
            .build();

            connection.start();
            console.log('Connected!');
            connection.on("ReceiveMessage", (message) => {
                    let dto = JSON.parse(message.body)
                    let id=dto.id
                    let type=dto.type;
                    let vel = dto.velocity
                    let dev= dto.device;

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
                            color:'white',
                            positions: [[latitude,longitude],[latitude,longitude],[latitude,longitude]],
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
                    showMessage(dto, id);
            
                });
                stompClient.subscribe("/topic/xml", function (message) {
                    let dto = JSON.parse(message.body)
                    let id=dto.id;
                    let type=dto.type;
                    let vel = dto.velocity;
                    let dev= dto.device;
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
                            positions: [[latitude,longitude],[latitude,longitude],[latitude,longitude]],
                            device:dev,
                            color:'white',
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

                    showMessage(dto, id);

                });
                stompClient.subscribe("/topic/port", function (message) {
                    let dto = JSON.parse(message.body)
                    let id=dto.id;
                    let type=dto.type;
                    let vel = dto.velocity
                    let dev= dto.device;
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
                            positions: [[latitude,longitude],[latitude,longitude],[latitude,longitude]],
                            device:dev,
                            color:'white',
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
                    showMessage(dto, id);

                });
                stompClient.subscribe("/topic/connect-req", function (message) {

                    let dto = JSON.parse(message.body)
                    setdev(dto.deviceID)
                    let types = dto.dataType
                    let devId = dto.deviceID;
                    if(types==="Close"){
                        const index = connections.indexOf(devId);
                        setconnections(connections.filter((obj) => obj !== devId))

                        setAlertClosed(true);
                    }
                    else{
                        let found = connections.find(obj => {
                            return obj === devId;
                        });
                        if(typeof(found) === 'undefined'){
                            connections.push(devId)
                            setconnections(connections);

                            setAlert(true)
                        }
                    }


                });
                stompClient.subscribe("/topic/replay", function (message) {
                    setmarkers([])
                    markers=[]
                    replayMarkers=[]
                    setreplayMarkers(replayMarkers)

                });
                stompClient.subscribe("/topic/query", function (message) {
                    let dto = JSON.parse(message.body)
                    let id=dto.id;
                    let type=dto.type;
                    let vel = dto.velocity
                    let dev= dto.device;
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
                    showMessageReplay(dto, id);

                });
            

        


    }



    useEffect(() => {
        setTimeout(() => {
            setAlert(false);
        }, 5000);
    }, [alert]);
    useEffect(() => {
        setTimeout(() => {
            setAlertClosed(false);
        }, 1000);
    }, [alertClose]);

    useEffect(() => {
        const interval = setInterval(() => {
            setupdated(true);
        }, 600);return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if(selectedOption=="Constant GUI")
        setconstantGUI(true)
        else
            setconstantGUI(false)
        }, [selectedOption]);

    useEffect(() => {
        connect();
        return ()=> {};
    }, []);

    useEffect(() => {

        for (var i = 0; i < markers.length; i++) {
            if(markers.at(i).id===indis) markers.at(i).color = '#B02929';
            else markers.at(i).color = 'white';
        }
        setmarkers(markers)

        setColor(true)
        return ()=> {};
    }, [colors]);


    useEffect(() => {
        setZoom("1")
        setupdated(false);
        return ;
    }, [updated]);

    function closePop(){
        setpopup(false);
    }

    return (

        <div className="App">
            <Replay isReplay={isReplay} handleChange={handleChange} replay={replay}></Replay>

            <Alert alert={alert} dev={dev} message={"is connected to server"}></Alert>
            <Alert alert={alertClose} dev={dev} message={"is leaved from server"}></Alert>


            <TrackCount length={markers.length}></TrackCount>

            {
                markerList ?
                    <div id="myModal2" className="modal"
                         style={{display: 'inline-block', height: '150px', width: '300px', left: '84.5%', top: '55%'}}>
                        <div className="modal-content" style={{backgroundColor: '#C0C0C0'}}>
                            <a className="nav-link" href="#" onClick={closeMarkerList}>x</a>
                            <MarkerList markers={markers}></MarkerList>
                        </div>
                    </div>
                    : null
            }


            {connectList ? <div id="myModal2" className="modal"  style={{display:'inline-block',height:'150px',width:'200px',left: '89%',top: '1%'}}>
                <div className="modal-content" style={{backgroundColor: '#C0C0C0'}}>
                    <a className="nav-link" href="#" onClick={closeList}>x</a>
                    <ConnectionList connections={connections}></ConnectionList>
                </div>
            </div> : null}


            { popup?
                <div id="myModal" className="modal"  style={{display:'inline-block',width:'210px', left: '89%',top: '25%',height:'250px' } }>

                    <div className="modal-content" style={{backgroundColor: '#C0C0C0'}}>
                        <a className="nav-link" href="#" onClick={closePop}>x</a>
                        <TrackDetail id={id} type={type} velocity={velocity} device={device} goToTrack={goToTrack} closePop={closePop}  width={'100'}> </TrackDetail>
                    </div>
                </div>
                :


                null}




            <MapContainer className="map" center={[state.centerTheMap.lat,state.centerTheMap.lng]} zoom='10' renderer={L.canvas()} preferCanvas={true} zoomControl={false} attributionControl={false}  >

                <TileLayer preferCanvas={true} renderer={L.canvas()}
                    url={layer}
                />

                { isReplay===false ?

                    markers.map(item =><FeatureGroup>

                        <Marker key={item.id}  eventHandlers={{
                            click: (e) => {
                                setpopup(true)
                                settype(item.type)

                                setIndis(item.id)
                                setColor(false)
                                setid(item.id)
                                setvelocity(item.velocity)
                                setdevice(item.device)
                                let stateCurrent = {
                                    centerTheMap: {
                                        lat: item.lat,
                                        lng: item.lng,
                                    },

                                    zoom: 10
                                };

                                setState(stateCurrent)
                            },
                        }}  position={[item.lat,item.lng]} icon={item.status}>
                                <Tooltip   direction="right" opacity={1}   permanent><p style={{color: item.color,position: "fixed", fontSize: '18px'}}> {item.id}</p></Tooltip>
                        </Marker>

                    </FeatureGroup>) : null

                }


                <MyComponent />



                { isReplay ?
                    replayMarkers.map(item =>
                        <Marker key={item.id}  eventHandlers={{
                            click: (e) => {
                                setpopup(true)
                                setIndis(item.id)
                                setColor(false)
                                settype(item.type)
                                setid(item.id)
                                setvelocity(item.velocity)
                                setdevice(item.device)

                                let stateCurrent = {
                                    centerTheMap: {
                                        lat: item.lat,
                                        lng: item.lng,
                                    },
                                    zoom: 10
                                };
                                setState(stateCurrent)
                            },
                        }}  position={[item.lat,item.lng]} icon={item.status}>
                            <Tooltip   direction="right" opacity={1}   permanent><p style={{color: item.color,position: "fixed", fontSize: '18px'}}> {item.id}</p></Tooltip>
                        </Marker>) : null
                }

            </MapContainer>


            <div id="myModal2" className="modal"  style={{display:'inline-block',height:'50px',width:'50px',position: "fixed",left: `${leftB}%`,top: '50%'}}>
                <a className="nav-link" href="#"><i className={styleB} style={{color: '#B02929',position: "fixed",left: `${leftB}%`,top: '50%', fontSize: '60px'}} onClick={contentMenu}></i> </a>
            </div>

            {constantGUI?
            <div id="myModal2" className="modal"  style={{display:'inline-block',width:'300px',left: '84.5%',top: '0%',height:'%100'}}>
                <div className="modal-content" style={{backgroundColor: '#091B32',display:'inline-block',width:'300px',left: '0%',top: '0%',height:'100%'}}>


                    <p style={{color:'white'}}>Track Info </p>




                    <div id="myModal2" className="modal"  style={{display:'inline-block',left: '84.5%',position: 'fixed',top: '5%',height:'300px',width:'300px'}}>
                        <MarkerList markers={markers}></MarkerList>
                    </div>




                    <p style={{color:'white',display:'inline-block',position: 'fixed',left: '84.5%',top: '35%',height:'%20',width:'300px'}}>Track Detail </p>


                    <div style={{display:'inline-block',position: 'fixed',left: '84.5%',top: '40%',height:'%20',width:'300px'}}>
                        <TrackDetail id={id} type={type} velocity={velocity} device={device} goToTrack={goToTrack} closePop={closePop} width={'150'}> </TrackDetail>
                    </div>




                    <p style={{color:'white',position: 'fixed',left: '89.5%',top: '70%'}}>Connected Units </p>

                    <div id="myModal2" className="modal"  style={{display:'inline-block',left: '84.5%',position: 'fixed',top: '75%',height:'200px',width:'300px'}}>
                        <ConnectionList connections={connections}></ConnectionList>
                    </div>


                </div>
            </div>:null}






            { menu ? <div id="myModal3" className="modal"  style={ {display:'inline-block',width:'1000%',top: '92%'}}>

                            <nav className="navbar navbar-expand-lg navbar-light bg-light" style={ {display:'inline-block',width:'100%',top: '92%'}}>
                                <div className="btn-group dropup"  style={{display:'block',border: 'outset',position: 'fixed',left: '0%',top: '93%'}} >
                                    <DropDownMenu menu={showListNames} menuType={"Show Info"} > </DropDownMenu>
                                </div>

                                <div className="btn-group dropup"   style={{display:'block',border: 'outset',position: 'fixed',left: '6%',top: '93%'}} data-target="#navbarNavDropdown">
                                    <DropDownMenu menu={mapList} menuType={"Map Type"} > </DropDownMenu>
                                </div>

                                    {
                                        isReplay ?

                                            <a class="nav-link" href="#"  style={{color: 'white',border: 'outset',background:'#6C757D',display:'block',position: 'fixed',left: '18%',top: '93.5%'} } onClick={playMode}>Play Mode</a>
                                      : null
                                    }

                                    <a class="nav-link" href="#"  style={{color: 'white',border: 'outset',background:'#6C757D',display:'block',position: 'fixed',left: '12.5%',top: '93%',height:"42px"} } onClick={replayMode}><center>Replay Mode</center></a>
                            </nav></div> : null
                        }
        </div>

    );
}
export default App;


