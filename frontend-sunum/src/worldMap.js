import React, { useState, useEffect } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import leafGreen from './assets/leaf-green.png';
import leafOrange from './assets/leaf-orange.png';
import leafShadow from './assets/leaf-shadow.png';

function WorldMap({ latN, lngN }) {
    const [lat, setLat] = useState(39.772790);
    const [lng, setLng] = useState(35.772790);

    useEffect(() => {
        const interval = setInterval(() => {
            setLat(latN);
            setLng(lngN);
        }, 1000);

        return () => clearInterval(interval);
    }, [latN, lngN]);

    const greenIcon = L.icon({
        iconUrl: leafGreen,
        shadowUrl: leafShadow,
        iconSize: [38, 95],
        shadowSize: [50, 64],
        iconAnchor: [22, 94],
        shadowAnchor: [4, 62],
        popupAnchor: [-3, -76],
        iconSize: iconSize
    });

    const orangeIcon = L.icon({
        iconUrl: leafOrange,
        shadowUrl: leafShadow,
        iconSize: [38, 95],
        shadowSize: [50, 64],
        iconAnchor: [22, 94],
        shadowAnchor: [4, 62],
        popupAnchor: [-3, -86],
        iconSize: iconSize
    });

    const positionGreenIcon = [39.772790, 35.772790]; // Or use state.greenIcon.lat and state.greenIcon.lng if necessary
    const positionOrangeIcon = [lat, lng];

    return (
        <MapContainer className="map" center={positionGreenIcon} zoom={13}>
            <TileLayer
                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={positionOrangeIcon} icon={orangeIcon}>
                <Popup>
                    Latitude: {lat}, Longitude: {lng}
                </Popup>
            </Marker>
        </MapContainer>
    );
}

export default WorldMap;
 