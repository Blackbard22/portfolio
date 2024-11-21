import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Line, Circle } from '@react-three/drei';
import * as THREE from 'three';

const DraggableSwingingRopeCircle = () => {
  const ropeRef = useRef();
  const circleRef = useRef();
  const [swingAngle, setSwingAngle] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const { camera, gl } = useThree();

  const handlePointerDown = (e) => {
    e.stopPropagation();
    setIsDragging(true);
    gl.domElement.style.cursor = 'grabbing';
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    gl.domElement.style.cursor = 'grab';
  };

  const handlePointerMove = (e) => {
    if (isDragging) {
      e.stopPropagation();
      const { clientX, clientY } = e;
      const rect = gl.domElement.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((clientY - rect.top) / rect.height) * 2 + 1;
      const vector = new THREE.Vector3(x, y, 0.5);
      vector.unproject(camera);
      const angle = Math.atan2(vector.x, -vector.y);
      setSwingAngle(angle);
    }
  };

  useEffect(() => {
    const canvas = gl.domElement;
    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerup', handlePointerUp);
    return () => {
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerup', handlePointerUp);
    };
  }, [gl, isDragging]);

  useFrame(() => {
    if (ropeRef.current && circleRef.current) {
      ropeRef.current.rotation.z = swingAngle;
      circleRef.current.position.x = Math.sin(swingAngle) * 2;
      circleRef.current.position.y = -Math.cos(swingAngle) * 2;
    }
  });

  return (
    <>
      <Line
        ref={ropeRef}
        points={[[0, 0, 0], [0, -2, 0]]}
        color="brown"
        lineWidth={5}
      />
      <Circle
        ref={circleRef}
        args={[0.2, 32]}
        position={[0, -2, 0]}
        onPointerDown={handlePointerDown}
      >
        <meshBasicMaterial attach="material" color="red" />
      </Circle>
    </>
  );
};

const Scene = () => {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <DraggableSwingingRopeCircle />
    </Canvas>
  );
};

export default Scene;