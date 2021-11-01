// HMJ
import { useEffect, useMemo } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import {
  GodRaysEffect as GodRaysEffectRaw,
  EffectComposer,
  RenderPass,
  EffectPass,
  KernelSize,
  EdgeDetectionMode,
  SMAAEffect,
  SMAAPreset,
  SMAAImageGenerator,
} from 'postprocessing';
import { useFBO } from '@react-three/drei';
import { Mesh } from 'three';

export type UseGodRaysEffectRawParams = ConstructorParameters<typeof GodRaysEffectRaw>[2];

export const defaultGodRaysEffectRawParams = {
  height: 480,
  kernelSize: KernelSize.SMALL,
  density: 0.96,
  decay: 0.92,
  weight: 0.3,
  exposure: 0.54,
  samples: 60,
  clampMax: 1.0,
};

const defaultRenderPriority = 1;

// Custom hook

type GodRaysEffectRawPropsType = {
  sunMesh: Mesh;
  params?: UseGodRaysEffectRawParams;
  renderPriority?: number;
};
export const GodRaysEffect = ({
  sunMesh,
  params,
  renderPriority,
}: GodRaysEffectRawPropsType): null => {
  const { gl, camera, size, scene } = useThree();

  const renderTarget = useFBO(size.width, size.height, { depthBuffer: true });

  const godRaysEffectRaw = useMemo(() => {
    return new GodRaysEffectRaw(camera, sunMesh, defaultGodRaysEffectRawParams);
  }, [scene, camera, params]);

  const smaaEffect = new SMAAEffect(
    new SMAAImageGenerator(),
    new SMAAImageGenerator(),
    SMAAPreset.HIGH,
    EdgeDetectionMode.DEPTH,
  );

  const effectComposer = useMemo(() => {
    const effectComposer = new EffectComposer(gl, renderTarget);
    const renderPass = new RenderPass(scene, camera);
    effectComposer.addPass(renderPass);
    effectComposer.addPass(new EffectPass(camera, smaaEffect));
    effectComposer.addPass(new EffectPass(camera, godRaysEffectRaw));

    return effectComposer;
  }, [gl, godRaysEffectRaw, smaaEffect, camera, scene]);

  useEffect(() => {
    effectComposer.setSize(size.width, size.height);
  }, [size]);

  useFrame(() => {
    effectComposer.render(0.02);
  }, renderPriority || defaultRenderPriority);

  return null;
};
