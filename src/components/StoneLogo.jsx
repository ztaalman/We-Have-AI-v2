import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';

// Stone letter component
function StoneLetter({ char, position, delay = 0, index }) {
    const groupRef = useRef();

    useFrame((state) => {
        if (groupRef.current) {
            const t = state.clock.elapsedTime + delay;
            groupRef.current.position.y = position[1] + Math.sin(t * 0.5) * 0.012;
        }
    });

    if (char === ' ') {
        return null;
    }

    const stoneHue = 28 + (index * 4) % 12;
    const stoneSat = 12 + (index * 2) % 6;
    const stoneLight = 40 + (index * 3) % 10;

    return (
        <group ref={groupRef} position={position}>
            {/* Stone boulder */}
            <mesh position={[0, 0, 0]}>
                <icosahedronGeometry args={[0.40, 1]} />
                <meshStandardMaterial
                    color={`hsl(${stoneHue}, ${stoneSat}%, ${stoneLight}%)`}
                    roughness={0.9}
                    flatShading
                />
            </mesh>

            {/* WHITE letter at centroid of stone */}
            <Text
                position={[0, 0, 0.42]}
                fontSize={0.34}
                anchorX="center"
                anchorY="middle"
                fontWeight="bold"
                outlineWidth={0.016}
                outlineColor="#000000"
            >
                {char}
                <meshBasicMaterial color="#ffffff" />
            </Text>
        </group>
    );
}

export default function StoneLogo({ position = [0, 4, -5] }) {
    const groupRef = useRef();
    const text = "WE HAVE AI";

    // EXPLICIT positions for each letter
    const letterPositions = useMemo(() => {
        return [
            { char: 'W', position: [-3.3, 0.08, 0], delay: 0 },
            { char: 'E', position: [-2.55, 0.15, 0], delay: 0.1 },
            { char: ' ', position: [-1.9, 0, 0], delay: 0.2 },
            { char: 'H', position: [-1.25, 0.22, 0], delay: 0.3 },
            { char: 'A', position: [-0.5, 0.26, 0], delay: 0.4 },
            { char: 'V', position: [0.25, 0.26, 0], delay: 0.5 },
            { char: 'E', position: [1.0, 0.22, 0], delay: 0.6 },
            { char: ' ', position: [1.65, 0, 0], delay: 0.7 },
            { char: 'A', position: [2.3, 0.15, 0], delay: 0.8 },
            { char: 'I', position: [3.0, 0.08, 0], delay: 0.9 },
        ];
    }, []);

    return (
        <group ref={groupRef} position={position}>
            {/* SHARP SWORD - no glow tube, pointed blade */}
            <group position={[0.3, 0.1, 0]} rotation={[0, 0, -0.25]}>
                {/* Blade - tapered point */}
                <mesh position={[1.5, 0, 0]}>
                    <boxGeometry args={[2.5, 0.12, 0.03]} />
                    <meshStandardMaterial
                        color="#d0d0d0"
                        metalness={0.9}
                        roughness={0.1}
                    />
                </mesh>
                {/* Blade tip - pointed */}
                <mesh position={[2.9, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
                    <boxGeometry args={[0.18, 0.18, 0.03]} />
                    <meshStandardMaterial
                        color="#e0e0e0"
                        metalness={0.95}
                        roughness={0.05}
                    />
                </mesh>
                {/* Blade base */}
                <mesh position={[-0.2, 0, 0]}>
                    <boxGeometry args={[3, 0.1, 0.025]} />
                    <meshStandardMaterial
                        color="#c0c0c0"
                        metalness={0.85}
                        roughness={0.15}
                    />
                </mesh>
                {/* Guard - gold crossguard */}
                <mesh position={[-1.8, 0, 0]}>
                    <boxGeometry args={[0.15, 0.6, 0.1]} />
                    <meshStandardMaterial color="#d4a020" metalness={0.7} roughness={0.3} />
                </mesh>
                {/* Handle - leather wrapped */}
                <mesh position={[-2.2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[0.06, 0.06, 0.6, 8]} />
                    <meshStandardMaterial color="#4a3020" roughness={0.9} />
                </mesh>
                {/* Pommel - gold */}
                <mesh position={[-2.55, 0, 0]}>
                    <sphereGeometry args={[0.09, 8, 8]} />
                    <meshStandardMaterial
                        color="#ffd700"
                        metalness={0.9}
                        roughness={0.1}
                    />
                </mesh>
            </group>

            {/* Stone letters */}
            {letterPositions.map((item, i) => (
                <StoneLetter
                    key={i}
                    char={item.char}
                    position={item.position}
                    delay={item.delay}
                    index={i}
                />
            ))}

            {/* Front lighting */}
            <pointLight position={[0, 0, 2]} intensity={2.5} color="#ffffff" distance={8} />
        </group>
    );
}
