import React, { useMemo, useState, useEffect, useRef } from 'react';
import {  useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { baseFragmentShader, baseVertexShader } from '../Shaders/baseSahder';



const ShaderMaterial = () => {
    const [isHovered, setIsHovered] = useState(false);
    const [aspect, setAspect] = useState(window.innerWidth / window.innerHeight);
  
    // Update aspect ratio on window resize
    useEffect(() => {
      const handleResize = () => setAspect(window.innerWidth / window.innerHeight);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);
  
    const shaderMaterial = useMemo(() => {
      return new THREE.ShaderMaterial({
        uniforms: {
          iTime: { value: 0 },
          iResolution: { value: new THREE.Vector3() },
          speedFactor: { value: 1.0 }
        },
        vertexShader: baseVertexShader,
        fragmentShader: baseFragmentShader
      });
    }, []);
  
  
   
  
  
    useFrame((state) => {
      shaderMaterial.uniforms.iTime.value = state.clock.elapsedTime;
      shaderMaterial.uniforms.iResolution.value.set(
        window.innerWidth,
        window.innerHeight,
        1
      );
      const targetSpeed = isHovered ? 0.2 : 1.0;
      shaderMaterial.uniforms.speedFactor.value += 
        (targetSpeed - shaderMaterial.uniforms.speedFactor.value) * 0.1;
    });
  
    return (
      <mesh
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={() => setIsHovered(false)}
      >
        <planeGeometry args={[2 * aspect, 2]} /> 
        <primitive object={shaderMaterial} attach="material" />
      </mesh>
    );
  };

  export default ShaderMaterial;    