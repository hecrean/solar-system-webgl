// HMJ

import React from 'react';
import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import HeavenlyBody from './HeavenlyBody';

type SolarSystemScenePropsType = {

}
const SolarSystemScene = (): React.ReactElement<SolarSystemScenePropsType> => {
	return ( 
		<group>
			<HeavenlyBody radius={10}/>
		</group>
	)
}


type UniversePropsType = Record<string, unknown>;
const Universe = (): React.ReactElement<UniversePropsType> => {
 
  return (
		
  	<Canvas 
			style={{
				width: '100vw',
				height: '100vh'
			}}			
			shadows 
			gl={{ antialias: false }} 
			// dpr={[1, 1.5]} 
			// onPointerMissed={() => (state.clicked = null)}
		>
				<ambientLight intensity={0.3} />
				<directionalLight
						castShadow
						position={[0, 10, 0]}
						intensity={1.5}
						shadow-mapSize-width={1024}
						shadow-mapSize-height={1024}
						shadow-camera-far={50}
						shadow-camera-left={-10}
						shadow-camera-right={10}
						shadow-camera-top={10}
						shadow-camera-bottom={-10}
				/>
				<pointLight position={[-10, 0, -20]} intensity={0.5} />
				<pointLight position={[0, -10, 0]} intensity={1.5} />

				{/**************** Scene  *************************/}
				<SolarSystemScene />
				{/**************** Scene  *************************/}
				<OrbitControls />
		</Canvas>
  );
};

export default Universe;
