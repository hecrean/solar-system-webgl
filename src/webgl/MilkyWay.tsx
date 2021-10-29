// HMJ
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import { useLoader } from '@react-three/fiber';
import { UNIVERSE_RADIUS } from '../CONSTANTS';
const MilkyWay = () => {
  const milywayTexture = useLoader(TextureLoader, '/milky-way.jpg');
  return (
    <mesh position={[0.0, 0.0, 0.0]}>
      <sphereBufferGeometry args={[UNIVERSE_RADIUS, 30, 30]} attach="geometry" />
      <meshBasicMaterial side={2} map={milywayTexture} attach="material" />
    </mesh>
  );
};

export default MilkyWay;
