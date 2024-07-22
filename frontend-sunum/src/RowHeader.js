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
import MarkerClusterGroup from 'react-leaflet-markercluster';
import {MapContainer, Marker, Popup, TileLayer, Tooltip,Polyline} from "react-leaflet";
import B from "./b";
import {Button} from "bootstrap/js/index.esm";
import * as signalR from '@microsoft/signalr';

var stompClient = "";
var socket = "";
let y=9;
let connection;

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



function App() {
    let [connectList,setconnectList] = useState(false);
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
    }// "http://mt0.google.com/vt/lyrs=p&hl=en&x={x}&y={y}&z={z}&s=Ga"
    function listMarkerEvent(item){
        setpopup(true)
        settype(item.type)
        setid(item.id)
        setvelocity(item.velocity)
        setdevice(item.device)
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
    function showMessage(dto,id){
        //if(type===1) $("#messages").append("<tr class=table-primary><td>" + message + "</td></tr>");
        //else $("#messages").append("<tr class=table-secondary><td>" + message + "</td></tr>");
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

    }


    function showMessageReplay(dto,id){
        function getIndex(id) {
            return replayMarkers.findIndex(obj => obj.id === id);
        }
        let index = getIndex(id);

        latitude=dto.lat
        ////console.log("->>>>>>>>>"  + message.body)
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

    async function connect() {
        // Create a connection
        connection = new signalR.HubConnectionBuilder()
            .withUrl("https://localhost:7045/myhub")
            .withAutomaticReconnect()
            .build();
    
        try {
            // Start the connection
            connection.start();
            console.log('Connected!');
    
            // Subscribe to the ReceiveMessage event
            connection.on("ReceiveMessage", (message) => {
                console.log(message);    
                let dto = JSON.parse(message);
                let id = dto.id;
                let type = dto.type;
                let vel = dto.velocity;
                let dev = dto.device;
    
                let found = markers.find(obj => obj.id === id);
              
    
                if (typeof (found) === 'undefined') {
                       
                    var initialvalues = {
                        id: id,
                        lat: dto.Latitude,
                        lng: dto.Longitude,
                        type: type,
                        device: dev,
                        velocity: vel,
                        color: 'white',
                        positions: [[dto.Latitude, dto.Longitude], [dto.Latitude, dto.Longitude], [dto.Latitude, dto.Longitude]],
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
    
        } catch (e) {
            console.error('Connection failed: ', e);
        }
    }



    useEffect(() => {
        // when the component is mounted, the alert is displayed for 3 seconds
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
        }, 400);return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if(selectedOption=="Constant GUI")
            setconstantGUI(true)
        else
            setconstantGUI(false)
        // when the component is mounted, the alert is displayed for 3 seconds
    }, [selectedOption]);

    useEffect(() => {
        connect();
        return ()=> {};
    }, []);


    useEffect(() => {

        //markers.map(item => console.log(item));
        setZoom("1")
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
                <div id="myModal4" className="modal"  style={{display:'inline-block',width:'200px',height:'30px', left: '750px',top: '10px' } }>
                    <div className="modal-content" style={{backgroundColor: '#091B32',color:'white'}}>
                        {dev} is connected to server

                    </div>
                </div> : null
            }
            {alertClose ?
                <div id="myModal5" className="modal"  style={{display:'inline-block',width:'200px',height:'30px', left: '750px',top: '10px' } }>
                    <div className="modal-content" style={{backgroundColor: '#091B32',color:'white'}}>
                        {dev} is leaved from server

                    </div>
                </div> : null
            }
            <div id="myModal2" className="modal"  style={{display:'inline-block',width:'200px',  left: '1%',top: '1%',height:'50px'}}>
                <div className="modal-content" style={{backgroundColor: '#091B32'}}>

                    <p style={{color:'white'}}>Track Count : {markers.length}</p>
                </div>
            </div>













            {markerList? <div id="myModal2" className="modal"  style={{display:'inline-block',height:'150px',width:'300px',left: '85%',top: '550px'}}>
                <div className="modal-content" style={{backgroundColor: '#C0C0C0'}}>
                    <a className="nav-link" href="#" onClick={closeMarkerList}>x</a>
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



            { popup? <div id="myModal" className="modal"  style={{display:'inline-block',width:'200px', left: '89%',top: '25%',height:'250px' } }>
                <div className="modal-content" style={{backgroundColor: '#C0C0C0'}}>
                    <a className="nav-link" href="#" onClick={closePop}>x</a>
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




            <MapContainer className="map" center={[state.centerTheMap.lat,state.centerTheMap.lng]} zoom='10' renderer={L.canvas()} preferCanvas={true} zoomControl={false} attributionControl={false}  >

                <TileLayer preferCanvas={true} renderer={L.canvas()}
                           url={layer}
                />
                <Polyline pathOptions={limeOptions} positions={polyline} />
                { isReplay===false ?
                    markers.map(item =>

                        <Marker preferCanvas={true} renderer={L.canvas()} key={item.id}  eventHandlers={{
                            click: (e) => {
                                //console.log('id : ', item.type)
                                setpopup(true)
                                settype(item.type)
                                setid(item.id)
                                setvelocity(item.velocity)
                                setdevice(item.device)
                                state.centerTheMap.lng = item.lng
                                state.centerTheMap.lat = item.lat
                                setState(state)

                            },
                        }}  position={[item.lat,item.lng]} icon={item.status}>
                            <Tooltip preferCanvas={true} renderer={L.canvas()} offset={[0, 0]} opacity={1} permanent>{item.id}</Tooltip>

                        </Marker>) : null
                }


                <MyComponent />



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
                            <Tooltip style={{backgroundColor: "transparent"}} direction="right" offset={[0, 0]} opacity={1}   permanent>{item.id}</Tooltip>
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
                            <ul className="list-group" >
                                {
                                    <table className="table table-striped" >
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
                                                    <a className="nav-link" onClick={event => listMarkerEvent(item)} href="#"><th scope="row">{item.id}</th> </a>
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




                        <p style={{color:'white',display:'inline-block',position: 'fixed',left: '84.5%',top: '35%',height:'%20',width:'300px'}}>Track Detail </p>



                        <table className="table table-striped" style={{display:'inline-block',position: 'fixed',left: '84.5%',top: '40%',height:'%20',width:'300px'}}>
                            <tbody >
                            <tr>
                                <th scope="row" style={{display:'inline-block',width:'150px'}}>ID</th>
                                <td style={{width:'150px'}}>{id}</td>
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
                                <button onClick={goToTrack} style={{display:'inline-block',width:'150px'}}>
                                    Go to Track
                                </button>
                            </tr>
                            </tbody>
                        </table>

                        <p style={{color:'white',position: 'fixed',left: '89.5%',top: '70%'}}>Connected Units </p>

                        <div id="myModal2" className="modal"  style={{display:'inline-block',left: '84.5%',position: 'fixed',top: '75%',height:'200px',width:'300px'}}>
                            <ul className="list-group">
                                {
                                    connections.map(item => <li className="list-group-item">{item}</li>)
                                }
                            </ul>
                        </div>



                    </div>
                </div>:null}






            { menu ? <div id="myModal3" className="modal"  style={ {display:'inline-block',width:'1000%',top: '92%'}}>

                <nav className="navbar navbar-expand-lg navbar-light bg-light" style={ {display:'inline-block',width:'100%',top: '92%'}}>


                    <div className="btn-group dropup"  style={{display:'block',border: 'outset',position: 'fixed',left: '0%',top: '93%'}} >
                        <button type="button" className="btn btn-secondary dropdown-toggle" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                            Show Info
                        </button>
                        <div className="dropdown-menu">
                            <li><a class="nav-link" href="#" onClick={showList}>Show Unit List</a></li>
                            <li><a class="nav-link" href="#" onClick={showMarkerList}>Show Track List</a></li>

                        </div>
                    </div>

                    <div className="btn-group dropup"   style={{display:'block',border: 'outset',position: 'fixed',left: '6%',top: '93%'}} data-target="#navbarNavDropdown">
                        <button type="button" className="btn btn-secondary dropdown-toggle" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                            Map Type
                        </button>
                        <div className="dropdown-menu">
                            <li><a class="nav-link" href="#" onClick={openStreet}>Open Street</a></li>
                            <li><a class="nav-link" href="#"  onClick={openSatellite}>Open Street Satellite</a></li>
                            <li><a class="nav-link" href="#" onClick={openGoogleHybrid}>Google hybrid</a></li>
                            <li><a class="nav-link" href="#" onClick={openGoogleSatellite}>Google Satellite </a></li>
                            <li><a class="nav-link" href="#" onClick={openGoogleStreet}>Google Street </a></li>
                        </div>
                    </div>

                    {
                        isReplay ?

                            <a class="nav-link" href="#"  style={{color: 'white',border: 'outset',background:'#6C757D',display:'block',position: 'fixed',left: '18%',top: '93.5%'} } onClick={playMode}>Play Mode</a>
                            : null
                    }

                    <a class="nav-link" href="#"  style={{color: 'white',border: 'outset',background:'#6C757D',display:'block',position: 'fixed',left: '12.5%',top: '93.5%'} } onClick={replayMode}>Replay Mode</a>





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


 // function connect(){
        
    //         socket = new SockJS("https://localhost:7045/myhub")
    //         stompClient = Stomp.over(socket);
    //         stompClient.connect({}, function (frame) {
    //             stompClient.subscribe("ReceiveMessage", function (message) {
    //                 let dto = JSON.parse(message.body)
    //                 let id=dto.id
    //                 let type=dto.type;
    //                 let vel = dto.velocity
    //                 let dev= dto.device;

    //                 let found = markers.find(obj => {
    //                     return obj.id === id;
    //                 });
    //                 if(typeof(found) === 'undefined'){
    //                     var initialvalues = {
    //                         id: id,
    //                         lat: latitude,
    //                         lng: longitude,
    //                         type:type,
    //                         device:dev,
    //                         velocity:vel,
    //                         color:'white',
    //                         positions: [[latitude,longitude],[latitude,longitude],[latitude,longitude]],
    //                         status: L.icon({
    //                             iconUrl: statusV,
    //                             shadowUrl: leafShadow,
    //                             iconSize: [38, 45], // size of the icon
    //                             shadowSize: [0, 0], // size of the shadow
    //                             iconAnchor: [22, 44], // point of the icon which will correspond to marker's location
    //                             shadowAnchor: [0, 0],  // the same for the shadow
    //                             popupAnchor: [-3, -86]
    //                         })
    //                     };
    //                     markers.push(initialvalues);
    //                     setmarkers([...markers, initialvalues]);

    //                 }
    //                 showMessage(dto, id);

    //             });
                
    //         });

        


    // }


