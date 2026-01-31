import React from 'react';
import * as THREE from 'three';

// Sword component (extracted from original knight)
export function Sword({ color = '#c0c0c0' }) {
    return (
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
                <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
            </mesh>
            {/* Pommel */}
            <mesh position={[0, -0.15, 0]}>
                <sphereGeometry args={[0.05, 6, 4]} />
                <meshStandardMaterial color="#ffd700" metalness={0.7} roughness={0.3} />
            </mesh>
        </group>
    );
}

// Battle Axe component
export function BattleAxe({ color = '#c0c0c0' }) {
    return (
        <group position={[0, -0.75, 0.25]} rotation={[0.3, 0, 0]}>
            {/* Handle */}
            <mesh position={[0, 0.3, 0]}>
                <cylinderGeometry args={[0.03, 0.035, 1.0, 6]} />
                <meshStandardMaterial color="#5a3d20" roughness={0.8} />
            </mesh>
            {/* Axe head - left blade */}
            <mesh position={[-0.12, 0.75, 0]} rotation={[0, 0, -0.2]}>
                <boxGeometry args={[0.2, 0.35, 0.03]} />
                <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
            </mesh>
            {/* Axe head - right blade */}
            <mesh position={[0.12, 0.75, 0]} rotation={[0, 0, 0.2]}>
                <boxGeometry args={[0.2, 0.35, 0.03]} />
                <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
            </mesh>
            {/* Axe head center */}
            <mesh position={[0, 0.75, 0]}>
                <boxGeometry args={[0.08, 0.25, 0.05]} />
                <meshStandardMaterial color={color} metalness={0.6} roughness={0.4} />
            </mesh>
            {/* Pommel */}
            <mesh position={[0, -0.2, 0]}>
                <sphereGeometry args={[0.045, 6, 4]} />
                <meshStandardMaterial color="#8b4513" roughness={0.7} />
            </mesh>
        </group>
    );
}

// Spear component
export function Spear({ color = '#c0c0c0' }) {
    return (
        <group position={[0, -0.5, 0.25]} rotation={[0.15, 0, 0]}>
            {/* Long shaft */}
            <mesh position={[0, 0.5, 0]}>
                <cylinderGeometry args={[0.025, 0.03, 1.8, 6]} />
                <meshStandardMaterial color="#5a3d20" roughness={0.8} />
            </mesh>
            {/* Spear head */}
            <mesh position={[0, 1.5, 0]}>
                <coneGeometry args={[0.06, 0.25, 4]} />
                <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
            </mesh>
            {/* Spear head base */}
            <mesh position={[0, 1.35, 0]}>
                <cylinderGeometry args={[0.05, 0.06, 0.08, 6]} />
                <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
            </mesh>
            {/* Bottom cap */}
            <mesh position={[0, -0.4, 0]}>
                <coneGeometry args={[0.035, 0.08, 4]} />
                <meshStandardMaterial color="#8b4513" roughness={0.7} />
            </mesh>
        </group>
    );
}

// Bow component
export function Bow({ color = '#c0c0c0' }) {
    return (
        <group position={[0.1, -0.6, 0.3]} rotation={[0, 0.5, 0.3]}>
            {/* Bow body - curved using multiple segments */}
            <mesh position={[0, 0.4, 0]} rotation={[0, 0, 0.3]}>
                <torusGeometry args={[0.35, 0.025, 6, 12, Math.PI * 0.8]} />
                <meshStandardMaterial color="#5a3d20" roughness={0.7} />
            </mesh>
            {/* Bow grip */}
            <mesh position={[0.05, 0.1, 0]}>
                <cylinderGeometry args={[0.035, 0.035, 0.15, 6]} />
                <meshStandardMaterial color="#3a2510" roughness={0.8} />
            </mesh>
            {/* String - simplified as a thin cylinder */}
            <mesh position={[0.28, 0.4, 0]} rotation={[0, 0, 0]}>
                <cylinderGeometry args={[0.005, 0.005, 0.7, 4]} />
                <meshStandardMaterial color="#c9a86c" roughness={0.9} />
            </mesh>
            {/* Bow tips */}
            <mesh position={[-0.15, 0.68, 0]}>
                <sphereGeometry args={[0.03, 4, 4]} />
                <meshStandardMaterial color={color} metalness={0.5} roughness={0.5} />
            </mesh>
            <mesh position={[0.25, 0.1, 0]}>
                <sphereGeometry args={[0.03, 4, 4]} />
                <meshStandardMaterial color={color} metalness={0.5} roughness={0.5} />
            </mesh>
        </group>
    );
}

// Weapon selector component
export function KnightWeapon({ type, color = '#c0c0c0' }) {
    switch (type) {
        case 'sword':
            return <Sword color={color} />;
        case 'axe':
            return <BattleAxe color={color} />;
        case 'spear':
            return <Spear color={color} />;
        case 'bow':
            return <Bow color={color} />;
        case 'none':
        default:
            return null;
    }
}

export default KnightWeapon;
