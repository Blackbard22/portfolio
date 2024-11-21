// import React, { useEffect, useState } from 'react';
// import { Canvas } from '@react-three/fiber';
// import { OrbitControls, useAnimations, useGLTF } from '@react-three/drei';

// function Model({ url }) {
//   const { scene, animations } = useGLTF(url);
//   const { actions, names } = useAnimations(animations, scene);

//   useEffect(() => {
//     // Play all animations if they exist
//     console.log(names);
//     names.forEach(name => {
//       if (actions[name]) {
//         actions[name].setEffectiveTimeScale(0.1); // Slow down the animation
//         actions[name].play();
//       }
//     });
//   }, [actions, names]);

//   return <primitive object={scene} scale={10} />;
// }

// const FBXViewer = () => {
//   return (
//       <Canvas
//         camera={{ position: [0, 0, 5], fov: 50 }}
//         style={{width:'85vw', height:'85vh'}}
//       >
//         <ambientLight intensity={0.5} />
//         <pointLight position={[10, 10, 10]} />
//         <Model url="./animated.glb" scale={10} />
//         <OrbitControls 
//           enableZoom={true}
//           enablePan={true}
//           enableRotate={true}
//         />
//       </Canvas>
//   );
// };

// export default FBXViewer;



// import React, { useEffect, useState } from 'react';
// import { Canvas } from '@react-three/fiber';
// import { OrbitControls, SpotLight, useAnimations, useGLTF } from '@react-three/drei';
// import * as THREE from 'three';

// function Model({ url, color }) {
//   const { scene, animations } = useGLTF(url);
//   const { actions, names } = useAnimations(animations, scene);

//   useEffect(() => {
//     // Apply color to all meshes in the model
//     scene.traverse((child) => {
//       if (child.isMesh) {
//         // Create a new material with the desired color
//         child.material = new THREE.MeshStandardMaterial({
//           color: color,
//           metalness: 0.5,
//           roughness: 0.5,
//         });
//       }
//     });

//     // Play all animations if they exist
//     console.log(names);
//     names.forEach(name => {
//       if (actions[name]) {
//         actions[name].setEffectiveTimeScale(0.15);
//         actions[name].play();
//       }
//     });
//   }, [actions, names, scene, color]);

//   return <primitive object={scene} scale={10} />;
// }

// const FBXViewer = () => {
//   const [modelColor, setModelColor] = useState('#ffffff');

//   return (
//     <div style={{width:'85vw', height: '85vh'}}>
//       {/* Color picker control */}
//       <div className="">
//         <label className="mr-2">Model Color:</label>
//         <input
//           type="color"
//           value={modelColor}
//           onChange={(e) => setModelColor(e.target.value)}
//           className="cursor-pointer"
//         />
//       </div>

//       <Canvas
//         camera={{ position: [0, 0, 5], fov: 50 }}   
//       >
//         <directionalLight position={[20, 10, 10]} />
//         <Model url="./animated.glb" color={modelColor} />
      
//         <OrbitControls 
//           enableZoom={true}
//           enablePan={true}
//           enableRotate={true}
//         />
//       </Canvas>
//     </div>
//   );
// };

// export default FBXViewer;




// import React, { useEffect, useState, useRef } from 'react';
// import { Canvas, useThree } from '@react-three/fiber';
// import { OrbitControls, SpotLight, useAnimations, useGLTF } from '@react-three/drei';
// import * as THREE from 'three';

// function Model({ url, color, onLightbulbPosition }) {
//   const { scene, animations } = useGLTF(url);
//   const { actions, names } = useAnimations(animations, scene);
//   const bulbRef = useRef();

//   useEffect(() => {
//     // Apply color to all meshes in the model
//     scene.traverse((child) => {
//       if (child.isMesh) {
//         // Store reference to the bulb mesh specifically
//         if (child.name === 'bulb') {
//           bulbRef.current = child;
//           console.log('Found bulb mesh:', child);
          
//           // Get world position of the bulb
//           const worldPosition = new THREE.Vector3();
//           child.getWorldPosition(worldPosition);
//           console.log('Bulb world position:', worldPosition);
          
//           onLightbulbPosition(worldPosition);
//         }
        
//         // Create a new material with the desired color
//         child.material = new THREE.MeshStandardMaterial({
//           color: color,
//           metalness: 0.5,
//           roughness: 0.5,
//         });
//       }
//     });

//     // Play all animations if they exist
//     names.forEach(name => {
//       if (actions[name]) {
//         actions[name].setEffectiveTimeScale(0.15);
//         actions[name].play();
//       }
//     });
//   }, [actions, names, scene, color, onLightbulbPosition]);

//   return <primitive object={scene} scale={10} />;
// }

// const DynamicSpotlight = ({ position }) => {
//   const spotlightRef = useRef();
  
//   useEffect(() => {
//     if (spotlightRef.current) {
//       console.log('Spotlight position:', position);
//     }
//   }, [position]);

//   if (!position) return null;
  
//   return (
//     <SpotLight
//       ref={spotlightRef}
//       position={[position.x, position.y + 0.1, position.z]} // Slightly above the bulb
//       angle={0.5}
//       penumbra={0.5}
//       intensity={5}
//       distance={20}
//       castShadow
//       decay={2}
//       target-position={[position.x, position.y - 1, position.z]} // Point downward
//     />
//   );
// };

// const FBXViewer = () => {
//   const [modelColor, setModelColor] = useState('#ffffff');
//   const [lightPosition, setLightPosition] = useState(null);

//   return (
//     <div style={{width:'85vw', height: '85vh'}}>
//       {/* Color picker control */}
//       <div className="">
//         <label className="mr-2">Model Color:</label>
//         <input
//           type="color"
//           value={modelColor}
//           onChange={(e) => setModelColor(e.target.value)}
//           className="cursor-pointer"
//         />
//       </div>

//       <Canvas
//         camera={{ position: [0, 0, 5], fov: 50 }}
//         shadows
//       >
//         <ambientLight intensity={0.2} /> {/* Reduced ambient light to make spotlight more visible */}
//         <directionalLight position={[20, 10, 10]} intensity={0.5} /> {/* Reduced intensity */}
//         <Model 
//           url="./animated.glb" 
//           color={modelColor} 
//           onLightbulbPosition={setLightPosition}
//         />
//         {lightPosition && <DynamicSpotlight position={lightPosition} />}
        
//         <OrbitControls 
//           enableZoom={true}
//           enablePan={true}
//           enableRotate={true}
//         />
//       </Canvas>
//     </div>
//   );
// };

// export default FBXViewer;



// import React, { useEffect, useState, useRef } from 'react';
// import { Canvas, useThree, useFrame } from '@react-three/fiber';
// import { OrbitControls, SpotLight, useAnimations, useGLTF } from '@react-three/drei';
// import * as THREE from 'three';

// function Model({ url, color, onLightbulbPosition }) {
//   const { scene, animations } = useGLTF(url);
//   const { actions, names } = useAnimations(animations, scene);
//   const bulbRef = useRef();

//   // Use useFrame to continuously update bulb position
//   useFrame(() => {
//     if (bulbRef.current) {
//       const worldPosition = new THREE.Vector3();
//       bulbRef.current.getWorldPosition(worldPosition);
//       onLightbulbPosition(worldPosition);
//     }
//   });

//   useEffect(() => {
//     scene.traverse((child) => {
//       if (child.isMesh) {
//         if (child.name === 'bulb') {
//           bulbRef.current = child;
//           console.log('Found bulb mesh:', child);
//           // Get initial position
//           const worldPosition = new THREE.Vector3();
//           child.getWorldPosition(worldPosition);
//           console.log('Initial bulb position:', worldPosition);
//         }
        
//         child.material = new THREE.MeshStandardMaterial({
//           color: color,
//           metalness: 0.5,
//           roughness: 0.5,
//         });
//         // Enable shadows for all meshes
//         child.castShadow = true;
//         child.receiveShadow = true;
//       }
//     });

//     names.forEach(name => {
//       if (actions[name]) {
//         actions[name].setEffectiveTimeScale(0.15);
//         actions[name].stop();
//       }
//     });
//   }, [actions, names, scene, color, onLightbulbPosition]);

//   return <primitive object={scene} scale={10} />;
// }

// // Helper component to visualize the bulb position
// const PositionHelper = ({ position }) => {
//   if (!position) return null;
//   return (
//     <mesh position={[position.x, position.y, position.z]}>
//       <sphereGeometry args={[0.1]} />
//       <meshBasicMaterial color="red" />
//     </mesh>
//   );
// };

// const DynamicSpotlight = ({ position }) => {
//   const spotlightRef = useRef();
//   const targetRef = useRef();
  
//   useEffect(() => {
//     if (spotlightRef.current && position) {
//       console.log('Updated spotlight position:', position);
//     }
//   }, [position]);

//   if (!position) return null;

//   // Calculate positions relative to the bulb
//   const spotlightPos = [
//     position.x,
//     position.y + 0.5, // Move spotlight up from bulb
//     position.z
//   ];

//   const targetPos = [
//     position.x,
//     position.y - 2, // Point downward
//     position.z
//   ];
  
//   return (
//     <>
//       {/* Spotlight target */}
//       <mesh ref={targetRef} position={targetPos}>
//         <sphereGeometry args={[0.05]} />
//         <meshBasicMaterial color="blue" />
//       </mesh>

      
//       <SpotLight
//         ref={spotlightRef}
//         position={[0, 1.1, 0.1]}
//         target={targetRef.current}
//         angle={0.6}
//         penumbra={0.5}
//         intensity={8}
//         distance={20}
//         castShadow
//         decay={2}
//         color="#ffffff"
      
//       />
//     </>
//   );
// };

// const FBXViewer = () => {
//   const [modelColor, setModelColor] = useState('#ffffff');
//   const [lightPosition, setLightPosition] = useState(null);

//   return (
//     <div style={{width:'85vw', height: '85vh'}}>
//       <div className="">
//         <label className="mr-2">Model Color:</label>
//         <input
//           type="color"
//           value={modelColor}
//           onChange={(e) => setModelColor(e.target.value)}
//           className="cursor-pointer"
//         />
//       </div>

//       <Canvas
//         camera={{ position: [0, 0, 5], fov: 50 }}
//         shadows
//       >
//         <color attach="background" args={['#2c2c2c']} />
//         <ambientLight intensity={0.2} />
//         <directionalLight position={[20, 10, 10]} intensity={0.3} />
        
//         <Model 
//           url="./animated.glb" 
//           color={modelColor} 
//           onLightbulbPosition={setLightPosition}
//         />
        
//         {lightPosition && (
//           <>
//             <DynamicSpotlight position={lightPosition} />
//             <PositionHelper position={lightPosition} />
//           </>
//         )}
        
//         <OrbitControls 
//           enableZoom={true}
//           enablePan={true}
//           enableRotate={true}
//         />

//         {/* Ground plane to show shadows */}
//         <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
//           <planeGeometry args={[50, 50]} />
//           <shadowMaterial opacity={0.3} />
//         </mesh>
//       </Canvas>
//     </div>
//   );
// };

// export default FBXViewer;





import React, { useEffect, useState, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, SpotLight, useAnimations, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

function Model({ url, color, onLightbulbPosition }) {
  const { scene, animations } = useGLTF(url);
  const { actions, names } = useAnimations(animations, scene);
  const lightbulbRef = useRef();
  const { camera } = useThree();

  useEffect(() => {
    let foundLightbulb = false;
    
    // Debug information
    console.log('Scanning scene for meshes...');
    console.log('Scene:', scene);
    
    scene.traverse((child) => {
      console.log('Found object:', child.name, child.type);
      
      

      if (child.isMesh) {
        // Look for specific names
        if (
          // child.name.toLowerCase().includes('lightbulb') || 
          // child.name.toLowerCase().includes('bulb') ||
          // child.name.toLowerCase().includes('light') ||
          child.name.toLowerCase().includes('main_lamp_holder')
        ) {
          console.log('Found lightbulb object:', child);
          lightbulbRef.current = child;
          foundLightbulb = true;
          
          // Get position in world space
          const worldPosition = new THREE.Vector3();
          // child.getWorldPosition(worldPosition);
          worldPosition.copy(child.position);
          console.log('World position:', worldPosition);
          
          // Get local position
          console.log('Local position:', child.position);
          
          // Get matrix information
          console.log('World matrix:', child.matrixWorld);
          
          onLightbulbPosition(worldPosition);
        }
        
        // Create a new material with the desired color
        child.material = new THREE.MeshStandardMaterial({
          color: color,
          metalness: 0.5,
          roughness: 0.5,
        });
      }
    });

    if (!foundLightbulb) {
      console.warn('No lightbulb mesh found in the scene');
    }

    // Play all animations if they exist
    names.forEach(name => {
      if (actions[name]) {
        actions[name].setEffectiveTimeScale(0.15);
        actions[name].play();
      }
    });
  }, [actions, names, scene, color, onLightbulbPosition]);

  return <primitive object={scene} scale={10} />;
}

const DynamicSpotlight = ({ position }) => {
  const spotlightRef = useRef();
  
  useEffect(() => {
    if (spotlightRef.current && position) {
      console.log('Spotlight position updated to:', position);
    }
  }, [position]);

  if (!position) return null;

  // x
  //     : 
  //     1.4204576015472412
  //     y
  //     : 
  //     1.0489507913589478
  //     z
  //     : 
  //     -10.247082710266113
  
  return (
    <SpotLight
      ref={spotlightRef}
      // position={[position.x, position.y, position.z]}
      position={[0,0,0]}
      angle={0.6}
      penumbra={0.5}
      intensity={2}
      distance={10}
      castShadow
      decay={2}
    />
  );
};

const FBXViewer = () => {
  const [modelColor, setModelColor] = useState('#ffffff');
  const [lightPosition, setLightPosition] = useState(null);

  useEffect(() => {
    if (lightPosition) {
      console.log('Light position updated in main component:', lightPosition);
    }
  }, [lightPosition]);

  return (
    <div style={{width:'85vw', height: '85vh'}}>
      {/* Color picker control */}
      <div className="">
        <label className="mr-2">Model Color:</label>
        <input
          type="color"
          value={modelColor}
          onChange={(e) => setModelColor(e.target.value)}
          className="cursor-pointer"
        />
      </div>

      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        shadows
      >
        <directionalLight position={[20, 10, 10]} />
        <Model 
          url="./animated2.glb" 
          color={modelColor} 
          onLightbulbPosition={setLightPosition}
        />
        {lightPosition && <DynamicSpotlight position={lightPosition} />}
        
        <OrbitControls 
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
        />
      </Canvas>
    </div>
  );
};

export default FBXViewer;