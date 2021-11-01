// HMJ

import React, { Suspense, useRef, useState, FC, useEffect } from 'react';
import { Bounds, useBounds, Line } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Color, Group, Mesh, Object3D, Vector3 } from 'three';
import useRefs from 'react-use-refs';

import { Resource } from '../types/index.';
import { RaycasterLayers } from '../CONSTANTS';

import HeavenlyBody from './HeavenlyBody';
import MilkyWay from './MilkyWay';
import { OutlinEffect } from './OutlineEffect';

const SelectToZoom: FC<Record<string, unknown>> = ({ children }) => {
  const api = useBounds();
  const [active, activate] = useState<Object3D | null>(null);
  useEffect(() => {
    if (active instanceof Object3D) return void api.refresh(active).fit();
  }, [active]);

  return (
    <group
      onDoubleClick={(e) => {
        e.stopPropagation();
        e.delta <= 2 && activate(active === e.object ? null : e.object);
      }}
    >
      {' '}
      {children}{' '}
    </group>
  );
};

type SolarSystemScenePropsType = {
  resources: Resource<string>;
  setSelectedObjects: (value: Object3D[]) => void;
};
const SolarSystemScene = (
  props: SolarSystemScenePropsType,
): React.ReactElement<SolarSystemScenePropsType> => {
  const [moonEarthGroup] = useState(new Group());
  const moonEarthGroupRef = useRef<Group>(moonEarthGroup);

  const [earthOrbitTime, setEarthOrbitTime] = useState<number>(0);
  const [moonOrbitTime, setMoonOrbitTime] = useState<number>(0);

  const [genericMesh] = useState(new Mesh());
  const [moonRef, earthRef, sunRef] = useRefs<Mesh>(genericMesh);

  const EARTH_ORBIT_SEMIMAJOR_AXIS = 200;
  const EARTH_ORBIT_ECCENTRICIY = 0.01671;

  const MOON_ORBIT_SEMIMAJOR_AXIS = 10;
  const MOON_ORBIT_ECCENTRICIY = 0.01671;

  const [moonOrbitOn, setMoonOrbit] = useState<boolean>(true);
  const [earthOrbitOn, setEarthOrbitOn] = useState<boolean>(true);

  const [earthTrajectoryPoints, setEarthTrajectoryPoints] = useState<Array<Vector3>>([]);
  const [moonTrajectoryPoints, setMoonTrajectoryPoints] = useState<Array<Vector3>>([]);

  useFrame((state, dt) => {
    if (earthOrbitOn) {
      setEarthOrbitTime(earthOrbitTime + 0.1 * dt);
    }

    if (moonOrbitOn) {
      setMoonOrbitTime(moonOrbitTime + 0.1 * dt);
    }

    moonEarthGroupRef.current.position.x = earthOrbitOn
      ? EARTH_ORBIT_SEMIMAJOR_AXIS *
        (Math.cos(earthOrbitTime / (2 * Math.PI)) - EARTH_ORBIT_ECCENTRICIY)
      : moonEarthGroupRef.current.position.x;

    moonEarthGroupRef.current.position.z = earthOrbitOn
      ? EARTH_ORBIT_SEMIMAJOR_AXIS *
        Math.sqrt(1 - EARTH_ORBIT_ECCENTRICIY * EARTH_ORBIT_ECCENTRICIY) *
        Math.sin(earthOrbitTime / (2 * Math.PI))
      : moonEarthGroupRef.current.position.z;

    setEarthTrajectoryPoints((value) => [
      ...value,
      new Vector3(
        moonEarthGroupRef.current.position.x,
        moonEarthGroupRef.current.position.y,
        moonEarthGroupRef.current.position.z,
      ),
    ]);

    moonRef.current.position.x = moonOrbitOn
      ? MOON_ORBIT_SEMIMAJOR_AXIS *
        (Math.cos((moonOrbitTime * 10) / (2 * Math.PI)) - MOON_ORBIT_ECCENTRICIY)
      : moonRef.current.position.x;

    moonRef.current.position.z = moonOrbitOn
      ? MOON_ORBIT_SEMIMAJOR_AXIS *
        Math.sqrt(1 - MOON_ORBIT_ECCENTRICIY * MOON_ORBIT_ECCENTRICIY) *
        Math.sin((moonOrbitTime * 10) / (2 * Math.PI))
      : moonRef.current.position.z;

    const moonGlobalPosition: Vector3 = new Vector3();
    moonRef.current.getWorldPosition(moonGlobalPosition);
    setMoonTrajectoryPoints((value) => [...value, moonGlobalPosition]);
  });

  useFrame((_state, dt) => {
    moonRef.current.rotation.x -= (0.01 * Math.PI) / 180;
    moonRef.current.rotation.y += dt * 0.15;

    earthRef.current.rotation.x -= (0.01 * Math.PI) / 180;
    earthRef.current.rotation.y += dt * 0.15;
  });

  return (
    <group key="universe-reference-frame">
      <MilkyWay />

      <directionalLight
        intensity={0.2}
        position={[0, 100, 0]}
        shadow-camera-bottom={-10}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-mapSize-height={1024}
        shadow-mapSize-width={1024}
        castShadow
      />

      {earthTrajectoryPoints.length > 3 ? (
        <Line
          color={new Color(31, 24, 192)} // Array of points
          dashed={false} // Default
          lineWidth={1} // In pixels (default)
          points={earthTrajectoryPoints} // Default
        />
      ) : null}

      {moonTrajectoryPoints.length > 3 ? (
        <Line
          color={new Color(255, 95, 31)} // Array of points
          dashed={false} // Default
          lineWidth={1} // In pixels (default)
          points={moonTrajectoryPoints} // Default
        />
      ) : null}

      <HeavenlyBody
        key="sun"
        ref={sunRef}
        diffuse_map={props.resources.sun.diffuse_map}
        displacement_map={props.resources.sun.displacement_map}
        layers={RaycasterLayers.CelestialBodies}
        position={[0, 0, 0]}
        radius={30}
        rotation={[0, 0, 0]}
        onDoubleClick={(_) => props.setSelectedObjects([sunRef.current])}
      />

      <group key="moon-earth-reference-frame" ref={moonEarthGroupRef}>
        <HeavenlyBody
          key="moon"
          ref={moonRef}
          diffuse_map={props.resources.moon.diffuse_map}
          displacement_map={props.resources.moon.displacement_map}
          layers={RaycasterLayers.CelestialBodies}
          position={[0, 0, 5]}
          radius={1}
          rotation={[0, 0, 0]}
          onClick={(_) => {
            setMoonOrbit(!moonOrbitOn);
          }}
          onDoubleClick={(_) => props.setSelectedObjects([moonRef.current])}
        />
        <HeavenlyBody
          key="earth"
          ref={earthRef}
          diffuse_map={props.resources.earth.diffuse_map}
          displacement_map={props.resources.earth.displacement_map}
          layers={RaycasterLayers.CelestialBodies}
          position={[0, 0, 0]}
          radius={2}
          rotation={[0, 0, 0]}
          onClick={(_) => {
            setEarthOrbitOn(!earthOrbitOn);
          }}
          onDoubleClick={(_) => props.setSelectedObjects([earthRef.current])}
        />
      </group>
    </group>
  );
};

type UniversePropsType = {
  resources: Resource<string>;
};
export const Universe = (props: UniversePropsType): React.ReactElement<UniversePropsType> => {
  const [selectedObjects, setSelectedObjects] = useState<Array<Object3D>>([]);

  return (
    <group>
      <Suspense fallback={null}>
        <Bounds margin={1.2}>
          <SelectToZoom>
            <SolarSystemScene resources={props.resources} setSelectedObjects={setSelectedObjects} />
          </SelectToZoom>
        </Bounds>
      </Suspense>
      <OutlinEffect selection={selectedObjects} />
    </group>
  );
};
