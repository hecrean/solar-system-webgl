// HMJ
import React, { Suspense } from 'react';
import Universe from './webgl/Universe';

const Overlay = () => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        width: '100%',
        height: '100%',
      }}
    >
      <a
        href="https://uk.linkedin.com/in/hector-crean-016032141"
        style={{ position: 'absolute', bottom: 40, left: 90, fontSize: '13px' }}
      >
        Hector Crean
        <br />
        for SpaceMakerAI
      </a>
      <div style={{ position: 'absolute', top: 40, left: 40, fontSize: '13px' }}> universe </div>
      <div style={{ position: 'absolute', bottom: 40, right: 40, fontSize: '13px' }}>
        28/10/2021
      </div>
    </div>
  );
};

type Resource<T> = {
  diffuse_map: T;
  displacement_map: T;
  gravity_map: T;
  rare_earth_metals_map: T;
};

const resourcesUrls: Array<Resource<string>> = [
  {
    diffuse_map: '/mars/mars-diffuse-map.jpeg',
    displacement_map: '/mars/med_sl_rough_35_s-2k.jpeg',
    rare_earth_metals_map: '/mars/mars-metals-map.jpeg',
    gravity_map: '/mars/mars-grav-2k.jpeg',
  },
];

const App = (): React.ReactElement => {
  return (
    <>
      <Suspense fallback={null}>
        <Universe resources={resourcesUrls} />
      </Suspense>
      <Overlay />
    </>
  );
};

export default App;
