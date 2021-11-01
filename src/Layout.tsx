// HMJ
import React, { FC } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

import { UNIVERSE_RADIUS, RaycasterLayers } from './CONSTANTS';
import { Resource } from './types/index.';
import { Universe } from './webgl/Universe';

const resourcesUrls: Resource<string> = {
  mars: {
    diffuse_map: '/mars/mars-diffuse-map.jpeg',
    displacement_map: '/mars/med_sl_rough_35_s-2k.jpeg',
  },
  moon: {
    diffuse_map: '/moon/diffuse-1k.jpeg',
    displacement_map: '/moon/displacement-1k.jpg',
  },
  earth: {
    diffuse_map: '/earth/diffuse-1k.jpeg',
    displacement_map: '/earth/displacement-1k.jpg',
  },
  sun: {
    diffuse_map: '/sun/8k_sun.jpeg',
    displacement_map: '/moon/displacement-1k.jpg',
  },
};

type LayoutPropsType = Record<string, unknown>;
export const Layout: FC<LayoutPropsType> = () => {
  return (
    <>
      <Canvas
        camera={{ near: 1, far: UNIVERSE_RADIUS * 2 }}
        dpr={window.devicePixelRatio}
        gl={{ antialias: true }}
        style={{
          width: '100vw',
          height: '100vh',
        }}
        shadows
        onCreated={({ camera, raycaster }) => {
          camera.layers.enableAll();
          raycaster.layers.enableAll();
          raycaster.layers.disable(RaycasterLayers.CosmicBackground);
          camera.position.x = UNIVERSE_RADIUS * 0.3;
          camera.position.z = UNIVERSE_RADIUS * 0.3;
          camera.position.y = 0;
        }}
      >
        <Universe resources={resourcesUrls} />
        <OrbitControls />
      </Canvas>
    </>
  );
};
