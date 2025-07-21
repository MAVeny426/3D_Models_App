import React, {Suspense,useRef,useEffect } from 'react';
import {Canvas} from '@react-three/fiber';
import {Environment,useGLTF,OrbitControls } from '@react-three/drei';
import {MathUtils} from 'three';

const ModelViewer = ({url,scale = 1.0,position = [0,0,0],rotation = [0,0,0],environmentPreset ='studio',castShadows =true,receiveShadows =true,cameraPosition = [10,10,7],cameraFov = 50,className = '',
     }) => {
      if (!url) {
        return <div className="text-gray-500">No 3D model URL provided.</div>;
      }

      const {scene} = useGLTF(url);
      const modelRef = useRef();

        useEffect(() => {
          if (scene) {
            scene.scale.set(scale, scale, scale);
            scene.position.set(position[0], position[1], position[2]);
            scene.rotation.set(rotation[0], rotation[1], rotation[2]);

            scene.traverse((child) => {
              if (child.isMesh) {
                child.castShadow = castShadows;
                child.receiveShadow = receiveShadows;
                if (child.material) {
                  child.material.needsUpdate = true;
                }
              }
            });
          }
        }, [scene,scale,position,rotation,castShadows,receiveShadows]);

      return (
            <Canvas shadows camera={{ position: cameraPosition, fov: cameraFov }} style={{ width:'100%',height:'100%' }} className={className}>
              <ambientLight intensity={1.5}/>
              <directionalLight position={[5,15,8]} intensity={3.5} castShadow={castShadows} shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-near={0.5} shadow-camera-far={50} shadow-camera-left={-15} shadow-camera-right={15} shadow-camera-top={15} shadow-camera-bottom={-15}/>
              <directionalLight position={[-5,-10,-5]} intensity={1.5} />
              <Suspense fallback={null}>
                <primitive object={scene} ref={modelRef}/>
                <Environment preset={environmentPreset}/>
              </Suspense>

              <mesh rotation-x={-MathUtils.degToRad(90)} position-y={-0.10} receiveShadow>
                <planeGeometry args={[50,50]}/>
                <shadowMaterial attach="material" color="black" opacity={0.5}/>
              </mesh>
              <OrbitControls enableZoom={true} enablePan={true} autoRotate={true} autoRotateSpeed={0.75}/>
            </Canvas>
      );
    };

  export default ModelViewer;