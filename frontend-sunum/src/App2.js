import React, { useEffect, useState } from 'react';
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import 'react-leaflet-markercluster/dist/styles.min.css';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.js';
import Popper from 'popper.js';
import $ from 'jquery';
import RowHeader from "./RowHeader";
import TrackCount from "./components/TrackCount";
import MarkerList from "./components/MarkerList";
import DropDownMenu from "./components/DropDownMenu";
import ConnectionList from "./components/ConnectionList";
import Alert from "./components/Alert";
import TrackDetail from "./components/TrackDetail";
import Replay from "./components/Replay";
import leafShadow from "./assets/leaf-shadow.png";
import friend from "./assets/FIXED WING-FRIEND.png";

import './App.css';

var stompClient = "";
var socket = "";
let y = 9;

let latitude = 39.772790;
let longitude = 35.772790;
let statusV = friend;
const polyline = [
    [51.505, -0.09],
    [51.51, -0.1],
    [51.51, -0.12],
];
const limeOptions = { color: 'lime' };

let stateCurrent = {
    centerTheMap: {
        lat: 39.742790,
        lng: 32.962790,
    },
    zoom: 10,
};

const MyContext = React.createContext();

function App() {
    let [connectList, setconnectList] = useState(false);
    let [layer, setLayerMap] = useState("http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}");
    let [query, setQuery] = useState("");
    let [markers, setmarkers] = useState([]);
    let [replayMarkers, setreplayMarkers] = useState([]);
    let [connections, setconnections] = useState([]);
    let [updated, setupdated] = useState(false);
    let [id, setid] = useState("");
    let [popup, setpopup] = useState(false);

    let mapList = [
        <li><a className="nav-link" href="#" onClick={openStreet}>Open Street</a></li>,
        <li><a className="nav-link" href="#" onClick={openSatellite}>Open Street Satellite</a></li>,
        <li><a className="nav-link" href="#" onClick={openGoogleHybrid}>Google hybrid</a></li>,
        <li><a className="nav-link" href="#" onClick={openGoogleSatellite}>Google Satellite </a></li>,
        <li><a className="nav-link" href="#" onClick={openGoogleStreet}>Google Street </a></li>
    ];

    let showListNames = [
        <li><a className="nav-link" href="#" onClick={showList}>Show Unit List</a></li>,
        <li><a className="nav-link" href="#" onClick={showMarkerList}>Show Track List</a></li>
    ];

    let [menu, setmenu] = useState(true);
    let [type, settype] = useState("");
    let [velocity, setvelocity] = useState("");
    let [device, setdevice] = useState("");
    let [dev, setdev] = useState("");
    let [optionMenu, setoptionMenu] = useState(false);
    let [markerList, setmarkerList] = useState(false);
    let [isReplay, setIsReplay] = useState(false);
    let [constantGUI, setconstantGUI] = useState(true);
    let [popGUI, setpopGUI] = useState(false);
    let [go, setGo] = useState(false);
    let [state, setState] = useState(stateCurrent);
    let [zoom, setZoom] = useState(30);
    let [styleB, setstyleB] = useState("bi bi-caret-right-fill");
    let [leftB, setLeftB] = useState('82');
    let [colors, setColor] = useState(true);
    let [indis, setIndis] = useState(0);
    const [selectedOption, setSelectedOption] = useState('Constant GUI');
    const [alert, setAlert] = useState(false);
    const [alertClose, setAlertClosed] = useState(false);

    function goToTrack() {
        setGo(true);
    }

    function contentMenu() {
        if (styleB === "bi bi-caret-right-fill") {
            setconstantGUI(false);
            setLeftB('97.5');
            setstyleB("bi bi-caret-left-fill");
            setupdated(true);
        } else {
            setconstantGUI(true);
            setLeftB('82');
            setstyleB("bi bi-caret-right-fill");
            setupdated(true);
        }
    }

    function MyComponent() {
        const map = useMap();
        if (go) {
            map.flyTo(state.centerTheMap, state.zoom);
            setGo(false);
        }
        return null;
    }

    function openStreet() {
        setLayerMap("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png");
    }

    function openSatellite() {
        setLayerMap("http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}");
    }

    function openGoogleHybrid() {
        setLayerMap("http://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}&s=Ga");
    }

    function openGoogleSatellite() {
        setLayerMap("http://mt0.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}&s=Ga");
    }

    function openGoogleStreet() {
        setLayerMap("http://mt0.google.com/vt/lyrs=p&hl=en&x={x}&y={y}&z={z}&s=Ga");
    }

    function listMarkerEvent(item) {
        setpopup(true);
        settype(item.type);
        setid(item.id);
        setvelocity(item.velocity);
        setdevice(item.device);
        setIndis(item.id);
        setColor(false);
    }

    function showList() {
        setconnectList(true);
    }

    function closeList() {
        setconnectList(false);
    }

    function showMarkerList() {
        setmarkerList(true);
    }

    function closeMarkerList() {
        setmarkerList(false);
    }

    function replayMode() {
        replayMarkers = [];
        setreplayMarkers(replayMarkers);
        setIsReplay(true);
        stompClient.send("/ws/csv", {}, "replay");
        replayMarkers = [];
        setreplayMarkers(replayMarkers);
    }

    function playMode() {
        markers = [];
        setmarkers(markers);
        setIsReplay(false);
        stompClient.send("/ws/csv", {}, "play");
    }

    const handleChange = (event) => {
        setQuery(event.target.value);
    };

    function replay() {
        replayMarkers = [];
        setreplayMarkers(replayMarkers);
        stompClient.send("/ws/db", {}, query);
    }

    function showMessage(dto, id) {
        function getIndex(id) {
            return markers.findIndex(obj => obj.id === id);
        }
        let index = getIndex(id);
        latitude = dto.lat;
        let stat = dto.status;
        longitude = dto.lng;
        statusV = require("./assets/" + dto.type + "-" + dto.status + ".png");
        markers.at(index).lat = latitude;
        markers.at(index).lng = longitude;
        let temp = markers.at(index).positions;
        temp.push([latitude, longitude]);
        temp.shift();
        markers.at(index).positions = temp;
        markers.at(index).status = L.icon({
            iconUrl: statusV,
            shadowUrl: leafShadow,
            iconSize: [38, 45],
            shadowSize: [0, 0],
            iconAnchor: [22, 44],
            shadowAnchor: [0, 0],
            popupAnchor: [-3, -86]
        });
        setmarkers(markers);
    }

    function showMessageReplay(dto, id) {
        function getIndex(id) {
            return replayMarkers.findIndex(obj => obj.id === id);
        }
        let index = getIndex(id);
        latitude = dto.lat;
        let stat = dto.status;
        longitude = dto.lng;
        statusV = require("./assets/" + dto.type + "-" + dto.status + ".png");
        replayMarkers.at(index).lat = latitude;
        replayMarkers.at(index).lng = longitude;
        replayMarkers.at(index).status = L.icon({
            iconUrl: statusV,
            shadowUrl: leafShadow,
            iconSize: [38, 45],
            shadowSize: [0, 0],
            iconAnchor: [22, 44],
            shadowAnchor: [0, 0],
            popupAnchor: [-3, -86]
        });
        setreplayMarkers(replayMarkers);
    }

    function createMessage(dto) {
        latitude = dto.lat;
        let stat = dto.status;
        longitude = dto.lng;
        statusV = require("./assets/" + dto.type + "-" + dto.status + ".png");
        let marker = {
            id: dto.id,
            lat: latitude,
            lng: longitude,
            status: L.icon({
                iconUrl: statusV,
                shadowUrl: leafShadow,
                iconSize: [38, 45],
                shadowSize: [0, 0],
                iconAnchor: [22, 44],
                shadowAnchor: [0, 0],
                popupAnchor: [-3, -86]
            }),
            positions: [[latitude, longitude]]
        };
        markers.push(marker);
        setmarkers(markers);
    }

    function createMessageReplay(dto) {
        latitude = dto.lat;
        let stat = dto.status;
        longitude = dto.lng;
        statusV = require("./assets/" + dto.type + "-" + dto.status + ".png");
        let marker = {
            id: dto.id,
            lat: latitude,
            lng: longitude,
            status: L.icon({
                iconUrl: statusV,
                shadowUrl: leafShadow,
                iconSize: [38, 45],
                shadowSize: [0, 0],
                iconAnchor: [22, 44],
                shadowAnchor: [0, 0],
                popupAnchor: [-3, -86]
            })
        };
        replayMarkers.push(marker);
        setreplayMarkers(replayMarkers);
    }

    function onChange(event) {
        const selectedOption = event.target.value;
        setSelectedOption(selectedOption);
        if (selectedOption == "Constant GUI") {
            setconstantGUI(true);
            setpopGUI(false);
        } else {
            setconstantGUI(false);
            setpopGUI(true);
        }
    }

    function changeUnit(airUnit) {
        stompClient.send("/ws/message", {}, airUnit);
        setconnectList(false);
    }

    function createAlert() {
        setAlert(true);
    }

    function closeAlert() {
        setAlertClosed(true);
    }

    useEffect(() => {
        const fetchMarkers = () => {
            fetch('http://localhost:8090/api/markers')
                .then(response => response.json())
                .then(data => setmarkers(data))
                .catch(error => console.error('Error fetching markers:', error));
        };

        fetchMarkers();
        const timer = setInterval(fetchMarkers, 10000);

        return () => clearInterval(timer);
    }, []);

    function connect() {
        socket = new SockJS('http://localhost:8090/gs-guide-websocket');
        stompClient = Stomp.over(socket);
        stompClient.connect({}, function (frame) {
            stompClient.subscribe('/topic/messages', function (messageOutput) {
                let dto = JSON.parse(messageOutput.body);
                let ids = [];
                if (isReplay) {
                    replayMarkers.forEach(marker => {
                        ids.push(marker.id);
                    });
                    if (ids.includes(dto.id)) {
                        showMessageReplay(dto, dto.id);
                    } else {
                        createMessageReplay(dto);
                    }
                } else {
                    markers.forEach(marker => {
                        ids.push(marker.id);
                    });
                    if (ids.includes(dto.id)) {
                        showMessage(dto, dto.id);
                    } else {
                        createMessage(dto);
                    }
                }
            });
        });
    }

    return (
        <MyContext.Provider value={zoom}>
            <div className="app">
                <div className="header">
                    <RowHeader connect={connect}
                               replay={replay}
                               handleChange={handleChange}
                               replayMode={replayMode}
                               playMode={playMode}
                               showList={showList}
                               closeList={closeList}
                               showMarkerList={showMarkerList}
                               closeMarkerList={closeMarkerList}
                               createAlert={createAlert}
                               closeAlert={closeAlert}
                               showMessage={showMessage}
                               showMessageReplay={showMessageReplay}
                               createMessage={createMessage}
                               createMessageReplay={createMessageReplay}
                               changeUnit={changeUnit}
                               onChange={onChange}
                               selectedOption={selectedOption}
                               contentMenu={contentMenu}
                               goToTrack={goToTrack}
                               styleB={styleB}
                               leftB={leftB}
                               mapList={mapList}
                               showListNames={showListNames}
                               indis={indis}
                               colors={colors}/>
                </div>
                <div className="content">
                    {connectList && <ConnectionList connections={connections}/>}
                    {markerList && <MarkerList markers={markers} listMarkerEvent={listMarkerEvent}/>}
                    {constantGUI && <TrackCount markers={markers} indis={indis}/>}
                    {popGUI && <TrackDetail markers={markers}/>}
                    {alert && !alertClose && <Alert />}
                    {isReplay && <Replay markers={replayMarkers}/>}
                    <div className="leaflet-container">
                        <MapContainer center={state.centerTheMap} zoom={state.zoom} style={{ height: '100vh', width: '100%' }}>
                            <TileLayer url={layer} />
                            {markers.map(marker => (
                                <MarkerWithDynamicSize key={marker.id} position={[marker.lat, marker.lng]} status={marker.status} />
                            ))}
                            <MyComponent/>
                        </MapContainer>
                    </div>
                </div>
            </div>
        </MyContext.Provider>
    );
}

function MarkerWithDynamicSize({ position, status }) {
    const map = useMap();
    const [iconSize, setIconSize] = useState([38, 45]);

    useEffect(() => {
        const updateIconSize = () => {
            const zoomLevel = map.getZoom();
            const newSize = [38 * (zoomLevel / 10), 45 * (zoomLevel / 10)];
            setIconSize(newSize);
        };

        map.on('zoomend', updateIconSize);

        return () => {
            map.off('zoomend', updateIconSize);
        };
    }, [map]);

    const customIcon = L.icon({
        iconUrl: status.options.iconUrl,
        shadowUrl: status.options.shadowUrl,
        iconSize,
        shadowSize: status.options.shadowSize,
        iconAnchor: [iconSize[0] / 2, iconSize[1]],
        shadowAnchor: status.options.shadowAnchor,
        popupAnchor: status.options.popupAnchor
    });

    return <Marker position={position} icon={customIcon} />;
}

export default App;
