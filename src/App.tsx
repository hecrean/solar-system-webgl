// HMJ
import React, { Suspense } from 'react';

import { Layout } from './Layout';

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

const App = (): React.ReactElement => {
  return (
    <Suspense fallback={null}>
      <Overlay />
      <Layout />
    </Suspense>
  );
};

export default App;
