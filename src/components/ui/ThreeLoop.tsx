"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function ThreeLoop() {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftInfoRef = useRef<HTMLDivElement>(null);
  const rightInfoRef = useRef<HTMLDivElement>(null);
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    // 1. Check WebGL support
    const checkWebGL = () => {
      try {
        const canvas = document.createElement("canvas");
        return !!(
          window.WebGLRenderingContext &&
          (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
        );
      } catch (e) {
        return false;
      }
    };

    if (!checkWebGL()) {
      setWebglSupported(false);
      return;
    }

    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }

    const container = containerRef.current;
    if (!container) return;

    // 2. Set up Three.js scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.z = 12;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Ensure size is set correctly even if container is slow to size
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // OrbitControls for true, smooth interactivity
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.04;
    controls.enableZoom = false; // Disable zoom to keep it neat in UI
    controls.enablePan = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.5;

    // 3. Create Custom Möbius Strip Geometry
    const uSegments = 120;
    const vSegments = 30;
    const vertices: number[] = [];
    const indices: number[] = [];
    const uvs: number[] = [];

    for (let j = 0; j <= vSegments; j++) {
      const v = j / vSegments;
      for (let i = 0; i <= uSegments; i++) {
        const u = i / uSegments;

        const uRad = u * Math.PI * 2;
        const vVal = (v - 0.5) * 2.0; 
        const R = 3.0; 

        // Möbius Parametric Equations
        const x = (R + vVal * Math.cos(uRad / 2)) * Math.cos(uRad);
        const y = (R + vVal * Math.cos(uRad / 2)) * Math.sin(uRad);
        const z = vVal * Math.sin(uRad / 2);

        vertices.push(x, y, z);
        uvs.push(u, v);
      }
    }

    for (let j = 0; j < vSegments; j++) {
      for (let i = 0; i < uSegments; i++) {
        const a = j * (uSegments + 1) + i;
        const b = j * (uSegments + 1) + (i + 1);
        const c = (j + 1) * (uSegments + 1) + i;
        const d = (j + 1) * (uSegments + 1) + (i + 1);

        indices.push(a, b, d);
        indices.push(a, d, c);
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();

    // 4. Create Luxurious Material
    const material = new THREE.MeshPhysicalMaterial({
      color: 0xc9a898, 
      metalness: 0.2,
      roughness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.15,
      transmission: 0.8, // Glass effect
      thickness: 1.5,
      ior: 1.5,
      side: THREE.DoubleSide,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Initial rotation
    mesh.rotation.x = Math.PI / 6;

    // 5. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const light1 = new THREE.PointLight(0xff758c, 10, 30); // Rose
    const light2 = new THREE.PointLight(0x75e6da, 10, 30); // Sage
    const light3 = new THREE.PointLight(0xffd3b6, 10, 30); // Gold
    scene.add(light1);
    scene.add(light2);
    scene.add(light3);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    // 6. GSAP ScrollTrigger Integration
    const scrollTween = gsap.to(scene.rotation, {
      y: Math.PI * 1.5,
      scrollTrigger: {
        trigger: container,
        start: "top center",
        end: "bottom top",
        scrub: 1.5,
      },
    });

    // Interaction states
    let isHovered = false;

    // Hover effect interactions
    const onPointerEnter = () => {
      isHovered = true;
      gsap.to(material.color, { r: 1.0, g: 0.8, b: 0.8, duration: 0.4 });
      controls.autoRotateSpeed = 0.5; // Slow down on hover
    };

    const onPointerLeave = () => {
      isHovered = false;
      gsap.to(material.color, { r: 0.788, g: 0.658, b: 0.596, duration: 0.4 }); // Revert to 0xc9a898
      controls.autoRotateSpeed = 1.5;
    };

    container.addEventListener("pointerenter", onPointerEnter);
    container.addEventListener("pointerleave", onPointerLeave);

    // 7. Resize Listener
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener("resize", handleResize);
    
    // Initial resize trigger to guarantee fit
    setTimeout(handleResize, 100);

    // 8. Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      const time = clock.getElapsedTime();

      // Orbit point lights in 3D space
      light1.position.x = Math.sin(time * 0.8) * 6;
      light1.position.z = Math.cos(time * 0.8) * 6;
      light1.position.y = Math.sin(time * 0.5) * 2;

      light2.position.x = Math.cos(time * 0.6 + 2) * 6;
      light2.position.z = Math.sin(time * 0.6 + 2) * 6;
      light2.position.y = Math.cos(time * 0.8) * 3;

      light3.position.x = Math.sin(time * 0.5 + 4) * 6;
      light3.position.y = Math.cos(time * 0.5 + 4) * 6;
      light3.position.z = Math.sin(time * 0.7) * 3;

      // Gentle floating animation
      const floatOffset = Math.sin(time);
      mesh.position.y = floatOffset * 0.2;
      
      // Sync DOM elements floating (multiply by pixels for visible DOM movement)
      if (leftInfoRef.current) {
        leftInfoRef.current.style.transform = `translateY(${-floatOffset * 10}px)`;
      }
      if (rightInfoRef.current) {
        rightInfoRef.current.style.transform = `translateY(${-floatOffset * 10}px)`;
      }

      controls.update(); // Required if controls.enableDamping or controls.autoRotate are set
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    // 9. Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("pointerenter", onPointerEnter);
      container.removeEventListener("pointerleave", onPointerLeave);
      
      if (scrollTween.scrollTrigger) {
        scrollTween.scrollTrigger.kill();
      }
      scrollTween.kill();
      
      cancelAnimationFrame(animationFrameId);
      controls.dispose();
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  if (!webglSupported) {
    return (
      <div className="relative w-full h-[350px] md:h-[500px] flex items-center justify-center rounded-3xl overflow-hidden glass border border-rose/20">
        <div className="absolute inset-0 bg-gradient-to-br from-charcoal-light via-[#2a1f2e] to-charcoal opacity-80" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url(https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&q=80)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent" />
        
        {/* Fallback floating info - uses CSS animation since JS loop isn't running */}
        <div className="absolute bottom-6 left-6 z-20 animate-[float_4s_ease-in-out_infinite]">
          <div className="glass rounded-2xl px-5 py-4 cursor-pointer group transition-all hover:scale-105 hover:-translate-y-1">
            <p className="text-xs text-parchment/60 mb-1 group-hover:text-sage transition-colors">Rent from</p>
            <p className="font-display text-2xl font-bold text-parchment">
              ₹499<span className="text-sm text-parchment/50 font-normal">/day</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[350px] md:h-[500px] flex items-center justify-center rounded-3xl overflow-hidden group">
      {/* 3D Canvas Container */}
      <div 
        ref={containerRef} 
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing transition-opacity duration-700" 
      />
      
      {/* Floating Info Overlay tags (Synced with 3D animation) */}
      <div ref={leftInfoRef} className="absolute bottom-6 left-6 z-20">
        <div className="glass rounded-2xl px-5 py-4 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(201,168,152,0.3)] cursor-pointer hover:-translate-y-1 group">
          <p className="text-xs text-parchment/60 mb-1 transition-colors group-hover:text-parchment/90">Rent from</p>
          <p className="font-display text-2xl font-bold text-parchment">
            ₹499
            <span className="text-sm text-parchment/50 font-normal">/day</span>
          </p>
        </div>
      </div>

      <div ref={rightInfoRef} className="absolute top-6 right-6 z-20">
        <div className="glass rounded-2xl px-5 py-4 max-w-[160px] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(117,230,218,0.2)] cursor-pointer hover:-translate-y-1 group">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-sage animate-pulse shadow-[0_0_8px_rgba(117,230,218,0.8)]" />
            <span className="text-[10px] text-sage font-bold tracking-widest uppercase">In The Loop</span>
          </div>
          <p className="text-xs text-parchment/70 leading-relaxed font-body">
            Infinite Wardrobe, Zero Waste
          </p>
        </div>
      </div>
    </div>
  );
}
