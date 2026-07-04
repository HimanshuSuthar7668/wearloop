"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function ThreeLoop() {
  const containerRef = useRef<HTMLDivElement>(null);
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

    // Renderer with antialiasing and transparency
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    container.appendChild(renderer.domElement);

    // 3. Create Custom Möbius Strip Geometry
    const uSegments = 100;
    const vSegments = 24;
    const vertices: number[] = [];
    const indices: number[] = [];
    const uvs: number[] = [];

    for (let j = 0; j <= vSegments; j++) {
      const v = j / vSegments; // [0, 1]
      for (let i = 0; i <= uSegments; i++) {
        const u = i / uSegments; // [0, 1]

        const uRad = u * Math.PI * 2;
        const vVal = (v - 0.5) * 1.6; // Ribbon width
        const R = 3.2; // Major radius of the loop

        // Möbius Parametric Equations
        const x = (R + vVal * Math.cos(uRad / 2)) * Math.cos(uRad);
        const y = (R + vVal * Math.cos(uRad / 2)) * Math.sin(uRad);
        const z = vVal * Math.sin(uRad / 2);

        vertices.push(x, y, z);
        uvs.push(u, v);
      }
    }

    // Build face indices
    for (let j = 0; j < vSegments; j++) {
      for (let i = 0; i < uSegments; i++) {
        const a = j * (uSegments + 1) + i;
        const b = j * (uSegments + 1) + (i + 1);
        const c = (j + 1) * (uSegments + 1) + i;
        const d = (j + 1) * (uSegments + 1) + (i + 1);

        // Grid quad triangles
        indices.push(a, b, d);
        indices.push(a, d, c);
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();

    // 4. Create Material (Luxurious Silk/Glass effect)
    const material = new THREE.MeshPhysicalMaterial({
      color: 0xc9a898, // Sand/rose-gold brand tone
      metalness: 0.1,
      roughness: 0.15,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      transmission: 0.75, // Glass/silk translucency
      thickness: 1.5,
      ior: 1.5,
      side: THREE.DoubleSide,
      flatShading: false,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Rotate mesh initially to look good
    mesh.rotation.x = Math.PI / 6;
    mesh.rotation.y = Math.PI / 4;

    // 5. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    // Colored orbiting lights for shimmering specular reflections
    const light1 = new THREE.PointLight(0xff758c, 8, 30); // Rose
    const light2 = new THREE.PointLight(0x75e6da, 8, 30); // Sage/Cyan
    const light3 = new THREE.PointLight(0xffd3b6, 8, 30); // Gold
    scene.add(light1);
    scene.add(light2);
    scene.add(light3);

    // Directional helper light
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    // 6. Interactive State variables
    let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let scrollRotation = { x: mesh.rotation.x, y: mesh.rotation.y, scale: 1.0 };
    const dragRotation = { x: 0, y: 0 };
    const pulse = { value: 1 };
    let isDragging = false;
    let previousPointer = { x: 0, y: 0 };

    // 7. Mouse Move Event Listener
    const onMouseMove = (e: MouseEvent) => {
      // Normalize mouse coordinates (-1 to 1)
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      mouse.targetX = x * 0.4;
      mouse.targetY = y * 0.4;
    };
    window.addEventListener("mousemove", onMouseMove);

    // 7b. Drag-to-rotate + click pulse interaction
    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      previousPointer = { x: e.clientX, y: e.clientY };

      // Tactile scale punch
      gsap.to(pulse, { value: 1.1, duration: 0.18, yoyo: true, repeat: 1, ease: "power2.out" });
      // Brand-colored light flash on the material
      gsap.to(material.color, {
        r: 1.0,
        g: 0.55,
        b: 0.65,
        duration: 0.25,
        yoyo: true,
        repeat: 1,
        ease: "power2.out",
      });
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousPointer.x;
      const deltaY = e.clientY - previousPointer.y;
      dragRotation.y += deltaX * 0.006;
      dragRotation.x += deltaY * 0.006;
      previousPointer = { x: e.clientX, y: e.clientY };
    };
    const onPointerUp = () => {
      isDragging = false;
    };
    container.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    // 8. GSAP ScrollTrigger Integration
    const scrollTween = gsap.to(scrollRotation, {
      x: mesh.rotation.x + Math.PI * 1.5,
      y: mesh.rotation.y - Math.PI * 1.2,
      scale: 0.65,
      scrollTrigger: {
        trigger: container,
        start: "top center",
        end: "bottom top",
        scrub: 1.2,
      },
    });

    // 9. Resize Listener
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    // 10. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      const time = clock.getElapsedTime();

      // Smooth mouse hover interpolation (lerp)
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

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

      // Auto rotation + scroll rotation + mouse tilt + manual drag offset
      mesh.rotation.x = scrollRotation.x + mouse.y + dragRotation.x + time * 0.08;
      mesh.rotation.y = scrollRotation.y + mouse.x + dragRotation.y + time * 0.05;
      mesh.scale.setScalar(scrollRotation.scale * pulse.value);

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    // 11. Cleanup function on component unmount
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      if (scrollTween.scrollTrigger) {
        scrollTween.scrollTrigger.kill();
      }
      scrollTween.kill();
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  if (!webglSupported) {
    // Elegant fallback layout if WebGL is not supported
    return (
      <div className="relative w-72 h-96 md:w-80 md:h-[440px] rounded-2xl overflow-hidden glass flex items-center justify-center border border-rose/20">
        <div className="absolute inset-0 bg-gradient-to-br from-charcoal-light via-[#2a1f2e] to-charcoal opacity-80" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&q=80)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent" />
        <div className="absolute bottom-5 left-5 glass rounded-lg px-4 py-3 z-10">
          <p className="text-xs text-parchment/50 mb-0.5">Rent from</p>
          <p className="font-display text-xl font-semibold text-parchment">
            ₹499<span className="text-xs text-parchment/50 font-normal">/day</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[350px] md:h-[500px] flex items-center justify-center">
      {/* 3D Canvas Container */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />
      
      {/* Floating Info Overlay tags overlaying the 3D canvas */}
      <div className="absolute bottom-4 left-4 glass rounded-xl px-4 py-3 z-10 select-none pointer-events-none transition-transform hover:scale-105">
        <p className="text-xs text-parchment/50 mb-0.5">Rent from</p>
        <p className="font-display text-lg font-semibold text-parchment">
          ₹499
          <span className="text-xs text-parchment/50 font-normal">/day</span>
        </p>
      </div>

      <div className="absolute top-4 right-4 glass rounded-xl px-4 py-3 z-10 max-w-[130px] select-none pointer-events-none transition-transform hover:scale-105">
        <div className="flex items-center gap-1.5 mb-1">
          <div className="w-1.5 h-1.5 rounded-full bg-sage animate-pulse" />
          <span className="text-[10px] text-sage font-medium tracking-wider uppercase">In The Loop</span>
        </div>
        <p className="text-[10px] text-parchment/60 leading-relaxed font-body">
          Infinite Wardrobe
        </p>
      </div>
    </div>
  );
}
