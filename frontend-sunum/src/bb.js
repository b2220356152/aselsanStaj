import React, { useEffect, useState, useRef } from 'react';
import {
  MapContainer,
  Marker,
  TileLayer,
  Tooltip,
  FeatureGroup,
} from 'react-leaflet';
import L from 'leaflet';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import 'bootstrap/dist/css/bootstrap.css';
import 'leaflet/dist/leaflet.css';
import 'react-leaflet-markercluster/dist/styles.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import leafShadow from './assets/leaf-shadow.png';
import friend from './assets/FIXED WING-FRIEND.png';
import Replay from './components/Replay';
import TrackCount from './components/TrackCount';
import MarkerList from './components/MarkerList';
import DropDownMenu from './components/DropDownMenu';
import ConnectionList from './components/ConnectionList';
import Alert from './components/Alert';
import TrackDetail from './components/TrackDetail';

const MyContext = React.createContext();

const App = () => {
  const [connectList, setConnectList] = useState(false);
  const [layer, setLayerMap] = useState(
    'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
  );
  const [query, setQuery] = useState('');
  const [markers, setMarkers] = useState([]);
  const [replayMarkers, setReplayMarkers] = useState([]);
  const [connections, setConnections] = useState([]);
  const [updated, setUpdated] = useState(false);
  const [popup, setPopup] = useState(false);
  const [state, setState] = useState({
    centerTheMap: {
      lat: 39.74279,
      lng: 32.96279,
    },
    zoom: 10,
  });
  const [alert, setAlert] = useState(false);
  const [alertClose, setAlertClosed] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Constant GUI');
  const [constantGUI, setConstantGUI] = useState(true);
  const [leftB, setLeftB] = useState('82');
  const [styleB, setStyleB] = useState('bi bi-caret-right-fill');
  const [colors, setColor] = useState(true);
  const [indis, setIndis] = useState(0);
  const [type, setType] = useState('');
  const [velocity, setVelocity] = useState('');
  const [device, setDevice] = useState('');
  const [id, setId] = useState('');
  const [isReplay, setIsReplay] = useState(false);
  const [markerList, setMarkerList] = useState(false);
  const [replay, setReplay] = useState(false); // replay state'i ekledim

  let stompClient = '';
  let socket = '';

  const connect = () => {
    if (stompClient.connected && socket) {
    } else {
      socket = new SockJS('http://localhost:10100/our-websocket');
      stompClient = Stomp.over(socket);
      stompClient.connect({}, (frame) => {
        stompClient.subscribe('/topic/csv', (message) => {
          const dto = JSON.parse(message.body);
          const { id, type, velocity, device } = dto;
          const found = markers.find((obj) => obj.id === id);

          if (typeof found === 'undefined') {
            const initialvalues = {
              id,
              lat: 39.77279,
              lng: 35.77279,
              type,
              device,
              velocity,
              color: 'white',
              positions: [
                [39.77279, 35.77279],
                [39.77279, 35.77279],
                [39.77279, 35.77279],
              ],
              status: L.icon({
                iconUrl: require(`./assets/${type}-${dto.status}.png`),
                shadowUrl: leafShadow,
                iconSize: [38, 45],
                shadowSize: [0, 0],
                iconAnchor: [22, 44],
                shadowAnchor: [0, 0],
                popupAnchor: [-3, -86],
              }),
            };
            setMarkers((prev) => [...prev, initialvalues]);
          }
          showMessage(dto, id);
        });

        stompClient.subscribe('/topic/connect-req', (message) => {
          const dto = JSON.parse(message.body);
          const devId = dto.deviceID;
          const types = dto.dataType;

          if (types === 'Close') {
            setConnections((prev) => prev.filter((obj) => obj !== devId));
            setAlertClosed(true);
          } else {
            const found = connections.find((obj) => obj === devId);
            if (typeof found === 'undefined') {
              setConnections((prev) => [...prev, devId]);
              setAlert(true);
            }
          }
        });
      });
    }
  };

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
      setUpdated(true);
    }, 600);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setConstantGUI(selectedOption === 'Constant GUI');
  }, [selectedOption]);

  useEffect(() => {
    connect();
    return () => {};
  }, []);

  useEffect(() => {
    markers.forEach((marker, i) => {
      marker.color = marker.id === indis ? '#B02929' : 'white';
    });
    setMarkers([...markers]);
    setColor(true);
  }, [colors]);

  useEffect(() => {
    setUpdated(false);
  }, [updated]);

  const handleChange = (event) => {
    setReplay(event.target.checked);
  };

  const contentMenu = () => {
    if (styleB === 'bi bi-caret-right-fill') {
      setConstantGUI(false);
      setLeftB('97.5');
      setStyleB('bi bi-caret-left-fill');
      setUpdated(true);
    } else {
      setConstantGUI(true);
      setLeftB('82');
      setStyleB('bi bi-caret-right-fill');
      setUpdated(true);
    }
  };

  const goToTrack = () => {
    setState((prev) => ({
      ...prev,
      centerTheMap: {
        lat: 39.77279,
        lng: 35.77279,
      },
      zoom: 30,
    }));
  };

  const showMessage = (dto, id) => {
    const index = markers.findIndex((obj) => obj.id === id);
    const newMarkers = [...markers];
    newMarkers[index].lat = dto.lat;
    newMarkers[index].lng = dto.lng;
    newMarkers[index].status = L.icon({
      iconUrl: require(`./assets/${dto.type}-${dto.status}.png`),
      shadowUrl: leafShadow,
      iconSize: [38, 45],
      shadowSize: [0, 0],
      iconAnchor: [22, 44],
      shadowAnchor: [0, 0],
      popupAnchor: [-3, -86],
    });
    newMarkers[index].positions.push([dto.lat, dto.lng]);
    newMarkers[index].positions.shift();
    setMarkers(newMarkers);
  };

  const listMarkerEvent = (item) => {
    setPopup(true);
    setType(item.type);
    setId(item.id);
    setVelocity(item.velocity);
    setDevice(item.device);
    setIndis(item.id);
    setColor(false);
  };

  const closePop = () => {
    setPopup(false);
  };

  return (
    <div className="App">
      <Replay isReplay={isReplay} handleChange={handleChange} replay={replay} />
      <Alert alert={alert} dev={device} message="is connected to server" />
      <Alert alert={alertClose} dev={device} message="is leaved from server" />
      <TrackCount length={markers.length} />

      {markerList && (
        <div className="modal" style={{ display: 'inline-block', height: '150px', width: '300px', left: '84.5%', top: '55%' }}>
          <div className="modal-content" style={{ backgroundColor: '#C0C0C0' }}>
            <a className="nav-link" href="#" onClick={() => setMarkerList(false)}>x</a>
            <MarkerList markers={markers} />
          </div>
        </div>
      )}

      {connectList && (
        <div className="modal" style={{ display: 'inline-block', height: '150px', width: '300px', left: '84.5%', top: '55%' }}>
          <div className="modal-content" style={{ backgroundColor: '#C0C0C0' }}>
            <a className="nav-link" href="#" onClick={() => setConnectList(false)}>x</a>
            <ConnectionList connections={connections} />
          </div>
        </div>
      )}

      <TrackDetail popup={popup} closePop={closePop} type={type} id={id} velocity={velocity} device={device} />

      <div className="row">
        <div className="col-11">
          <MapContainer center={state.centerTheMap} zoom={state.zoom} style={{ height: '100vh', zIndex: 0 }}>
            <TileLayer url={layer} />
            <FeatureGroup>
              {markers.map((item, index) => (
                <Marker
                  key={index}
                  position={[item.lat, item.lng]}
                  icon={item.status}
                  eventHandlers={{ click: () => listMarkerEvent(item) }}
                >
                  <Tooltip>
                    <div style={{ fontSize: '10px' }}>
                      id: {item.id}
                      <br />
                      type: {item.type}
                      <br />
                      speed: {item.velocity}
                      <br />
                      device: {item.device}
                    </div>
                  </Tooltip>
                </Marker>
              ))}
            </FeatureGroup>
          </MapContainer>
        </div>
        <div className="col-1 d-flex flex-column justify-content-between align-items-end" style={{ marginLeft: `${leftB}%`, backgroundColor: '#4D4D4D', height: '80%', padding: '5px', paddingBottom: '0px', paddingLeft: '3px', paddingRight: '0px', position: 'fixed', top: '15%' }}>
          <DropDownMenu setSelectedOption={setSelectedOption} selectedOption={selectedOption} contentMenu={contentMenu} />
          <div className="fixed-bottom">
            <button onClick={goToTrack} className="btn btn-secondary" style={{ zIndex: 1 }}>
              <i className={styleB} onClick={contentMenu}></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
