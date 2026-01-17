import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Torus, Cylinder, Sphere } from '@react-three/drei';
import * as THREE from 'three';

export default function Reactor({ position, active }) {
    const outerRingRef = useRef();
    const innerRingRef = useRef();
    const coreRef = useRef();

    useFrame((state, delta) => {
        const speedMultiplier = active ? 5 : 1;

        if (outerRingRef.current) {
            outerRingRef.current.rotation.z += delta * 0.2 * speedMultiplier;
        }
        if (innerRingRef.current) {
            innerRingRef.current.rotation.x += delta * 0.5 * speedMultiplier;
            innerRingRef.current.rotation.y += delta * 0.3 * speedMultiplier;
        }
        if (coreRef.current) {
            // Pulse scale
            const t = state.clock.getElapsedTime();
            const scale = 1 + Math.sin(t * (active ? 10 : 2)) * 0.1;
            coreRef.current.scale.setScalar(scale);
        }
    });

    // Materials
    const ringMaterial = new THREE.MeshStandardMaterial({
        color: '#333333',
        roughness: 0.2,
        metalness: 0.9,
    });

    const glowMaterial = new THREE.MeshBasicMaterial({
        color: active ? '#ff0033' : '#00ffaa', // Red/Orange when active, Cyan idle
    });

    return (
        <group position={position}>
            {/* Base */}
            <Cylinder args={[1, 1.2, 0.5, 32]} position={[0, -0.25, 0]} material={ringMaterial} />

            {/* Outer Ring */}
            <group ref={outerRingRef}>
                <Torus args={[0.8, 0.1, 16, 32]} rotation={[Math.PI / 2, 0, 0]} material={ringMaterial} />
                <Torus args={[0.85, 0.02, 16, 32]} rotation={[Math.PI / 2, 0, 0]} material={glowMaterial} />
            </group>

            {/* Inner Rotating Ring */}
            <group ref={innerRingRef}>
                <Torus args={[0.6, 0.05, 16, 32]} material={ringMaterial} />
            </group>

            {/* The Core */}
            <group ref={coreRef}>
                <Sphere args={[0.3, 32, 32]} material={glowMaterial} />
            </group>

            {/* Bottom Glow */}
            <pointLight position={[0, -0.5, 0]} intensity={active ? 5 : 2} color={active ? '#ff0000' : '#00ffff'} distance={5} />
        </group>
    );
}
