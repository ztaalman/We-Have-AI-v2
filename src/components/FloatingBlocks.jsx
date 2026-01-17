import React, { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float, RoundedBox, Icosahedron, Octahedron, Cylinder, Box, Sphere, Wireframe } from '@react-three/drei';
import * as THREE from 'three';

// Blocks data will be passed from Scene.jsx, but we need to handle specific rendering logic here based on ID or Label.

function DataBlock({ item, onSelect, overridePos, isExploding }) {
    const meshRef = useRef();
    const [hovered, setHover] = useState(false);

    useFrame((state, delta) => {
        if (meshRef.current) {
            if (overridePos) {
                let cx = overridePos[0];
                let cy = overridePos[1];
                let cz = overridePos[2];

                // Apply Vibration if exploding
                if (isExploding) {
                    const intensity = 0.1;
                    cx += (Math.random() - 0.5) * intensity;
                    cy += (Math.random() - 0.5) * intensity;
                    cz += (Math.random() - 0.5) * intensity;
                }

                meshRef.current.position.set(cx, cy, cz);
                meshRef.current.rotation.set(0, 0, 0);
                meshRef.current.scale.set(0.8, 0.8, 0.8);
            } else {
                if (!hovered) {
                    // Unique idle animations per type?
                    // For now, general rotation
                    meshRef.current.rotation.x += delta * 0.1;
                    meshRef.current.rotation.y += delta * 0.2;
                } else {
                    meshRef.current.rotation.y += delta * 1.5;
                }

                const targetScale = hovered ? 1.2 : 1;
                meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
            }
        }
    });

    // --- GEOMETRY RENDERERS ---

    const renderVisuals = () => {
        const textStyle = {
            fontSize: 0.15,
            color: '#ffffff',
            anchorX: 'center',
            anchorY: 'middle',
            font: 'https://fonts.gstatic.com/s/rajdhani/v17/LDI2apCSOBg7S-QT7pa8FsOs.ttf'
        };

        const InnerGlow = ({ color }) => (
            <mesh>
                <sphereGeometry args={[0.2, 16, 16]} />
                <meshBasicMaterial color={color} transparent opacity={0.6} blending={THREE.AdditiveBlending} />
                <pointLight color={color} intensity={1} distance={2} />
            </mesh>
        );

        switch (item.label) {
            case 'ABOUT ME':
                // Holographic Cube (Wireframe + Glass)
                return (
                    <group>
                        {/* Outer Wireframe Cube */}
                        <Box args={[0.7, 0.7, 0.7]}>
                            <meshBasicMaterial color="#00ffff" wireframe transparent opacity={0.3} />
                        </Box>
                        {/* Inner Glass Cube */}
                        <Box args={[0.6, 0.6, 0.6]}>
                            <meshPhysicalMaterial
                                color="#00ffff"
                                transmission={0.6}
                                roughness={0}
                                thickness={0.5}
                                transparent
                                opacity={0.2}
                            />
                        </Box>
                        {/* Data Lines */}
                        <Text position={[0, 0, 0.36]} {...textStyle} fontSize={0.05}>
                            {">>"} SYSTEM_INFO
                        </Text>
                        <InnerGlow color="#00ffff" />
                    </group>
                );

            case 'TOOLS':
                // Orange Tech Container (Solid edges, hollow center)
                return (
                    <group>
                        <RoundedBox args={[0.7, 0.5, 0.5]} radius={0.05}>
                            <meshStandardMaterial color="#ffaa00" roughness={0.2} metalness={0.8} wireframe />
                        </RoundedBox>
                        <RoundedBox args={[0.6, 0.4, 0.4]} radius={0.05}>
                            <meshPhysicalMaterial color="#ff6600" transmission={0.5} opacity={0.3} transparent />
                        </RoundedBox>
                        <InnerGlow color="#ffaa00" />
                    </group>
                );

            case 'GAMES':
                // Holographic Panel (Floating Screen)
                return (
                    <group>
                        <Cylinder args={[0.6, 0.6, 0.02, 4]} rotation={[Math.PI / 2, Math.PI / 4, 0]}>
                            <meshPhysicalMaterial
                                color="#d000ff"
                                transmission={0.8}
                                opacity={0.4}
                                transparent
                                side={THREE.DoubleSide}
                            />
                        </Cylinder>
                        <Wireframe geometry={new THREE.BoxGeometry(0.85, 0.6, 0.05)} stroke="#ff00ff" thickness={0.01} />
                        <Text position={[0, 0, 0.05]} {...textStyle} color="#ff00ff">
                            GAME_MODE
                        </Text>
                        <InnerGlow color="#ff00ff" />
                    </group>
                );

            case 'AI CHATBOT':
                // Digital Brain (Sphere with complex wireframe/noise)
                return (
                    <group>
                        {/* Brain representation - distorted sphere */}
                        <Icosahedron args={[0.4, 4]}>
                            <meshPhysicalMaterial
                                color="#00ff00"
                                wireframe
                                emissive="#00ff00"
                                emissiveIntensity={0.5}
                                transparent
                                opacity={0.3}
                            />
                        </Icosahedron>
                        <Sphere args={[0.3, 16, 16]}>
                            <meshBasicMaterial color="#00ff00" transparent opacity={0.2} blending={THREE.AdditiveBlending} />
                        </Sphere>
                        {/* Scanning ring */}
                        <Cylinder args={[0.5, 0.5, 0.02, 32]} rotation={[0.2, 0, 0.2]}>
                            <meshBasicMaterial color="#00ff00" transparent opacity={0.5} />
                        </Cylinder>
                    </group>
                );

            case 'CONTACT':
                // Data Interface (Angled Panel)
                return (
                    <group>
                        <Box args={[0.8, 0.5, 0.05]}>
                            <meshPhysicalMaterial color="#ff0000" transmission={0.7} opacity={0.4} transparent />
                        </Box>
                        {/* Border */}
                        <Box args={[0.82, 0.52, 0.04]}>
                            <meshBasicMaterial color="#ff0000" wireframe transparent opacity={0.5} />
                        </Box>
                        <Text position={[-0.2, 0.1, 0.06]} {...textStyle} fontSize={0.04} anchorX="left">
                            Subject: Inquiry
                        </Text>
                        <Text position={[-0.2, 0, 0.06]} {...textStyle} fontSize={0.04} anchorX="left">
                            Status: Online
                        </Text>
                        <InnerGlow color="#ff0000" />
                    </group>
                );

            default:
                return (
                    <group>
                        <Box args={[0.5, 0.5, 0.5]} />
                    </group>
                );
        }
    };

    const Content = (
        <group
            ref={meshRef}
            onPointerOver={() => { document.body.style.cursor = 'pointer'; setHover(true); }}
            onPointerOut={() => { document.body.style.cursor = 'auto'; setHover(false); }}
            onClick={() => onSelect(item)}
        >
            {renderVisuals()}
        </group>
    );

    if (overridePos) {
        return (
            <group position={[0, 0, 0]}>
                {Content}
            </group>
        );
    }

    return (
        <group position={item.position}>
            <Float speed={2} rotationIntensity={1} floatIntensity={1}>
                {Content}
                <Text
                    position={[0, -1.6, 0]}
                    fontSize={0.25}
                    font="https://fonts.gstatic.com/s/rajdhani/v17/LDI2apCSOBg7S-QT7pa8FsOs.ttf"
                    color={hovered ? '#ffffff' : item.color}
                    anchorX="center"
                    anchorY="middle"
                >
                    {item.label}
                </Text>
            </Float>
        </group>
    );
}

export default function FloatingBlocks({ blocks, onSelect, activeBlockId, overridePos, isExploding }) {
    return (
        <group>
            {blocks.map((block) => (
                <DataBlock
                    key={block.id}
                    item={block}
                    onSelect={onSelect}
                    overridePos={(activeBlockId === block.id) ? overridePos : null}
                    isExploding={(activeBlockId === block.id) ? isExploding : false}
                />
            ))}
        </group>
    );
}
