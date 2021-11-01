// HMJ
import { useEffect, useMemo, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import {
  OutlineEffect as OutlineEffectRaw,
  EffectComposer,
  RenderPass,
  EffectPass,
} from 'postprocessing';
import { useFBO } from '@react-three/drei';
import { Object3D } from 'three';

export type UseOutlineEffectParams = ConstructorParameters<typeof OutlineEffectRaw>[2];

export const defaultOutlineEffectParams = {
  edgeStrength: 8,
  pulseSpeed: 0.0,
  visibleEdgeColor: 'yellow',
  hiddenEdgeColor: '#fff',
  blur: 0,
};

const defaultRenderPriority = 1;

// Custom hook

type OutlineEffectPropsType = {
  selection: Array<Object3D>;
  params?: UseOutlineEffectParams;
  renderPriority?: number;
};
export const OutlinEffect = ({
  selection,
  params,
  renderPriority,
}: OutlineEffectPropsType): null => {
  const { gl, camera, size, scene } = useThree();

  const renderTarget = useFBO(size.width, size.height, { depthBuffer: true });

  const previousSelection = useRef<Array<Object3D>>([]);

  const outlineEffect = useMemo(() => {
    return new OutlineEffectRaw(scene, camera, params || defaultOutlineEffectParams);
  }, [scene, camera, params]);

  const effectComposer = useMemo(() => {
    const effectComposer = new EffectComposer(gl, renderTarget);
    const renderPass = new RenderPass(scene, camera);
    effectComposer.addPass(renderPass);
    effectComposer.addPass(new EffectPass(camera, outlineEffect));

    return effectComposer;
  }, [gl, outlineEffect, camera, scene]);

  useEffect(() => {
    // Optimize for continuously empty selections
    if (selection.length === 0 && previousSelection.current.length === 0) {
      return;
    }
    previousSelection.current = selection;
    outlineEffect.clearSelection();
    outlineEffect.setSelection(selection);
  }, [outlineEffect, selection]);

  useEffect(() => {
    effectComposer.setSize(size.width, size.height);
  }, [size]);

  useFrame(() => {
    effectComposer.render(0.02);
  }, renderPriority || defaultRenderPriority);

  return null;
};
