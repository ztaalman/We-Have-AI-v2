import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Cylinder, Box, Sphere } from '@react-three/drei';
import * as THREE from 'three';

export default function MechanicalArm({ position, rotation }) {
    const groupRef = useRef();
    const forearmRef = useRef();
    const handRef = useRef();

    // Materials - Lighter Carbon for visibility
    const carbonMaterial = new THREE.MeshStandardMaterial({
        color: '#444444', // Lighter grey
        roughness: 0.6,
        metalness: 0.6,
    });

    const cyanEmissive = new THREE.MeshStandardMaterial({
        color: '#00ffff',
        emissive: '#00ffff',
        emissiveIntensity: 3, // Brighter
        toneMapped: false
    });

    const metalMaterial = new THREE.MeshStandardMaterial({
        color: '#cccccc',
        roughness: 0.3,
        metalness: 0.8,
    });

    useFrame((state) => {
        const time = state.clock.elapsedTime;

        // Waving Animation
        // Rotate Forearm Group around Z axis (Pivot is at bottom of forearm now)
        if (forearmRef.current) {
            // Oscillate rotation between approx -0.2 and +0.8 radians
            forearmRef.current.rotation.z = Math.sin(time * 3) * 0.5 + 0.3;
        }

        if (handRef.current) {
            handRef.current.rotation.x = Math.sin(time * 5) * 0.1;
        }
    });

    // Structure builds UP from y=0
    return (
        <group ref={groupRef} position={position} rotation={rotation} scale={0.8}>

            {/* --- BASE (Floor Mount) --- */}
            <Cylinder args={[1.5, 1.8, 0.4, 32]} position={[0, 0.2, 0]} material={carbonMaterial} />
            <Cylinder args={[1.55, 1.55, 0.1, 32]} position={[0, 0.5, 0]} material={cyanEmissive} />

            {/* --- SHOULDER JOINT --- */}
            <group position={[0, 1.0, 0]}>
                <Box args={[1.2, 1.2, 1.2]} material={carbonMaterial} />
                <Cylinder args={[0.5, 0.5, 1.8, 16]} rotation={[0, 0, Math.PI / 2]} material={metalMaterial} />

                {/* --- UPPER ARM (Angled slightly forward/up) --- */}
                <group position={[0, 0.5, 0]} rotation={[0, 0, 0.2]}>
                    <Box args={[0.9, 3.5, 0.9]} position={[0, 1.75, 0]} material={carbonMaterial} />
                    {/* Decorative Cyan Strips */}
                    <Box args={[0.92, 3, 0.1]} position={[0, 1.75, 0.41]} material={cyanEmissive} />
                    <Box args={[0.92, 3, 0.1]} position={[0, 1.75, -0.41]} material={cyanEmissive} />

                    {/* --- ELBOW JOINT (Pivot Point) --- */}
                    {/* The Elbow itself remains static relative to Upper Arm */}
                    <group position={[0, 3.8, 0]}>
                        <Cylinder args={[0.7, 0.7, 1.4, 32]} rotation={[0, 0, Math.PI / 2]} material={carbonMaterial} />
                        <Cylinder args={[0.72, 0.72, 0.2, 32]} rotation={[0, 0, Math.PI / 2]} material={cyanEmissive} />

                        {/* --- FOREARM (Waves) --- */}
                        {/* PIVOT: The group is at the Elbow. Content extends UP. */}
                        <group ref={forearmRef} position={[0, 0, 0]}>
                            {/* Forearm Content */}
                            <group position={[0, 1.5, 0]}>
                                <Cylinder args={[0.6, 0.5, 3, 16]} material={metalMaterial} />
                                {/* Cyan Glowing Sleeve */}
                                <Cylinder args={[0.62, 0.62, 1, 16]} position={[0, 0.5, 0]} material={cyanEmissive} />

                                {/* --- WRIST & HAND --- */}
                                <group ref={handRef} position={[0, 1.6, 0]}>
                                    <Sphere args={[0.6, 16, 16]} material={carbonMaterial} />

                                    {/* CLAW FINGERS (Pointing Up/Out) */}
                                    {[0, 1, 2].map((i) => (
                                        <group key={i} rotation={[0, (i * Math.PI * 2) / 3, 0]}>
                                            <group position={[0.5, 0.5, 0]} rotation={[0, 0, 0.5]}>
                                                <Box args={[0.25, 1.2, 0.15]} material={metalMaterial} />
                                                <Box args={[0.27, 0.3, 0.17]} position={[0, 0.4, 0]} material={cyanEmissive} />
                                            </group>
                                        </group>
                                    ))}
                                </group>
                            </group>
                        </group>
                    </group>
                </group>
            </group>
        </group>
    );
}
