// src/components/TshirtModel.jsx
import React, { Suspense } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, Stage, Html } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const Model = ({ color }) => {
  const gltf = useLoader(GLTFLoader, "/models/tshirt.glb");

  if (color) {
    gltf.scene.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.color.set(color);
      }
    });
  }

  return <primitive object={gltf.scene} scale={1.5} />;
};

const TshirtModel = ({ color }) => {
  return (
    <div className="model-canvas-container">
      <Canvas shadows camera={{ position: [0, 1.5, 3.5], fov: 35 }}>
        <ambientLight intensity={0.6} />
        <directionalLight intensity={0.6} position={[5, 5, 5]} />
        <Suspense fallback={<Html><div style={{ color: '#fff' }}>Cargando modelo...</div></Html>}>
          <Stage environment="city" intensity={0.5}>
            <Model color={color} />
          </Stage>
          <OrbitControls enableZoom={true} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default TshirtModel;
