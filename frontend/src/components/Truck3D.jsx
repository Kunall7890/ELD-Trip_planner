import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import './Truck3D.css';

let sharedAudioCtx = null;
function getAudioContext() {
  if (!sharedAudioCtx || sharedAudioCtx.state === 'closed') {
    try {
      sharedAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch {
      return null;
    }
  }
  return sharedAudioCtx;
}

let hornPlaying = false;

function playHorn() {
  if (hornPlaying) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  hornPlaying = true;

  try {
    const master = ctx.createGain();
    master.gain.setValueAtTime(0.3, ctx.currentTime);
    master.connect(ctx.destination);

    const h1 = (f, s, d) => {
      const o = ctx.createOscillator();
      o.type = 'sawtooth';
      o.frequency.setValueAtTime(f, ctx.currentTime + s);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, ctx.currentTime + s);
      g.gain.linearRampToValueAtTime(0.5, ctx.currentTime + s + 0.04);
      g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + s + d);
      o.connect(g); g.connect(master);
      o.start(ctx.currentTime + s); o.stop(ctx.currentTime + s + d);
    };
    h1(190, 0, 1.1); h1(300, 0.05, 0.95); h1(145, 0.1, 0.85);

    const sub = ctx.createOscillator();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(50, ctx.currentTime);
    const sg = ctx.createGain();
    sg.gain.setValueAtTime(0.12, ctx.currentTime);
    sg.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
    sub.connect(sg); sg.connect(master);
    sub.start(ctx.currentTime); sub.stop(ctx.currentTime + 0.6);

    setTimeout(() => { hornPlaying = false; }, 1500);
  } catch {
    hornPlaying = false;
  }
}

export default function Truck3D() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const w = container.clientWidth;
    const h = container.clientHeight;
    if (w === 0 || h === 0) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, w / h, 0.1, 100);
    camera.position.set(6, 3.5, 9);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.5;
    controls.minPolarAngle = Math.PI / 5;
    controls.maxPolarAngle = Math.PI / 2.1;
    controls.target.set(0, 0.8, 0);
    renderer.domElement.style.cursor = 'pointer';
    renderer.domElement.addEventListener('click', playHorn);

    scene.add(new THREE.HemisphereLight(0xffeedd, 0x443322, 0.6));
    const key = new THREE.DirectionalLight(0xffffff, 2.5);
    key.position.set(8, 14, 6);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.radius = 6;
    key.shadow.bias = -0.001;
    key.shadow.normalBias = 0.02;
    scene.add(key);
    const fill = new THREE.DirectionalLight(0x4488ff, 0.4);
    fill.position.set(-4, 2, -6);
    scene.add(fill);
    const rim = new THREE.DirectionalLight(0xffffff, 0.7);
    rim.position.set(-3, 4, 8);
    scene.add(rim);

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(24, 24),
      new THREE.ShadowMaterial({ opacity: 0.15, color: 0x666666 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.1;
    ground.receiveShadow = true;
    scene.add(ground);

    const truck = new THREE.Group();

    const blueBody = new THREE.MeshPhysicalMaterial({ color: 0x1a5276, roughness: 0.3, metalness: 0.1, clearcoat: 0.2 });
    const darkBlue = new THREE.MeshPhysicalMaterial({ color: 0x154360, roughness: 0.35, metalness: 0.1 });
    const creamPanel = new THREE.MeshPhysicalMaterial({ color: 0xF5F0E8, roughness: 0.4, metalness: 0.05 });
    const chromeMat = new THREE.MeshPhysicalMaterial({ color: 0xcccccc, roughness: 0.05, metalness: 0.9 });
    const silverMat = new THREE.MeshPhysicalMaterial({ color: 0xaaaaaa, roughness: 0.2, metalness: 0.5 });
    const glassMat = new THREE.MeshPhysicalMaterial({ color: 0x88ccff, roughness: 0.05, transparent: true, opacity: 0.25 });
    const tireMat = new THREE.MeshPhysicalMaterial({ color: 0x1a1a1a, roughness: 0.95, metalness: 0 });
    const lightMat = new THREE.MeshPhysicalMaterial({ color: 0xffeeaa, emissive: 0xffcc44, emissiveIntensity: 0.3 });
    const redMat = new THREE.MeshPhysicalMaterial({ color: 0xcc0000, roughness: 0.3 });

    const cab = new THREE.Group();

    const cabMain = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.5, 2.0), blueBody);
    cabMain.position.set(0, 1.0, 0.1);
    cabMain.castShadow = true;
    cab.add(cabMain);

    const cabCreamBand = new THREE.Mesh(new THREE.BoxGeometry(1.62, 0.2, 2.02), creamPanel);
    cabCreamBand.position.set(0, 0.6, 0.1);
    cab.add(cabCreamBand);

    const cabRoof = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.25, 1.8), darkBlue);
    cabRoof.position.set(0, 1.8, 0);
    cabRoof.castShadow = true;
    cab.add(cabRoof);

    const roofCrown = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.12, 0.5), creamPanel);
    roofCrown.position.set(0, 1.98, -0.2);
    cab.add(roofCrown);

    const windshield = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.55, 0.05), glassMat);
    windshield.position.set(0, 1.3, 1.03);
    cab.add(windshield);

    const windshieldSurround = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.65, 0.02), chromeMat);
    windshieldSurround.position.set(0, 1.3, 1.04);
    cab.add(windshieldSurround);

    const visor = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.08, 0.2), darkBlue);
    visor.position.set(0, 1.65, 1.04);
    cab.add(visor);

    const frontPanel = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.5, 0.05), blueBody);
    frontPanel.position.set(0, 0.95, 1.03);
    cab.add(frontPanel);

    const grille = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.4, 0.04), silverMat);
    grille.position.set(0, 0.95, 1.08);
    cab.add(grille);

    for (let i = -3; i <= 3; i++) {
      const bar = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.02, 0.06), chromeMat);
      bar.position.set(0, 0.95 + i * 0.045, 1.10);
      cab.add(bar);
    }

    const grilleBorder = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.45, 0.02), chromeMat);
    grilleBorder.position.set(0, 0.95, 1.09);
    cab.add(grilleBorder);

    const headlightL = new THREE.Mesh(new THREE.CircleGeometry(0.12, 16), lightMat);
    headlightL.position.set(-0.5, 0.85, 1.08);
    cab.add(headlightL);
    const headlightR = new THREE.Mesh(new THREE.CircleGeometry(0.12, 16), lightMat);
    headlightR.position.set(0.5, 0.85, 1.08);
    cab.add(headlightR);

    const headlightRingL = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.015, 8, 16), chromeMat);
    headlightRingL.position.set(-0.5, 0.85, 1.09);
    cab.add(headlightRingL);
    const headlightRingR = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.015, 8, 16), chromeMat);
    headlightRingR.position.set(0.5, 0.85, 1.09);
    cab.add(headlightRingR);

    const indicatorL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.04, 0.02), new THREE.MeshPhysicalMaterial({ color: 0xff8800, emissive: 0xff6600, emissiveIntensity: 0.2 }));
    indicatorL.position.set(-0.35, 0.7, 1.08);
    cab.add(indicatorL);
    const indicatorR = indicatorL.clone();
    indicatorR.position.x = 0.35;
    cab.add(indicatorR);

    const bumper = new THREE.Mesh(new THREE.BoxGeometry(1.65, 0.2, 0.15), silverMat);
    bumper.position.set(0, 0.3, 1.08);
    cab.add(bumper);

    const bumperStep = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.04, 0.2), chromeMat);
    bumperStep.position.set(0, 0.15, 1.12);
    cab.add(bumperStep);

    const fenderFL = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.35, 0.18, 14, 1, true, 0, Math.PI), blueBody);
    fenderFL.rotation.z = Math.PI / 2;
    fenderFL.position.set(-0.85, 0.3, 0.9);
    cab.add(fenderFL);
    const fenderFR = fenderFL.clone();
    fenderFR.position.x = 0.85;
    cab.add(fenderFR);

    const fenderRL = fenderFL.clone();
    fenderRL.position.set(-0.85, 0.3, -0.6);
    cab.add(fenderRL);
    const fenderRR = fenderRL.clone();
    fenderRR.position.x = 0.85;
    cab.add(fenderRR);

    const sideDoorL = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.9, 0.65), creamPanel);
    sideDoorL.position.set(-0.81, 0.95, 0.5);
    cab.add(sideDoorL);
    const sideDoorR = sideDoorL.clone();
    sideDoorR.position.x = 0.81;
    cab.add(sideDoorR);

    const handleL = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.02, 0.08), chromeMat);
    handleL.position.set(-0.82, 0.9, 0.7);
    cab.add(handleL);
    const handleR = handleL.clone();
    handleR.position.x = 0.82;
    cab.add(handleR);

    const stepRailL = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.03, 0.12), silverMat);
    stepRailL.position.set(-0.82, 0.12, 0.4);
    cab.add(stepRailL);
    const stepRailR = stepRailL.clone();
    stepRailR.position.x = 0.82;
    cab.add(stepRailR);

    const mirrorL = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.25, 0.3), darkBlue);
    mirrorL.position.set(-0.88, 1.2, 0.6);
    cab.add(mirrorL);
    const mirrorR = mirrorL.clone();
    mirrorR.position.x = 0.88;
    cab.add(mirrorR);
    const mirrorArmL = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.02, 0.2), chromeMat);
    mirrorArmL.position.set(-0.86, 1.05, 0.75);
    cab.add(mirrorArmL);
    const mirrorArmR = mirrorArmL.clone();
    mirrorArmR.position.x = 0.86;
    cab.add(mirrorArmR);

    const mirrorExtL = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.2, 0.22), darkBlue);
    mirrorExtL.position.set(-1.0, 1.15, 0.5);
    cab.add(mirrorExtL);
    const mirrorExtR = mirrorExtL.clone();
    mirrorExtR.position.x = 1.0;
    cab.add(mirrorExtR);

    // Exhaust stacks behind cab
    const stackPositions = [-0.55, -0.3, 0.3, 0.55];
    stackPositions.forEach(x => {
      const stack = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.055, 0.5), chromeMat);
      stack.position.set(x, 0.4, -0.9);
      cab.add(stack);
    });

    const wiperL = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.01, 0.02), darkBlue);
    wiperL.position.set(-0.35, 1.08, 1.04);
    cab.add(wiperL);
    const wiperR = wiperL.clone();
    wiperR.position.x = 0.35;
    cab.add(wiperR);

    const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.01, 0.5), silverMat);
    antenna.position.set(0.4, 2.05, 0.3);
    cab.add(antenna);

    truck.add(cab);

    // Trailer deck
    const deck = new THREE.Group();
    const deckBase = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.2, 3.8), new THREE.MeshPhysicalMaterial({ color: 0x4a2c1a, roughness: 0.8 }));
    deckBase.position.set(0, 0.4, -2.0);
    deckBase.castShadow = true;
    deck.add(deckBase);

    const deckMat = new THREE.MeshPhysicalMaterial({ color: 0x8B5E3C, roughness: 0.9 });
    for (let i = 0; i < 8; i++) {
      const plank = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.05, 0.35), deckMat);
      plank.position.set(0, 0.6, -0.3 - i * 0.5);
      deck.add(plank);
    }

    const woodMat = new THREE.MeshPhysicalMaterial({ color: 0x8B5E3C, roughness: 0.8, metalness: 0 });
    const sideBoardL = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.4, 3.8), woodMat);
    sideBoardL.position.set(-0.84, 0.8, -2.0);
    deck.add(sideBoardL);
    const sideBoardR = sideBoardL.clone();
    sideBoardR.position.x = 0.84;
    deck.add(sideBoardR);

    const sideRailL = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 3.8), silverMat);
    sideRailL.position.set(-0.86, 1.0, -2.0);
    deck.add(sideRailL);
    const sideRailR = sideRailL.clone();
    sideRailR.position.x = 0.86;
    deck.add(sideRailR);

    const postPositions = [-1.6, -0.8, 0, 0.8, 1.6];
    for (const z of postPositions) {
      const postL = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.45, 0.03), silverMat);
      postL.position.set(-0.85, 0.82, -0.3 - z);
      deck.add(postL);
      const postR = postL.clone();
      postR.position.x = 0.85;
      deck.add(postR);
    }

    const headBoard = new THREE.Mesh(new THREE.BoxGeometry(1.64, 0.5, 0.04), woodMat);
    headBoard.position.set(0, 0.85, 0.1);
    deck.add(headBoard);

    const tailBoard = new THREE.Mesh(new THREE.BoxGeometry(1.64, 0.5, 0.04), woodMat);
    tailBoard.position.set(0, 0.85, -3.9);
    deck.add(tailBoard);

    // Taillights at rear
    const taillightL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.12, 0.03), redMat);
    taillightL.position.set(-0.65, 0.5, -3.92);
    deck.add(taillightL);
    const taillightR = taillightL.clone();
    taillightR.position.x = 0.65;
    deck.add(taillightR);

    // Cargo
    const cargoMat = new THREE.MeshPhysicalMaterial({ color: 0x5a7a4a, roughness: 0.7 });
    const cargoBoxes = [
      [-0.4, 0.9, -0.8, 0.6, 0.35, 0.5],
      [0.4, 1.0, -0.8, 0.55, 0.4, 0.45],
      [-0.3, 0.85, -1.6, 0.5, 0.3, 0.5],
      [0.35, 0.95, -1.6, 0.65, 0.35, 0.5],
      [-0.2, 0.75, -2.4, 0.5, 0.3, 0.5],
      [0.25, 0.8, -2.4, 0.55, 0.35, 0.5],
      [-0.1, 0.65, -3.2, 0.6, 0.3, 0.5],
    ];
    for (const pos of cargoBoxes) {
      const box = new THREE.Mesh(
        new THREE.BoxGeometry(pos[3], pos[4], pos[5]),
        cargoMat
      );
      box.position.set(pos[0], pos[1], pos[2]);
      box.castShadow = true;
      deck.add(box);
    }

    truck.add(deck);

    // Wheels
    const wheels = [];
    function createWheel(x, y, z) {
      const g = new THREE.Group();
      const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.28, 0.18, 24), tireMat);
      tire.rotation.z = Math.PI / 2;
      tire.castShadow = true;
      g.add(tire);
      const rimOuter = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.025, 12, 24), silverMat);
      rimOuter.rotation.x = Math.PI / 2;
      g.add(rimOuter);
      const rimInner = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.2, 16), silverMat);
      rimInner.rotation.z = Math.PI / 2;
      g.add(rimInner);
      for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI * 2;
        const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.14, 0.18), chromeMat);
        spoke.position.set(Math.cos(angle) * 0.07, Math.sin(angle) * 0.07, 0);
        spoke.rotation.z = -angle;
        g.add(spoke);
      }
      const hub = new THREE.Mesh(new THREE.CircleGeometry(0.04, 12), chromeMat);
      hub.position.z = 0.1;
      g.add(hub);
      g.position.set(x, y, z);
      wheels.push(g);
      return g;
    }

    truck.add(createWheel(-0.82, 0.2, 0.9));
    truck.add(createWheel(0.82, 0.2, 0.9));
    truck.add(createWheel(-0.82, 0.2, -0.6));
    truck.add(createWheel(0.82, 0.2, -0.6));
    truck.add(createWheel(-0.82, 0.2, -1.6));
    truck.add(createWheel(0.82, 0.2, -1.6));
    truck.add(createWheel(-0.82, 0.2, -2.6));
    truck.add(createWheel(0.82, 0.2, -2.6));
    truck.add(createWheel(-0.82, 0.2, -3.4));
    truck.add(createWheel(0.82, 0.2, -3.4));

    truck.position.z = 1.8;
    scene.add(truck);

    let time = 0;
    const handleResize = () => {
      const cw = container.clientWidth, ch = container.clientHeight;
      if (cw === 0 || ch === 0) return;
      camera.aspect = cw / ch; camera.updateProjectionMatrix(); renderer.setSize(cw, ch);
    };
    window.addEventListener('resize', handleResize);

    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      time += 0.02;
      const bounce = Math.sin(time * 1.5) * 0.006;
      truck.position.y = bounce;
      wheels.forEach((w, i) => {
        w.children.forEach(child => {
          if (child.isMesh && child.geometry.type === 'CylinderGeometry' && child !== w.children[0]) {
            child.rotation.x += 0.03;
          }
        });
      });
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      renderer.domElement.removeEventListener('click', playHorn);
      controls.dispose();
      scene.traverse(obj => {
        if (obj.isMesh) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach(m => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, []);

  return <div className="truck-3d" ref={containerRef} />;
}
