import React, { useEffect, useState } from 'react';
import { Marker, useMap } from 'react-leaflet';
import L from 'leaflet';

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
        updateIconSize();  // Initial size update

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

export default MarkerWithDynamicSize;
