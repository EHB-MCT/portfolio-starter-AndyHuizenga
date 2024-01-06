import React, { useState, useEffect, useRef } from 'react';
import './PaintingCanvas.css';
import { handleClearData } from './Buttons';
import 'bootstrap/dist/css/bootstrap.min.css';
import socketIOClient from 'socket.io-client';
import { useNavigate } from 'react-router-dom';



const ENDPOINT = 'http://localhost:3001'; // Update with your server URL


function OSCDataDisplay() {
  const [oscData, setOSCData] = useState([]);
  const canvasRef = useRef(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token').trim();
  console.log('Token:', encodeURIComponent(token));



  
  const saveDrawing = async () => {
    try {
      console.log(localStorage.getItem('token'));
      console.log(`token render ${token}`)

      // Fetch user only when the button is pressed
      const fetchUserResponse = await fetch(`${ENDPOINT}/api/check-authentication`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });
  
      if (fetchUserResponse.ok) {
        const authenticatedUser = await fetchUserResponse.json();
        setIsLoggedIn(authenticatedUser ? true : false);
        console.log("User is authenticated");
  
        // Continue with saving the drawing
        const saveDrawingResponse = await fetch(`${ENDPOINT}/api/save-drawing-points`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ oscData }),
        });
  
        if (saveDrawingResponse.ok) {
          alert('Drawing saved successfully!');
        } else {
          const data = await saveDrawingResponse.json();
          console.error('Error saving drawing:', data.error);
          alert('Error saving drawing. Please try again.');
        }
      } else {
        // Handle the case where user authentication fails
        console.error('User authentication failed');
        alert('User authentication failed. Please log in again.');
        navigate('/login');
      }
    } catch (error) {
      console.error('Unexpected error during saveDrawing:', error);
      alert('Unexpected error occurred. Please try again later.');
    }
  };
  
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
      if (data.position && data.position.x !== undefined && data.position.y !== undefined) {
        const x = mapOSCValueToCanvas(data.position.x * -1, canvas.width);
        const y = mapOSCValueToCanvas(data.position.y, canvas.height);

        // Draw a point on the canvas
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fill();
      }
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

 
     
     


      <div className="painting-canvas-container">
        <canvas ref={canvasRef} width={4985} height={4985} className="live-canvas"></canvas>
      </div>

        <button onClick={saveDrawing} className="btn btn-primary">
        Save Drawing
      </button>
      <button onClick={handleClearData} className="btn btn-danger">
        Clear OSC Data
      </button>
    </div>
    
  );
}

export default OSCDataDisplay;
