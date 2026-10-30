/**
 * Globe renderer — a holographic earth drawn with three.js.
 *
 * The NASA day/night images are used only as masks (where land is, where city lights are);
 * every colour on screen is ours. Oceans go deep navy, land glows cyan with a bright coastline,
 * a graticule and a slow scanline make it read as a projected control surface rather than a
 * satellite photo. Markers are light pillars with soft expanding rings and a slowly turning
 * wireframe gem, all additive so the globe shows through them.
 *
 * Pointer input first: one finger rotates (with inertia), a tap on a marker selects it. No zoom,
 * so pages keep scrolling normally on touch devices. `three` is imported dynamically by the
 * caller so it never lands in the shared bundle.
 */
import type * as THREE from "three";

type Three = typeof import("three");
export type GlobeTheme = "light" | "dark";

export interface GlobeMarker {
  id: string;
  lat: number;
  lng: number;
  /** hex colour, e.g. 0xffc24a */
  color?: number;
  primary?: boolean;
}

export interface GlobeOptions {
  markers: GlobeMarker[];
  /** idle auto-rotation in degrees per second (0 disables) */
  idleSpin?: number;
  /** initial view */
  lat?: number;
  lng?: number;
  /** zoom relative to "whole sphere fits the canvas" — 1 fits, 1.2 is closer */
  zoom?: number;
  theme?: GlobeTheme;
  reducedMotion?: boolean;
  onSelect?: (id: string) => void;
  onHover?: (id: string | null) => void;
}

export interface GlobeHandle {
  resize: (w: number, h: number) => void;
  /** lat/lng → position in % of the canvas; `visible` is false on the far side */
  project: (lat: number, lng: number) => { left: number; top: number; visible: boolean };
  flyTo: (lat: number, lng: number) => void;
  setTheme: (theme: GlobeTheme) => void;
  setSelected: (id: string | null) => void;
  setPaused: (paused: boolean) => void;
  dispose: () => void;
}

const R = 1;
const DEG = Math.PI / 180;
const LAT_LIMIT = 75;
const FOV = 36;

/** Palette per theme. The sphere itself stays dark in both — a hologram is a dark object that emits light. */
const PALETTE: Record<GlobeTheme, { ocean: number; land: number; coast: number; grid: number; rim: number; atmo: number; lights: number; atmoAlpha: number }> = {
  dark: { ocean: 0x0a1f3d, land: 0x79e6ff, coast: 0xd8f8ff, grid: 0x6fd7ff, rim: 0x5fb8ff, atmo: 0x5ec8ff, lights: 1.0, atmoAlpha: 1.0 },
  light: { ocean: 0x10284f, land: 0x6fdcff, coast: 0xecffff, grid: 0x7fdcff, rim: 0x7f9cff, atmo: 0x86b4ff, lights: 0.8, atmoAlpha: 0.5 }
};

function latLngToVec3(T: Three, lat: number, lng: number, r = R): THREE.Vector3 {
  const phi = (90 - lat) * DEG;
  const theta = (lng + 180) * DEG;
  return new T.Vector3(-(r * Math.sin(phi) * Math.cos(theta)), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta));
}

const SURFACE_VERT = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  void main() {
    vUv = uv;
    vNormal = normalize(mat3(modelMatrix) * normal);
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPos = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

/**
 * Surface: the day image gives a land mask (Blue Marble oceans are blue-dominant, ice is near
 * white) and a brightness term; the night image gives city lights on the dark side. Colour is
 * entirely from uniforms.
 */
const SURFACE_FRAG = /* glsl */ `
  uniform sampler2D uDay;
  uniform sampler2D uNight;
  uniform vec3 uSunDir;
  uniform vec3 uOcean;
  uniform vec3 uLand;
  uniform vec3 uCoast;
  uniform vec3 uGrid;
  uniform vec3 uRim;
  uniform float uTime;
  uniform float uLights;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldPos;

  // thin line repeated every 1/n of x, constant width on screen thanks to fwidth
  float gridLine(float x, float n) {
    float d = abs(fract(x * n - 0.5) - 0.5) / max(fwidth(x * n), 1e-4);
    return 1.0 - min(d, 1.0);
  }

  void main() {
    vec3 n = normalize(vNormal);
    vec3 tex = texture2D(uDay, vUv).rgb;
    float lum = dot(tex, vec3(0.299, 0.587, 0.114));

    // land mask: oceans are blue-dominant in the source image, ice and bright desert are near white
    float land = smoothstep(-0.02, 0.07, tex.r - tex.b);
    land = max(land, smoothstep(0.6, 0.85, lum));

    // flat colours: the image only decides *where*, relief comes from a soft two-tone on land
    vec3 ocean = uOcean * (0.82 + 0.18 * lum);
    vec3 landCol = mix(uLand * 0.6, uCoast * 0.95, smoothstep(0.12, 0.75, lum));
    vec3 col = mix(ocean, landCol, land);

    // coastline — only the land/sea boundary brightens, which is what makes shapes legible
    float coast = land * (1.0 - land) * 4.0;
    col += uCoast * coast * 0.6;

    // graticule every 15 degrees
    float grid = max(gridLine(vUv.x, 24.0), gridLine(vUv.y, 12.0));
    col += uGrid * grid * 0.22;

    // one slow scanline drifting down — any faster and it gets busy
    float scan = smoothstep(0.985, 1.0, sin(vUv.y * 160.0 - uTime * 0.5) * 0.5 + 0.5);
    col += uGrid * scan * 0.14;

    // night side keeps only the city lights
    float sun = dot(n, normalize(uSunDir));
    float day = smoothstep(-0.25, 0.3, sun);
    vec3 lights = texture2D(uNight, vUv).rgb;
    lights = lights * lights * 2.4 * uLights;
    col = mix(col * 0.35 + lights * vec3(0.75, 0.92, 1.0), col, day);

    // fresnel rim — the hologram edge
    vec3 viewDir = normalize(cameraPosition - vWorldPos);
    float rim = pow(1.0 - max(dot(n, viewDir), 0.0), 2.4);
    col += uRim * rim * 0.8;

    gl_FragColor = vec4(col, 1.0);
  }
`;

const ATMO_VERT = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  void main() {
    vNormal = normalize(mat3(modelMatrix) * normal);
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPos = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

const ATMO_FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform float uAlpha;
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  void main() {
    vec3 viewDir = normalize(cameraPosition - vWorldPos);
    float f = pow(max(1.0 - abs(dot(viewDir, normalize(vNormal))), 0.0), 3.0);
    gl_FragColor = vec4(uColor, f * uAlpha);
  }
`;

/** Expanding ring: a square plane whose alpha is a soft band by distance from centre, fading as it grows. */
const RING_FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform float uK;
  varying vec2 vUv;
  void main() {
    float r = length(vUv - 0.5) * 2.0;
    float band = smoothstep(0.55, 0.88, r) * (1.0 - smoothstep(0.88, 1.0, r));
    float core = (1.0 - smoothstep(0.0, 0.7, r)) * 0.14;
    float fade = (1.0 - uK) * (1.0 - uK);
    gl_FragColor = vec4(uColor, (band * 0.9 + core) * fade);
  }
`;

/** Light pillar: fades toward the top so it never looks cut off. */
const BEAM_FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform float uA;
  varying vec2 vUv;
  void main() {
    float a = pow(1.0 - vUv.y, 1.7) * uA;
    gl_FragColor = vec4(uColor, a);
  }
`;

const UV_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export async function mountGlobe(canvas: HTMLCanvasElement, opts: GlobeOptions): Promise<GlobeHandle> {
  const T: Three = await import("three");

  const renderer = new T.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  renderer.outputColorSpace = T.SRGBColorSpace;
  renderer.setClearColor(0x000000, 0);

  const scene = new T.Scene();
  const camera = new T.PerspectiveCamera(FOV, 1, 0.1, 80);
  const zoom = opts.zoom ?? 1;
  /** distance at which a sphere of radius ~1.1 (with halo) exactly fits the shorter side */
  const FIT_DIST = 1.12 / Math.tan((FOV / 2) * DEG);
  camera.position.set(0, 0, FIT_DIST / zoom);

  // --- textures (masks only; two JPEGs, loaded in parallel)
  const loader = new T.TextureLoader();
  const load = (url: string) => new Promise<THREE.Texture>((res, rej) => loader.load(url, (t) => res(t), undefined, rej));
  const [dayMap, nightMap] = await Promise.all([load("/globe/earth-day.jpg"), load("/globe/earth-night.jpg")]);
  for (const t of [dayMap, nightMap]) {
    t.colorSpace = T.SRGBColorSpace;
    t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  }

  const world = new T.Group();
  scene.add(world);

  let theme: GlobeTheme = opts.theme ?? "light";
  const pal = () => PALETTE[theme];

  const surfaceMat = new T.ShaderMaterial({
    uniforms: {
      uDay: { value: dayMap },
      uNight: { value: nightMap },
      // fixed sun: Asia in daylight, Europe at dusk, Americas showing their lights
      uSunDir: { value: new T.Vector3(-0.55, 0.3, 0.78).normalize() },
      uOcean: { value: new T.Color(pal().ocean) },
      uLand: { value: new T.Color(pal().land) },
      uCoast: { value: new T.Color(pal().coast) },
      uGrid: { value: new T.Color(pal().grid) },
      uRim: { value: new T.Color(pal().rim) },
      uTime: { value: 0 },
      uLights: { value: pal().lights }
    },
    vertexShader: SURFACE_VERT,
    fragmentShader: SURFACE_FRAG
  });
  world.add(new T.Mesh(new T.SphereGeometry(R, 96, 64), surfaceMat));

  const atmoMat = new T.ShaderMaterial({
    uniforms: { uColor: { value: new T.Color(pal().atmo) }, uAlpha: { value: pal().atmoAlpha } },
    vertexShader: ATMO_VERT,
    fragmentShader: ATMO_FRAG,
    transparent: true,
    side: T.BackSide,
    depthWrite: false,
    blending: theme === "dark" ? T.AdditiveBlending : T.NormalBlending
  });
  scene.add(new T.Mesh(new T.SphereGeometry(R * 1.06, 64, 48), atmoMat));

  // stars — only make sense on a dark page; hidden in light theme
  const starCount = 900;
  const starPos = new Float32Array(starCount * 3);
  const dir = new T.Vector3();
  for (let i = 0; i < starCount; i++) {
    dir.randomDirection().multiplyScalar(20 + Math.random() * 12);
    starPos.set([dir.x, dir.y, dir.z], i * 3);
  }
  const starGeo = new T.BufferGeometry();
  starGeo.setAttribute("position", new T.BufferAttribute(starPos, 3));
  const stars = new T.Points(
    starGeo,
    new T.PointsMaterial({ color: 0x9fd8ff, size: 0.045, sizeAttenuation: true, transparent: true, opacity: 0.6, depthWrite: false })
  );
  stars.visible = theme === "dark";
  scene.add(stars);

  // --- markers
  const markerGroup = new T.Group();
  world.add(markerGroup);
  const hitMeshes: THREE.Mesh[] = [];
  const glowMats: THREE.Material[] = [];
  const blendFor = (t: GlobeTheme) => (t === "dark" ? T.AdditiveBlending : T.NormalBlending);

  interface Pin {
    id: string;
    primary: boolean;
    rings: { mesh: THREE.Mesh; mat: THREE.ShaderMaterial; phase: number }[];
    gem: THREE.Mesh;
    beamMat: THREE.ShaderMaterial;
  }
  const pins: Pin[] = [];
  const up0 = new T.Vector3(0, 1, 0);

  for (const m of opts.markers) {
    const color = m.color ?? (m.primary ? 0xffc24a : 0xc9d4ff);
    const up = latLngToVec3(T, m.lat, m.lng, 1).normalize();
    const g = new T.Group();
    g.position.copy(up).multiplyScalar(R * 1.002);
    g.quaternion.setFromUnitVectors(up0, up);

    const beamH = m.primary ? 0.19 : 0.14;
    const beamMat = new T.ShaderMaterial({
      uniforms: { uColor: { value: new T.Color(color) }, uA: { value: 0.75 } },
      vertexShader: UV_VERT,
      fragmentShader: BEAM_FRAG,
      transparent: true,
      depthWrite: false,
      side: T.DoubleSide,
      blending: blendFor(theme)
    });
    const beam = new T.Mesh(new T.CylinderGeometry(0.007, 0.007, beamH, 10, 1, true), beamMat);
    beam.position.y = beamH / 2;
    g.add(beam);
    glowMats.push(beamMat);

    const coreMat = new T.MeshBasicMaterial({ color, transparent: true, opacity: 0.95, depthWrite: false, blending: blendFor(theme) });
    const core = new T.Mesh(new T.CircleGeometry(m.primary ? 0.014 : 0.011, 24), coreMat);
    core.rotation.x = -Math.PI / 2;
    core.position.y = 0.0015;
    g.add(core);
    glowMats.push(coreMat);

    const rings = [0, 0.5].map((phase) => {
      const mat = new T.ShaderMaterial({
        uniforms: { uColor: { value: new T.Color(color) }, uK: { value: 0 } },
        vertexShader: UV_VERT,
        fragmentShader: RING_FRAG,
        transparent: true,
        depthWrite: false,
        side: T.DoubleSide,
        blending: blendFor(theme)
      });
      const mesh = new T.Mesh(new T.PlaneGeometry(0.07, 0.07), mat);
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.y = 0.0025;
      g.add(mesh);
      glowMats.push(mat);
      return { mesh, mat, phase };
    });

    const gemMat = new T.MeshBasicMaterial({ color, transparent: true, opacity: 0.9, wireframe: true, depthWrite: false, blending: blendFor(theme) });
    const gem = new T.Mesh(new T.OctahedronGeometry(m.primary ? 0.02 : 0.015), gemMat);
    gem.position.y = beamH;
    g.add(gem);
    glowMats.push(gemMat);

    const hit = new T.Mesh(new T.SphereGeometry(0.075, 8, 8), new T.MeshBasicMaterial({ visible: false }));
    hit.userData.id = m.id;
    g.add(hit);
    hitMeshes.push(hit);

    markerGroup.add(g);
    pins.push({ id: m.id, primary: !!m.primary, rings, gem, beamMat });
  }

  // --- orientation: yaw/pitch on the world group
  const prefersReduced = opts.reducedMotion ?? false;
  let yaw = -(opts.lng ?? 127) * DEG - Math.PI / 2;
  let pitch = (opts.lat ?? 36) * DEG * 0.6;
  let vYaw = 0;
  let vPitch = 0;
  const idleSpin = prefersReduced ? 0 : (opts.idleSpin ?? 1.4) * DEG;
  let lastInteraction = -Infinity;
  let target: { yaw: number; pitch: number; t0: number } | null = null;
  let selectedId: string | null = null;

  const applyRotation = () => {
    pitch = Math.max(-LAT_LIMIT * DEG * 0.75, Math.min(LAT_LIMIT * DEG * 0.75, pitch));
    world.rotation.set(pitch, yaw, 0, "XYZ");
  };
  applyRotation();

  // --- input: down on the canvas, move/up on the window so a fast drag never escapes
  let width = canvas.clientWidth || 1;
  let height = canvas.clientHeight || 1;
  const raycaster = new T.Raycaster();
  const ndc = new T.Vector2();
  let dragging = false;
  let moved = 0;
  let lastX = 0;
  let lastY = 0;
  let lastT = 0;
  let hoverId: string | null = null;

  const pick = (x: number, y: number): string | null => {
    ndc.set((x / width) * 2 - 1, -(y / height) * 2 + 1);
    raycaster.setFromCamera(ndc, camera);
    const hits = raycaster.intersectObjects(hitMeshes, false);
    if (!hits.length) return null;
    const p = hits[0].object.getWorldPosition(new T.Vector3());
    const toCam = camera.position.clone().sub(p);
    if (p.dot(toCam) < 0) return null; // far side
    return (hits[0].object.userData.id as string) ?? null;
  };

  const onPointerDown = (e: PointerEvent) => {
    if (e.button !== undefined && e.button !== 0) return;
    dragging = true;
    moved = 0;
    lastX = e.clientX;
    lastY = e.clientY;
    lastT = performance.now();
    vYaw = 0;
    vPitch = 0;
    target = null;
    lastInteraction = performance.now();
    canvas.setPointerCapture?.(e.pointerId);
    window.addEventListener("pointermove", onWindowMove);
    window.addEventListener("pointerup", onWindowUp);
    window.addEventListener("pointercancel", onWindowUp);
  };
  const onWindowMove = (e: PointerEvent) => {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    const now = performance.now();
    const dt = Math.max(8, now - lastT);
    moved += Math.abs(dx) + Math.abs(dy);
    // half the canvas width ≈ 150° regardless of screen size
    const k = 2.6 / Math.max(240, width);
    yaw += dx * k;
    pitch += dy * k;
    vYaw = prefersReduced ? 0 : (dx * k) / dt;
    vPitch = prefersReduced ? 0 : (dy * k) / dt;
    lastX = e.clientX;
    lastY = e.clientY;
    lastT = now;
    lastInteraction = now;
    applyRotation();
  };
  const onWindowUp = (e: PointerEvent) => {
    if (!dragging) return;
    dragging = false;
    window.removeEventListener("pointermove", onWindowMove);
    window.removeEventListener("pointerup", onWindowUp);
    window.removeEventListener("pointercancel", onWindowUp);
    canvas.releasePointerCapture?.(e.pointerId);
    lastInteraction = performance.now();
    if (moved < 6) {
      const rect = canvas.getBoundingClientRect();
      const id = pick(e.clientX - rect.left, e.clientY - rect.top);
      if (id) opts.onSelect?.(id);
    }
  };
  const onHoverMove = (e: PointerEvent) => {
    if (dragging || e.pointerType === "touch") return;
    const rect = canvas.getBoundingClientRect();
    const id = pick(e.clientX - rect.left, e.clientY - rect.top);
    if (id !== hoverId) {
      hoverId = id;
      canvas.style.cursor = id ? "pointer" : "grab";
      opts.onHover?.(id);
    }
  };
  const onLeave = () => {
    if (hoverId) {
      hoverId = null;
      canvas.style.cursor = "grab";
      opts.onHover?.(null);
    }
  };
  canvas.style.cursor = "grab";
  canvas.style.touchAction = "pan-y";
  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointermove", onHoverMove);
  canvas.addEventListener("pointerleave", onLeave);

  // --- loop
  let paused = false;
  let raf = 0;
  let prev = performance.now();
  const RING_PERIOD = 2800;
  const tick = () => {
    raf = requestAnimationFrame(tick);
    if (paused) return;
    const now = performance.now();
    const dt = Math.min(64, now - prev);
    prev = now;

    if (target) {
      const k = Math.min(1, (now - target.t0) / 900);
      const e = 1 - Math.pow(1 - k, 3);
      yaw += (target.yaw - yaw) * e * 0.35;
      pitch += (target.pitch - pitch) * e * 0.35;
      if (k >= 1) target = null;
    } else if (!dragging) {
      yaw += vYaw * dt;
      pitch += vPitch * dt;
      const fr = Math.pow(0.92, dt / 16);
      vYaw *= fr;
      vPitch *= fr;
      if (idleSpin && now - lastInteraction > 2500) {
        yaw += (idleSpin * dt) / 1000;
        pitch += (0 - pitch) * 0.002 * (dt / 16);
      }
    }
    applyRotation();

    surfaceMat.uniforms.uTime.value = now / 1000;
    if (stars.visible) stars.rotation.y += dt * 0.000004;

    for (const p of pins) {
      const sel = p.id === selectedId;
      for (const r of p.rings) {
        const k = (now / RING_PERIOD + r.phase) % 1;
        const e = 1 - Math.pow(1 - k, 2.2);
        r.mesh.scale.setScalar(0.5 + e * (p.primary || sel ? 2.6 : 2.0));
        r.mat.uniforms.uK.value = k;
      }
      if (!prefersReduced) {
        p.gem.rotation.y += dt * 0.0006;
        p.gem.rotation.x = Math.sin(now / 1400) * 0.18;
      }
      const gs = sel ? 1.7 : 1;
      if (p.gem.scale.x !== gs) p.gem.scale.setScalar(gs);
      p.beamMat.uniforms.uA.value = sel ? 1.0 : 0.75;
    }

    renderer.render(scene, camera);
  };
  raf = requestAnimationFrame(tick);

  const resize = (w: number, h: number) => {
    width = Math.max(1, w);
    height = Math.max(1, h);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    // the shorter side limits the view: if the canvas is narrower than tall, back off by the aspect
    camera.position.z = FIT_DIST / Math.min(1, camera.aspect) / zoom;
    camera.updateProjectionMatrix();
  };
  resize(width, height);

  const tmp = new T.Vector3();
  const project = (lat: number, lng: number) => {
    tmp.copy(latLngToVec3(T, lat, lng, R * 1.004));
    world.localToWorld(tmp);
    const toCam = camera.position.clone().sub(tmp);
    const visible = tmp.dot(toCam) > 0.05;
    tmp.project(camera);
    return { left: (tmp.x * 0.5 + 0.5) * 100, top: (-tmp.y * 0.5 + 0.5) * 100, visible };
  };

  const flyTo = (lat: number, lng: number) => {
    const ty = -lng * DEG - Math.PI / 2;
    const twoPi = Math.PI * 2;
    const dy = ((((ty - yaw + Math.PI) % twoPi) + twoPi) % twoPi) - Math.PI; // shortest way round
    target = { yaw: yaw + dy, pitch: lat * DEG * 0.6, t0: performance.now() };
    lastInteraction = performance.now();
  };

  const setTheme = (t: GlobeTheme) => {
    if (t === theme) return;
    theme = t;
    const p = PALETTE[t];
    (surfaceMat.uniforms.uOcean.value as THREE.Color).setHex(p.ocean);
    (surfaceMat.uniforms.uLand.value as THREE.Color).setHex(p.land);
    (surfaceMat.uniforms.uCoast.value as THREE.Color).setHex(p.coast);
    (surfaceMat.uniforms.uGrid.value as THREE.Color).setHex(p.grid);
    (surfaceMat.uniforms.uRim.value as THREE.Color).setHex(p.rim);
    surfaceMat.uniforms.uLights.value = p.lights;
    (atmoMat.uniforms.uColor.value as THREE.Color).setHex(p.atmo);
    atmoMat.uniforms.uAlpha.value = p.atmoAlpha;
    atmoMat.blending = blendFor(t);
    atmoMat.needsUpdate = true;
    for (const m of glowMats) {
      m.blending = blendFor(t);
      m.needsUpdate = true;
    }
    stars.visible = t === "dark";
  };

  const dispose = () => {
    cancelAnimationFrame(raf);
    canvas.removeEventListener("pointerdown", onPointerDown);
    canvas.removeEventListener("pointermove", onHoverMove);
    canvas.removeEventListener("pointerleave", onLeave);
    window.removeEventListener("pointermove", onWindowMove);
    window.removeEventListener("pointerup", onWindowUp);
    window.removeEventListener("pointercancel", onWindowUp);
    scene.traverse((o) => {
      const mesh = o as THREE.Mesh;
      mesh.geometry?.dispose?.();
      const mat = mesh.material as THREE.Material | THREE.Material[] | undefined;
      if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
      else mat?.dispose?.();
    });
    dayMap.dispose();
    nightMap.dispose();
    renderer.dispose();
  };

  return {
    resize,
    project,
    flyTo,
    setTheme,
    setSelected: (id) => {
      selectedId = id;
    },
    setPaused: (p) => {
      paused = p;
      if (!p) prev = performance.now();
    },
    dispose
  };
}
