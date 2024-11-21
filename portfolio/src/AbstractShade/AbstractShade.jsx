import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { abstractFragmentShader, abstractVertexShader } from '../Shaders/abstractShader';
import { outlineFragmentShader, outlineVertexShader } from '../Shaders/outlineShader';


const AbstractShaderMaterial = ({ width = window.innerWidth, height = window.innerHeight }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [aspect, setAspect] = useState(width / height);
  
    useEffect(() => {
      const handleResize = () => setAspect(width / height);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, [width, height]);
  
    const shaderMaterial = useMemo(() => {
      return new THREE.ShaderMaterial({
        uniforms: {
          iTime: { value: 0 },
          iResolution: { value: new THREE.Vector3() },
          speedFactor: { value: 1.0 }
        },
        vertexShader: outlineVertexShader,
        fragmentShader: outlineFragmentShader
      });
    }, []);
  
    useFrame((state) => {
      shaderMaterial.uniforms.iTime.value = state.clock.elapsedTime;
      shaderMaterial.uniforms.iResolution.value.set(
        width,
        height,
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

  export default AbstractShaderMaterial;    