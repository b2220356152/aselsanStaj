import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AircraftList = () => {
  const [aircrafts, setAircrafts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://localhost:7100/data'); // API endpoint'i buraya göre ayarlayın
        console.log('Response:', response.data); // API'den dönen veriyi console'da göster
        setAircrafts(response.data); // Gelen veriyi state'e kaydet
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Aircraft List</h2>
      <ul>
        {aircrafts.map(aircraft => (
          <li key={aircraft.flightId}>
            Flight ID: {aircraft.flightId}, Latitude: {aircraft.latitude}, Longitude: {aircraft.longitude}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AircraftList;
