// HMJ
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import { useLoader } from '@react-three/fiber';

import { UNIVERSE_RADIUS, RaycasterLayers } from '../CONSTANTS';
const MilkyWay = (): React.ReactElement => {
  const milywayTexture = useLoader(TextureLoader, '/milky-way.jpg');

  return (
    <mesh layers={RaycasterLayers.CosmicBackground} position={[0.0, 0.0, 0.0]}>
      <sphereBufferGeometry args={[UNIVERSE_RADIUS, 30, 30]} attach="geometry" />
      <meshBasicMaterial attach="material" map={milywayTexture} side={2} />
    </mesh>
  );
};

export default MilkyWay;
