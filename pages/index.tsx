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
  const portfolioContainerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<THREE.Group | null>(null);
  const animationIdRef = useRef<number | null>(null);

  const portfolioCards = [
    {
      title: 'observe.finance',
      description: 'A widget based app for tracking and analyzing financial data',
      image: '/thumbnails/observe-finance.png',
      link: 'https://observe.finance'
    }
  ]

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
        globeGroup.position.x = -3.65 + (3.7 * easeIn); // Start closer to center
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
        <title>Gallery | shipitkev.dev</title>
        <meta name="description" content="Portfolio and work directory" />
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
      <div className={styles.contentContainer}>
        {/* Hero Section */}
        <div className={styles.sectionContainer}>
          <div className={styles.heroFrame}>
          <div className={styles.globeMaskLeft}/> <div className={styles.globeMaskTop}/> <div className={styles.globeMaskBottom}/> <div className={styles.globeMaskRight}/>
          <div className={styles.heroContainer}>
            <div className={styles.customFontText}>
                <h2 className={styles.customFontTextHeader}>Ship it Kev</h2>
                <p className={styles.customFontTextSubtitle}>Think • Create • Repeat</p>
                <p 
                  onClick={() => {
                    if (portfolioContainerRef.current) {
                      portfolioContainerRef.current.scrollIntoView({
                        behavior: 'smooth'
                      });
                    }
                  }}
                  className={styles.heroBottomText}>
                  <span>›</span> Explore <span>‹</span>
                </p>
            </div>
          </div>
          </div>
        </div>
        {/* Examples of work section */}
        <div ref={portfolioContainerRef} className={styles.sectionContainer}>
          <div className={styles.portfolioContainer}>
            {/* {portfolioCards.map((card) => {
              return (
                
                <div className={styles.displayItemContainer} onClick={() => {
                  window.open(card.link, '_blank');
                }}>
                  <div className={styles.displayItemHeader}>
                    <h3>{card.title}</h3>
                  </div>
                  <div className={styles.displayItemImage} style={{ backgroundImage: `url(${card.image})` }}/>
                </div>
              )
            })} */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
