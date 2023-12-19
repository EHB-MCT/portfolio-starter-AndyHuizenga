import React, { useState, useEffect, useRef } from 'react';
import './PaintingCanvas.css';
import { handleClearData } from './buttonss';
import 'bootstrap/dist/css/bootstrap.min.css';
import socketIOClient from 'socket.io-client';

const ENDPOINT = 'http://localhost:3000'; // Update with your server URL

function OSCDataDisplay() {
  const [oscData, setOSCData] = useState([]);
  const canvasRef = useRef(null);

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

    // Clean up socket when component unmounts
    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    oscData.forEach((data) => {
      const x = mapOSCValueToCanvas(data.position.x * -1, canvas.width);
      const y = mapOSCValueToCanvas(data.position.y , canvas.height);

      // Draw a point on the canvas
      ctx.fillStyle = 'red';
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, 2 * Math.PI);
      ctx.fill();
    });
  }, [oscData]);

  const mapOSCValueToCanvas = (oscValue, canvasSize) => {
    // Map the OSC value between -5 and 5 to the canvas size
    const mappedValue = ((oscValue + 5) / 10) * canvasSize;
  
    // Reverse the Y values on the canvas
    return canvasSize - mappedValue;
  };

  return (
    <div>
      <h1>Live OSC Data Painting</h1>

      <button onClick={handleClearData} className="btn btn-danger">
        Clear OSC Data
      </button>

      <div className="painting-canvas-container">
        <canvas ref={canvasRef} width={500} height={500} className="live-canvas"></canvas>
      </div>
    </div>
  );
}

export default OSCDataDisplay;
