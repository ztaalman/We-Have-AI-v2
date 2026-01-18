import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Float, SpotLight } from '@react-three/drei';
import * as THREE from 'three';

const Mole = (props) => {
    const group = useRef();
    const jackhammerRef = useRef();
    const bodyRef = useRef();

    // Animation state
    useFrame((state) => {
        const t = state.clock.getElapsedTime();

        // Jackhammer vibration
        if (jackhammerRef.current) {
            // Rapid up/down vibration
            const vibration = Math.sin(t * 40) * 0.02;
            jackhammerRef.current.position.y = vibration;

            // Body shakes with it
            if (bodyRef.current) {
                bodyRef.current.position.y = 0.6 + vibration * 0.5;
                bodyRef.current.rotation.z = Math.sin(t * 30) * 0.01;
            }
        }
    });

    return (
        <group ref={group} {...props}>
            {/* Mole Body (Capsule-ish) */}
            <group ref={bodyRef} position={[0, 0.6, 0]}>
                <mesh>
                    <capsuleGeometry args={[0.5, 1.2, 4, 8]} />
                    <meshStandardMaterial color="#5D4037" roughness={0.9} />
                </mesh>

                {/* Snout */}
                <group position={[0, 0.4, 0.45]}>
                    <mesh rotation={[Math.PI / 2, 0, 0]}>
                        <coneGeometry args={[0.15, 0.3, 16]} />
                        <meshStandardMaterial color="#FFCCBC" />
                    </mesh>

                    {/* Whiskers */}
                    <group position={[0, 0, 0.05]}>
                        <mesh position={[0.15, 0, 0]} rotation={[0, 0, -0.2]}>
                            <boxGeometry args={[0.3, 0.01, 0.01]} />
                            <meshStandardMaterial color="#000" />
                        </mesh>
                        <mesh position={[0.15, 0.05, 0]} rotation={[0, 0, 0.1]}>
                            <boxGeometry args={[0.3, 0.01, 0.01]} />
                            <meshStandardMaterial color="#000" />
                        </mesh>
                        <mesh position={[-0.15, 0, 0]} rotation={[0, 0, 0.2]}>
                            <boxGeometry args={[0.3, 0.01, 0.01]} />
                            <meshStandardMaterial color="#000" />
                        </mesh>
                        <mesh position={[-0.15, 0.05, 0]} rotation={[0, 0, -0.1]}>
                            <boxGeometry args={[0.3, 0.01, 0.01]} />
                            <meshStandardMaterial color="#000" />
                        </mesh>
                    </group>
                </group>

                {/* Nose tip - BLACK */}
                <mesh position={[0, 0.4, 0.6]} rotation={[0, 0, 0]}>
                    <sphereGeometry args={[0.06, 8, 8]} />
                    <meshStandardMaterial color="#000000" roughness={0.4} />
                </mesh>

                {/* Eyes - Moved FORWARD to sit on surface (Z ~ 0.48) */}
                <group position={[0, 0.55, 0.48]}>
                    <mesh position={[0.15, 0, 0]}>
                        <sphereGeometry args={[0.05, 8, 8]} />
                        <meshStandardMaterial color="#000" roughness={0.2} />
                    </mesh>
                    <mesh position={[-0.15, 0, 0]}>
                        <sphereGeometry args={[0.05, 8, 8]} />
                        <meshStandardMaterial color="#000" roughness={0.2} />
                    </mesh>
                </group>

                {/* Mouth and Buck Teeth - Moved FORWARD */}
                <group position={[0, 0.25, 0.5]} rotation={[0.1, 0, 0]}>
                    {/* Teeth */}
                    <mesh position={[0.06, -0.02, 0.02]}>
                        <boxGeometry args={[0.08, 0.12, 0.02]} />
                        <meshStandardMaterial color="#ffffff" />
                    </mesh>
                    <mesh position={[-0.06, -0.02, 0.02]}>
                        <boxGeometry args={[0.08, 0.12, 0.02]} />
                        <meshStandardMaterial color="#ffffff" />
                    </mesh>
                </group>


                {/* Construction Helmet - Yellow */}
                <group position={[0, 0.75, 0]} rotation={[-0.2, 0, 0]}>
                    <mesh>
                        <sphereGeometry args={[0.52, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
                        <meshStandardMaterial color="#FFEB3B" metalness={0.3} roughness={0.4} />
                    </mesh>
                    <mesh position={[0, -0.05, 0]}>
                        <cylinderGeometry args={[0.6, 0.6, 0.1, 32]} />
                        <meshStandardMaterial color="#FFEB3B" metalness={0.3} roughness={0.4} />
                    </mesh>

                    {/* Spotlight on helmet */}
                    <mesh position={[0, 0.2, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
                        <cylinderGeometry args={[0.1, 0.15, 0.2, 16]} />
                        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={5} />
                    </mesh>
                    <SpotLight
                        position={[0, 0.2, 0.6]}
                        target-position={[1, -1, 1]}
                        angle={0.8}
                        penumbra={0.2}
                        intensity={5}
                        distance={15}
                        color="#fff"
                        castShadow
                    />
                </group>

                {/* Arms - Holding Jackhammer */}
                {/* Left Arm */}
                <group position={[-0.4, 0.2, 0.3]} rotation={[0.5, 0.5, -0.5]}>
                    <mesh>
                        <capsuleGeometry args={[0.12, 0.5, 4, 8]} />
                        <meshStandardMaterial color="#5D4037" />
                    </mesh>
                </group>

                {/* Right Arm */}
                <group position={[0.4, 0.2, 0.3]} rotation={[0.5, -0.5, 0.5]}>
                    <mesh>
                        <capsuleGeometry args={[0.12, 0.5, 4, 8]} />
                        <meshStandardMaterial color="#5D4037" />
                    </mesh>
                </group>
            </group>

            {/* JACKHAMMER GROUP */}
            <group ref={jackhammerRef} position={[0, 0, 0.8]}>
                {/* Handles (T-Shape) */}
                <mesh position={[0, 1.2, 0]} rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[0.04, 0.04, 0.8, 8]} />
                    <meshStandardMaterial color="#333" />
                </mesh>

                {/* Main Body */}
                <mesh position={[0, 0.8, 0]}>
                    <boxGeometry args={[0.25, 0.8, 0.25]} />
                    <meshStandardMaterial color="#B0BEC5" metalness={0.6} roughness={0.3} />
                </mesh>

                {/* Engine/Motor block */}
                <mesh position={[0, 0.9, 0.15]}>
                    <boxGeometry args={[0.3, 0.4, 0.3]} />
                    <meshStandardMaterial color="#FF5722" /> {/* Orange industrial color */}
                </mesh>

                {/* Shaft */}
                <mesh position={[0, 0.3, 0]}>
                    <cylinderGeometry args={[0.08, 0.12, 0.4, 16]} />
                    <meshStandardMaterial color="#78909C" />
                </mesh>

                {/* Chisel Tip */}
                <mesh position={[0, -0.1, 0]}>
                    <cylinderGeometry args={[0.04, 0.01, 0.6, 8]} />
                    <meshStandardMaterial color="#CFD8DC" metalness={0.8} />
                </mesh>
            </group>

            {/* Rock being chiseled - Positioned under jackhammer */}
            <mesh position={[0, -0.4, 0.8]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <dodecahedronGeometry args={[0.5, 0]} />
                <meshStandardMaterial color="#757575" flatShading />
            </mesh>

            {/* Debris/Sparks from chiseling */}
            <SparkParticles position={[0, -0.4, 0.8]} />
        </group>
    );
};

const SparkParticles = ({ position = [1.2, 0.6, 1.2] }) => {
    // Simple particle system for sparks when hitting
    const count = 10;
    const meshRef = useRef();

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        // Burst effect synced with swing speed roughly
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.1;
            const pulse = Math.sin(time * 40); // Fast pulse
            meshRef.current.visible = pulse > 0.5; // Only visible during "hit"
            meshRef.current.scale.setScalar(pulse * 1.5);
        }
    });

    return (
        <points position={position} ref={meshRef}>
            <sphereGeometry args={[0.3, 4, 4]} />
            <pointsMaterial color="orange" size={0.1} transparent opacity={0.8} />
        </points>
    );
};

const ConstructionScene = ({ onNavigate, title = "UNDER CONSTRUCTION" }) => {
    return (
        <div style={{ width: '100vw', height: '100vh', background: '#1a1a1a' }}>
            {/* Back Button */}
            <button className="return-button" onClick={() => onNavigate('hub')}>
                &lt; RETURN TO HUB
            </button>

            <Canvas shadows camera={{ position: [0, 2, 6], fov: 50 }}>
                <ambientLight intensity={1.5} />
                <pointLight position={[-5, 5, -5]} intensity={1.5} />
                <directionalLight position={[5, 10, 5]} intensity={2} color="#ffffff" />
                <pointLight position={[0, 2, 5]} intensity={1.5} color="#ffd700" distance={10} />

                <React.Suspense fallback={null}>
                    <Mole position={[0, -1, 0]} rotation={[0, -0.3, 0]} />

                    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
                        <Text
                            position={[0, 2.5, 0]}
                            fontSize={0.5}
                            color="#FFEB3B"
                            anchorX="center"
                            anchorY="middle"
                            outlineWidth={0.02}
                            outlineColor="#000000"
                        >
                            {title}
                        </Text>

                        <Text
                            position={[0, 1.8, 0]}
                            fontSize={0.18}
                            color="#ffffff"
                            anchorX="center"
                            anchorY="middle"
                        >
                            Currently excavating new features...
                        </Text>
                    </Float>
                </React.Suspense>

                <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 4} />
            </Canvas>
        </div>
    );
};

export default ConstructionScene;
