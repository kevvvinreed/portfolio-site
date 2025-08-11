import { NextPage } from "next";
import Head from "next/head";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import styles from "../src/styles/pages/index.module.css";
import { IPageProps } from "./_app";

const Home: NextPage<IPageProps> = ({}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const globeRef = useRef<THREE.Group | null>(null);
  const animationIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 3;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create wireframe globe
    const globeGroup = new THREE.Group();
    const gridGeometry = new THREE.SphereGeometry(0.70, 12, 12);
    const gridMaterial = new THREE.MeshBasicMaterial({
      color: 0x25edc4,
      wireframe: true,
      transparent: true,
      opacity: 0.8
    });
    const grid = new THREE.Mesh(gridGeometry, gridMaterial);
    globeGroup.add(grid);


    // Initial position (off-screen)
    // globeGroup.position.x = -5;
    // globeGroup.rotation.y = Math.PI / 4;
    scene.add(globeGroup);
    globeRef.current = globeGroup;

    // Animation
    let startTime = Date.now();
    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const duration = 3000; // 2 seconds for entrance animation

      if (elapsed < duration) {
        // Entrance animation - slide in from left
        const progress = elapsed / duration;
        const easeIn = Math.pow(progress, 3); // Cubic ease-in
        globeGroup.position.x = -5 + (5 * easeIn);
        globeGroup.rotation.y = Math.PI / 4 + (Math.PI * 2 * easeIn);
      } else {
        // Continuous rotation
        globeGroup.rotation.y += 0.005;
      }
      renderer.render(scene, camera);
      animationIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <>
      <Head>
        <title>Kevin Reed - Portfolio | shipitkev.dev</title>
        <meta name="description" content="Kevin Reed's portfolio and work directory" />
        <link rel="icon" href="/favicon.ico" />
        <style jsx global>{`
          @font-face {
            font-family: 'Gunmetal';
            src: url('/gunmetal.ttf') format('truetype');
            font-weight: normal;
            font-style: normal;
          }
        `}</style>
      </Head>
      
      {/* 3D Globe Canvas */}
      <div ref={mountRef} className={styles.globeContainer} />
      
      {/* Content Overlay */}
      <div className={styles.contentOverlay}>
        <div className={styles.heroContainer}>
          <div className={styles.customFontText}>
              <h2 className={styles.customFontTextHeader}>Kevin Reed</h2>
              <p className={styles.customFontTextSubtitle}>Developer • Designer • Creator</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
