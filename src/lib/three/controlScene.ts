/**
 * Control scene — one city block as a projected control surface, drawn with three.js.
 *
 * No textures: a floor grid, two crossing roads, a traffic camera on a pole with its field of
 * view, a control console, a robot dock and one robot. The scene replays the loop every control
 * screen I have built around: an incident is detected on the road, the operator approves, a
 * robot is dispatched, resolves it and returns. Each step lights a different part of the scene
 * and the wrapper pins an HTML chip to the step's anchor through `project()`.
 *
 * Pointer input: a tap advances to the next step, a drag turns the block (with inertia), and the
 * view drifts back to its home angle when left alone. No zoom so touch pages keep scrolling.
 * `three` is imported dynamically by the caller so it never lands in the shared bundle.
 */
import type * as THREE from "three";

type Three = typeof import("three");
export type SceneTheme = "light" | "dark";

export const STAGES = ["detect", "approve", "dispatch", "return"] as const;
export type Stage = (typeof STAGES)[number];

export interface SceneOptions {
  theme?: SceneTheme;
  reducedMotion?: boolean;
  /** ms each step stays before the loop moves on (dispatch/return follow the robot instead) */
  holdMs?: number;
  onStage?: (stage: Stage, index: number) => void;
}

export interface SceneHandle {
  resize: (w: number, h: number) => void;
  /** anchor of a step → position in % of the canvas */
  project: (stage: Stage) => { left: number; top: number };
  setStage: (index: number) => void;
  next: () => void;
  setTheme: (theme: SceneTheme) => void;
  setPaused: (paused: boolean) => void;
  dispose: () => void;
}

const FOV = 30;
const PITCH = 0.58; // camera elevation in radians
const DIST = 12.0;
const ROAD_W = 0.5; // half width
const GRID = 3.5; // half extent of the floor
const TRAVEL_MS = 3200;

/** Palette per theme. Dark adds light onto the page; light draws solid ink so it survives a white background. */
const PALETTE: Record<SceneTheme, { grid: number; road: number; mark: number; signal: number; warn: number; robot: number; alpha: number }> = {
  dark: { grid: 0x6fd7ff, road: 0x9fe8ff, mark: 0xd8f8ff, signal: 0x79e6ff, warn: 0xffc24a, robot: 0xffffff, alpha: 1 },
  light: { grid: 0x4c5ad6, road: 0x2f3fb8, mark: 0x1c2a8c, signal: 0x0ea5c4, warn: 0xd98a00, robot: 0x1c2a8c, alpha: 0.9 }
};

/** world anchors (x, y, z) */
const CAMERA_POS: [number, number, number] = [1.55, 0, -1.55];
const CAMERA_H = 1.7;
const TARGET: [number, number, number] = [2.1, 0.02, 0.22];
const CONSOLE_POS: [number, number, number] = [-2.6, 0, 1.7];
const DOCK: [number, number, number] = [-1.45, 0.02, 2.55];
/** dock → vertical road → horizontal road → target */
const PATH: [number, number, number][] = [DOCK, [-0.25, 0.02, 2.55], [-0.25, 0.02, 0.22], TARGET];

export async function mountControlScene(canvas: HTMLCanvasElement, opts: SceneOptions): Promise<SceneHandle> {
  const T: Three = await import("three");

  const renderer = new T.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  renderer.outputColorSpace = T.SRGBColorSpace;
  renderer.setClearColor(0x000000, 0);

  const scene = new T.Scene();
  const camera = new T.PerspectiveCamera(FOV, 1, 0.1, 60);
  const lookAt = new T.Vector3(0.1, 0.05, 0.1);

  const prefersReduced = !!opts.reducedMotion;
  const holdMs = opts.holdMs ?? 2200;
  let theme: SceneTheme = opts.theme ?? "light";
  const pal = () => PALETTE[theme];
  const blendFor = (t: SceneTheme) => (t === "dark" ? T.AdditiveBlending : T.NormalBlending);

  const world = new T.Group();
  scene.add(world);

  // --- materials: every drawn thing is a line or a flat additive surface
  const lineMats: { mat: THREE.LineBasicMaterial | THREE.LineDashedMaterial; key: keyof typeof PALETTE.dark; base: number }[] = [];
  const line = (key: keyof typeof PALETTE.dark, opacity: number, dashed = false) => {
    const mat = dashed
      ? new T.LineDashedMaterial({ color: pal()[key] as number, transparent: true, opacity, dashSize: 0.22, gapSize: 0.16 })
      : new T.LineBasicMaterial({ color: pal()[key] as number, transparent: true, opacity });
    mat.blending = blendFor(theme);
    mat.depthWrite = false;
    lineMats.push({ mat, key, base: opacity });
    return mat;
  };
  const meshMats: { mat: THREE.MeshBasicMaterial; key: keyof typeof PALETTE.dark; base: number }[] = [];
  const flat = (key: keyof typeof PALETTE.dark, opacity: number, side: THREE.Side = T.DoubleSide) => {
    const mat = new T.MeshBasicMaterial({ color: pal()[key] as number, transparent: true, opacity, side, depthWrite: false });
    mat.blending = blendFor(theme);
    meshMats.push({ mat, key, base: opacity });
    return mat;
  };
  const segs = (pts: number[], mat: THREE.Material) => {
    const g = new T.BufferGeometry();
    g.setAttribute("position", new T.Float32BufferAttribute(pts, 3));
    const l = new T.LineSegments(g, mat);
    return l;
  };
  const strip = (pts: [number, number, number][], mat: THREE.Material, dashed = false) => {
    const g = new T.BufferGeometry().setFromPoints(pts.map((p) => new T.Vector3(...p)));
    const l = new T.Line(g, mat);
    if (dashed) l.computeLineDistances();
    return l;
  };

  // --- floor grid (roads cut out of it)
  {
    const pts: number[] = [];
    const step = 0.5;
    for (let i = -GRID; i <= GRID + 1e-6; i += step) {
      const onRoad = Math.abs(i) <= ROAD_W + 1e-6;
      if (!onRoad) {
        pts.push(-GRID, 0, i, -ROAD_W, 0, i, ROAD_W, 0, i, GRID, 0, i);
        pts.push(i, 0, -GRID, i, 0, -ROAD_W, i, 0, ROAD_W, i, 0, GRID);
      }
    }
    world.add(segs(pts, line("grid", 0.16)));
    // outer frame
    world.add(strip([[-GRID, 0, -GRID], [GRID, 0, -GRID], [GRID, 0, GRID], [-GRID, 0, GRID], [-GRID, 0, -GRID]], line("grid", 0.35)));
  }

  // --- roads: kerb lines plus a dashed centre line
  {
    const kerb = line("road", 0.7);
    const w = ROAD_W;
    const pts: number[] = [];
    // horizontal road (along x) kerbs, broken at the junction
    pts.push(-GRID, 0, -w, -w, 0, -w, w, 0, -w, GRID, 0, -w);
    pts.push(-GRID, 0, w, -w, 0, w, w, 0, w, GRID, 0, w);
    // vertical road (along z)
    pts.push(-w, 0, -GRID, -w, 0, -w, -w, 0, w, -w, 0, GRID);
    pts.push(w, 0, -GRID, w, 0, -w, w, 0, w, w, 0, GRID);
    world.add(segs(pts, kerb));
    const centre = line("road", 0.35, true);
    world.add(strip([[-GRID, 0.005, 0], [GRID, 0.005, 0]], centre, true));
    world.add(strip([[0, 0.005, -GRID], [0, 0.005, GRID]], centre, true));
    // crossing bars at the junction
    const cross = line("road", 0.3);
    const bars: number[] = [];
    for (let i = -0.35; i <= 0.36; i += 0.14) {
      bars.push(i, 0.004, w + 0.05, i, 0.004, w + 0.3);
      bars.push(i, 0.004, -w - 0.05, i, 0.004, -w - 0.3);
    }
    world.add(segs(bars, cross));
  }

  // --- traffic camera: pole, head, field of view towards the target
  const camHead = new T.Vector3(CAMERA_POS[0], CAMERA_H, CAMERA_POS[2]);
  const fovMat = flat("signal", 0.08);
  {
    const [x, , z] = CAMERA_POS;
    world.add(strip([[x, 0, z], [x, CAMERA_H, z]], line("mark", 0.8)));
    world.add(strip([[x, CAMERA_H, z], [x - 0.22, CAMERA_H - 0.06, z + 0.22]], line("mark", 0.8)));
    const head = new T.LineSegments(new T.EdgesGeometry(new T.BoxGeometry(0.16, 0.1, 0.26)), line("mark", 0.95));
    head.position.set(x - 0.22, CAMERA_H - 0.08, z + 0.22);
    head.lookAt(TARGET[0], 0, TARGET[2]);
    world.add(head);
    // view cone: a fan from the head to a patch of road around the target
    const apex = new T.Vector3(x - 0.22, CAMERA_H - 0.08, z + 0.22);
    const tx = TARGET[0];
    const tz = TARGET[2];
    const patch = [new T.Vector3(tx - 0.9, 0.01, tz - 0.55), new T.Vector3(tx + 0.9, 0.01, tz - 0.55), new T.Vector3(tx + 0.9, 0.01, tz + 0.55), new T.Vector3(tx - 0.9, 0.01, tz + 0.55)];
    const g = new T.BufferGeometry();
    const v: number[] = [];
    for (let i = 0; i < 4; i++) {
      const a = patch[i];
      const b = patch[(i + 1) % 4];
      v.push(apex.x, apex.y, apex.z, a.x, a.y, a.z, b.x, b.y, b.z);
    }
    g.setAttribute("position", new T.Float32BufferAttribute(v, 3));
    world.add(new T.Mesh(g, fovMat));
    const edge = line("signal", 0.35);
    const ept: number[] = [];
    for (const p of patch) ept.push(apex.x, apex.y, apex.z, p.x, p.y, p.z);
    ept.push(patch[0].x, patch[0].y, patch[0].z, patch[1].x, patch[1].y, patch[1].z);
    ept.push(patch[1].x, patch[1].y, patch[1].z, patch[2].x, patch[2].y, patch[2].z);
    ept.push(patch[2].x, patch[2].y, patch[2].z, patch[3].x, patch[3].y, patch[3].z);
    ept.push(patch[3].x, patch[3].y, patch[3].z, patch[0].x, patch[0].y, patch[0].z);
    world.add(segs(ept, edge));
  }

  // --- incident on the road: a marker with expanding rings
  const target = new T.Group();
  target.position.set(...TARGET);
  world.add(target);
  const warnMat = flat("warn", 0.9);
  const carMat = line("warn", 0.9);
  {
    const car = new T.LineSegments(new T.EdgesGeometry(new T.BoxGeometry(0.46, 0.16, 0.24)), carMat);
    car.position.y = 0.08;
    target.add(car);
  }
  const rings: { mesh: THREE.Mesh; mat: THREE.MeshBasicMaterial; phase: number }[] = [];
  for (let i = 0; i < 2; i++) {
    const mat = flat("warn", 0.6);
    const mesh = new T.Mesh(new T.RingGeometry(0.42, 0.46, 48), mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = 0.012;
    target.add(mesh);
    rings.push({ mesh, mat, phase: i / 2 });
  }

  // --- console (control room) and dock
  const consolePos = new T.Vector3(...CONSOLE_POS);
  {
    const box = new T.LineSegments(new T.EdgesGeometry(new T.BoxGeometry(0.9, 0.5, 0.6)), line("mark", 0.85));
    box.position.set(consolePos.x, 0.25, consolePos.z);
    world.add(box);
    // screen glyph on its front face
    const scr = new T.Mesh(new T.PlaneGeometry(0.5, 0.22), flat("signal", 0.35, T.DoubleSide));
    scr.position.set(consolePos.x + 0.452, 0.3, consolePos.z);
    scr.rotation.y = Math.PI / 2;
    world.add(scr);
    const dock = new T.Mesh(new T.RingGeometry(0.32, 0.35, 40), flat("signal", 0.5));
    dock.rotation.x = -Math.PI / 2;
    dock.position.set(DOCK[0], 0.01, DOCK[2]);
    world.add(dock);
  }

  // --- data links: camera → console, console → dock, each with a travelling pulse
  const arc = (a: THREE.Vector3, b: THREE.Vector3, lift: number) => {
    const mid = a.clone().add(b).multiplyScalar(0.5);
    mid.y += lift;
    return new T.QuadraticBezierCurve3(a, mid, b);
  };
  const linkA = arc(camHead.clone(), consolePos.clone().setY(0.5), 1.4);
  const linkB = arc(consolePos.clone().setY(0.5), new T.Vector3(DOCK[0], 0.3, DOCK[2]), 0.5);
  const linkMat = line("signal", 0.25);
  for (const c of [linkA, linkB]) world.add(new T.Line(new T.BufferGeometry().setFromPoints(c.getPoints(40)), linkMat));
  const pulseMat = flat("signal", 1);
  const pulseGeo = new T.SphereGeometry(0.05, 10, 10);
  const pulses = [linkA, linkB].map((c) => {
    const m = new T.Mesh(pulseGeo, pulseMat);
    m.visible = false;
    world.add(m);
    return { mesh: m, curve: c };
  });

  // --- robot
  const robot = new T.Group();
  robot.scale.setScalar(1.15);
  world.add(robot);
  const robotMat = line("robot", 0.95);
  {
    const body = new T.LineSegments(new T.EdgesGeometry(new T.BoxGeometry(0.34, 0.2, 0.26)), robotMat);
    body.position.y = 0.14;
    robot.add(body);
    const mast = strip([[0, 0.24, 0], [0, 0.46, 0]], robotMat);
    robot.add(mast);
    const beacon = new T.Mesh(new T.SphereGeometry(0.035, 8, 8), warnMat);
    beacon.position.y = 0.48;
    robot.add(beacon);
    // heading chevron on the floor
    const chev = strip([[-0.1, 0.03, 0.28], [0.12, 0.03, 0.4], [0.34, 0.03, 0.28]], line("signal", 0.6));
    chev.rotation.y = -Math.PI / 2;
    chev.position.set(0.0, 0, 0);
    robot.add(chev);
  }
  const robotHalo = new T.Mesh(new T.RingGeometry(0.26, 0.3, 36), flat("signal", 0.5));
  robotHalo.rotation.x = -Math.PI / 2;
  robotHalo.position.y = 0.012;
  robot.add(robotHalo);

  // path as arc-length parametrised polyline
  const pathPts = PATH.map((p) => new T.Vector3(...p));
  const segLen = pathPts.slice(1).map((p, i) => p.distanceTo(pathPts[i]));
  const total = segLen.reduce((a, b) => a + b, 0);
  const tmpA = new T.Vector3();
  const tmpB = new T.Vector3();
  const placeRobot = (k: number) => {
    // k in [0,1] along the path; heading follows the segment
    let d = Math.max(0, Math.min(1, k)) * total;
    for (let i = 0; i < segLen.length; i++) {
      if (d <= segLen[i] || i === segLen.length - 1) {
        const u = segLen[i] ? Math.min(1, d / segLen[i]) : 1;
        tmpA.copy(pathPts[i]).lerp(pathPts[i + 1], u);
        robot.position.copy(tmpA);
        tmpB.copy(pathPts[i + 1]).sub(pathPts[i]);
        if (tmpB.lengthSq() > 1e-6) robot.rotation.y = Math.atan2(-tmpB.z, tmpB.x);
        return;
      }
      d -= segLen[i];
    }
  };
  placeRobot(0);

  // --- camera orbit: drag turns the block, idle drifts home
  /** camera on the south-east corner: console and dock sit left, the pole and the incident right */
  const HOME_YAW = 0.78;
  let yaw = HOME_YAW;
  let vYaw = 0;
  let dragging = false;
  let moved = 0;
  let lastX = 0;
  let lastT = 0;
  let lastInteraction = -1e9;
  let width = canvas.clientWidth || 1;
  let height = canvas.clientHeight || 1;
  let dist = DIST;

  const applyCamera = () => {
    camera.position.set(Math.sin(yaw) * Math.cos(PITCH) * dist, Math.sin(PITCH) * dist, Math.cos(yaw) * Math.cos(PITCH) * dist);
    camera.lookAt(lookAt);
  };

  // --- stage machine
  let stage = 0;
  let stageT0 = performance.now();
  const setStage = (i: number, fromUser = false) => {
    stage = ((i % STAGES.length) + STAGES.length) % STAGES.length;
    stageT0 = performance.now();
    if (fromUser) lastInteraction = stageT0;
    opts.onStage?.(STAGES[stage], stage);
  };
  const next = (fromUser = false) => setStage(stage + 1, fromUser);

  const onPointerDown = (e: PointerEvent) => {
    if (e.button !== undefined && e.button !== 0) return;
    dragging = true;
    moved = 0;
    lastX = e.clientX;
    lastT = performance.now();
    vYaw = 0;
    lastInteraction = lastT;
    canvas.setPointerCapture?.(e.pointerId);
    window.addEventListener("pointermove", onWindowMove);
    window.addEventListener("pointerup", onWindowUp);
    window.addEventListener("pointercancel", onWindowUp);
  };
  const onWindowMove = (e: PointerEvent) => {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    const now = performance.now();
    const dt = Math.max(8, now - lastT);
    moved += Math.abs(dx);
    const k = 2.2 / Math.max(240, width);
    yaw += dx * k;
    vYaw = prefersReduced ? 0 : (dx * k) / dt;
    lastX = e.clientX;
    lastT = now;
    lastInteraction = now;
  };
  const onWindowUp = (e: PointerEvent) => {
    if (!dragging) return;
    dragging = false;
    window.removeEventListener("pointermove", onWindowMove);
    window.removeEventListener("pointerup", onWindowUp);
    window.removeEventListener("pointercancel", onWindowUp);
    canvas.releasePointerCapture?.(e.pointerId);
    lastInteraction = performance.now();
    if (moved < 6) next(true);
  };
  canvas.style.cursor = "pointer";
  canvas.style.touchAction = "pan-y";
  canvas.addEventListener("pointerdown", onPointerDown);

  // --- loop
  let paused = false;
  let raf = 0;
  let prev = performance.now();
  const RING_PERIOD = 1800;
  const tick = () => {
    raf = requestAnimationFrame(tick);
    if (paused) return;
    const now = performance.now();
    const dt = Math.min(64, now - prev);
    prev = now;
    const el = now - stageT0;
    const cur = STAGES[stage];

    // camera
    if (!dragging) {
      yaw += vYaw * dt;
      vYaw *= Math.pow(0.92, dt / 16);
      if (now - lastInteraction > 3000) {
        const home = HOME_YAW + (prefersReduced ? 0 : Math.sin(now / 9000) * 0.1);
        yaw += (home - yaw) * 0.01 * (dt / 16);
      }
    }
    applyCamera();

    // auto advance: timed steps, travel steps wait for the robot
    if (now - lastInteraction > 6000 && !prefersReduced) {
      const travel = cur === "dispatch" || cur === "return";
      if (el > (travel ? TRAVEL_MS + 600 : holdMs)) next(false);
    }

    // robot
    const travelK = prefersReduced ? 1 : Math.min(1, el / TRAVEL_MS);
    const ease = 1 - Math.pow(1 - travelK, 3);
    if (cur === "dispatch") placeRobot(ease);
    else if (cur === "return") placeRobot(1 - ease);
    else if (cur === "detect" || cur === "approve") placeRobot(0);
    robotHalo.scale.setScalar(1 + Math.sin(now / 400) * 0.06);

    // incident marker: alive from detect until the robot reaches it
    const resolved = cur === "return" || (cur === "dispatch" && travelK >= 1);
    const targetAlpha = resolved ? Math.max(0, 1 - (cur === "return" ? el / 600 : 0)) : cur === "detect" ? Math.min(1, el / 400) : 1;
    target.visible = targetAlpha > 0.02;
    for (const r of rings) {
      const k = (now / RING_PERIOD + r.phase) % 1;
      r.mesh.scale.setScalar(0.6 + k * 1.8);
      r.mat.opacity = 0.6 * (1 - k) * targetAlpha * pal().alpha;
    }
    carMat.opacity = 0.9 * targetAlpha * pal().alpha;

    // camera field of view: breathes on detect
    fovMat.opacity = (cur === "detect" ? 0.1 + Math.sin(now / 180) * 0.05 : 0.06) * pal().alpha;

    // link pulses
    const pulseOn = (i: number, on: boolean, period: number) => {
      const p = pulses[i];
      p.mesh.visible = on;
      if (on) p.curve.getPoint(((now / period) % 1 + 1) % 1, p.mesh.position);
    };
    pulseOn(0, cur === "detect" || cur === "approve", 1100);
    pulseOn(1, cur === "approve", 700);

    renderer.render(scene, camera);
  };
  raf = requestAnimationFrame(tick);

  const resize = (w: number, h: number) => {
    width = Math.max(1, w);
    height = Math.max(1, h);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    // the block is wider than tall; a narrow canvas backs off so it still fits
    dist = DIST / Math.min(1, camera.aspect / 1.5);
    camera.updateProjectionMatrix();
    applyCamera();
  };
  resize(width, height);

  const anchors: Record<Stage, THREE.Vector3> = {
    detect: camHead.clone().add(new T.Vector3(-0.22, 0.1, 0.22)),
    approve: consolePos.clone().setY(0.85),
    dispatch: new T.Vector3(TARGET[0], 0.5, TARGET[2]),
    return: new T.Vector3(DOCK[0] - 0.1, 0.05, DOCK[2] + 0.35)
  };
  const tmp = new T.Vector3();
  const project = (s: Stage) => {
    tmp.copy(anchors[s]);
    world.localToWorld(tmp);
    tmp.project(camera);
    return { left: (tmp.x * 0.5 + 0.5) * 100, top: (-tmp.y * 0.5 + 0.5) * 100 };
  };

  const setTheme = (t: SceneTheme) => {
    if (t === theme) return;
    theme = t;
    const p = PALETTE[t];
    for (const m of lineMats) {
      m.mat.color.setHex(p[m.key] as number);
      m.mat.opacity = m.base * p.alpha;
      m.mat.blending = blendFor(t);
      m.mat.needsUpdate = true;
    }
    for (const m of meshMats) {
      m.mat.color.setHex(p[m.key] as number);
      m.mat.opacity = m.base * p.alpha;
      m.mat.blending = blendFor(t);
      m.mat.needsUpdate = true;
    }
  };
  if (theme === "light") {
    // apply the light alphas once; the constructor used the base opacity
    const p = PALETTE.light;
    for (const m of lineMats) m.mat.opacity = m.base * p.alpha;
    for (const m of meshMats) m.mat.opacity = m.base * p.alpha;
  }

  const dispose = () => {
    cancelAnimationFrame(raf);
    canvas.removeEventListener("pointerdown", onPointerDown);
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
    renderer.dispose();
  };

  // announce the first stage so the wrapper starts in sync
  opts.onStage?.(STAGES[0], 0);

  return {
    resize,
    project,
    setStage: (i) => setStage(i, true),
    next: () => next(true),
    setTheme,
    setPaused: (p) => {
      paused = p;
      if (!p) prev = performance.now();
    },
    dispose
  };
}
