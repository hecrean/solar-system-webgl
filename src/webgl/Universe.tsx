// HMJ

import React, { Suspense } from 'react';
import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import HeavenlyBody from './HeavenlyBody';
import { Resource } from '../types';
import MilkyWay from './MilkyWay';
import { UNIVERSE_RADIUS } from '../CONSTANTS';

type UniversePropsType = {
  resources: Array<Resource<string>>;
};
const Universe = (props: UniversePropsType): React.ReactElement<UniversePropsType> => {
  return (
    <Canvas
      style={{
        width: '100vw',
        height: '100vh',
      }}
      shadows
      gl={{ antialias: true }}
      dpr={window.devicePixelRatio}
      camera={{ near: 1, far: UNIVERSE_RADIUS * 2 }}

      // onPointerMissed={() => (state.clicked = null)}
    >
      <directionalLight
        castShadow
        position={[0, 100, 0]}
        intensity={0.2}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      {/* <pointLight position={[-10, 0, -20]} intensity={0.5} />
				<pointLight position={[0, -10, 0]} intensity={1.5} /> */}

      {/**************** Scene  *************************/}
      <Suspense fallback={null}>
        <MilkyWay />
      </Suspense>
      <group>
        {props.resources.map((resource, index) => {
          return (
            <Suspense fallback={null} key={`heavenly-body-suspence${index}`}>
              <HeavenlyBody
                key={`heavenly-body-${index}`}
                radius={10}
                position={[0, 0, 0]}
                rotation={[0, 0, 0]}
                diffuse_map={resource.diffuse_map}
                displacement_map={resource.displacement_map}
                rare_earth_metals_map={resource.rare_earth_metals_map}
                gravity_map={resource.gravity_map}
              />
            </Suspense>
          );
        })}
      </group>
      {/**************** Scene  *************************/}
      <OrbitControls />
    </Canvas>
  );
};

export default Universe;
