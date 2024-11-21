import * as THREE from 'three'
import { useRef, useState, useMemo } from 'react'
import { Canvas, useFrame, extend } from '@react-three/fiber'
import { Physics, RigidBody, useSphericalJoint, CylinderCollider } from '@react-three/rapier'
import { SpotLight, useHelper, Text3D, Center, OrbitControls } from '@react-three/drei'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { Suspense } from 'react'
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry'
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial'
import { Line2 } from 'three/examples/jsm/lines/Line2'



extend({ Line2, LineGeometry, LineMaterial })


function HangingLightShade() {
  const fixedPoint = useRef();
  const cord = useRef();
  const shade = useRef();
  const light = useRef();
  const vec = new THREE.Vector3(), dir = new THREE.Vector3()

  const [dragged, setDragged] = useState(false)
  const [spotlightAngle, setSpotlightAngle] = useState(0.1)
  const [angleIncreasing, setAngleIncreasing] = useState(true)

  const curve = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 5, 0),
    new THREE.Vector3(0, 3, 0),
    new THREE.Vector3(0, 1, 0)
  ]), [])

  useSphericalJoint(fixedPoint, shade, [[0, -1, 0], [0, 2, 0]])

  useFrame((state, delta) => {
    if(dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera)
      dir.copy(vec).sub(state.camera.position).normalize()
      vec.add(dir.multiplyScalar(state.camera.position.length()))
      shade.current?.setNextKinematicTranslation({ x: vec.x - dragged.x, y: shade.current.translation().y, z: vec.z - dragged.z })
    }
    if (fixedPoint.current && shade.current) {
      // Update curve control points
      curve.points[0].copy(fixedPoint.current.translation())
      curve.points[2].copy(shade.current.translation())
      curve.points[1].lerpVectors(curve.points[0], curve.points[2], 0.5)
      
      // Generate points along the curve
      const points = curve.getPoints(50)
      
      // Update the line geometry
      const positions = points.reduce((arr, point) => arr.concat(point.toArray()), [])
      cord.current.geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
      cord.current.geometry.computeBoundingSphere()

      // Update spotlight position to match shade
      if (light.current) {
        light.current.position.copy(shade.current.translation())
      }
    }

    // Oscillate spotlight angle
    if (angleIncreasing) {
      setSpotlightAngle(prev => Math.min(prev + delta * 0.5, 1))
      if (spotlightAngle >= 1) setAngleIncreasing(false)
    } else {
      setSpotlightAngle(prev => Math.max(prev - delta * 0.5, 0.1))
      if (spotlightAngle <= 0.1) setAngleIncreasing(true)
    }
  });

  return (
    <group>
      <RigidBody ref={fixedPoint} type="fixed" position={[0, 5, 0]}>
        <mesh>
          <sphereGeometry args={[0.1, 16, 16]}  />
          <meshBasicMaterial color="white" />
        </mesh>
      </RigidBody>

      {/* <line ref={cord} >
        <bufferGeometry />
        <lineBasicMaterial color="blue"/>
      </line> */}

    <line ref={cord}>
        <meshLineGeometry />
        {/* <meshLineMaterial color="blue" resolution={[10, 10]} lineWidth={10} /> */}
        <lineBasicMaterial color="blue"/>

      </line>



      <RigidBody 
        ref={shade} 
        position={[2, 3, 0]}
        type={dragged ? 'kinematicPosition' : 'dynamic'}
        angularDamping={40} 
        linearDamping={5}
      >
        <CylinderCollider args={[0.3, 0.4]} />
        <mesh 
          onPointerUp={(e) => (e.target.releasePointerCapture(e.pointerId), setDragged(false))}
          onPointerDown={(e) => {
            e.stopPropagation(),
            e.target.setPointerCapture(e.pointerId),
            setDragged(new THREE.Vector3().copy(e.point).sub(vec.copy(shade.current.translation())))
          }}
        >
          <cylinderGeometry args={[0.5, 0.8, 0.6, 32]} />
          {/* <meshPhongMaterial color="white" side={THREE.DoubleSide} /> */}
          <meshStandardMaterial color="white" side={THREE.DoubleSide} metalness={0.5} />

        </mesh>
      </RigidBody>

      <SpotLight
        ref={light}
        position={[0, 1, 0]}
        intensity={10}
        distance={10}
        angle={spotlightAngle}   
        color="yellow"
        castShadow
      />

      <group position={[-1.3, -2, 0]}>
        <Center>
          <Suspense fallback={null}>
            <Text3D
              font="./Afacad Flux_Regular.json"
              size={0.6}
              height={0.2}
              curveSegments={12}
              bevelEnabled
              bevelThickness={0.02}
              bevelSize={0.02}
              bevelOffset={0}
              bevelSegments={5}
            >
              Loading
              <meshStandardMaterial color="white" metalness={0.5} />
            </Text3D>
          </Suspense>
        </Center>
      </group>
    </group>
  );
}

function Loading() {
  return (
    <Canvas camera={{ position: [0, 4, 10], fov: 50 }} style={{width: '90vw', height: '90vh'}}>
        <Physics gravity={[0, -9.81, 0]}>
        <directionalLight 
        position={[0, 1, 0]} 
        intensity={1} 
        castShadow 
        />
        <OrbitControls />
            <HangingLightShade />
        </Physics>
    </Canvas>
  );
}

export default Loading;
