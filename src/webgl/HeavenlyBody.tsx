// HMJ
import * as THREE from 'three';
import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree, useLoader } from '@react-three/fiber';
// import { /*useAnimations,*/ useFBO, useGLTF } from '@react-three/drei';
import glsl from 'babel-plugin-glsl/macro';
import { TextureLoader } from 'three/src/loaders/TextureLoader';

type SphereMeshResolution = 1 | 2 | 4 | 8 | 16 | 32 | 64 | 128 | 256;
const SPHERE_MESH_RESOLUTION: SphereMeshResolution = 128;

/**
 * ## Rendering Pipeline: webgl + three.js ###
 *
 * (note: I've added in the gltf version of the glb file in the /public directory, in order that you can
 * more easily see the different buffers contained within the model)
 *
 * GLB model includees a set of meshes. Meshes are made up of triangular faces, which in turn are made up of
 * vertices and edges. Often meshes are represented as buffers of vertices, edges, and indices (which index whhich
 * vertex/edge belongs to which face).
 * The vertices often have data attached to them, known as vertex attributes. Your glb model has 3 vertex attributes:
 * - POSITION (i.e. the position of the vertex in so-called 'model space'),
 * - NORMAL (a 3-vector representing the direction of the 'normal' on the geoemtry at that vertex),
 * - TEXCOORD_0 (a uv coordinate, which helps to map 2-d textures onto the surface of the geometry)
 *
 * In the actual vertex shader, these attributes will look like this:
 * 	 💉 injected attributes:  ✅
 * attribute vec3 position; //POSITION ✅
 * attribute vec3 normal; //NORMAL ✅
 * attribute vec3 tangent; //TANGENT
 * attribute vec2 uv; //TEXCOORD_0 ✅
 * attribute vec2 uv2; //TEXCOORD_1
 * attribute vec4 color; //COLOR_0
 * attribute vec3 skinWeight; //WEIGHTS_
 * attribute vec3 skinIndex; //JOINTS_0
 *
 * Three.js is just a wrapper around webgl, which is an api for dealing with the graphic piepline at a low level. Meshes
 * are sent through a graphics pipeline, and decomposed into their constituent faces. They generally go through a so-called
 * 'vertex shader', which manipulates the positions of the vertices (i.e. we need to go from the model space coordinate system to
 * the homogenous clip space, which is the final 2d representation you get on the screen). During this process you can write custom
 * shaders to add effects to where the individual vertices of the gometry are position. This is usally achieved by feeding in 'uniforms',
 * which is data passed from the CPU on an often per frame basis (i.e. mouse position, camera position). Three.js already injectes
 * some of theese uniforms for us.
 *
 * Next, the triangles are 'rasterized' into pizels, and sent off to the fragment shader, which colours the 'fragments' of  the triangles
 * We can write a custom fragment shader to influence the colouring.
 *
 * What uniforms should we pass in from the CPU to influence our mesh. Some we already get for free:
 * uniform mat4 modelMatrix; ✅ 			// = object.matrixWorld
 * uniform mat4 modelViewMatrix; ✅ 	// = camera.matrixWorldInverse * object.matrixWorld
 * uniform mat4 projectionMatrix; ✅ 	// = camera.projectionMatrix
 * uniform mat4 viewMatrix; ✅				// = camera.matrixWorldInverse
 * uniform mat3 normalMatrix; ✅			// = inverse transpose of modelViewMatrix
 * uniform vec3 cameraPosition; ✅		// = camera position in world space
 *
 * We probably also want data on
 *  - mouse
 */

//eslint-disable-next-line
const vertexShader = glsl`
  // #define FFT_SIZE

	//This uniform is fed into the GPU via a buffer
	uniform vec2 mouse;
	//Samplers encapsulate the various render states associated with reading textures: coordinate system, addressing mode, and filtering
	//We can create them from within the shader, but easier to just feed it in. 
	uniform sampler2D tDiffuse;
	uniform sampler2D tDisplacement; 
	uniform sampler2D tRareEarthMetals;

	varying vec3 vPosition; 
	varying vec2 vUv; 
	varying vec3 vNormal; 

	 void main()
	 {
		 	//terrain 
			float displacement = texture2D(tDisplacement, uv).r; //Extracting the color information from the image
			float displaceFactor = 0.0001;
			vPosition = position + (displacement * displaceFactor);


			// note: There is a wrapping on the texture, which means when we read from coordinates outside
			// the domain, it wraps back on itself

			vec4 modelPosition = modelMatrix * vec4( vec3(vPosition.x, vPosition.y, vPosition.z), 1.0);
			vec4 viewPosition = viewMatrix * modelPosition;
			vec4 projectionPosition = projectionMatrix * viewPosition;
			gl_Position = projectionPosition;
			// pass vertex attributes to frag shader via varyings:
			vPosition = position; 
			vUv = uv; 
			vNormal = normalize(normalMatrix * normal); 
	}
`;

const fragmentShader = glsl`
// #pragma glslify: blend = require("../../shaders/functions/glsl-blend/add.glsl")
uniform vec2 mouse;
uniform sampler2D tDiffuse;
uniform sampler2D tDisplacement; 
uniform sampler2D tRareEarthMetals;

varying vec3 vPosition; 
varying vec2 vUv; 
varying vec3 vNormal; 


void main()
{
	//atmosphere
	float atmosphereIntensity = pow(0.6 - dot(vNormal, vec3(0., 0., 1.)), 2.0); 
	vec3 atmosphere = vec3(0.3, 0.6, 1.) * pow(atmosphereIntensity, 1.5);  

	vec4 surfaceColor = texture2D( tDiffuse, vec2( vUv.x, vUv.y ) ); 
	
	
  gl_FragColor = vec4(surfaceColor.xyz + atmosphere, 1.);
	// gl_FragColor = vec4(1.0, 0., 0., 1.);

}
`;

// We can represent the visualisation in different ways
//eslint-disable-next-line
type RepresentationADT =
  | { kind: 'copernican' }
  | { kind: 'heliocentric' }
  | { kind: 'flatlander' }
  | { kind: '4D' };

type Url = string;

type HeavenlyBodyPropsType = {
  radius: number;
  position: [number, number, number];
  rotation: [number, number, number];
  diffuse_map: Url;
  displacement_map: Url;
  rare_earth_metals_map: Url;
  gravity_map: Url;
};

const HeavenlyBody = (props: HeavenlyBodyPropsType): React.ReactElement<HeavenlyBodyPropsType> => {
  const [
    diffuse_map_texture,
    displacement_map_texture,
    gravity_map_texture,
    rare_earth_metals_map_texture,
  ] = useLoader(TextureLoader, [
    props.diffuse_map,
    props.displacement_map,
    props.gravity_map,
    props.rare_earth_metals_map,
  ]);

  const { mouse } = useThree();
  const mesh = useRef<THREE.Mesh>(null!);
  const shaderMaterialRef = useRef<THREE.ShaderMaterial>(null!);

  const initialUniforms = useMemo(() => {
    return {
      mouse: { value: mouse },
      tDiffuse: { value: THREE.Texture.DEFAULT_IMAGE },
      tDisplacement: { value: THREE.Texture.DEFAULT_IMAGE },
      tGravity: { value: THREE.Texture.DEFAULT_IMAGE },
      tRareEarthMetals: { value: THREE.Texture.DEFAULT_IMAGE },
    };
  }, []);

  useEffect(() => {
    shaderMaterialRef.current.uniforms.tDiffuse.value = diffuse_map_texture;
    shaderMaterialRef.current.uniforms.tDiffuse.value.needsUpdate = true;
    shaderMaterialRef.current.uniforms.tDisplacement.value = displacement_map_texture;
    shaderMaterialRef.current.uniforms.tDisplacement.value.needsUpdate = true;
    shaderMaterialRef.current.uniforms.tRareEarthMetals.value = rare_earth_metals_map_texture;
    shaderMaterialRef.current.uniforms.tRareEarthMetals.value.needsUpdate = true;
    shaderMaterialRef.current.uniforms.tGravity.value = gravity_map_texture;
    shaderMaterialRef.current.uniforms.tGravity.value.needsUpdate = true;
  }, [
    diffuse_map_texture,
    displacement_map_texture,
    gravity_map_texture,
    rare_earth_metals_map_texture,
  ]);

  useFrame(({ mouse }) => {
    // update our uniforms imperatively
    shaderMaterialRef.current.uniforms.mouse.value = mouse;
    shaderMaterialRef.current.uniforms.mouse.value.needsUpdate = true;
  });

  useFrame((_state, delta) => {
    if (mesh.current && mesh.current.rotation) {
      mesh.current.rotation.x -= (0.01 * Math.PI) / 180;
      mesh.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <mesh ref={mesh} receiveShadow>
      <sphereBufferGeometry
        args={[props.radius, 2 * SPHERE_MESH_RESOLUTION, 1 * SPHERE_MESH_RESOLUTION]}
      />
      <shaderMaterial
        ref={shaderMaterialRef}
        alphaTest={0}
        attach="material"
        // defines={{ }}
        fragmentShader={fragmentShader}
        side={THREE.DoubleSide}
        uniforms={initialUniforms}
        vertexShader={vertexShader}
        depthWrite
        vertexColors
        // needsUpdate={true}
        // uniformsNeedUpdate={true}
      />
    </mesh>
  );
};

export default HeavenlyBody;
