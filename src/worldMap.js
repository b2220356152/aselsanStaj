
import L from 'leaflet';

import React, {Component, useEffect, useState} from 'react';

import leafGreen from './assets/leaf-green.png';
import leafRed from './assets/leaf-red.png';
import leafOrange from './assets/leaf-orange.png';
import leafShadow from './assets/leaf-shadow.png';
import {MapContainer, TileLayer, Marker, Polygon, Popup} from "react-leaflet";
import { usestate } from 'react';
import a from "./a";

function WorldMap({latN,lngN}) {
    var [lat,setlat] = useState(39.772790);
    var [lng,setlng] = useState(35.772790);

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



        let
            orangeIcon = L.icon({
                iconUrl: leafOrange,
                shadowUrl: leafShadow,
                iconSize: [38, 95], // size of the icon
                shadowSize: [50, 64], // size of the shadow
                iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
                shadowAnchor: [4, 62],  // the same for the shadow
                popupAnchor: [-3, -86]
            });

    useEffect(() => {
        const interval = setInterval(() => {
            setlat(lat => latN);
            setlng(lng => lngN);
            console.log(latN)
        }, 1000);return () => clearInterval(interval);
    }, []);



        const positionGreenIcon = [state.greenIcon.lat, state.greenIcon.lng];
        const positionOrangeIcon = [lat, lng];
        return (

            <MapContainer className="map" center={positionGreenIcon} zoom={state.zoom}>
                <TileLayer
                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={positionOrangeIcon} icon={orangeIcon}>
                    <Popup>
                        I am an orange leaf
                    </Popup>
                </Marker>
            </MapContainer>

        );




}export default WorldMap;
