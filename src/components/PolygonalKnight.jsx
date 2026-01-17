import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Low-poly knight component matching the Runescape aesthetic
export default function PolygonalKnight({
    targetPosition = null,
    onReachedTarget = null,
    initialPosition = [0, -1.5, 2]
}) {
    const groupRef = useRef();
    const [phase, setPhase] = useState('IDLE'); // IDLE, WALKING, ENTERING
    const [walkCycle, setWalkCycle] = useState(0);

    const currentPos = useRef(new THREE.Vector3(...initialPosition));
    const targetPos = useRef(null);
    const walkSpeed = 2.0;

    // Update target when prop changes
    useEffect(() => {
        if (targetPosition) {
            targetPos.current = new THREE.Vector3(...targetPosition);
            setPhase('WALKING');
        }
    }, [targetPosition]);

    useFrame((state, delta) => {
        if (!groupRef.current) return;

        const t = state.clock.elapsedTime;

        if (phase === 'IDLE') {
            // Idle bobbing animation
            groupRef.current.position.y = currentPos.current.y + Math.sin(t * 2) * 0.03;

            // Subtle sword sway
            groupRef.current.rotation.y = Math.sin(t * 0.5) * 0.05;
        }
        else if (phase === 'WALKING') {
            if (targetPos.current) {
                // Move toward target
                const direction = new THREE.Vector3()
                    .subVectors(targetPos.current, currentPos.current);

                const distance = direction.length();

                if (distance > 0.3) {
                    // Walking
                    direction.normalize();
                    currentPos.current.add(direction.multiplyScalar(walkSpeed * delta));

                    // Face walking direction
                    const angle = Math.atan2(direction.x, direction.z);
                    groupRef.current.rotation.y = angle;

                    // Walk cycle animation
                    setWalkCycle(prev => prev + delta * 8);

                    // Bob up and down while walking
                    const bobAmount = Math.sin(walkCycle * 2) * 0.1;
                    groupRef.current.position.set(
                        currentPos.current.x,
                        currentPos.current.y + bobAmount,
                        currentPos.current.z
                    );
                } else {
                    // Reached target - stay IDLE, don't drift
                    setPhase('IDLE');
                    targetPos.current = null;
                    if (onReachedTarget) {
                        onReachedTarget();
                    }
                }
            }
        }
        else if (phase === 'ENTERING') {
            // Walk into the door
            currentPos.current.z -= delta * 1.5;
            groupRef.current.position.copy(currentPos.current);

            // Fade out or shrink as entering
            groupRef.current.scale.setScalar(Math.max(0.3, groupRef.current.scale.x - delta * 0.5));
        }

        // Update position
        if (phase === 'IDLE' || phase === 'WALKING') {
            groupRef.current.position.x = currentPos.current.x;
            groupRef.current.position.z = currentPos.current.z;
        }
    });

    // Reset knight when phase changes back to idle
    const resetKnight = () => {
        setPhase('IDLE');
        currentPos.current.set(...initialPosition);
        targetPos.current = null;
        if (groupRef.current) {
            groupRef.current.scale.setScalar(1);
        }
    };

    // Armor color - silver/white like reference
    const armorColor = '#d0d0d0';
    const armorDark = '#8a8a8a';
    const plumeColor = '#cc3333';

    // Walking animation offsets
    const legOffset = phase === 'WALKING' ? Math.sin(walkCycle) * 0.2 : 0;
    const armOffset = phase === 'WALKING' ? -Math.sin(walkCycle) * 0.15 : 0;

    return (
        <group ref={groupRef} position={initialPosition} scale={0.7}>
            {/* ===== BODY ===== */}

            {/* Torso - chest plate */}
            <mesh position={[0, 0.8, 0]}>
                <boxGeometry args={[0.7, 0.9, 0.4]} />
                <meshStandardMaterial color={armorColor} roughness={0.3} metalness={0.6} flatShading />
            </mesh>

            {/* Lower torso */}
            <mesh position={[0, 0.2, 0]}>
                <boxGeometry args={[0.5, 0.4, 0.35]} />
                <meshStandardMaterial color={armorDark} roughness={0.4} metalness={0.5} flatShading />
            </mesh>

            {/* ===== HEAD & HELMET ===== */}
            <group position={[0, 1.5, 0]}>
                {/* Helmet base */}
                <mesh>
                    <boxGeometry args={[0.45, 0.5, 0.45]} />
                    <meshStandardMaterial color={armorColor} roughness={0.3} metalness={0.6} flatShading />
                </mesh>

                {/* Visor slits */}
                <mesh position={[0, 0, 0.23]}>
                    <boxGeometry args={[0.35, 0.08, 0.02]} />
                    <meshStandardMaterial color="#1a1a1a" />
                </mesh>
                <mesh position={[0, -0.1, 0.23]}>
                    <boxGeometry args={[0.35, 0.08, 0.02]} />
                    <meshStandardMaterial color="#1a1a1a" />
                </mesh>

                {/* Plume */}
                <mesh position={[0, 0.4, -0.05]}>
                    <boxGeometry args={[0.08, 0.4, 0.3]} />
                    <meshStandardMaterial color={plumeColor} roughness={0.8} flatShading />
                </mesh>
            </group>

            {/* ===== SHOULDERS ===== */}
            <mesh position={[-0.5, 1.1, 0]}>
                <sphereGeometry args={[0.2, 6, 4]} />
                <meshStandardMaterial color={armorColor} roughness={0.3} metalness={0.6} flatShading />
            </mesh>
            <mesh position={[0.5, 1.1, 0]}>
                <sphereGeometry args={[0.2, 6, 4]} />
                <meshStandardMaterial color={armorColor} roughness={0.3} metalness={0.6} flatShading />
            </mesh>

            {/* ===== LEFT ARM (with sword) ===== */}
            <group position={[-0.55, 0.7, 0]} rotation={[armOffset, 0, 0]}>
                {/* Upper arm */}
                <mesh position={[0, -0.2, 0]}>
                    <boxGeometry args={[0.2, 0.4, 0.2]} />
                    <meshStandardMaterial color={armorDark} roughness={0.4} metalness={0.5} flatShading />
                </mesh>
                {/* Forearm */}
                <mesh position={[0, -0.5, 0.1]}>
                    <boxGeometry args={[0.18, 0.35, 0.18]} />
                    <meshStandardMaterial color={armorColor} roughness={0.3} metalness={0.6} flatShading />
                </mesh>
                {/* Hand */}
                <mesh position={[0, -0.75, 0.15]}>
                    <boxGeometry args={[0.12, 0.15, 0.12]} />
                    <meshStandardMaterial color={armorDark} roughness={0.5} metalness={0.4} flatShading />
                </mesh>

                {/* SWORD */}
                <group position={[0, -0.75, 0.25]} rotation={[0.3, 0, 0]}>
                    {/* Handle */}
                    <mesh position={[0, 0, 0]}>
                        <cylinderGeometry args={[0.03, 0.03, 0.25, 6]} />
                        <meshStandardMaterial color="#4a3020" roughness={0.8} />
                    </mesh>
                    {/* Guard */}
                    <mesh position={[0, 0.15, 0]}>
                        <boxGeometry args={[0.25, 0.04, 0.04]} />
                        <meshStandardMaterial color="#8b7355" metalness={0.4} roughness={0.6} />
                    </mesh>
                    {/* Blade */}
                    <mesh position={[0, 0.7, 0]}>
                        <boxGeometry args={[0.06, 1.0, 0.02]} />
                        <meshStandardMaterial color="#c0c0c0" metalness={0.8} roughness={0.2} />
                    </mesh>
                    {/* Pommel */}
                    <mesh position={[0, -0.15, 0]}>
                        <sphereGeometry args={[0.05, 6, 4]} />
                        <meshStandardMaterial color="#ffd700" metalness={0.7} roughness={0.3} />
                    </mesh>
                </group>
            </group>

            {/* ===== RIGHT ARM ===== */}
            <group position={[0.55, 0.7, 0]} rotation={[-armOffset, 0, 0]}>
                {/* Upper arm */}
                <mesh position={[0, -0.2, 0]}>
                    <boxGeometry args={[0.2, 0.4, 0.2]} />
                    <meshStandardMaterial color={armorDark} roughness={0.4} metalness={0.5} flatShading />
                </mesh>
                {/* Forearm */}
                <mesh position={[0, -0.5, 0.05]}>
                    <boxGeometry args={[0.18, 0.35, 0.18]} />
                    <meshStandardMaterial color={armorColor} roughness={0.3} metalness={0.6} flatShading />
                </mesh>
                {/* Hand */}
                <mesh position={[0, -0.75, 0.1]}>
                    <boxGeometry args={[0.12, 0.15, 0.12]} />
                    <meshStandardMaterial color={armorDark} roughness={0.5} metalness={0.4} flatShading />
                </mesh>
            </group>

            {/* ===== LEFT LEG ===== */}
            <group position={[-0.18, -0.1, 0]} rotation={[legOffset, 0, 0]}>
                {/* Thigh */}
                <mesh position={[0, -0.25, 0]}>
                    <boxGeometry args={[0.22, 0.4, 0.22]} />
                    <meshStandardMaterial color={armorDark} roughness={0.4} metalness={0.5} flatShading />
                </mesh>
                {/* Shin */}
                <mesh position={[0, -0.6, 0]}>
                    <boxGeometry args={[0.2, 0.45, 0.2]} />
                    <meshStandardMaterial color={armorColor} roughness={0.3} metalness={0.6} flatShading />
                </mesh>
                {/* Foot */}
                <mesh position={[0, -0.9, 0.05]}>
                    <boxGeometry args={[0.18, 0.12, 0.28]} />
                    <meshStandardMaterial color={armorDark} roughness={0.5} metalness={0.4} flatShading />
                </mesh>
            </group>

            {/* ===== RIGHT LEG ===== */}
            <group position={[0.18, -0.1, 0]} rotation={[-legOffset, 0, 0]}>
                {/* Thigh */}
                <mesh position={[0, -0.25, 0]}>
                    <boxGeometry args={[0.22, 0.4, 0.22]} />
                    <meshStandardMaterial color={armorDark} roughness={0.4} metalness={0.5} flatShading />
                </mesh>
                {/* Shin */}
                <mesh position={[0, -0.6, 0]}>
                    <boxGeometry args={[0.2, 0.45, 0.2]} />
                    <meshStandardMaterial color={armorColor} roughness={0.3} metalness={0.6} flatShading />
                </mesh>
                {/* Foot */}
                <mesh position={[0, -0.9, 0.05]}>
                    <boxGeometry args={[0.18, 0.12, 0.28]} />
                    <meshStandardMaterial color={armorDark} roughness={0.5} metalness={0.4} flatShading />
                </mesh>
            </group>

            {/* Shadow under knight */}
            <mesh position={[0, -1.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[0.5, 16]} />
                <meshBasicMaterial color="#000000" transparent opacity={0.4} />
            </mesh>

            {/* Light attached to knight for visibility */}
            <pointLight position={[0, 1, 1]} intensity={2} color="#ffffff" distance={5} />
        </group>
    );
}
