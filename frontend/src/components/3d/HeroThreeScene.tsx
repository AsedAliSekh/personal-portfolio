import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Rotate3d, Cpu, Activity, Sparkles, RefreshCw } from 'lucide-react';

type HoloSpectrum = 'photonic' | 'quantum' | 'matrix' | 'original';

interface ColorProfile {
  primary: number;
  secondary: number;
  accent: number;
  rim: number;
  cssPrimary: string;
}

const COLOR_PROFILES: Record<HoloSpectrum, ColorProfile> = {
  photonic: {
    primary: 0x22d3ee,   // Cyan
    secondary: 0x38bdf8, // Sky Blue
    accent: 0x0ea5e9,
    rim: 0xa855f7,       // Electric Purple
    cssPrimary: '#22d3ee',
  },
  quantum: {
    primary: 0xc084fc,   // Lavender
    secondary: 0xa855f7, // Electric Purple
    accent: 0x7c3aed,
    rim: 0xf43f5e,       // Neon Rose
    cssPrimary: '#c084fc',
  },
  matrix: {
    primary: 0x34d399,   // Mint
    secondary: 0x10b981, // Emerald
    accent: 0x059669,
    rim: 0x22d3ee,       // Cyan
    cssPrimary: '#34d399',
  },
  original: {
    primary: 0x38bdf8,   // Crisp Blue-Cyan Accent for base platform
    secondary: 0x94a3b8, // Slate Steel
    accent: 0x64748b,
    rim: 0x38bdf8,
    cssPrimary: '#38bdf8',
  },
};

// Safe WebGL Detection Guard for Mobile Devices
const checkWebGLSupport = (): boolean => {
  if (typeof window === 'undefined') return true;
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
};

// Generates a soft luminous radial glow texture for quantum stardust motes
const createStardustGlowTexture = (): THREE.CanvasTexture | null => {
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.18, 'rgba(56, 189, 248, 0.95)');
  gradient.addColorStop(0.45, 'rgba(34, 211, 238, 0.45)');
  gradient.addColorStop(0.75, 'rgba(14, 165, 233, 0.12)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);
  const texture = new THREE.CanvasTexture(canvas);
  return texture;
};

export const HeroThreeScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const azimuthRef = useRef<HTMLSpanElement>(null);
  const [loadProgress, setLoadProgress] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [hasWebGL, setHasWebGL] = useState<boolean>(true);
  const [spectrum, setSpectrum] = useState<HoloSpectrum>('photonic');
  const spectrumRef = useRef<HoloSpectrum>('photonic');
  spectrumRef.current = spectrum;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (!checkWebGLSupport()) {
      setHasWebGL(false);
      return;
    }

    let isMounted = true;
    const isMobile = window.innerWidth < 768;

    // ─── 1. Scene, Camera, Renderer ──────────────────────────
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );

    let controls: OrbitControls | null = null;

    // Auto-fit function: guarantees the enlarged avatar + orbit rings fit with zero cropping
    const fitCameraToViewport = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (width === 0 || height === 0) return;

      const aspect = width / height;
      camera.aspect = aspect;

      // Perfectly tuned bounding radius to fit larger avatar with zero cropping
      const boundingRadius = isMobile ? 2.42 : 2.50;
      const vFovRad = (camera.fov * Math.PI) / 180;
      const hFovRad = 2 * Math.atan(Math.tan(vFovRad / 2) * aspect);

      const distVertical = boundingRadius / Math.tan(vFovRad / 2);
      const distHorizontal = boundingRadius / Math.tan(hFovRad / 2);

      const safeDistance = Math.max(distVertical, distHorizontal, isMobile ? 5.2 : 5.4);

      camera.position.set(0, 0.16, safeDistance);
      camera.updateProjectionMatrix();

      if (controls) {
        controls.target.set(0, 0.08, 0);
        controls.update();
      }
    };

    const safePixelRatio = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
        stencil: false,
        depth: true,
        preserveDrawingBuffer: false,
      });
    } catch (e) {
      console.error('[Hero3D] WebGLRenderer initialization failed:', e);
      if (isMounted) setHasWebGL(false);
      return;
    }

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(safePixelRatio);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    // Guarantee native vertical page scrolling via touch-action
    renderer.domElement.style.touchAction = 'pan-y';
    container.appendChild(renderer.domElement);

    // Master rotatable group
    const masterPivot = new THREE.Group();
    scene.add(masterPivot);

    // ─── 2. Controls & Silky Smooth Mobile Inertia Dragging ───
    let isInteracting = false;
    let idleTimer: ReturnType<typeof setTimeout> | null = null;

    // Mobile physics-based smooth dragging state
    let targetRotationY = 0;
    let angularVelocity = 0;
    let isUserDragging = false;
    const autoRotateSpeed = 0.0035;

    if (!isMobile) {
      // Desktop: OrbitControls with silky damping
      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.06;
      controls.enableZoom = false;
      controls.enablePan = false;
      controls.minPolarAngle = Math.PI / 3.4;
      controls.maxPolarAngle = Math.PI / 1.72;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 1.1;

      controls.addEventListener('start', () => {
        isInteracting = true;
        if (idleTimer) clearTimeout(idleTimer);
      });
      controls.addEventListener('end', () => {
        if (idleTimer) clearTimeout(idleTimer);
        idleTimer = setTimeout(() => {
          isInteracting = false;
        }, 2500);
      });
    } else {
      // Mobile: OrbitControls is NEVER attached to avoid touchAction: none overrides!
      // Silky smooth inertia touch controller with unblocked vertical scrolling:
      let touchStartX = 0;
      let touchStartY = 0;
      let lastTouchX = 0;
      let lastTouchTime = 0;
      let gestureType: 'none' | 'vertical' | 'horizontal' = 'none';

      const onTouchStart = (e: TouchEvent) => {
        if (e.touches.length === 1) {
          touchStartX = e.touches[0].clientX;
          touchStartY = e.touches[0].clientY;
          lastTouchX = touchStartX;
          lastTouchTime = performance.now();
          gestureType = 'none';
          angularVelocity = 0;
          isUserDragging = false;
          if (idleTimer) clearTimeout(idleTimer);
        }
      };

      const onTouchMove = (e: TouchEvent) => {
        if (e.touches.length !== 1) return;
        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;
        const diffX = currentX - touchStartX;
        const diffY = currentY - touchStartY;

        if (gestureType === 'none') {
          const absX = Math.abs(diffX);
          const absY = Math.abs(diffY);
          if (absX >= 7 || absY >= 7) {
            if (absY >= absX) {
              // Locked as vertical page scrolling: NEVER preventDefault, allow browser to scroll fluidly
              gestureType = 'vertical';
              return;
            } else if (absX > absY * 1.25 && absX >= 9) {
              // Locked as intentional horizontal avatar rotation
              gestureType = 'horizontal';
              isUserDragging = true;
              isInteracting = true;
              targetRotationY = masterPivot.rotation.y;
            }
          }
        }

        if (gestureType === 'vertical') {
          // Native vertical page scroll underway: do nothing
          return;
        }

        if (gestureType === 'horizontal') {
          if (e.cancelable) e.preventDefault();
          const now = performance.now();
          const dt = Math.max(now - lastTouchTime, 1);
          const stepX = currentX - lastTouchX;

          // Responsive rotation step with momentum tracking
          targetRotationY += stepX * 0.0075;
          angularVelocity = (stepX / dt) * 0.14;

          lastTouchX = currentX;
          lastTouchTime = now;
        }
      };

      const onTouchEnd = () => {
        if (gestureType === 'horizontal') {
          isUserDragging = false;
          // Clamp maximum release velocity for comfortable glide
          angularVelocity = Math.max(Math.min(angularVelocity, 0.06), -0.06);
        }
        gestureType = 'none';
        if (idleTimer) clearTimeout(idleTimer);
        idleTimer = setTimeout(() => {
          isInteracting = false;
        }, 2500);
      };

      const dom = renderer.domElement;
      dom.addEventListener('touchstart', onTouchStart, { passive: true });
      dom.addEventListener('touchmove', onTouchMove, { passive: false });
      dom.addEventListener('touchend', onTouchEnd, { passive: true });
      dom.addEventListener('touchcancel', onTouchEnd, { passive: true });
    }

    // ─── 3. Professional Cinematic Lighting ───────────────────
    const ambientLight = new THREE.AmbientLight(0xf8fafc, 1.45);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(3, 4, 4);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xe2e8f0, 1.0);
    fillLight.position.set(-3, 2, 3);
    scene.add(fillLight);

    const rimLightA = new THREE.PointLight(0x22d3ee, 5.2, 12);
    rimLightA.position.set(2.5, 2.5, -2);
    scene.add(rimLightA);

    const rimLightB = new THREE.PointLight(0xa855f7, 4.5, 12);
    rimLightB.position.set(-2.5, -1.5, -2);
    scene.add(rimLightB);

    const topHalo = new THREE.PointLight(0x38bdf8, 2.2, 10);
    topHalo.position.set(0, 3.8, 0);
    scene.add(topHalo);

    const disposables: (THREE.BufferGeometry | THREE.Material | THREE.Texture)[] = [];

    // ─── 4. Sci-Fi Holographic Base Platform (Preserved 2 Loved Baselines) ──
    const baseGroup = new THREE.Group();
    masterPivot.add(baseGroup);

    // A. Solid Cyber Chassis Disc (Titanium/Obsidian)
    const chassisGeo = new THREE.CylinderGeometry(1.48, 1.78, 0.08, 64);
    const chassisMat = new THREE.MeshStandardMaterial({
      color: 0x06080d,
      roughness: 0.25,
      metalness: 0.88,
    });
    const chassis = new THREE.Mesh(chassisGeo, chassisMat);
    chassis.position.y = -1.48;
    baseGroup.add(chassis);
    disposables.push(chassisGeo, chassisMat);

    // B. Upper Luminous Emitter Rim (Baseline 1)
    const baseRim1Geo = new THREE.TorusGeometry(1.48, 0.013, 16, 90);
    const baseRim1Mat = new THREE.MeshStandardMaterial({
      color: 0x22d3ee,
      emissive: 0x22d3ee,
      emissiveIntensity: 1.5,
      transparent: true,
      opacity: 0.85,
    });
    const baseRim1 = new THREE.Mesh(baseRim1Geo, baseRim1Mat);
    baseRim1.rotation.x = Math.PI / 2;
    baseRim1.position.y = -1.44;
    baseGroup.add(baseRim1);
    disposables.push(baseRim1Geo, baseRim1Mat);

    // C. Lower Outer Housing Ring (Baseline 2)
    const baseRim2Geo = new THREE.TorusGeometry(1.78, 0.01, 16, 90);
    const baseRim2Mat = new THREE.MeshStandardMaterial({
      color: 0xa855f7,
      emissive: 0xa855f7,
      emissiveIntensity: 1.2,
      transparent: true,
      opacity: 0.7,
    });
    const baseRim2 = new THREE.Mesh(baseRim2Geo, baseRim2Mat);
    baseRim2.rotation.x = Math.PI / 2;
    baseRim2.position.y = -1.52;
    baseGroup.add(baseRim2);
    disposables.push(baseRim2Geo, baseRim2Mat);

    // D. Surface Concentric Tech Tracks
    const floorTrack1Geo = new THREE.RingGeometry(0.85, 0.865, 64);
    const floorTrackMat = new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5,
    });
    const floorTrack1 = new THREE.Mesh(floorTrack1Geo, floorTrackMat);
    floorTrack1.rotation.x = -Math.PI / 2;
    floorTrack1.position.y = -1.438;
    baseGroup.add(floorTrack1);
    disposables.push(floorTrack1Geo, floorTrackMat);

    const floorTrack2Geo = new THREE.RingGeometry(1.18, 1.195, 64);
    const floorTrack2 = new THREE.Mesh(floorTrack2Geo, floorTrackMat);
    floorTrack2.rotation.x = -Math.PI / 2;
    floorTrack2.position.y = -1.438;
    baseGroup.add(floorTrack2);
    disposables.push(floorTrack2Geo);

    // E. 16 Radial Heatsink Laser Diffraction Spokes
    const spokeGeo = new THREE.BoxGeometry(0.16, 0.005, 0.01);
    const spokeMat = new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      transparent: true,
      opacity: 0.45,
    });
    disposables.push(spokeGeo, spokeMat);

    for (let i = 0; i < 16; i++) {
      const angle = (i * Math.PI) / 8;
      const spoke = new THREE.Mesh(spokeGeo, spokeMat);
      spoke.position.set(Math.cos(angle) * 1.02, -1.436, Math.sin(angle) * 1.02);
      spoke.rotation.y = -angle;
      baseGroup.add(spoke);
    }

    // F. 4 Cardinal Emitter Pylons with Vertical Laser Collimator Beams
    const pylonSphereGeo = new THREE.SphereGeometry(0.024, 12, 12);
    const pylonMat = new THREE.MeshBasicMaterial({ color: 0x22d3ee });
    disposables.push(pylonSphereGeo, pylonMat);

    // Vertical Laser Collimator Needle Beams (photonic containment column)
    const collimatorGeo = new THREE.CylinderGeometry(0.003, 0.003, 1.55, 8);
    const collimatorMat = new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
    });
    disposables.push(collimatorGeo, collimatorMat);

    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2;
      const x = Math.cos(angle) * 1.48;
      const z = Math.sin(angle) * 1.48;

      const pylon = new THREE.Mesh(pylonSphereGeo, pylonMat);
      pylon.position.set(x, -1.438, z);
      baseGroup.add(pylon);

      const beam = new THREE.Mesh(collimatorGeo, collimatorMat);
      beam.position.set(x, -0.66, z);
      baseGroup.add(beam);
    }

    // ─── 5. Advanced Hollywood Sci-Fi Cyber Orbit Telemetry System ─
    const cyberOrbitGroup = new THREE.Group();
    masterPivot.add(cyberOrbitGroup);

    // A. Biometric Head Scanner Reticle (strictly BEHIND avatar head at z = -0.55, y = 0.44)
    const haloGroup = new THREE.Group();
    haloGroup.position.set(0, 0.44, -0.55);
    cyberOrbitGroup.add(haloGroup);

    // Primary Target Ring
    const haloRingGeo = new THREE.TorusGeometry(0.98, 0.0035, 16, 80);
    const haloRingMat = new THREE.MeshStandardMaterial({
      color: 0x22d3ee,
      emissive: 0x22d3ee,
      emissiveIntensity: 0.65,
      transparent: true,
      opacity: 0.45,
    });
    const haloRing = new THREE.Mesh(haloRingGeo, haloRingMat);
    haloGroup.add(haloRing);
    disposables.push(haloRingGeo, haloRingMat);

    // Inner Concentric Reticle Ring
    const innerHaloGeo = new THREE.TorusGeometry(0.80, 0.0025, 16, 64);
    const innerHalo = new THREE.Mesh(innerHaloGeo, haloRingMat);
    haloGroup.add(innerHalo);
    disposables.push(innerHaloGeo);

    // 4 Corner HUD Crosshair Brackets [ ┌ ┐ └ ┘ ]
    const tickGeo = new THREE.BoxGeometry(0.08, 0.004, 0.004);
    const tickMat = new THREE.MeshBasicMaterial({ color: 0x22d3ee });
    disposables.push(tickGeo, tickMat);

    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2 + Math.PI / 4;
      const tick = new THREE.Mesh(tickGeo, tickMat);
      tick.position.set(Math.cos(angle) * 0.98, Math.sin(angle) * 0.98, 0);
      tick.rotation.z = angle;
      haloGroup.add(tick);
    }

    // B. Dual-Track Equatorial Telemetry Rail (Hollywood Sci-Fi Gyroscopic Instrument)
    const equatorialGroup = new THREE.Group();
    equatorialGroup.position.set(0, -0.32, 0);
    equatorialGroup.rotation.x = Math.PI / 2; // Perfectly horizontal, coplanar with the base rings
    cyberOrbitGroup.add(equatorialGroup);

    // Primary Equatorial Telemetry Ring
    const eqRingGeo = new THREE.TorusGeometry(1.95, 0.0035, 16, 120);
    const eqRingMat = new THREE.MeshStandardMaterial({
      color: 0x22d3ee,
      emissive: 0x22d3ee,
      emissiveIntensity: 0.75,
      transparent: true,
      opacity: 0.65,
    });
    const eqRing = new THREE.Mesh(eqRingGeo, eqRingMat);
    equatorialGroup.add(eqRing);
    disposables.push(eqRingGeo, eqRingMat);

    // Outer Concentric Track
    const eqOuterTrackGeo = new THREE.TorusGeometry(2.14, 0.0025, 16, 120);
    const eqOuterTrackMat = new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      transparent: true,
      opacity: 0.45,
    });
    const eqOuterTrack = new THREE.Mesh(eqOuterTrackGeo, eqOuterTrackMat);
    equatorialGroup.add(eqOuterTrack);
    disposables.push(eqOuterTrackGeo, eqOuterTrackMat);

    // 8 Radial Laser Bridge Spokes connecting inner and outer rail
    const bridgeSpokeGeo = new THREE.BoxGeometry(0.18, 0.003, 0.003);
    disposables.push(bridgeSpokeGeo);
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4;
      const bridge = new THREE.Mesh(bridgeSpokeGeo, tickMat);
      bridge.position.set(Math.cos(angle) * 2.045, Math.sin(angle) * 2.045, 0);
      bridge.rotation.z = angle;
      equatorialGroup.add(bridge);
    }

    // Twin Counter-Orbiting Telemetry Satellite Nodes
    const satGeo = new THREE.SphereGeometry(0.032, 14, 14);
    const satMat1 = new THREE.MeshBasicMaterial({ color: 0x22d3ee });
    const satNodeAlpha = new THREE.Mesh(satGeo, satMat1);
    equatorialGroup.add(satNodeAlpha);
    disposables.push(satGeo, satMat1);

    const satMat2 = new THREE.MeshBasicMaterial({ color: 0xc084fc });
    const satNodeBeta = new THREE.Mesh(satGeo, satMat2);
    equatorialGroup.add(satNodeBeta);
    disposables.push(satMat2);

    // C. Upper Sensor Gimbal Arch (Chest Height: y = 0.52)
    const upperGimbalGroup = new THREE.Group();
    upperGimbalGroup.position.set(0, 0.52, 0);
    upperGimbalGroup.rotation.x = Math.PI / 2 + 0.14; // Subtle 8 deg cinematic tilt
    cyberOrbitGroup.add(upperGimbalGroup);

    const upperGimbalGeo = new THREE.TorusGeometry(1.62, 0.0025, 16, 96);
    const upperGimbalMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.38,
    });
    const upperGimbalRing = new THREE.Mesh(upperGimbalGeo, upperGimbalMat);
    upperGimbalGroup.add(upperGimbalRing);
    disposables.push(upperGimbalGeo, upperGimbalMat);

    // 2 Cardinal Telemetry Micro-Beacons on Upper Arch
    const microBeaconGeo = new THREE.SphereGeometry(0.02, 10, 10);
    const microBeaconA = new THREE.Mesh(microBeaconGeo, satMat1);
    microBeaconA.position.set(1.62, 0, 0);
    upperGimbalGroup.add(microBeaconA);
    const microBeaconB = new THREE.Mesh(microBeaconGeo, satMat1);
    microBeaconB.position.set(-1.62, 0, 0);
    upperGimbalGroup.add(microBeaconB);
    disposables.push(microBeaconGeo);

    // ─── 6. Ambient Quantum Stardust: Luminous Micro-Particles with Additive Glow ──
    const particleCount = isMobile ? 110 : 190;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 6.5;
      positions[i + 1] = (Math.random() - 0.5) * 5.5;
      positions[i + 2] = (Math.random() - 0.5) * 5.5;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const stardustTexture = createStardustGlowTexture();
    const particleMat = new THREE.PointsMaterial({
      size: isMobile ? 0.075 : 0.095,
      map: stardustTexture || undefined,
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const particlePoints = new THREE.Points(particleGeo, particleMat);
    scene.add(particlePoints);
    disposables.push(particleGeo, particleMat);
    if (stardustTexture) disposables.push(stardustTexture);

    // ─── 7. Hollywood Sci-Fi Avatar Hologram Shader Uniforms ──
    const holoUniforms = {
      uTime: { value: 0 },
      uHoloColor: { value: new THREE.Color(0x22d3ee) },
      uRimColor: { value: new THREE.Color(0xa855f7) },
      uHoloIntensity: { value: 0.55 },
    };

    const avatarGroup = new THREE.Group();
    masterPivot.add(avatarGroup);

    const loader = new GLTFLoader();
    loader.load(
      '/models/avatar.glb',
      (gltf) => {
        if (!isMounted) return;
        const model = gltf.scene;

        const box = new THREE.Box3().setFromObject(model);
        const center = new THREE.Vector3();
        const size = new THREE.Vector3();
        box.getCenter(center);
        box.getSize(size);

        model.position.x = -center.x;
        model.position.y = -center.y;
        model.position.z = -center.z;

        const maxDim = Math.max(size.x, size.y, size.z);
        // Slightly enlarged avatar size for a commanding, cinematic presence without cropping
        const targetSize = isMobile ? 3.35 : 3.75;
        const scaleFactor = targetSize / maxDim;
        avatarGroup.scale.setScalar(scaleFactor);
        avatarGroup.position.set(0, 0.12, 0);

        // Inject Hollywood Sci-Fi Holographic Shader into Avatar Materials
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = false;
            mesh.receiveShadow = false;
            if (mesh.material) {
              const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
              materials.forEach((m) => {
                if ('roughness' in m) {
                  const mat = m as THREE.MeshStandardMaterial;
                  mat.roughness = Math.max(mat.roughness ?? 0.5, 0.4);
                  mat.metalness = Math.min(mat.metalness ?? 0.1, 0.2);

                  // Inject Sci-Fi Hologram Fresnel Edge & Volumetric Scanline Waves
                  try {
                    mat.onBeforeCompile = (shader) => {
                      shader.uniforms.uTime = holoUniforms.uTime;
                      shader.uniforms.uHoloColor = holoUniforms.uHoloColor;
                      shader.uniforms.uRimColor = holoUniforms.uRimColor;
                      shader.uniforms.uHoloIntensity = holoUniforms.uHoloIntensity;

                      shader.vertexShader = shader.vertexShader.replace(
                        '#include <common>',
                        `#include <common>
                         varying highp vec3 vHoloWorldPos;
                         varying highp vec3 vHoloNormal;
                        `
                      );
                      shader.vertexShader = shader.vertexShader.replace(
                        '#include <worldpos_vertex>',
                        `#include <worldpos_vertex>
                         vHoloWorldPos = (modelMatrix * vec4(transformed, 1.0)).xyz;
                         vHoloNormal = normalize(normalMatrix * normal);
                        `
                      );

                      shader.fragmentShader = shader.fragmentShader.replace(
                        '#include <common>',
                        `#include <common>
                         uniform float uTime;
                         uniform vec3 uHoloColor;
                         uniform vec3 uRimColor;
                         uniform float uHoloIntensity;
                         varying highp vec3 vHoloWorldPos;
                         varying highp vec3 vHoloNormal;
                        `
                      );

                      shader.fragmentShader = shader.fragmentShader.replace(
                        '#include <dithering_fragment>',
                        `#include <dithering_fragment>
                         // When uHoloIntensity is 0.0 (ORIGINAL mode), no holographic pass is applied
                         if (uHoloIntensity > 0.01) {
                           // Hollywood Sci-Fi Hologram Fresnel Edge Luminescence (safe normalDot)
                           vec3 viewDir = normalize(cameraPosition - vHoloWorldPos);
                           float normalDot = clamp(dot(normalize(vHoloNormal), viewDir), 0.0, 1.0);
                           float fresnel = pow(1.0 - normalDot, 2.5);

                           // Fine horizontal holographic scanline shimmer
                           float scanline = sin((vHoloWorldPos.y + uTime * 0.35) * 42.0);
                           float scanMask = smoothstep(0.35, 0.9, scanline * 0.5 + 0.5) * 0.12;

                           // Upward holographic coherence wave pulse
                           float wave = sin(vHoloWorldPos.y * 3.2 - uTime * 2.2);
                           float waveMask = smoothstep(0.92, 1.0, wave) * 0.22;

                           // Cinematic Hollywood Sci-Fi color gradient
                           vec3 glowColor = mix(uHoloColor, uRimColor, fresnel * 0.85);

                           // Composite subtle holographic photonic glow onto natural textures
                           gl_FragColor.rgb += glowColor * ((fresnel * 0.52 + scanMask + waveMask) * uHoloIntensity);
                         }
                        `
                      );
                    };
                    mat.needsUpdate = true;
                  } catch (e) {
                    console.warn('[Hero3D] Shader compile hook fallback:', e);
                  }
                }
              });
            }
          }
        });

        avatarGroup.add(model);
        setIsLoaded(true);
        setLoadProgress(100);

        fitCameraToViewport();
      },
      (xhr) => {
        if (!isMounted) return;
        if (xhr.total > 0) {
          const pct = Math.round((xhr.loaded / xhr.total) * 100);
          setLoadProgress(pct);
        }
      },
      (err) => {
        if (!isMounted) return;
        console.warn('[Hero3D] avatar.glb could not be loaded, using procedural fallback:', err);
        const fallbackGeo = new THREE.IcosahedronGeometry(1.3, 2);
        const fallbackMat = new THREE.MeshStandardMaterial({
          color: 0x22d3ee,
          wireframe: true,
          emissive: 0x0891b2,
          emissiveIntensity: 0.6,
        });
        const fallbackMesh = new THREE.Mesh(fallbackGeo, fallbackMat);
        avatarGroup.add(fallbackMesh);
        avatarGroup.position.set(0, 0.12, 0);
        disposables.push(fallbackGeo, fallbackMat);
        setIsLoaded(true);
        fitCameraToViewport();
      }
    );

    fitCameraToViewport();

    // ─── 8. Window Resize Handler ─────────────────────────────
    const onResize = () => {
      if (!container || !renderer) return;
      renderer.setSize(container.clientWidth, container.clientHeight);
      fitCameraToViewport();
    };
    window.addEventListener('resize', onResize);

    // ─── 9. WebGL Context Loss Handler ────────────────────────
    const handleContextLost = (e: Event) => {
      e.preventDefault();
      console.warn('[Hero3D] WebGL context lost.');
      cancelAnimationFrame(animId);
    };

    const handleContextRestored = () => {
      console.info('[Hero3D] WebGL context restored.');
      fitCameraToViewport();
      animId = requestAnimationFrame(animate);
    };

    renderer.domElement.addEventListener('webglcontextlost', handleContextLost, false);
    renderer.domElement.addEventListener('webglcontextrestored', handleContextRestored, false);

    // ─── 10. Animation Loop ──────────────────────────────────
    let animId: number;
    const clock = new THREE.Clock();
    let prevSpectrum: HoloSpectrum = 'photonic';

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Update holographic shader time
      holoUniforms.uTime.value = elapsedTime;

      // Dynamic Hologram Spectrum Switcher
      const currentSpectrum = spectrumRef.current;
      if (currentSpectrum !== prevSpectrum) {
        prevSpectrum = currentSpectrum;
        const profile = COLOR_PROFILES[currentSpectrum];

        if (currentSpectrum === 'original') {
          // Zero holographic glow for original textured 3D model
          holoUniforms.uHoloIntensity.value = 0.0;
          keyLight.intensity = 2.4;
          fillLight.intensity = 1.3;
          rimLightA.color.setHex(0xe2e8f0);
          rimLightB.color.setHex(0xcbd5e1);
          rimLightA.intensity = 1.8;
          rimLightB.intensity = 1.4;
          particleMat.color.setHex(0x38bdf8);
        } else {
          holoUniforms.uHoloIntensity.value = 0.55;
          holoUniforms.uHoloColor.value.setHex(profile.primary);
          holoUniforms.uRimColor.value.setHex(profile.rim);
          keyLight.intensity = 2.2;
          fillLight.intensity = 1.0;
          rimLightA.color.setHex(profile.primary);
          rimLightB.color.setHex(profile.rim);
          rimLightA.intensity = 5.2;
          rimLightB.intensity = 4.5;
          particleMat.color.setHex(profile.secondary);
        }

        baseRim1Mat.color.setHex(profile.primary);
        baseRim1Mat.emissive.setHex(profile.primary);
        baseRim2Mat.color.setHex(profile.rim);
        baseRim2Mat.emissive.setHex(profile.rim);
        floorTrackMat.color.setHex(profile.primary);
        spokeMat.color.setHex(profile.primary);
        pylonMat.color.setHex(profile.primary);
        collimatorMat.color.setHex(profile.primary);
        haloRingMat.color.setHex(profile.primary);
        haloRingMat.emissive.setHex(profile.primary);
        tickMat.color.setHex(profile.primary);
        eqRingMat.color.setHex(profile.primary);
        eqRingMat.emissive.setHex(profile.primary);
        satMat1.color.setHex(profile.primary);
        satMat2.color.setHex(profile.secondary);
        eqOuterTrackMat.color.setHex(profile.rim);
        upperGimbalMat.color.setHex(profile.secondary);
        upperGimbalMat.emissive.setHex(profile.secondary);
      }

      // Smooth Rotation Controller
      if (!isMobile && controls) {
        controls.autoRotate = !isInteracting;
        controls.update();
      } else {
        // Mobile physics-based smooth momentum / inertia handling:
        if (isUserDragging) {
          // Responsive tracking while finger is moving (smooth lerp eliminates touch sampling jitter)
          masterPivot.rotation.y += (targetRotationY - masterPivot.rotation.y) * 0.35;
        } else {
          // When touch ends: smooth exponential friction / inertia decay
          if (Math.abs(angularVelocity) > 0.0002) {
            masterPivot.rotation.y += angularVelocity;
            angularVelocity *= 0.93; // buttery-smooth momentum glide
            targetRotationY = masterPivot.rotation.y;
          } else {
            angularVelocity = 0;
            if (!isInteracting) {
              masterPivot.rotation.y += autoRotateSpeed;
              targetRotationY = masterPivot.rotation.y;
            }
          }
        }
      }

      // Update live Azimuth Telemetry HUD Readout (direct DOM update for 60fps performance)
      if (azimuthRef.current) {
        const currentRotY = (masterPivot.rotation.y % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
        const deg = Math.round((currentRotY * 180) / Math.PI);
        const modeLabel = currentSpectrum === 'original' ? 'SPATIAL MESH v8.2' : 'PHOTONIC MATRIX v8.2';
        azimuthRef.current.innerText = `${modeLabel} // AZIMUTH: ${deg.toString().padStart(3, '0')}°`;
      }

      // Gentle floating / levitating breathing movement
      avatarGroup.position.y = 0.12 + Math.sin(elapsedTime * 1.5) * 0.05;

      // Base rings gentle rotational drift
      baseRim1.rotation.z = elapsedTime * 0.1;
      baseRim2.rotation.z = -elapsedTime * 0.07;

      // Collimator beam pulsing containment field
      collimatorMat.opacity = 0.28 + Math.sin(elapsedTime * 3.0) * 0.14;

      // Biometric head scanner reticle slow counter-rotation behind head
      haloRing.rotation.z = -elapsedTime * 0.08;
      innerHalo.rotation.z = elapsedTime * 0.10;

      // Clean Equatorial Telemetry Rail & Twin Satellites
      equatorialGroup.rotation.z = elapsedTime * 0.07;
      const satAngle1 = elapsedTime * 0.85;
      satNodeAlpha.position.set(Math.cos(satAngle1) * 1.95, Math.sin(satAngle1) * 1.95, 0);

      const satAngle2 = -elapsedTime * 0.72 + Math.PI;
      satNodeBeta.position.set(Math.cos(satAngle2) * 2.14, Math.sin(satAngle2) * 2.14, 0);

      // Upper Gimbal Arch counter-drift
      upperGimbalGroup.rotation.z = -elapsedTime * 0.05;

      // Quantum stardust slow rotational drift + subtle twinkle
      particlePoints.rotation.y = elapsedTime * 0.02;
      particleMat.opacity = 0.75 + Math.sin(elapsedTime * 2.0) * 0.15;

      // Pulsing rim lights in holographic modes
      if (currentSpectrum !== 'original') {
        rimLightA.intensity = 4.8 + Math.sin(elapsedTime * 2.2) * 1.2;
        rimLightB.intensity = 4.2 + Math.cos(elapsedTime * 1.8) * 1.0;
      }

      renderer.render(scene, camera);
    };
    animate();

    // ─── 11. Cleanup ──────────────────────────────────────────
    return () => {
      isMounted = false;
      cancelAnimationFrame(animId);
      if (idleTimer) clearTimeout(idleTimer);
      window.removeEventListener('resize', onResize);

      if (renderer) {
        renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
        renderer.domElement.removeEventListener('webglcontextrestored', handleContextRestored);
      }

      if (controls) controls.dispose();

      disposables.forEach((item) => {
        if ('dispose' in item && typeof item.dispose === 'function') {
          item.dispose();
        }
      });

      if (container && renderer && renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
      if (renderer) renderer.dispose();
    };
  }, []);

  if (!hasWebGL) {
    return (
      <div className="relative w-full h-[480px] sm:h-[540px] lg:h-[610px] flex flex-col items-center justify-center p-6 border border-cyan-500/20 rounded-2xl bg-[#08090B]/80 font-mono text-center select-none">
        <div className="relative w-16 h-16 flex items-center justify-center mb-4 rounded-full border border-cyan-500/30 bg-cyan-950/30">
          <Cpu className="w-8 h-8 text-cyan-400 animate-pulse" />
        </div>
        <h3 className="text-sm font-semibold text-cyan-300 tracking-wider mb-1">
          SPATIAL 3D ENGINE STANDBY
        </h3>
        <p className="text-xs text-gray-400 max-w-xs mb-4">
          Hardware WebGL acceleration unavailable on this device mode. Mainframe content nominal.
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[480px] sm:h-[540px] lg:h-[610px] flex items-center justify-center overflow-visible select-none">
      {/* Hollywood Sci-Fi Corner HUD Reticle Brackets */}
      <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-cyan-400/40 pointer-events-none" />
      <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-cyan-400/40 pointer-events-none" />
      <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-cyan-400/40 pointer-events-none" />
      <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-cyan-400/40 pointer-events-none" />

      {/* 3D Canvas Container */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        style={{ touchAction: 'pan-y' }}
        title="Swipe horizontally to rotate 3D Avatar"
      />

      {/* Loading Overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#08090B]/60 backdrop-blur-sm font-mono text-xs text-cyan-400 gap-3 pointer-events-none">
          <div className="relative w-12 h-12 flex items-center justify-center">
            <div className="absolute inset-0 border-2 border-cyan-500/20 rounded-full animate-ping" />
            <div className="w-10 h-10 border-2 border-t-cyan-400 border-r-transparent border-b-purple-500 border-l-transparent rounded-full animate-spin" />
          </div>
          <span className="tracking-widest">CALIBRATING PHOTONIC LATTICE {loadProgress > 0 ? `${loadProgress}%` : ''}</span>
        </div>
      )}

      {/* Top Left: Sci-Fi Telemetry Readout 
      {isLoaded && (
        <div className="absolute top-3 left-3 hidden sm:flex flex-col gap-0.5 px-2.5 py-1.5 rounded-lg border border-cyan-500/20 bg-[#08090B]/75 backdrop-blur-md font-mono text-[9px] text-cyan-400/80 pointer-events-none tracking-wider shadow-[0_0_12px_rgba(34,211,238,0.08)]">
          <div className="flex items-center gap-1.5 font-semibold text-cyan-300">
            <Cpu className="w-3 h-3 text-cyan-400 animate-pulse" />
            <span>{spectrum === 'original' ? 'SPATIAL MESH v8.2' : 'PHOTONIC MATRIX v8.2'}</span>
          </div>
          <span ref={azimuthRef} className="text-gray-400">
            AZIMUTH: 000° // 584.2 THz
          </span>
        </div>
      )}  */}

      {/* Top Right: Status indicator pill */}
      {isLoaded && (
        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-cyan-500/30 bg-[#08090B]/75 backdrop-blur-md font-mono text-[10px] text-cyan-300 pointer-events-none shadow-[0_0_15px_rgba(34,211,238,0.15)]">
          <span className={`w-1.5 h-1.5 rounded-full ${spectrum === 'original' ? 'bg-sky-400' : 'bg-emerald-400 animate-ping'}`} />
          <span>{spectrum === 'original' ? 'ORIGINAL 3D AVATAR' : 'HOLOGRAM ACTIVE'}</span>
        </div>
      )}

      {/* Bottom Center: Drag Hint + 4 Spectrum / Style Selector Buttons */}
      {isLoaded && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 z-10 max-w-[95%]">
          {/* 4 Interactive Frequency & Style Modes */}
          <div className="flex items-center gap-1 p-1 rounded-full border border-white/10 bg-[#08090B]/85 backdrop-blur-lg shadow-[0_0_20px_rgba(0,0,0,0.6)] overflow-x-auto max-w-full">
            <button
              type="button"
              onClick={() => setSpectrum('photonic')}
              className={`px-2.5 py-0.5 rounded-full font-mono text-[9px] font-semibold transition-all duration-300 whitespace-nowrap ${spectrum === 'photonic'
                ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-500/60 shadow-[0_0_10px_rgba(34,211,238,0.4)]'
                : 'text-gray-400 hover:text-cyan-300'
                }`}
            >
              PHOTONIC
            </button>
            <button
              type="button"
              onClick={() => setSpectrum('quantum')}
              className={`px-2.5 py-0.5 rounded-full font-mono text-[9px] font-semibold transition-all duration-300 whitespace-nowrap ${spectrum === 'quantum'
                ? 'bg-purple-500/25 text-purple-300 border border-purple-500/60 shadow-[0_0_10px_rgba(168,85,247,0.4)]'
                : 'text-gray-400 hover:text-purple-300'
                }`}
            >
              QUANTUM
            </button>
            <button
              type="button"
              onClick={() => setSpectrum('matrix')}
              className={`px-2.5 py-0.5 rounded-full font-mono text-[9px] font-semibold transition-all duration-300 whitespace-nowrap ${spectrum === 'matrix'
                ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/60 shadow-[0_0_10px_rgba(16,185,129,0.4)]'
                : 'text-gray-400 hover:text-emerald-300'
                }`}
            >
              MATRIX
            </button>
            <button
              type="button"
              onClick={() => setSpectrum('original')}
              className={`px-2.5 py-0.5 rounded-full font-mono text-[9px] font-semibold transition-all duration-300 whitespace-nowrap ${spectrum === 'original'
                ? 'bg-sky-500/25 text-sky-200 border border-sky-400/60 shadow-[0_0_10px_rgba(56,189,248,0.4)]'
                : 'text-gray-400 hover:text-sky-300'
                }`}
            >
              RAW
            </button>
          </div>

          {/* Swipe / Drag 360 Hint */}
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-cyan-500/20 bg-[#08090B]/60 backdrop-blur-sm font-mono text-[9px] text-cyan-400/80 pointer-events-none whitespace-nowrap">
            <Rotate3d className="w-3 h-3 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
            <span>SWIPE TO ROTATE 360°</span>
          </div>
        </div>
      )}
    </div>
  );
};
