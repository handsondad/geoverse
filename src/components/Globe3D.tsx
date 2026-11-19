import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import type { LonLat } from "../lib/geo.ts";
import { greatCircleArc, latLonToVec3, sunStateAt, vec3ToLatLon } from "../lib/globe-math.ts";

export type GlobeMarkerItem = {
  id: string;
  label: string;
  icon: string;
  coord: LonLat;
  color?: string;
  note?: string;
  place?: string;
  storyId?: string;
};

export type GlobeArcItem = {
  id: string;
  from: LonLat;
  to: LonLat;
  color: string;
  altitude?: number;
  traveler?: string;
};

export type GlobePolylineItem = {
  id: string;
  points: readonly LonLat[];
  color: string;
  dashed?: boolean;
  animated?: boolean;
};

export type Globe3DProps = {
  /** 昼夜真实光照 vs 全亮观察模式 */
  dayNight: boolean;
  /** 0..11 月份（影响太阳直射纬度 ±23.44°） */
  monthIdx: number;
  /** UTC 时刻 0..24（影响晨昏线经度位置） */
  utcHour: number;
  /** 是否自动缓慢自转 */
  autoSpin: boolean;
  /** 图层开关 */
  showClouds: boolean;
  showGraticule: boolean;
  showAxis: boolean;
  showTectonics: boolean;
  showCurrents: boolean;
  showChinaLines: boolean;
  showSubsolar: boolean;
  /** 聚焦飞向目标坐标（每次 seq 变化时平滑飞向该点） */
  focusTarget?: { coord: LonLat; distance?: number; seq: number } | null;
  /** 3D 球面图钉、自定义折线与大圆航线 */
  markers?: readonly GlobeMarkerItem[];
  activeMarkerId?: string | null;
  arcs?: readonly GlobeArcItem[];
  extraLines?: readonly GlobePolylineItem[];
  /** 点击球面回调（返回点击处经纬度） */
  onSurfaceClick?: (coord: LonLat) => void;
  /** 点击 3D 图钉回调 */
  onSelectMarker?: (marker: GlobeMarkerItem) => void;
  /** 供无 WebGL 时降级 */
  onUnsupported?: () => void;
};

export function canUseWebGL(): boolean {
  if (typeof document === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

const RING_OF_FIRE: readonly LonLat[] = [
  [175, -40], [166, -15], [148, -5], [126, 6], [122, 22], [138, 35], [145, 44], [160, 55],
  [-172, 52], [-152, 59], [-125, 48], [-115, 32], [-95, 16], [-80, 0], [-72, -18], [-72, -38]
];

const MID_ATLANTIC_RIDGE: readonly LonLat[] = [
  [-18, 65], [-28, 45], [-38, 25], [-42, 10], [-24, 0], [-14, -20], [-14, -45]
];

const EAST_AFRICA_RIFT: readonly LonLat[] = [
  [38.5, 20], [41, 12], [38, 5], [36, -2], [34, -12], [35, -20]
];

const HIMALAYA_BELT: readonly LonLat[] = [
  [73, 35], [80, 31], [87, 28], [95, 29]
];

const CURRENTS: readonly { id: string; color: string; pts: readonly LonLat[] }[] = [
  { id: "gulf", color: "#ff5a5f", pts: [[-80, 25], [-70, 36], [-45, 44], [-15, 52], [10, 65]] },
  { id: "kuroshio", color: "#ff5a5f", pts: [[123, 22], [134, 32], [146, 38], [165, 40]] },
  { id: "brazil", color: "#ff7f50", pts: [[-35, -8], [-39, -20], [-48, -32]] },
  { id: "peru", color: "#38bdf8", pts: [[-75, -45], [-74, -28], [-80, -12], [-92, -1]] },
  { id: "labrador", color: "#38bdf8", pts: [[-58, 62], [-53, 52], [-50, 42]] },
  { id: "oyashio", color: "#38bdf8", pts: [[160, 52], [150, 45], [143, 39]] }
];

const HU_LINE: readonly LonLat[] = [[127.53, 50.25], [116, 41], [107, 34], [98.49, 25.02]];
const QINLING_HUAIHE: readonly LonLat[] = [[104.5, 34.2], [108.5, 33.9], [114.5, 32.5], [119.5, 33.8]];

const EARTH_VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormalWorld;
  varying vec3 vPosWorld;
  void main() {
    vUv = uv;
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vPosWorld = worldPos.xyz;
    vNormalWorld = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const EARTH_FRAGMENT_SHADER = /* glsl */ `
  uniform sampler2D uDayMap;
  uniform sampler2D uNightMap;
  uniform sampler2D uWaterMap;
  uniform sampler2D uBumpMap;
  uniform vec3 uSunDir;
  uniform float uDayNight;
  varying vec2 vUv;
  varying vec3 vNormalWorld;
  varying vec3 vPosWorld;

  void main() {
    vec3 N = normalize(vNormalWorld);
    vec3 L = normalize(uSunDir);
    vec3 V = normalize(cameraPosition - vPosWorld);

    vec3 dayCol = texture2D(uDayMap, vUv).rgb;
    vec3 nightCol = texture2D(uNightMap, vUv).rgb;
    float waterMask = texture2D(uWaterMap, vUv).r;

    // 轻微地形高程明暗增强，让青藏高原与安第斯山更有立体感
    float hC = texture2D(uBumpMap, vUv).r;
    float hX = texture2D(uBumpMap, vUv + vec2(0.0012, 0.0)).r;
    float hY = texture2D(uBumpMap, vUv + vec2(0.0, 0.0024)).r;
    float relief = clamp(1.0 + (hC - hX) * 2.2 + (hC - hY) * 1.4, 0.82, 1.22);
    dayCol *= mix(relief, 1.0, waterMask);

    float NdotL = dot(N, L);
    float dayFactor = smoothstep(-0.16, 0.22, NdotL);
    float diffuse = max(NdotL, 0.0);

    // 海洋太阳高光
    vec3 H = normalize(L + V);
    float spec = pow(max(dot(N, H), 0.0), 34.0) * waterMask * 0.42 * smoothstep(0.0, 0.25, NdotL);

    // 晨昏线暖橙夕阳带
    float twilight = exp(-pow((NdotL + 0.02) * 8.5, 2.0)) * 0.28;
    vec3 sunsetTint = vec3(1.0, 0.48, 0.18) * twilight;

    // 夜晚底色 + 城市灯光增强
    vec3 nightLit = nightCol * 1.65 + dayCol * 0.055;
    vec3 dayLit = dayCol * (0.28 + 0.88 * diffuse) + vec3(0.95, 0.98, 1.0) * spec;

    vec3 litRealistic = mix(nightLit, dayLit, dayFactor) + sunsetTint;

    // 全亮地球仪观察模式（柔和书桌灯光）
    float deskDiff = max(dot(N, normalize(V + vec3(0.35, 0.45, 0.2))), 0.0);
    vec3 litDesk = dayCol * (0.62 + 0.52 * deskDiff) + vec3(0.9, 0.96, 1.0) * pow(max(dot(N, V), 0.0), 22.0) * waterMask * 0.14;

    vec3 baseColor = mix(litDesk, litRealistic, uDayNight);

    // 蓝色大气边缘菲涅尔散射
    float rim = pow(1.0 - max(dot(N, V), 0.0), 3.0);
    float rimLight = mix(0.65, smoothstep(-0.25, 0.55, NdotL) * 0.95 + 0.12, uDayNight);
    baseColor += vec3(0.28, 0.62, 1.0) * rim * 0.52 * rimLight;

    gl_FragColor = vec4(baseColor, 1.0);
  }
`;

const ATMOS_VERTEX_SHADER = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vPos;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    vPos = mvPos.xyz;
    gl_Position = projectionMatrix * mvPos;
  }
`;

const ATMOS_FRAGMENT_SHADER = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vPos;
  void main() {
    vec3 V = normalize(-vPos);
    float intensity = pow(0.66 - dot(vNormal, V), 3.4);
    gl_FragColor = vec4(0.32, 0.68, 1.0, clamp(intensity * 0.9, 0.0, 0.72));
  }
`;

function buildSphereLine(points: readonly LonLat[], radius: number, color: string, opacity = 0.88): THREE.Line {
  const verts: number[] = [];
  for (let i = 0; i < points.length - 1; i++) {
    const seg = greatCircleArc(points[i], points[i + 1], 18, radius, 0);
    for (let k = i === 0 ? 0 : 1; k < seg.length; k++) {
      verts.push(seg[k][0], seg[k][1], seg[k][2]);
    }
  }
  const geom = new THREE.BufferGeometry();
  geom.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
  const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity });
  return new THREE.Line(geom, mat);
}

function buildLatCircle(lat: number, radius: number, color: string, opacity = 0.7): THREE.LineLoop {
  const verts: number[] = [];
  const steps = 128;
  for (let i = 0; i < steps; i++) {
    const lon = -180 + (i / steps) * 360;
    const [x, y, z] = latLonToVec3(lon, lat, radius);
    verts.push(x, y, z);
  }
  const geom = new THREE.BufferGeometry();
  geom.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
  const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity });
  return new THREE.LineLoop(geom, mat);
}

function buildLonMeridian(lon: number, radius: number, color: string, opacity = 0.45): THREE.Line {
  const verts: number[] = [];
  const steps = 90;
  for (let i = 0; i <= steps; i++) {
    const lat = -85 + (i / steps) * 170;
    const [x, y, z] = latLonToVec3(lon, lat, radius);
    verts.push(x, y, z);
  }
  const geom = new THREE.BufferGeometry();
  geom.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
  const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity });
  return new THREE.Line(geom, mat);
}

type ScreenPin = {
  marker: GlobeMarkerItem;
  x: number;
  y: number;
  visible: boolean;
};

export function Globe3D({
  dayNight,
  monthIdx,
  utcHour,
  autoSpin,
  showClouds,
  showGraticule,
  showAxis,
  showTectonics,
  showCurrents,
  showChinaLines,
  showSubsolar,
  focusTarget,
  markers = [],
  activeMarkerId,
  arcs = [],
  extraLines = [],
  onSurfaceClick,
  onSelectMarker,
  onUnsupported
}: Globe3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [screenPins, setScreenPins] = useState<ScreenPin[]>([]);
  const [texReady, setTexReady] = useState(false);

  // 最新 props 通过 ref 注入渲染循环，避免重建 WebGL 上下文
  const propsRef = useRef({
    dayNight,
    monthIdx,
    utcHour,
    autoSpin,
    showClouds,
    showGraticule,
    showAxis,
    showTectonics,
    showCurrents,
    showChinaLines,
    showSubsolar,
    markers,
    activeMarkerId,
    onSurfaceClick,
    onSelectMarker
  });
  propsRef.current = {
    dayNight,
    monthIdx,
    utcHour,
    autoSpin,
    showClouds,
    showGraticule,
    showAxis,
    showTectonics,
    showCurrents,
    showChinaLines,
    showSubsolar,
    markers,
    activeMarkerId,
    onSurfaceClick,
    onSelectMarker
  };

  // 相机球坐标（围绕原点旋转，便于精确 flyTo 任意经纬度）
  const camStateRef = useRef({
    lon: 108, // 默认朝向中国
    lat: 26,
    dist: 2.75,
    velLon: 0,
    velLat: 0,
    flyTo: null as { lon: number; lat: number; dist: number; t: number; startLon: number; startLat: number; startDist: number } | null
  });

  // 触发飞向目标坐标
  const lastFocusSeq = useRef(-1);
  useEffect(() => {
    if (!focusTarget || focusTarget.seq === lastFocusSeq.current) return;
    lastFocusSeq.current = focusTarget.seq;
    const cs = camStateRef.current;
    let targetLon = focusTarget.coord[0];
    // 选最短经度旋转路径
    while (targetLon - cs.lon > 180) targetLon -= 360;
    while (targetLon - cs.lon < -180) targetLon += 360;
    cs.flyTo = {
      startLon: cs.lon,
      startLat: cs.lat,
      startDist: cs.dist,
      lon: targetLon,
      lat: Math.max(-72, Math.min(72, focusTarget.coord[1])),
      dist: focusTarget.distance ?? 2.35,
      t: 0
    };
    cs.velLon = 0;
    cs.velLat = 0;
  }, [focusTarget]);

  // 动态航线/折线容器 ref
  const dynamicGroupRef = useRef<THREE.Group | null>(null);
  const arcBeadsRef = useRef<{ mesh: THREE.Mesh; points: THREE.Vector3[]; speed: number; phase: number }[]>([]);

  useEffect(() => {
    if (!canUseWebGL()) {
      onUnsupported?.();
      return;
    }
    const container = mountRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    } catch {
      onUnsupported?.();
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(container.clientWidth || 720, container.clientHeight || 520);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#071126");

    const camera = new THREE.PerspectiveCamera(
      40,
      (container.clientWidth || 720) / (container.clientHeight || 520),
      0.1,
      100
    );

    // 星空背景
    const starCount = 1100;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const r = 18 + Math.random() * 24;
      const u = Math.random() * 2 - 1;
      const theta = Math.random() * Math.PI * 2;
      const s = Math.sqrt(1 - u * u);
      starPositions[i * 3] = r * s * Math.cos(theta);
      starPositions[i * 3 + 1] = r * u;
      starPositions[i * 3 + 2] = r * s * Math.sin(theta);
    }
    const starGeom = new THREE.BufferGeometry();
    starGeom.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({ color: "#dbeafe", size: 0.085, transparent: true, opacity: 0.8 });
    scene.add(new THREE.Points(starGeom, starMat));

    // 加载本地 NASA 高清贴图
    const base = (import.meta as { env?: { BASE_URL?: string } }).env?.BASE_URL ?? "./";
    const loader = new THREE.TextureLoader();
    let loadedCount = 0;
    const onTexLoad = () => {
      loadedCount += 1;
      if (loadedCount >= 2) setTexReady(true);
    };
    const loadTex = (file: string, srgb = false) => {
      const tex = loader.load(`${base}textures/${file}`, onTexLoad);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
      tex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
      if (srgb) tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    };

    const dayTex = loadTex("earth-day.jpg", true);
    const nightTex = loadTex("earth-night.jpg", true);
    const waterTex = loadTex("earth-water.jpg", false);
    const bumpTex = loadTex("earth-bump.jpg", false);
    const cloudTex = loadTex("earth-clouds.jpg", true);

    const earthUniforms = {
      uDayMap: { value: dayTex },
      uNightMap: { value: nightTex },
      uWaterMap: { value: waterTex },
      uBumpMap: { value: bumpTex },
      uSunDir: { value: new THREE.Vector3(1, 0, 0) },
      uDayNight: { value: propsRef.current.dayNight ? 1.0 : 0.0 }
    };

    const earthGeom = new THREE.SphereGeometry(1, 72, 48);
    const earthMat = new THREE.ShaderMaterial({
      uniforms: earthUniforms,
      vertexShader: EARTH_VERTEX_SHADER,
      fragmentShader: EARTH_FRAGMENT_SHADER
    });
    const earthMesh = new THREE.Mesh(earthGeom, earthMat);
    scene.add(earthMesh);

    // 动态云层球
    const cloudGeom = new THREE.SphereGeometry(1.011, 64, 40);
    const cloudMat = new THREE.MeshBasicMaterial({
      map: cloudTex,
      alphaMap: cloudTex,
      transparent: true,
      opacity: 0.36,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    const cloudMesh = new THREE.Mesh(cloudGeom, cloudMat);
    scene.add(cloudMesh);

    // 大气层蓝光外晕
    const atmosGeom = new THREE.SphereGeometry(1.075, 48, 32);
    const atmosMat = new THREE.ShaderMaterial({
      vertexShader: ATMOS_VERTEX_SHADER,
      fragmentShader: ATMOS_FRAGMENT_SHADER,
      side: THREE.BackSide,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    scene.add(new THREE.Mesh(atmosGeom, atmosMat));

    // 地轴支架（北极到南极穿心轴）
    const axisGroup = new THREE.Group();
    const axisGeom = new THREE.CylinderGeometry(0.005, 0.005, 2.55, 12);
    const axisMat = new THREE.MeshBasicMaterial({ color: "#fde047", transparent: true, opacity: 0.85 });
    axisGroup.add(new THREE.Mesh(axisGeom, axisMat));
    const poleCapGeom = new THREE.SphereGeometry(0.022, 16, 12);
    const northCap = new THREE.Mesh(poleCapGeom, new THREE.MeshBasicMaterial({ color: "#38bdf8" }));
    northCap.position.set(0, 1.28, 0);
    const southCap = new THREE.Mesh(poleCapGeom, new THREE.MeshBasicMaterial({ color: "#f97316" }));
    southCap.position.set(0, -1.28, 0);
    axisGroup.add(northCap, southCap);
    scene.add(axisGroup);

    // 经纬网与特殊纬线图层
    const graticuleGroup = new THREE.Group();
    for (let lat = -60; lat <= 60; lat += 30) {
      if (lat === 0) continue;
      graticuleGroup.add(buildLatCircle(lat, 1.004, "#93c5fd", 0.22));
    }
    for (let lon = -150; lon <= 150; lon += 30) {
      if (lon === 0) continue;
      graticuleGroup.add(buildLonMeridian(lon, 1.004, "#93c5fd", 0.2));
    }
    graticuleGroup.add(buildLatCircle(0, 1.006, "#ef4444", 0.85)); // 赤道
    graticuleGroup.add(buildLatCircle(23.44, 1.006, "#f59e0b", 0.72)); // 北回归线
    graticuleGroup.add(buildLatCircle(-23.44, 1.006, "#f59e0b", 0.72)); // 南回归线
    graticuleGroup.add(buildLatCircle(66.56, 1.006, "#38bdf8", 0.72)); // 北极圈
    graticuleGroup.add(buildLatCircle(-66.56, 1.006, "#38bdf8", 0.72)); // 南极圈
    graticuleGroup.add(buildLonMeridian(0, 1.006, "#facc15", 0.75)); // 0° 本初子午线
    graticuleGroup.add(buildLonMeridian(180, 1.006, "#f43f5e", 0.75)); // 180° 日界线
    scene.add(graticuleGroup);

    // 板块火环图层
    const tectonicsGroup = new THREE.Group();
    tectonicsGroup.add(buildSphereLine(RING_OF_FIRE, 1.009, "#ff4d4f", 0.92));
    tectonicsGroup.add(buildSphereLine(MID_ATLANTIC_RIDGE, 1.009, "#fb923c", 0.85));
    tectonicsGroup.add(buildSphereLine(EAST_AFRICA_RIFT, 1.009, "#facc15", 0.9));
    tectonicsGroup.add(buildSphereLine(HIMALAYA_BELT, 1.009, "#e879f9", 0.9));
    scene.add(tectonicsGroup);

    // 全球洋流图层（带流动光点）
    const currentsGroup = new THREE.Group();
    const currentBeads: { mesh: THREE.Mesh; pts: THREE.Vector3[]; phase: number }[] = [];
    const beadGeom = new THREE.SphereGeometry(0.014, 10, 8);
    for (const cur of CURRENTS) {
      currentsGroup.add(buildSphereLine(cur.pts, 1.008, cur.color, 0.85));
      const dense: THREE.Vector3[] = [];
      for (let i = 0; i < cur.pts.length - 1; i++) {
        for (const p of greatCircleArc(cur.pts[i], cur.pts[i + 1], 14, 1.012, 0)) {
          dense.push(new THREE.Vector3(p[0], p[1], p[2]));
        }
      }
      for (let b = 0; b < 2; b++) {
        const mesh = new THREE.Mesh(beadGeom, new THREE.MeshBasicMaterial({ color: cur.color }));
        currentsGroup.add(mesh);
        currentBeads.push({ mesh, pts: dense, phase: b * 0.5 });
      }
    }
    scene.add(currentsGroup);

    // 中国胡焕庸线 & 秦岭淮河线图层
    const chinaGroup = new THREE.Group();
    chinaGroup.add(buildSphereLine(HU_LINE, 1.01, "#facc15", 0.95));
    chinaGroup.add(buildSphereLine(QINLING_HUAIHE, 1.01, "#34d399", 0.95));
    scene.add(chinaGroup);

    // 太阳直射点光环
    const subsolarGroup = new THREE.Group();
    const sunRingGeom = new THREE.RingGeometry(0.028, 0.046, 32);
    const sunRingMat = new THREE.MeshBasicMaterial({
      color: "#fde047",
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.92
    });
    const sunDot = new THREE.Mesh(new THREE.SphereGeometry(0.016, 12, 10), new THREE.MeshBasicMaterial({ color: "#ef4444" }));
    subsolarGroup.add(new THREE.Mesh(sunRingGeom, sunRingMat), sunDot);
    scene.add(subsolarGroup);

    // 动态航线/寻宝测地线容器
    const dynamicGroup = new THREE.Group();
    dynamicGroupRef.current = dynamicGroup;
    scene.add(dynamicGroup);

    // 指针拖拽旋转 + 滚轮缩放 + 点击球面经纬度检测
    const raycaster = new THREE.Raycaster();
    let dragging = false;
    let movedPx = 0;
    let lastX = 0;
    let lastY = 0;

    const onPointerDown = (e: PointerEvent) => {
      dragging = true;
      movedPx = 0;
      lastX = e.clientX;
      lastY = e.clientY;
      camStateRef.current.flyTo = null;
      camStateRef.current.velLon = 0;
      camStateRef.current.velLat = 0;
      renderer.domElement.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      movedPx += Math.hypot(dx, dy);
      lastX = e.clientX;
      lastY = e.clientY;

      const cs = camStateRef.current;
      const sens = 0.24 * (cs.dist / 2.6);
      cs.lon -= dx * sens;
      cs.lat = Math.max(-80, Math.min(80, cs.lat + dy * sens));
      cs.velLon = -dx * sens * 0.45;
      cs.velLat = dy * sens * 0.45;
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      try {
        renderer.domElement.releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
      if (movedPx < 6 && propsRef.current.onSurfaceClick) {
        const rect = renderer.domElement.getBoundingClientRect();
        const ndc = new THREE.Vector2(
          ((e.clientX - rect.left) / rect.width) * 2 - 1,
          -((e.clientY - rect.top) / rect.height) * 2 + 1
        );
        raycaster.setFromCamera(ndc, camera);
        const hits = raycaster.intersectObject(earthMesh, false);
        if (hits.length > 0) {
          const pt = hits[0].point;
          const coord = vec3ToLatLon(pt.x, pt.y, pt.z);
          propsRef.current.onSurfaceClick(coord);
        }
      }
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const cs = camStateRef.current;
      cs.flyTo = null;
      cs.dist = Math.max(1.48, Math.min(4.2, cs.dist + e.deltaY * 0.0016));
    };

    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("pointerup", onPointerUp);
    renderer.domElement.addEventListener("wheel", onWheel, { passive: false });

    const resizeObserver = new ResizeObserver(() => {
      const w = container.clientWidth || 720;
      const h = container.clientHeight || 520;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    resizeObserver.observe(container);

    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    let raf = 0;
    let lastNow = performance.now();
    let clockSec = 0;
    let pinUpdateAcc = 0;
    const tmpVec = new THREE.Vector3();
    const camDir = new THREE.Vector3();

    const animate = (now: number) => {
      raf = requestAnimationFrame(animate);
      if (document.hidden) {
        lastNow = now;
        return;
      }
      const dt = Math.min((now - lastNow) / 1000, 0.05);
      lastNow = now;
      clockSec += dt;

      const p = propsRef.current;
      const cs = camStateRef.current;

      // 平滑飞向目标坐标
      if (cs.flyTo) {
        cs.flyTo.t = Math.min(1, cs.flyTo.t + dt * 1.5);
        const u = 1 - (1 - cs.flyTo.t) ** 3;
        cs.lon = cs.flyTo.startLon + (cs.flyTo.lon - cs.flyTo.startLon) * u;
        cs.lat = cs.flyTo.startLat + (cs.flyTo.lat - cs.flyTo.startLat) * u;
        cs.dist = cs.flyTo.startDist + (cs.flyTo.dist - cs.flyTo.startDist) * u;
        if (cs.flyTo.t >= 1) cs.flyTo = null;
      } else if (!dragging) {
        if (Math.abs(cs.velLon) > 0.004 || Math.abs(cs.velLat) > 0.004) {
          cs.lon += cs.velLon;
          cs.lat = Math.max(-80, Math.min(80, cs.lat + cs.velLat));
          cs.velLon *= 0.91;
          cs.velLat *= 0.91;
        } else if (p.autoSpin && !reducedMotion) {
          cs.lon += dt * 5.2;
        }
      }

      if (cs.lon > 180) cs.lon -= 360;
      if (cs.lon < -180) cs.lon += 360;

      // 更新相机位置
      const [cx, cy, cz] = latLonToVec3(cs.lon, cs.lat, cs.dist);
      camera.position.set(cx, cy, cz);
      camera.lookAt(0, 0, 0);

      // 更新太阳方向与昼夜模式
      const sun = sunStateAt(p.monthIdx, p.utcHour);
      earthUniforms.uSunDir.value.set(sun.dir[0], sun.dir[1], sun.dir[2]);
      earthUniforms.uDayNight.value += ((p.dayNight ? 1 : 0) - earthUniforms.uDayNight.value) * Math.min(1, dt * 8);

      // 云层缓慢漂移
      cloudMesh.visible = p.showClouds;
      if (p.showClouds && !reducedMotion) {
        cloudMesh.rotation.y += dt * 0.012;
      }

      // 图层显隐
      axisGroup.visible = p.showAxis;
      graticuleGroup.visible = p.showGraticule;
      tectonicsGroup.visible = p.showTectonics;
      currentsGroup.visible = p.showCurrents;
      chinaGroup.visible = p.showChinaLines;
      subsolarGroup.visible = p.showSubsolar;

      if (p.showSubsolar) {
        const [sx, sy, sz] = latLonToVec3(sun.subsolarLon, sun.subsolarLat, 1.014);
        subsolarGroup.position.set(sx, sy, sz);
        subsolarGroup.lookAt(sx * 2, sy * 2, sz * 2);
      }

      // 洋流光点动画
      if (p.showCurrents && !reducedMotion) {
        for (const bead of currentBeads) {
          const u = (clockSec * 0.16 + bead.phase) % 1;
          const idx = Math.min(bead.pts.length - 1, Math.floor(u * (bead.pts.length - 1)));
          bead.mesh.position.copy(bead.pts[idx]);
        }
      }

      // 航线飞行光点动画
      if (!reducedMotion) {
        for (const ab of arcBeadsRef.current) {
          const u = (clockSec * ab.speed + ab.phase) % 1;
          const idx = Math.min(ab.points.length - 1, Math.floor(u * (ab.points.length - 1)));
          ab.mesh.position.copy(ab.points[idx]);
        }
      }

      renderer.render(scene, camera);

      // 投影 3D 奇观图钉到屏幕坐标（每 50ms 刷新一次以保持流畅与低开销）
      pinUpdateAcc += dt;
      if (pinUpdateAcc >= 0.045) {
        pinUpdateAcc = 0;
        const w = container.clientWidth || 720;
        const h = container.clientHeight || 520;
        camDir.copy(camera.position).normalize();
        const projected: ScreenPin[] = [];
        for (const m of p.markers) {
          const [mx, my, mz] = latLonToVec3(m.coord[0], m.coord[1], 1.015);
          tmpVec.set(mx, my, mz);
          // 背面剔除：点积 > 0.12 表示位于地球仪正面
          const facing = tmpVec.clone().normalize().dot(camDir);
          if (facing <= 0.12) continue;
          tmpVec.project(camera);
          const sx = (tmpVec.x * 0.5 + 0.5) * w;
          const sy = (-tmpVec.y * 0.5 + 0.5) * h;
          const inBounds = sx >= 16 && sx <= w - 16 && sy >= 16 && sy <= h - 16;
          if (inBounds) {
            projected.push({ marker: m, x: sx, y: sy, visible: true });
          }
        }
        setScreenPins(projected);
      }
    };

    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener("pointerup", onPointerUp);
      renderer.domElement.removeEventListener("wheel", onWheel);
      dayTex.dispose();
      nightTex.dispose();
      waterTex.dispose();
      bumpTex.dispose();
      cloudTex.dispose();
      earthGeom.dispose();
      earthMat.dispose();
      cloudGeom.dispose();
      cloudMat.dispose();
      atmosGeom.dispose();
      atmosMat.dispose();
      starGeom.dispose();
      starMat.dispose();
      renderer.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 动态更新大圆航线与自定义测地线
  useEffect(() => {
    const group = dynamicGroupRef.current;
    if (!group) return;
    while (group.children.length > 0) {
      const child = group.children.pop()!;
      if (child instanceof THREE.Mesh || child instanceof THREE.Line) {
        child.geometry.dispose();
        if (Array.isArray(child.material)) child.material.forEach((m) => m.dispose());
        else child.material.dispose();
      }
    }
    arcBeadsRef.current = [];

    for (const arc of arcs) {
      const pts = greatCircleArc(arc.from, arc.to, 72, 1.008, arc.altitude ?? 0.11);
      const vecs = pts.map(([x, y, z]) => new THREE.Vector3(x, y, z));
      const curve = new THREE.CatmullRomCurve3(vecs);
      const tubeGeom = new THREE.TubeGeometry(curve, 64, 0.0055, 8, false);
      const tubeMat = new THREE.MeshBasicMaterial({ color: arc.color });
      group.add(new THREE.Mesh(tubeGeom, tubeMat));

      const bead = new THREE.Mesh(
        new THREE.SphereGeometry(0.018, 12, 10),
        new THREE.MeshBasicMaterial({ color: "#fff8f0" })
      );
      bead.position.copy(vecs[0]);
      group.add(bead);
      arcBeadsRef.current.push({ mesh: bead, points: vecs, speed: 0.22, phase: 0 });
    }

    for (const line of extraLines) {
      if (line.points.length >= 2) {
        group.add(buildSphereLine(line.points, 1.01, line.color, 0.92));
      }
    }
  }, [arcs, extraLines]);

  return (
    <div className="globe3d-wrap">
      <div
        ref={mountRef}
        className="globe3d-canvas"
        aria-label="交互式 3D 逼真地球仪：可拖动旋转、滚轮缩放、点击任意位置查看坐标与奇观"
      />
      {!texReady && (
        <div className="globe3d-loading" role="status">
          🌍 正在加载卫星地球贴图……
        </div>
      )}
      <div className="globe3d-pins" aria-hidden="false">
        {screenPins.map(({ marker, x, y }) => {
          const isActive = marker.id === activeMarkerId;
          return (
            <button
              key={marker.id}
              type="button"
              className={`globe3d-pin${isActive ? " is-active" : ""}`}
              style={{
                left: `${x.toFixed(1)}px`,
                top: `${y.toFixed(1)}px`,
                borderColor: marker.color ?? "#ff9f43"
              }}
              onClick={(e) => {
                e.stopPropagation();
                onSelectMarker?.(marker);
              }}
            >
              <span aria-hidden="true">{marker.icon}</span>
              <span>{marker.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
