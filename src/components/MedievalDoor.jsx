import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';

// Medieval door with 3D signs
export default function MedievalDoor({
    position,
    label,
    onClick,
    isActive = false,
    isHighlighted = false
}) {
    const doorRef = useRef();
    const groupRef = useRef();
    const [hovered, setHovered] = useState(false);
    const [doorOpen, setDoorOpen] = useState(0);

    useFrame((state, delta) => {
        if (isActive && doorOpen < 1) {
            setDoorOpen(prev => Math.min(1, prev + delta * 2));
        }
        if (doorRef.current) {
            doorRef.current.rotation.y = -doorOpen * (Math.PI / 2);
        }
    });

    const doorWidth = 1.0;
    const doorHeight = 2.0;
    const isGlowing = hovered || isHighlighted;
    const doorColor = isGlowing ? "#6a5040" : "#4a3020";
    const frameColor = "#666666";

    return (
        <group
            ref={groupRef}
            position={position}
            onPointerOver={(e) => {
                e.stopPropagation();
                document.body.style.cursor = 'pointer';
                setHovered(true);
            }}
            onPointerOut={(e) => {
                e.stopPropagation();
                document.body.style.cursor = 'auto';
                setHovered(false);
            }}
            onClick={(e) => {
                e.stopPropagation();
                if (onClick) onClick();
            }}
        >
            {/* Stone frame */}
            <mesh position={[0, doorHeight / 2 + 0.15, 0]}>
                <boxGeometry args={[doorWidth + 0.5, doorHeight + 0.5, 0.3]} />
                <meshStandardMaterial color={frameColor} roughness={0.85} />
            </mesh>

            {/* Door cutout */}
            <mesh position={[0, doorHeight / 2, 0.1]}>
                <boxGeometry args={[doorWidth, doorHeight, 0.1]} />
                <meshStandardMaterial color="#050505" />
            </mesh>

            {/* Door panel */}
            <group position={[-doorWidth / 2, 0, 0.15]}>
                <group ref={doorRef}>
                    <mesh position={[doorWidth / 2, doorHeight / 2, 0]}>
                        <boxGeometry args={[doorWidth - 0.05, doorHeight - 0.05, 0.1]} />
                        <meshStandardMaterial color={doorColor} roughness={0.8} />
                    </mesh>

                    {/* Horizontal bands */}
                    <mesh position={[doorWidth / 2, 0.4, 0.06]}>
                        <boxGeometry args={[doorWidth - 0.1, 0.08, 0.02]} />
                        <meshStandardMaterial color="#333333" metalness={0.6} />
                    </mesh>
                    <mesh position={[doorWidth / 2, doorHeight - 0.4, 0.06]}>
                        <boxGeometry args={[doorWidth - 0.1, 0.08, 0.02]} />
                        <meshStandardMaterial color="#333333" metalness={0.6} />
                    </mesh>

                    {/* Door handle */}
                    <mesh position={[doorWidth / 2 + 0.25, doorHeight / 2, 0.08]}>
                        <sphereGeometry args={[0.06, 8, 6]} />
                        <meshStandardMaterial color="#8b7355" metalness={0.5} />
                    </mesh>
                </group>
            </group>

            {/* 3D WOODEN SIGN - hanging style */}
            <group position={[0, doorHeight + 0.55, 0.25]}>
                {/* Sign post */}
                <mesh position={[0, 0.35, -0.1]}>
                    <cylinderGeometry args={[0.03, 0.03, 0.4, 6]} />
                    <meshStandardMaterial color="#4a3a2a" roughness={0.9} />
                </mesh>

                {/* Main sign board - thick 3D plank */}
                <mesh position={[0, 0, 0]}>
                    <boxGeometry args={[1.4, 0.4, 0.12]} />
                    <meshStandardMaterial color="#3a2815" roughness={0.85} />
                </mesh>

                {/* Wood grain detail strips */}
                <mesh position={[0, 0.12, 0.065]}>
                    <boxGeometry args={[1.35, 0.03, 0.01]} />
                    <meshStandardMaterial color="#2a1a0a" roughness={0.9} />
                </mesh>
                <mesh position={[0, -0.08, 0.065]}>
                    <boxGeometry args={[1.35, 0.03, 0.01]} />
                    <meshStandardMaterial color="#2a1a0a" roughness={0.9} />
                </mesh>

                {/* Metal corner brackets */}
                <mesh position={[-0.62, 0.13, 0.07]}>
                    <boxGeometry args={[0.1, 0.1, 0.02]} />
                    <meshStandardMaterial color="#555555" metalness={0.7} roughness={0.4} />
                </mesh>
                <mesh position={[0.62, 0.13, 0.07]}>
                    <boxGeometry args={[0.1, 0.1, 0.02]} />
                    <meshStandardMaterial color="#555555" metalness={0.7} roughness={0.4} />
                </mesh>
                <mesh position={[-0.62, -0.13, 0.07]}>
                    <boxGeometry args={[0.1, 0.1, 0.02]} />
                    <meshStandardMaterial color="#555555" metalness={0.7} roughness={0.4} />
                </mesh>
                <mesh position={[0.62, -0.13, 0.07]}>
                    <boxGeometry args={[0.1, 0.1, 0.02]} />
                    <meshStandardMaterial color="#555555" metalness={0.7} roughness={0.4} />
                </mesh>

                {/* Bright text */}
                <Text
                    position={[0, 0, 0.08]}
                    fontSize={0.18}
                    maxWidth={1.3}
                    lineHeight={1}
                    color="#ffd700"
                    anchorX="center"
                    anchorY="middle"
                    fontWeight="bold"
                    outlineWidth={0.02}
                    outlineColor="#000000"
                >
                    {label}
                </Text>
            </group>

            {/* Light for sign visibility */}
            <pointLight position={[0, doorHeight + 0.5, 0.6]} color="#ffffff" intensity={0.6} distance={2} />

            {/* Glow when highlighted */}
            {isGlowing && (
                <pointLight position={[0, doorHeight / 2, 0.8]} color="#ffaa00" intensity={1.5} distance={3} />
            )}
        </group>
    );
}
