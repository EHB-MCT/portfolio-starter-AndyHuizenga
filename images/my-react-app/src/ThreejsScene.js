// ThreejsScene.js
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const ThreejsScene = () => {
  const sceneRef = useRef(null);

  useEffect(() => {
    // Your three.js code goes here
    const scene = new THREE.Scene();
    // ...

  }, []); // Run this effect only once when the component mounts

  return <div ref={sceneRef} />;
};

export default ThreejsScene;
