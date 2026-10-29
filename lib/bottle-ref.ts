import * as THREE from 'three'

// Shared, module-level handles so the persistent 3D scene (R3F Canvas) and the
// scroll orchestration (GSAP ScrollTrigger) can animate the same bottle object
// without passing refs through every section component.
export const bottleWorld = {
  group: null as THREE.Group | null,
  mesh: null as THREE.Mesh | null,
}
