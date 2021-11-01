[![Netlify Status](https://api.netlify.com/api/v1/badges/a202bf40-d927-4dac-af06-c8c16834815d/deploy-status)](https://app.netlify.com/sites/serene-khorana-e5a88c/deploys)
[site](spacemaker-ai.netlify.app)

# solar-system-webgl

- [] create 'heavenly body' component.

  - [] geometry: plain three.js sphereBufferGeometry. No need to glb model as we can assume the planets to all be spherical.
  - [] can modulate geometry (i.e. for mountains) using heightmap textures in the vertex shader
  - [] use diffuse_map, normal_map etc. in the fragment shader to add colour to the mesh
  - [] there are several survey related scans (of mineral deposits etc.), which we could include
  - [] add atmosphere shader

- [] Sun :

  - [] associate the sun with a light source in order that one side of the planet is in darkness
  - [] simulaste solar flares? (use shader or animation baked in glb model?)

- [] Satelite/rocket

  - [] glb file

- [] physics :
  - [] use rust .wasm to simulate the physics, and update the positions every frame ?
  - [] newtonian mechanics or general relativity ?

https://map.half-earthproject.org/
