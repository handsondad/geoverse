import * as THREE from "three";
import { mountDuo, type DuoKit, type DuoStageHandle } from "../series/duo-stage.ts";

/**
 * 地理奇遇记的小星球：在系列同一颗草地小星球上，
 * 摆一座 23.44° 倾斜黄铜地球仪、一座冒烟小火山、一只指南针与雪山双峰，
 * 头顶飘着探索热气球、彩虹雨云和绕飞的地球遥感小卫星。
 */

function ball(kit: DuoKit, color: string, r: number, at: [number, number, number]): THREE.Mesh {
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(r, 20, 14), kit.toon(color));
  mesh.position.set(...at);
  return mesh;
}

function rod(
  kit: DuoKit,
  color: string,
  from: THREE.Vector3,
  to: THREE.Vector3,
  r = 0.015
): THREE.Mesh {
  const length = from.distanceTo(to);
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(r, r, length, 8), kit.toon(color));
  mesh.position.copy(from).lerp(to, 0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), to.clone().sub(from).normalize());
  return mesh;
}

function deskGlobe(kit: DuoKit): { group: THREE.Group; sphere: THREE.Group } {
  const group = new THREE.Group();
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.18, 0.05, 20), kit.toon("#8b5e3c"));
  base.position.y = 0.025;
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.032, 0.14, 12), kit.toon("#d9a441"));
  stem.position.y = 0.11;

  const tiltGroup = new THREE.Group();
  tiltGroup.position.y = 0.34;
  tiltGroup.rotation.z = THREE.MathUtils.degToRad(-23.44);

  const arc = new THREE.Mesh(
    new THREE.TorusGeometry(0.205, 0.016, 8, 36, Math.PI * 1.15),
    kit.toon("#e6b44c")
  );
  arc.rotation.z = -Math.PI * 0.58;
  const axisPin = new THREE.Mesh(
    new THREE.CylinderGeometry(0.01, 0.01, 0.44, 8),
    kit.toon("#e6b44c")
  );
  tiltGroup.add(arc, axisPin);

  const sphere = new THREE.Group();
  sphere.add(ball(kit, "#4d96ff", 0.17, [0, 0, 0]));
  // 简化海陆色块与赤道金线
  const continents: [number, number, number, number, string][] = [
    [0.09, 0.06, 0.11, 0.062, "#57bf69"],
    [-0.08, 0.04, 0.13, 0.052, "#63c76a"],
    [-0.06, -0.07, 0.12, 0.046, "#57bf69"],
    [0.11, -0.05, 0.09, 0.042, "#e8b86b"],
    [0, 0.155, 0, 0.045, "#ffffff"],
    [0, -0.155, 0, 0.048, "#ffffff"]
  ];
  for (const [x, y, z, r, c] of continents) {
    const patch = ball(kit, c, r, [x, y, z]);
    patch.scale.set(1.15, 0.78, 0.65);
    patch.lookAt(x * 2, y * 2, z * 2);
    sphere.add(patch);
  }
  const equator = new THREE.Mesh(
    new THREE.TorusGeometry(0.173, 0.006, 6, 36),
    kit.toon("#ffd43b")
  );
  equator.rotation.x = Math.PI / 2;
  sphere.add(equator);

  tiltGroup.add(sphere);
  group.add(base, stem, tiltGroup);
  return { group, sphere };
}

function miniVolcano(kit: DuoKit): { group: THREE.Group; puffs: THREE.Mesh[]; lava: THREE.Mesh } {
  const group = new THREE.Group();
  const cone = new THREE.Mesh(
    new THREE.ConeGeometry(0.28, 0.34, 14, 1, false),
    kit.toon("#7d6456")
  );
  cone.position.y = 0.17;
  // 削平火山口视觉：叠加火山口外环与熔岩池
  const rim = new THREE.Mesh(
    new THREE.CylinderGeometry(0.11, 0.145, 0.08, 14),
    kit.toon("#695246")
  );
  rim.position.y = 0.31;
  const lava = new THREE.Mesh(
    new THREE.CircleGeometry(0.088, 16),
    new THREE.MeshBasicMaterial({ color: "#ff6b35" })
  );
  lava.rotation.x = -Math.PI / 2;
  lava.position.y = 0.352;

  // 山腰凝灰与熔岩流条带
  for (let i = 0; i < 3; i += 1) {
    const a = i * 2.1 + 0.4;
    const stream = new THREE.Mesh(
      new THREE.CylinderGeometry(0.012, 0.022, 0.18, 6),
      new THREE.MeshBasicMaterial({ color: "#ff8c42" })
    );
    stream.position.set(Math.sin(a) * 0.13, 0.22, Math.cos(a) * 0.13);
    stream.rotation.z = -Math.sin(a) * 0.58;
    stream.rotation.x = Math.cos(a) * 0.58;
    group.add(stream);
  }

  const puffs: THREE.Mesh[] = [];
  for (let i = 0; i < 3; i += 1) {
    const puff = new THREE.Mesh(
      new THREE.SphereGeometry(0.048 + i * 0.012, 12, 10),
      new THREE.MeshBasicMaterial({ color: "#fff5eb", transparent: true, opacity: 0.72 })
    );
    puff.position.set(0, 0.42 + i * 0.1, 0);
    group.add(puff);
    puffs.push(puff);
  }

  group.add(cone, rim, lava);
  return { group, puffs, lava };
}

function compassRose(kit: DuoKit): { group: THREE.Group; needle: THREE.Group } {
  const group = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.16, 0.175, 0.045, 24),
    kit.toon("#e0a943")
  );
  body.position.y = 0.022;
  const dial = new THREE.Mesh(
    new THREE.CylinderGeometry(0.138, 0.138, 0.012, 24),
    kit.toon("#fff9ee")
  );
  dial.position.y = 0.046;

  const needle = new THREE.Group();
  needle.position.y = 0.058;
  const north = new THREE.Mesh(new THREE.ConeGeometry(0.028, 0.11, 6), kit.toon("#ff595e"));
  north.rotation.x = Math.PI / 2;
  north.position.z = 0.055;
  const south = new THREE.Mesh(new THREE.ConeGeometry(0.028, 0.11, 6), kit.toon("#4d96ff"));
  south.rotation.x = -Math.PI / 2;
  south.position.z = -0.055;
  const cap = ball(kit, "#d99b26", 0.022, [0, 0.006, 0]);
  needle.add(north, south, cap);

  group.add(body, dial, needle);
  return { group, needle };
}

function snowPeaks(kit: DuoKit): THREE.Group {
  const group = new THREE.Group();
  const specs: [number, number, number, number][] = [
    [0, 0, 0.22, 0.36],
    [-0.14, 0.05, 0.15, 0.24],
    [0.14, -0.03, 0.14, 0.22]
  ];
  for (const [x, z, r, h] of specs) {
    const rock = new THREE.Mesh(new THREE.ConeGeometry(r, h, 7), kit.toon("#7f8fa6"));
    rock.position.set(x, h / 2, z);
    const snowH = h * 0.42;
    const snow = new THREE.Mesh(
      new THREE.ConeGeometry(r * 0.44, snowH, 7),
      kit.toon("#ffffff")
    );
    snow.position.set(x, h - snowH / 2 + 0.006, z);
    group.add(rock, snow);
  }
  return group;
}

function explorerBalloon(kit: DuoKit): THREE.Group {
  const group = new THREE.Group();
  const envelope = ball(kit, "#ff8a5c", 0.24, [0, 0.22, 0]);
  envelope.scale.set(1, 1.18, 1);
  const band1 = new THREE.Mesh(
    new THREE.TorusGeometry(0.232, 0.028, 8, 28),
    kit.toon("#ffd43b")
  );
  band1.rotation.x = Math.PI / 2;
  band1.position.y = 0.24;
  const band2 = new THREE.Mesh(
    new THREE.TorusGeometry(0.19, 0.022, 8, 28),
    kit.toon("#4d96ff")
  );
  band2.rotation.x = Math.PI / 2;
  band2.position.y = 0.35;
  const basket = new THREE.Mesh(
    new THREE.CylinderGeometry(0.068, 0.056, 0.085, 10),
    kit.toon("#b07d4f")
  );
  basket.position.y = -0.14;
  for (const [sx, sz] of [
    [-1, -1],
    [1, -1],
    [-1, 1],
    [1, 1]
  ]) {
    group.add(
      rod(
        kit,
        "#8c6239",
        new THREE.Vector3(sx * 0.048, -0.1, sz * 0.048),
        new THREE.Vector3(sx * 0.1, 0.03, sz * 0.1),
        0.007
      )
    );
  }
  group.add(envelope, band1, band2, basket);
  return group;
}

function rainbowCloud(kit: DuoKit): THREE.Group {
  const group = new THREE.Group();
  const rainbowColors = ["#ff6b6b", "#ffa94d", "#ffd43b", "#51cf66", "#4dabf7"];
  rainbowColors.forEach((c, i) => {
    const arc = new THREE.Mesh(
      new THREE.TorusGeometry(0.28 - i * 0.028, 0.016, 8, 32, Math.PI),
      kit.toon(c)
    );
    arc.position.set(0, 0.03, -0.04);
    group.add(arc);
  });
  const puffs: [number, number, number, number][] = [
    [-0.18, 0, 0.04, 0.11],
    [-0.05, 0.04, 0.05, 0.13],
    [0.1, 0.02, 0.04, 0.12],
    [0.21, -0.01, 0.03, 0.095]
  ];
  for (const [x, y, z, r] of puffs) {
    group.add(ball(kit, "#ffffff", r, [x, y, z]));
  }
  for (const x of [-0.1, 0.02, 0.13]) {
    const drop = new THREE.Mesh(new THREE.ConeGeometry(0.022, 0.065, 8), kit.toon("#4dabf7"));
    drop.position.set(x, -0.14, 0.04);
    group.add(drop);
  }
  return group;
}

function earthSatellite(kit: DuoKit): THREE.Group {
  const group = new THREE.Group();
  const bus = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.11, 0.13), kit.toon("#ffd43b"));
  const lens = new THREE.Mesh(
    new THREE.CylinderGeometry(0.034, 0.042, 0.045, 12),
    kit.toon("#3b4b5e")
  );
  lens.position.y = -0.07;
  group.add(bus, lens);
  for (const side of [-1, 1]) {
    const wing = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.012, 0.085), kit.toon("#3f78c9"));
    wing.position.x = side * 0.175;
    group.add(wing);
  }
  return group;
}

function decorate(kit: DuoKit): void {
  const globe = deskGlobe(kit);
  globe.group.scale.setScalar(1.22);
  kit.plant(globe.group, 1.16, -0.16);

  const volcano = miniVolcano(kit);
  volcano.group.scale.setScalar(1.12);
  kit.plant(volcano.group, -1.26, -0.12);

  const compass = compassRose(kit);
  compass.group.scale.setScalar(1.12);
  kit.plant(compass.group, -0.92, 0.56);

  const peaks = snowPeaks(kit);
  peaks.scale.setScalar(1.05);
  kit.plant(peaks, 1.02, 0.54);

  const balloon = explorerBalloon(kit);
  const weather = rainbowCloud(kit);
  const floaters = [
    { object: balloon, at: new THREE.Vector3(-1.85, 2.0, -1.15), spin: 0.28 },
    { object: weather, at: new THREE.Vector3(1.4, 2.38, -1.75), spin: 0 }
  ];
  floaters.forEach(({ object, at }) => {
    object.position.copy(at);
    kit.scene.add(object);
  });

  const sat = earthSatellite(kit);
  const satCenter = new THREE.Vector3(-0.08, 2.62, -2.25);
  kit.scene.add(sat);

  kit.onFrame((t, dt) => {
    globe.sphere.rotation.y += dt * 0.65;
    compass.needle.rotation.y = 0.35 + Math.sin(t * 1.8) * 0.22;

    const glow = 0.85 + 0.15 * Math.sin(t * 5.2);
    volcano.lava.scale.setScalar(glow);
    volcano.puffs.forEach((puff, i) => {
      const phase = ((t * 0.42 + i / volcano.puffs.length) % 1 + 1) % 1;
      puff.position.y = 0.38 + phase * 0.36;
      puff.position.x = Math.sin(t * 2 + i) * 0.03 * phase;
      const s = 0.65 + phase * 0.85;
      puff.scale.setScalar(s);
      (puff.material as THREE.MeshBasicMaterial).opacity = (1 - phase) * 0.72;
    });

    floaters.forEach(({ object, at, spin }, i) => {
      if (spin) object.rotation.y += dt * spin;
      object.position.y = at.y + Math.sin(t * 1.15 + i * 2.1) * 0.08;
    });

    sat.position.set(
      satCenter.x + Math.cos(t * 0.6) * 0.62,
      satCenter.y + Math.sin(t * 0.6) * 0.16,
      satCenter.z + Math.sin(t * 0.6) * 0.28
    );
    sat.rotation.y = -t * 0.6;
  });
}

export function mountGeoPlanet(host: HTMLElement, onTap: () => void): Promise<DuoStageHandle> {
  return mountDuo(host, {
    label:
      "小念和爸爸站在地理小星球上，旁边摆着倾斜地球仪、冒烟小火山、指南针和雪山，头顶飘着热气球、彩虹雨云和遥感小卫星；点他们会接着聊",
    decorate,
    onTap
  });
}
