import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Rotate3d, Sparkles, Eye } from 'lucide-react';

export const HeroThreeScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loadProgress, setLoadProgress] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isUserInteracting, setIsUserInteracting] = useState<boolean>(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isMobile = window.innerWidth < 768;

    // ─── 1. Scene, Camera, Renderer ──────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0.4, 5.2);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // ─── 2. OrbitControls (Smooth mouse drag interaction) ────
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false; // Prevent page scroll interference
    controls.enablePan = false;
    controls.minPolarAngle = Math.PI / 3;     // Don't flip upside down
    controls.maxPolarAngle = Math.PI / 1.7;   // Keep upright
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.2;

    controls.addEventListener('start', () => setIsUserInteracting(true));
    controls.addEventListener('end', () => {
      // Resume slow auto-rotation after 3s of inactivity
      setTimeout(() => setIsUserInteracting(false), 3000);
    });

    // ─── 3. Lighting (Studio Key + Cyber Rim) ─────────────────
    // Neutral ambient light for realistic texture clarity
    const ambientLight = new THREE.AmbientLight(0xf8fafc, 1.4);
    scene.add(ambientLight);

    // Natural Key Light (frontal-right)
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(3, 4, 4);
    scene.add(keyLight);

    // Soft Fill Light (frontal-left)
    const fillLight = new THREE.DirectionalLight(0xe2e8f0, 1.0);
    fillLight.position.set(-3, 2, 3);
    scene.add(fillLight);

    // Cyber Cyan Rim Light (top-back)
    const cyanRim = new THREE.PointLight(0x22d3ee, 5, 15);
    cyanRim.position.set(2.5, 2.5, -2);
    scene.add(cyanRim);

    // Electric Purple Rim Light (bottom-back)
    const purpleRim = new THREE.PointLight(0xa855f7, 4.5, 15);
    purpleRim.position.set(-2.5, -1.5, -2);
    scene.add(purpleRim);

    // Top Halo Light
    const topLight = new THREE.PointLight(0x38bdf8, 2.5, 10);
    topLight.position.set(0, 4, 0);
    scene.add(topLight);

    // ─── 4. Pedestal & Cyber Rings ───────────────────────────
    const cyberGroup = new THREE.Group();
    scene.add(cyberGroup);

    // Pedestal Ring 1 (Cyan)
    const ringGeo1 = new THREE.TorusGeometry(1.6, 0.012, 16, 100);
    const ringMat1 = new THREE.MeshStandardMaterial({
      color: 0x22d3ee,
      emissive: 0x22d3ee,
      emissiveIntensity: 0.8,
      transparent: true,
      opacity: 0.65,
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 2;
    ring1.position.y = -1.5;
    cyberGroup.add(ring1);

    // Pedestal Ring 2 (Purple - Outer)
    const ringGeo2 = new THREE.TorusGeometry(2.0, 0.008, 16, 100);
    const ringMat2 = new THREE.MeshStandardMaterial({
      color: 0xa855f7,
      emissive: 0xa855f7,
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.45,
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.x = Math.PI / 2;
    ring2.position.y = -1.6;
    cyberGroup.add(ring2);

    // Diagonal Gyro Ring
    const gyroGeo = new THREE.TorusGeometry(2.3, 0.006, 16, 100);
    const gyroMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.35,
    });
    const gyroRing = new THREE.Mesh(gyroGeo, gyroMat);
    gyroRing.rotation.x = Math.PI / 3;
    gyroRing.rotation.y = Math.PI / 6;
    cyberGroup.add(gyroRing);

    // ─── 5. Ambient Quantum Particles ─────────────────────────
    const particleCount = isMobile ? 120 : 250;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 8;
      positions[i + 1] = (Math.random() - 0.5) * 6;
      positions[i + 2] = (Math.random() - 0.5) * 6;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.025,
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    const particlePoints = new THREE.Points(particleGeo, particleMat);
    scene.add(particlePoints);

    // ─── 6. Load avatar.glb ──────────────────────────────────
    const avatarGroup = new THREE.Group();
    scene.add(avatarGroup);

    const loader = new GLTFLoader();
    loader.load(
      '/models/avatar.glb',
      (gltf) => {
        const model = gltf.scene;

        // Compute Bounding Box to perfectly center and auto-scale
        const box = new THREE.Box3().setFromObject(model);
        const center = new THREE.Vector3();
        const size = new THREE.Vector3();
        box.getCenter(center);
        box.getSize(size);

        // Center model origin
        model.position.x = -center.x;
        model.position.y = -center.y;
        model.position.z = -center.z;

        // Auto-scale to fill viewport nicely (target height ~3.1 units)
        const maxDim = Math.max(size.x, size.y, size.z);
        const targetSize = isMobile ? 2.8 : 3.2;
        const scaleFactor = targetSize / maxDim;
        avatarGroup.scale.setScalar(scaleFactor);

        // Enhance materials
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            if (mesh.material) {
              const mat = mesh.material as THREE.MeshStandardMaterial;
              mat.roughness = Math.max(mat.roughness ?? 0.5, 0.4);
              mat.metalness = Math.min(mat.metalness ?? 0.1, 0.2);
              mat.needsUpdate = true;
            }
          }
        });

        avatarGroup.add(model);
        setIsLoaded(true);
        setLoadProgress(100);
      },
      (xhr) => {
        if (xhr.total > 0) {
          const pct = Math.round((xhr.loaded / xhr.total) * 100);
          setLoadProgress(pct);
        }
      },
      (err) => {
        console.warn('Failed to load avatar.glb, fallback active:', err);
        // Fallback procedural hologram if glb fails
        const fallbackGeo = new THREE.IcosahedronGeometry(1.4, 2);
        const fallbackMat = new THREE.MeshStandardMaterial({
          color: 0x22d3ee,
          wireframe: true,
          emissive: 0x0891b2,
          emissiveIntensity: 0.5,
        });
        const fallbackMesh = new THREE.Mesh(fallbackGeo, fallbackMat);
        avatarGroup.add(fallbackMesh);
        setIsLoaded(true);
      }
    );

    // ─── 7. Resize Handler ───────────────────────────────────
    const onResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', onResize);

    // ─── 8. Animation Loop ───────────────────────────────────
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Update OrbitControls
      controls.autoRotate = !isUserInteracting;
      controls.update();

      // Gentle floating / breathing idle motion
      avatarGroup.position.y = Math.sin(elapsedTime * 1.6) * 0.08;

      // Cyber rings spin
      ring1.rotation.z = elapsedTime * 0.15;
      ring2.rotation.z = -elapsedTime * 0.12;
      gyroRing.rotation.y = elapsedTime * 0.2;
      gyroRing.rotation.z = elapsedTime * 0.1;

      // Particles slow drift
      particlePoints.rotation.y = elapsedTime * 0.03;
      particlePoints.rotation.x = elapsedTime * 0.015;

      // Pulse rim lights
      cyanRim.intensity = 5 + Math.sin(elapsedTime * 2.5) * 1.5;
      purpleRim.intensity = 4.5 + Math.cos(elapsedTime * 2.0) * 1.2;

      renderer.render(scene, camera);
    };
    animate();

    // ─── 9. Cleanup ──────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      controls.dispose();
      if (container && renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isUserInteracting]);

  return (
    <div className="relative w-full h-[450px] sm:h-[520px] lg:h-[580px] flex items-center justify-center">
      {/* 3D Canvas Container */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing select-none"
        title="Click and drag to rotate 3D Avatar"
      />

      {/* Loading Overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#08090B]/60 backdrop-blur-sm font-mono text-xs text-cyan-400 gap-3 pointer-events-none">
          <div className="relative w-12 h-12 flex items-center justify-center">
            <div className="absolute inset-0 border-2 border-cyan-500/20 rounded-full animate-ping" />
            <div className="w-10 h-10 border-2 border-t-cyan-400 border-r-transparent border-b-purple-500 border-l-transparent rounded-full animate-spin" />
          </div>
          <span className="tracking-widest">LOADING 3D AVATAR {loadProgress > 0 ? `${loadProgress}%` : ''}</span>
        </div>
      )}

      {/* Interactive Badge / Drag Hint */}
      {isLoaded && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-500/20 bg-[#08090B]/75 backdrop-blur-md font-mono text-[10px] text-cyan-300 pointer-events-none shadow-[0_0_15px_rgba(34,211,238,0.15)] transition-opacity duration-300">
          <Rotate3d className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
          <span>DRAG TO ROTATE 360°</span>
        </div>
      )}

      {/* Status indicator pill (top right) */}
      {isLoaded && (
        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-white/10 bg-[#08090B]/60 backdrop-blur-md font-mono text-[10px] text-gray-400 pointer-events-none">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>3D HOLOGRAM ACTIVE</span>
        </div>
      )}
    </div>
  );
};
