import React, { useState, useEffect } from 'react';
import './OSCDataDisplay.css';
import { handleClearData } from './Buttons';
import 'bootstrap/dist/css/bootstrap.min.css';
import socketIOClient from 'socket.io-client';

const ENDPOINT = 'http://localhost:3000'; // Update with your server URL

function OSCDataDisplay() {
  const [oscData, setOSCData] = useState([]);

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);

    // Listen for initial data when connected
    socket.on('initial-osc-data', (initialData) => {
      setOSCData(initialData);
    });

    // Listen for real-time updates
    socket.on('osc-data-update', (oscUpdate) => {
      setOSCData((prevData) => [...prevData, oscUpdate]);
    });

    // Listen for data clearing
    socket.on('osc-data-cleared', () => {
      setOSCData([]);
    });

      

        fetchOscData();
    // Clean up socket when component unmounts
    return () => socket.disconnect();
  }, []);

  const fetchOscData = async () => {
    try {
      const response = await fetch(`${ENDPOINT}/oscdata`);
      if (!response.ok) {
        throw new Error('Failed to fetch OSC data');
      }

      const data = await response.json();
      setOSCData(data);
    } catch (error) {
      console.error('Error fetching OSC data:', error);
    }
  };

  return (
    <div>
      <h1>OSC Data Display</h1>

      <button onClick={handleClearData} className="btn btn-danger">
        Clear OSC Data
      </button>

      <div className="tableS">
        <table className="table table-bordered table-width-80">
          <thead className="thead-dark">
            <tr>
              <th>X-POS</th>
              <th>Y-POS</th>
            </tr>
          </thead>
          <tbody>
            {oscData.map((data, index) => (
              <tr key={index}>
              <td>{data.position && data.position.x}</td>
              <td>{data.position && data.position.y}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OSCDataDisplay;
