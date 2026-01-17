import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Single torch bowl with clickable flame
function TorchBowl({ position, isExtinguished = false, onExtinguish }) {
    const flameRef = useRef();
    const lightRef = useRef();
    const particlesRef = useRef();

    // Keep particle count constant to avoid buffer resize error
    const particleCount = 40;

    const particleData = useMemo(() => {
        return new Array(particleCount).fill().map(() => ({
            velocity: new THREE.Vector3(
                (Math.random() - 0.5) * 0.8,
                2 + Math.random() * 1.5,
                (Math.random() - 0.5) * 0.8
            ),
            life: Math.random(),
            maxLife: 0.8 + Math.random() * 0.6
        }));
    }, []);

    const particlePositions = useMemo(() => {
        const positions = new Float32Array(particleCount * 3);
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 0.4;
            positions[i * 3 + 1] = Math.random() * 0.5;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 0.4;
        }
        return positions;
    }, []);

    useFrame((state, delta) => {
        const t = state.clock.elapsedTime;

        // Animate main flame
        if (flameRef.current && !isExtinguished) {
            flameRef.current.scale.x = 1 + Math.sin(t * 12) * 0.15;
            flameRef.current.scale.z = 1 + Math.cos(t * 10) * 0.15;
            flameRef.current.scale.y = 1 + Math.sin(t * 8) * 0.2;
        }

        // Flicker light
        if (lightRef.current) {
            if (isExtinguished) {
                lightRef.current.intensity = 0.3 + Math.sin(t * 3) * 0.1;
            } else {
                lightRef.current.intensity = 4 + Math.sin(t * 15) * 1 + Math.random() * 0.5;
            }
        }

        // Animate particles - behavior changes based on extinguished state
        if (particlesRef.current) {
            const positions = particlesRef.current.geometry.attributes.position.array;
            const speedMult = isExtinguished ? 0.3 : 1;
            const maxY = isExtinguished ? 2 : 1.5;

            for (let i = 0; i < particleCount; i++) {
                const particle = particleData[i];
                particle.life += delta;

                positions[i * 3] += particle.velocity.x * delta * speedMult;
                positions[i * 3 + 1] += particle.velocity.y * delta * speedMult;
                positions[i * 3 + 2] += particle.velocity.z * delta * speedMult;

                if (particle.life > particle.maxLife || positions[i * 3 + 1] > maxY) {
                    particle.life = 0;
                    positions[i * 3] = (Math.random() - 0.5) * 0.4;
                    positions[i * 3 + 1] = 0;
                    positions[i * 3 + 2] = (Math.random() - 0.5) * 0.4;
                }
            }

            particlesRef.current.geometry.attributes.position.needsUpdate = true;
        }
    });

    const handleClick = (e) => {
        e.stopPropagation();
        if (onExtinguish && !isExtinguished) {
            onExtinguish();
        }
    };

    return (
        <group position={position}>
            {/* Tall stand/pedestal */}
            <mesh position={[0, 0, 0]}>
                <cylinderGeometry args={[0.25, 0.35, 2.5, 8]} />
                <meshStandardMaterial color="#4a4a4a" roughness={0.85} metalness={0.2} />
            </mesh>

            {/* Bowl base */}
            <mesh position={[0, 1.4, 0]}>
                <cylinderGeometry args={[0.6, 0.4, 0.3, 12]} />
                <meshStandardMaterial color="#3a3a3a" roughness={0.8} metalness={0.3} />
            </mesh>

            {/* Bowl */}
            <mesh position={[0, 1.7, 0]}>
                <cylinderGeometry args={[0.7, 0.55, 0.5, 12, 1, true]} />
                <meshStandardMaterial color="#2a2a2a" roughness={0.7} metalness={0.4} side={THREE.DoubleSide} />
            </mesh>

            {/* Inner bowl */}
            <mesh position={[0, 1.65, 0]}>
                <cylinderGeometry args={[0.55, 0.5, 0.4, 12]} />
                <meshStandardMaterial color="#1a1210" roughness={0.9} />
            </mesh>

            {/* Clickable fire/embers area */}
            <group position={[0, 2, 0]} onClick={handleClick}>
                {/* Invisible click target */}
                <mesh>
                    <sphereGeometry args={[0.7, 8, 8]} />
                    <meshBasicMaterial transparent opacity={0} />
                </mesh>

                {!isExtinguished ? (
                    <>
                        {/* Outer flame */}
                        <mesh ref={flameRef}>
                            <coneGeometry args={[0.5, 1.2, 8]} />
                            <meshBasicMaterial
                                color="#ff5500"
                                transparent
                                opacity={0.85}
                                blending={THREE.AdditiveBlending}
                            />
                        </mesh>

                        {/* Middle flame */}
                        <mesh scale={[0.65, 0.8, 0.65]} position={[0, 0.1, 0]}>
                            <coneGeometry args={[0.5, 1, 8]} />
                            <meshBasicMaterial
                                color="#ff8800"
                                transparent
                                opacity={0.9}
                                blending={THREE.AdditiveBlending}
                            />
                        </mesh>

                        {/* Inner hot core */}
                        <mesh scale={[0.35, 0.5, 0.35]}>
                            <coneGeometry args={[0.5, 0.8, 8]} />
                            <meshBasicMaterial
                                color="#ffcc00"
                                transparent
                                opacity={0.8}
                                blending={THREE.AdditiveBlending}
                            />
                        </mesh>
                    </>
                ) : (
                    <>
                        {/* Smoldering embers when extinguished */}
                        <mesh scale={[0.5, 0.2, 0.5]} position={[0, -0.2, 0]}>
                            <coneGeometry args={[0.5, 0.3, 8]} />
                            <meshBasicMaterial
                                color="#883300"
                                transparent
                                opacity={0.6}
                            />
                        </mesh>
                    </>
                )}

                {/* Smoke/fire particles - color changes based on state */}
                <points ref={particlesRef}>
                    <bufferGeometry>
                        <bufferAttribute
                            attach="attributes-position"
                            count={particleCount}
                            array={particlePositions}
                            itemSize={3}
                        />
                    </bufferGeometry>
                    <pointsMaterial
                        size={isExtinguished ? 0.2 : 0.15}
                        color={isExtinguished ? "#555555" : "#ff6600"}
                        transparent
                        opacity={isExtinguished ? 0.5 : 0.8}
                        blending={isExtinguished ? THREE.NormalBlending : THREE.AdditiveBlending}
                        sizeAttenuation
                    />
                </points>

                {/* Light */}
                <pointLight
                    ref={lightRef}
                    color={isExtinguished ? "#ff4400" : "#ff6b35"}
                    intensity={isExtinguished ? 0.5 : 4}
                    distance={isExtinguished ? 4 : 12}
                    decay={2}
                />
            </group>
        </group>
    );
}

export default function AnimatedTorches() {
    const [leftExtinguished, setLeftExtinguished] = useState(false);
    const [rightExtinguished, setRightExtinguished] = useState(false);

    return (
        <group>
            {/* LEFT torch - click to extinguish */}
            <TorchBowl
                position={[-5, -2, 1.5]}
                isExtinguished={leftExtinguished}
                onExtinguish={() => setLeftExtinguished(true)}
            />

            {/* RIGHT torch - click to extinguish */}
            <TorchBowl
                position={[5, -2, 1.5]}
                isExtinguished={rightExtinguished}
                onExtinguish={() => setRightExtinguished(true)}
            />
        </group>
    );
}
