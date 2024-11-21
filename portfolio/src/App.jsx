import reactLogo from './assets/react.svg'

import './App.css'
import * as THREE from 'three'
import { useRef, useState } from 'react'
import { Canvas, extend, useThree, useFrame } from '@react-three/fiber'
import { BallCollider, Physics, RigidBody, useSphericalJoint } from '@react-three/rapier'
import { MeshLineGeometry, MeshLineMaterial } from 'meshline'
import { SpotLight } from '@react-three/drei'
import Scene from './Scene'

extend({ MeshLineGeometry, MeshLineMaterial })

function App() {
  const [count, setCount] = useState(0)

  return (
    <Canvas className='canvas' camera={{ position: [0, 5, 30], fov: 25 }} style={{ width: '90vw', height: '90vh' }} >
      <Physics gravity={[0, -10, 0]} timeStep={1 / 60}  interpolate>

        <Band />
        {/* <Scene /> */}
      </Physics>
    </Canvas>
  )
}

// function Band() {
//   const band = useRef(), fixed = useRef(), j1 = useRef(), sphere = useRef()
//   const vec = new THREE.Vector3(), dir = new THREE.Vector3()
//   const { width, height } = useThree((state) => state.size)
//   const [curve] = useState(() => new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()]))
//   const [dragged, drag] = useState(false)

//   useSphericalJoint(fixed, j1, [[0, 0, 0], [0, 0, 0]])
//   useSphericalJoint(j1, sphere, [[0, 0, 0], [0, 1, 0]])

//   useFrame((state, delta) => {
//     if (dragged) {
//       vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera)
//       dir.copy(vec).sub(state.camera.position).normalize()
//       vec.add(dir.multiplyScalar(state.camera.position.length()))
//       ;[sphere, j1, fixed].forEach((ref) => ref.current?.wakeUp())
//       sphere.current?.setNextKinematicTranslation({ x: vec.x - dragged.x, y: vec.y - dragged.y, z: vec.z - dragged.z })
//     }
//     if (fixed.current && sphere.current) {
//       // Calculate curve
//       curve.points[0].copy(fixed.current.translation())
//       curve.points[1].copy(j1.current.translation())
//       curve.points[2].copy(sphere.current.translation())
//       band.current.geometry.setPoints(curve.getPoints(32))
//     }
//   })

//   return (
//     <>
//       <group position={[0, 4, 0]}>
//         <RigidBody ref={fixed} type="fixed" />
//         <RigidBody position={[0, -1, 0]} ref={j1} angularDamping={2} linearDamping={2}>
//           <BallCollider args={[0.1]} />
//         </RigidBody>
//         <RigidBody position={[0, -2, 0]} ref={sphere} angularDamping={10} linearDamping={10} type={dragged ? 'kinematicPosition' : 'dynamic'}>
//           <BallCollider args={[1]} />
//           <mesh
//            scale={[0.2, 0.3, 0.2]}
//             onPointerUp={(e) => (e.target.releasePointerCapture(e.pointerId), drag(false))}
//             onPointerDown={(e) => (e.target.setPointerCapture(e.pointerId), drag(new THREE.Vector3().copy(e.point).sub(vec.copy(sphere.current.translation()))))}>
//             <cylinderGeometry args={[0.3, 5, 8, 24, 1, false, 0, 6.283185]} />
//             {/* <circleGeometry args={[1, 32]} /> */}
//             <meshBasicMaterial transparent opacity={0.9} color="white" side={THREE.DoubleSide} />
//           </mesh>
//           <SpotLight
//             // castShadow
//             position={[0, 0, 0]}
//             angle={1.5}
//             penumbra={0.9}
//             intensity={10}
//             distance={10}
//             color="yellow"
//             rotation={[Math.PI, 0, 0]}
//           />
//         </RigidBody>
//       </group>
//       <mesh ref={band}>
//         <meshLineGeometry />
//         <meshLineMaterial transparent opacity={0.25} color="blue" depthTest={false} resolution={[width, height]} lineWidth={1} />
//       </mesh>
//     </>
//   )
// }


function Band() {
  const [dragged, drag] = useState(false)
  const band = useRef(), fixed = useRef(), j1 = useRef(), sphere = useRef()
  const vec = new THREE.Vector3(), dir = new THREE.Vector3()
  const { width, height } = useThree((state) => state.size)
  const points = [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()] // 3 points for the line

  useSphericalJoint(fixed, j1, [[0, 0, 0], [0, 0, 0]])
  useSphericalJoint(j1, sphere, [[0, 0, 0], [0, 1, 0]])

  useFrame((state, delta) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera)
      dir.copy(vec).sub(state.camera.position).normalize()
      vec.add(dir.multiplyScalar(state.camera.position.length()))
      [sphere, j1, fixed].forEach((ref) => ref.current?.wakeUp())
      sphere.current?.setNextKinematicTranslation({ x: vec.x - dragged.x, y: vec.y - dragged.y, z: vec.z - dragged.z })
    }
    if (fixed.current && sphere.current) {
      // Update points based on object positions
      points[0].copy(fixed.current.translation())
      points[1].copy(j1.current.translation())
      points[2].copy(sphere.current.translation())

      // Update the line geometry with new positions
      const positions = points.reduce((arr, point) => arr.concat(point.toArray()), [])
      band.current.geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
      band.current.geometry.computeBoundingSphere() 
    }
  })

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} type="fixed" />
        <RigidBody position={[0, -1, 0]} ref={j1} angularDamping={2} linearDamping={2} >
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[0, -2, 0]} ref={sphere} angularDamping={10} linearDamping={10} type={dragged ? 'kinematicPosition' : 'kinematicPosition'}>
        {/* <RigidBody position={[0, -2, 0]} ref={sphere} angularDamping={10} linearDamping={10} type= 'dynamic'> */}
          <BallCollider args={[1]} />
          <mesh
            scale={[0.2, 0.3, 0.2]}
            onPointerUp={(e) => (e.target.releasePointerCapture(e.pointerId), drag(false))}
            onPointerDown={(e) => (e.target.setPointerCapture(e.pointerId), drag(new THREE.Vector3().copy(e.point).sub(vec.copy(sphere.current.translation()))))}>
            {/* <circleGeometry args={[1, 32]} /> */}
            <cylinderGeometry args={[0.3, 5, 8, 24, 1, false, 0, 6.283185]} />
            <meshBasicMaterial transparent opacity={0.25} color="white" side={THREE.DoubleSide} />
            {console.log(dragged)}
          </mesh>
          <SpotLight
            position={[0, 0, 0]}
            angle={1.5}
            penumbra={0.9}
            intensity={10}
            distance={10}
            color="yellow"
            rotation={[-Math.PI, 0, 0]}
          />
        </RigidBody>
      </group>
      <line ref={band}>
        <bufferGeometry />
        <lineBasicMaterial transparent opacity={1} color="gray" linewidth={1} />
      </line>
    </>
  )
}

export default App


