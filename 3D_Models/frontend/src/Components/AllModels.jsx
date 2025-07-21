import React,{Suspense} from 'react';
import {Canvas} from '@react-three/fiber';
import {useGLTF,OrbitControls,Environment,ContactShadows} from '@react-three/drei';

const Model = ({url})=>{
  const {scene} = useGLTF(url);
  return <primitive object={scene} scale={0.5} position={[0,0,0]}/>;
};

const AllModels = ({url}) => {
  if (!url) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-gray-900 text-white">
        No 3D Model Selected
      </div>
    );
  }

  return (
    <Canvas
      shadows 
      camera={{fov:10,position:[0,1.5,5]}} 
      style={{background:'#222'}}>
      <Suspense fallback={null}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[3,5,3]} intensity={2.5} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} shadow-camera-near={0.1} shadow-camera-far={20} shadow-camera-left={-10} shadow-camera-right={10} shadow-camera-top={10} shadow-camera-bottom={-10}/>
        <directionalLight position={[-3,2,-3]} intensity={0.5} />
        <Environment preset="city" background={false} />
        <Model url={url}/>
        <ContactShadows position={[0, -0.1, 0]}  opacity={0.6} scale={20} blur={1.5} far={0.8} resolution={256} color="#000000"/>
        <OrbitControls enableZoom={true} enablePan={true} autoRotate={true} autoRotateSpeed={0.75}/>
      </Suspense>
    </Canvas>
  );
};

export default AllModels;