"use client";
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

// Check WebGL support
function checkWebGLSupport(): boolean {
    try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        return !!gl;
    } catch (e) {
        return false;
    }
}

export default function Orb3D() {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [useWebGL, setUseWebGL] = useState<boolean>(false);
    const [isWebGLChecked, setIsWebGLChecked] = useState(false);

    // Check WebGL on mount
    useEffect(() => {
        const hasWebGL = checkWebGLSupport();
        setUseWebGL(hasWebGL);
        setIsWebGLChecked(true);
        console.log(`[ÉTER] Rendering mode: ${hasWebGL ? '3D (WebGL)' : '2D (Canvas)'}`);
    }, []);

    // WebGL 3D Version
    useEffect(() => {
        if (!isWebGLChecked || !useWebGL || !containerRef.current) return;

        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js';
        script.async = true;

        script.onload = () => {
            const THREE = (window as any).THREE;
            if (!THREE || !containerRef.current) return;

            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(
                45,
                containerRef.current.offsetWidth / containerRef.current.offsetHeight,
                0.1,
                1000
            );
            camera.position.z = 6;

            const renderer = new THREE.WebGLRenderer({
                antialias: true,
                alpha: true
            });
            renderer.setSize(containerRef.current.offsetWidth, containerRef.current.offsetHeight);
            renderer.setPixelRatio(window.devicePixelRatio);
            containerRef.current.appendChild(renderer.domElement);

            // Main wireframe sphere
            const geometry = new THREE.SphereGeometry(1.5, 32, 16);
            const material = new THREE.MeshBasicMaterial({
                color: 0x00F0FF,
                wireframe: true,
                transparent: true,
                opacity: 0.6
            });
            const sphere = new THREE.Mesh(geometry, material);
            scene.add(sphere);

            // Inner glow sphere
            const glowGeometry = new THREE.SphereGeometry(1.3, 16, 16);
            const glowMaterial = new THREE.MeshBasicMaterial({
                color: 0x00F0FF,
                transparent: true,
                opacity: 0.15
            });
            const glowSphere = new THREE.Mesh(glowGeometry, glowMaterial);
            scene.add(glowSphere);

            // Lights
            const light1 = new THREE.PointLight(0x00F0FF, 2, 10);
            light1.position.set(0, 0, 3);
            scene.add(light1);

            const light2 = new THREE.PointLight(0xBD00FF, 1, 10);
            light2.position.set(-2, 2, 0);
            scene.add(light2);

            let animationFrame: number;
            const animate = () => {
                animationFrame = requestAnimationFrame(animate);
                sphere.rotation.y += 0.003;
                sphere.rotation.x += 0.001;
                glowSphere.rotation.y -= 0.002;
                const scale = 1 + Math.sin(Date.now() * 0.001) * 0.05;
                glowSphere.scale.set(scale, scale, scale);
                renderer.render(scene, camera);
            };
            animate();

            const handleResize = () => {
                if (!containerRef.current) return;
                camera.aspect = containerRef.current.offsetWidth / containerRef.current.offsetHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(containerRef.current.offsetWidth, containerRef.current.offsetHeight);
            };
            window.addEventListener('resize', handleResize);

            return () => {
                cancelAnimationFrame(animationFrame);
                window.removeEventListener('resize', handleResize);
                if (containerRef.current && renderer.domElement) {
                    containerRef.current.removeChild(renderer.domElement);
                }
                renderer.dispose();
            };
        };

        script.onerror = () => {
            console.error('[ÉTER] Failed to load Three.js, falling back to 2D');
            setUseWebGL(false);
        };

        document.head.appendChild(script);

        return () => {
            if (document.head.contains(script)) {
                document.head.removeChild(script);
            }
        };
    }, [isWebGLChecked, useWebGL]);

    // 2D Canvas Version (Neural Network + Solar System + Cosmic Dust)
    useEffect(() => {
        if (!isWebGLChecked || useWebGL || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resizeCanvas = () => {
            canvas.width = canvas.offsetWidth * window.devicePixelRatio;
            canvas.height = canvas.offsetHeight * window.devicePixelRatio;
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        let animationFrame: number;
        let time = 0;

        // Neural network nodes
        interface Node {
            angle: number;
            distance: number;
            speed: number;
            size: number;
            color: string;
        }

        const nodes: Node[] = [];
        const nodeCount = 20;
        for (let i = 0; i < nodeCount; i++) {
            nodes.push({
                angle: Math.random() * Math.PI * 2,
                distance: 60 + Math.random() * 100,
                speed: 0.2 + Math.random() * 0.3,
                size: 2 + Math.random() * 3,
                color: Math.random() > 0.5 ? '#00F0FF' : '#BD00FF'
            });
        }

        // Planets (orbital system)
        interface Planet {
            orbitRadius: number;
            angle: number;
            speed: number;
            size: number;
            color: string;
        }

        const planets: Planet[] = [
            { orbitRadius: 80, angle: 0, speed: 0.015, size: 4, color: '#00F0FF' },
            { orbitRadius: 120, angle: Math.PI, speed: 0.01, size: 6, color: '#BD00FF' },
            { orbitRadius: 160, angle: Math.PI / 2, speed: 0.007, size: 5, color: '#00F0FF' }
        ];

        // Cosmic dust particles following neural connections
        interface DustParticle {
            x: number;
            y: number;
            vx: number;
            vy: number;
            targetNodeIndex: number;
            life: number;
            maxLife: number;
            size: number;
            color: string;
        }

        const dustParticles: DustParticle[] = [];
        const nebulaColors = [
            'rgba(255, 120, 40, ',  // Orange
            'rgba(255, 80, 50, ',   // Red-orange
            'rgba(200, 100, 60, ',  // Amber
            'rgba(150, 60, 40, ',   // Dark red-brown
            'rgba(255, 150, 80, '   // Light orange
        ];

        const animate = () => {
            time += 0.01;

            const centerX = canvas.offsetWidth / 2;
            const centerY = canvas.offsetHeight / 2;
            const baseRadius = Math.min(canvas.offsetWidth, canvas.offsetHeight) * 0.35;

            ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

            // === ORBITAL RINGS (Solar System) ===
            planets.forEach((planet, i) => {
                ctx.beginPath();
                ctx.arc(centerX, centerY, planet.orbitRadius, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(255, 255, 255, 0.1)`;
                ctx.lineWidth = 0.5;
                ctx.setLineDash([3, 6]);
                ctx.stroke();
                ctx.setLineDash([]);
            });

            // === NEURAL NODES ===
            const nodePositions: { x: number; y: number; color: string }[] = [];
            nodes.forEach((node) => {
                node.angle += node.speed * 0.01;
                const x = centerX + Math.cos(node.angle) * node.distance;
                const y = centerY + Math.sin(node.angle) * node.distance;

                nodePositions.push({ x, y, color: node.color });

                // Draw node
                const nodeGradient = ctx.createRadialGradient(x, y, 0, x, y, node.size * 2);
                nodeGradient.addColorStop(0, node.color);
                nodeGradient.addColorStop(1, 'rgba(0, 240, 255, 0)');

                ctx.beginPath();
                ctx.arc(x, y, node.size * 2, 0, Math.PI * 2);
                ctx.fillStyle = nodeGradient;
                ctx.fill();

                ctx.beginPath();
                ctx.arc(x, y, node.size, 0, Math.PI * 2);
                ctx.fillStyle = node.color;
                ctx.fill();
            });

            // === SPAWN COSMIC DUST along neural connections ===
            // Increased spawn rate for more visible dust (3x more)
            if (Math.random() < 1.0) {
                // Pick two random nodes that might be connected
                const i = Math.floor(Math.random() * nodePositions.length);
                const j = Math.floor(Math.random() * nodePositions.length);

                if (i !== j) {
                    const dx = nodePositions[j].x - nodePositions[i].x;
                    const dy = nodePositions[j].y - nodePositions[i].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 80) {
                        // Spawn dust particle along this connection
                        const t = Math.random();
                        const x = nodePositions[i].x + dx * t;
                        const y = nodePositions[i].y + dy * t;

                        dustParticles.push({
                            x,
                            y,
                            vx: (Math.random() - 0.5) * 0.5,
                            vy: (Math.random() - 0.5) * 0.5,
                            targetNodeIndex: Math.random() > 0.5 ? i : j,
                            life: 0,
                            maxLife: 100 + Math.random() * 100,
                            size: 1 + Math.random() * 2,
                            color: nebulaColors[Math.floor(Math.random() * nebulaColors.length)]
                        });
                    }
                }
            }

            // === UPDATE AND DRAW COSMIC DUST ===
            for (let i = dustParticles.length - 1; i >= 0; i--) {
                const particle = dustParticles[i];
                particle.life++;

                // Remove dead particles
                if (particle.life > particle.maxLife) {
                    dustParticles.splice(i, 1);
                    continue;
                }

                // Move towards target node with some drift
                const targetNode = nodePositions[particle.targetNodeIndex];
                if (targetNode) {
                    const dx = targetNode.x - particle.x;
                    const dy = targetNode.y - particle.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist > 1) {
                        particle.vx += (dx / dist) * 0.02;
                        particle.vy += (dy / dist) * 0.02;
                    }
                }

                // Apply velocity with damping
                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.vx *= 0.98;
                particle.vy *= 0.98;

                // Calculate opacity based on life
                const lifeRatio = particle.life / particle.maxLife;
                const opacity = Math.sin(lifeRatio * Math.PI) * 0.8; // Fade in and out

                // Draw particle with nebula glow
                const particleGradient = ctx.createRadialGradient(
                    particle.x, particle.y, 0,
                    particle.x, particle.y, particle.size * 3
                );
                particleGradient.addColorStop(0, particle.color + opacity + ')');
                particleGradient.addColorStop(0.5, particle.color + (opacity * 0.5) + ')');
                particleGradient.addColorStop(1, particle.color + '0)');

                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
                ctx.fillStyle = particleGradient;
                ctx.fill();

                // Core
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = particle.color + opacity + ')';
                ctx.fill();
            }

            // === NEURAL CONNECTIONS ===
            for (let i = 0; i < nodePositions.length; i++) {
                for (let j = i + 1; j < nodePositions.length; j++) {
                    const dx = nodePositions[j].x - nodePositions[i].x;
                    const dy = nodePositions[j].y - nodePositions[i].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 80) {
                        const opacity = (1 - distance / 80) * 0.3;
                        ctx.beginPath();
                        ctx.moveTo(nodePositions[i].x, nodePositions[i].y);
                        ctx.lineTo(nodePositions[j].x, nodePositions[j].y);
                        ctx.strokeStyle = `rgba(0, 240, 255, ${opacity})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }

            // === PLANETS (moving on orbits) ===
            planets.forEach((planet) => {
                planet.angle += planet.speed;
                const x = centerX + Math.cos(planet.angle) * planet.orbitRadius;
                const y = centerY + Math.sin(planet.angle) * planet.orbitRadius;

                // Planet glow
                const planetGradient = ctx.createRadialGradient(x, y, 0, x, y, planet.size * 3);
                planetGradient.addColorStop(0, planet.color);
                planetGradient.addColorStop(0.5, planet.color + '88');
                planetGradient.addColorStop(1, 'rgba(0, 240, 255, 0)');

                ctx.beginPath();
                ctx.arc(x, y, planet.size * 3, 0, Math.PI * 2);
                ctx.fillStyle = planetGradient;
                ctx.fill();

                // Planet core
                ctx.beginPath();
                ctx.arc(x, y, planet.size, 0, Math.PI * 2);
                ctx.fillStyle = planet.color;
                ctx.fill();
            });

            // === CENTRAL CORE (Sun/Neural Hub) ===
            const pulseScale = 1 + Math.sin(time * 2) * 0.2;
            const coreRadius = 25 * pulseScale;

            const coreGradient = ctx.createRadialGradient(
                centerX, centerY, 0,
                centerX, centerY, coreRadius
            );
            coreGradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
            coreGradient.addColorStop(0.3, 'rgba(0, 240, 255, 0.9)');
            coreGradient.addColorStop(0.7, 'rgba(189, 0, 255, 0.5)');
            coreGradient.addColorStop(1, 'rgba(0, 240, 255, 0)');

            ctx.beginPath();
            ctx.arc(centerX, centerY, coreRadius, 0, Math.PI * 2);
            ctx.fillStyle = coreGradient;
            ctx.fill();

            // Energy beams from core
            const beamCount = 6;
            for (let i = 0; i < beamCount; i++) {
                const angle = time * 0.5 + (i * Math.PI * 2 / beamCount);
                const startX = centerX + Math.cos(angle) * coreRadius;
                const startY = centerY + Math.sin(angle) * coreRadius;
                const endX = centerX + Math.cos(angle) * baseRadius * 1.5;
                const endY = centerY + Math.sin(angle) * baseRadius * 1.5;

                const beamGradient = ctx.createLinearGradient(startX, startY, endX, endY);
                beamGradient.addColorStop(0, 'rgba(0, 240, 255, 0.5)');
                beamGradient.addColorStop(1, 'rgba(0, 240, 255, 0)');

                ctx.beginPath();
                ctx.moveTo(startX, startY);
                ctx.lineTo(endX, endY);
                ctx.strokeStyle = beamGradient;
                ctx.lineWidth = 1.5;
                ctx.stroke();
            }

            animationFrame = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            cancelAnimationFrame(animationFrame);
            window.removeEventListener('resize', resizeCanvas);
        };
    }, [isWebGLChecked, useWebGL]);

    if (!isWebGLChecked) {
        return (
            <div className="w-full h-[400px] md:h-[450px] flex items-center justify-center">
                <div className="animate-pulse text-white/30">Inicializando...</div>
            </div>
        );
    }

    return (
        <div className="w-full h-[400px] md:h-[450px] relative flex items-center justify-center group">
            {/* Cosmic Nebula Background - Fullscreen subtle (2D only) */}
            {!useWebGL && (
                <div className="fixed inset-0 pointer-events-none" style={{ zIndex: -1 }}>
                    {/* Layer 1: Base nebula - ultra subtle */}
                    <div className="absolute inset-0" style={{ opacity: 0.06 }}>
                        <Image
                            src="/pillars-of-creation.png"
                            alt="Cosmic Nebula"
                            fill
                            className="object-cover"
                            style={{
                                filter: 'blur(40px) brightness(0.25) saturate(0.6)',
                                mixBlendMode: 'screen',
                                transform: 'scale(2.5)'
                            }}
                        />
                    </div>

                    {/* Layer 2: Rotated variation */}
                    <div className="absolute inset-0" style={{ opacity: 0.04 }}>
                        <Image
                            src="/pillars-of-creation.png"
                            alt="Cosmic Nebula Layer 2"
                            fill
                            className="object-cover"
                            style={{
                                filter: 'blur(50px) brightness(0.2) hue-rotate(25deg)',
                                mixBlendMode: 'screen',
                                transform: 'scale(3) rotate(90deg)'
                            }}
                        />
                    </div>

                    {/* Layer 3: Soft glow overlay */}
                    <div
                        className="absolute inset-0"
                        style={{
                            opacity: 0.08,
                            background: 'radial-gradient(ellipse 70% 60% at 50% 25%, rgba(180, 70, 35, 0.15) 0%, rgba(220, 90, 50, 0.08) 30%, rgba(189, 0, 255, 0.05) 50%, transparent 75%)',
                            mixBlendMode: 'screen'
                        }}
                    />
                </div>
            )}

            {useWebGL ? (
                <div
                    ref={containerRef}
                    className="w-[350px] h-[350px] md:w-[450px] md:h-[450px] transition-all duration-300 group-hover:scale-105 relative z-10"
                    style={{
                        filter: 'drop-shadow(0 0 80px rgba(0, 240, 255, 0.6))'
                    }}
                />
            ) : (
                <canvas
                    ref={canvasRef}
                    className="w-[350px] h-[350px] md:w-[450px] md:h-[450px] transition-all duration-300 group-hover:scale-105 relative z-10"
                    style={{
                        filter: 'drop-shadow(0 0 80px rgba(0, 240, 255, 0.6))'
                    }}
                />
            )}
        </div>
    );
}
