import React from 'react';

// Basic Knight Helmet (original design)
export function BasicHelmet({ armorColor }) {
    return (
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
        </group>
    );
}

// Horned Helmet - Big Steer Horns
export function HornedHelmet({ armorColor }) {
    return (
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

            {/* Left BIG steer horn - base */}
            <mesh position={[-0.28, 0.15, 0]} rotation={[0, 0, 0.8]}>
                <cylinderGeometry args={[0.08, 0.1, 0.25, 8]} />
                <meshStandardMaterial color="#4a3a2a" roughness={0.6} metalness={0.2} />
            </mesh>
            {/* Left horn - mid curve */}
            <mesh position={[-0.48, 0.35, 0]} rotation={[0, 0, 1.2]}>
                <cylinderGeometry args={[0.06, 0.08, 0.3, 8]} />
                <meshStandardMaterial color="#5a4a3a" roughness={0.6} metalness={0.2} />
            </mesh>
            {/* Left horn - tip curving up */}
            <mesh position={[-0.58, 0.6, 0]} rotation={[0, 0, 1.8]}>
                <coneGeometry args={[0.06, 0.25, 8]} />
                <meshStandardMaterial color="#6a5a4a" roughness={0.5} metalness={0.2} />
            </mesh>

            {/* Right BIG steer horn - base */}
            <mesh position={[0.28, 0.15, 0]} rotation={[0, 0, -0.8]}>
                <cylinderGeometry args={[0.08, 0.1, 0.25, 8]} />
                <meshStandardMaterial color="#4a3a2a" roughness={0.6} metalness={0.2} />
            </mesh>
            {/* Right horn - mid curve */}
            <mesh position={[0.48, 0.35, 0]} rotation={[0, 0, -1.2]}>
                <cylinderGeometry args={[0.06, 0.08, 0.3, 8]} />
                <meshStandardMaterial color="#5a4a3a" roughness={0.6} metalness={0.2} />
            </mesh>
            {/* Right horn - tip curving up */}
            <mesh position={[0.58, 0.6, 0]} rotation={[0, 0, -1.8]}>
                <coneGeometry args={[0.06, 0.25, 8]} />
                <meshStandardMaterial color="#6a5a4a" roughness={0.5} metalness={0.2} />
            </mesh>
        </group>
    );
}

// Winged Helmet
export function WingedHelmet({ armorColor }) {
    return (
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

            {/* Left wing */}
            <group position={[-0.28, 0.1, 0]} rotation={[0, 0.3, 0.2]}>
                <mesh position={[0, 0.12, 0]}>
                    <boxGeometry args={[0.02, 0.25, 0.15]} />
                    <meshStandardMaterial color="#f5f5f5" roughness={0.6} />
                </mesh>
                <mesh position={[-0.08, 0.18, 0]}>
                    <boxGeometry args={[0.02, 0.2, 0.12]} />
                    <meshStandardMaterial color="#e8e8e8" roughness={0.6} />
                </mesh>
                <mesh position={[-0.14, 0.22, 0]}>
                    <boxGeometry args={[0.02, 0.15, 0.08]} />
                    <meshStandardMaterial color="#dcdcdc" roughness={0.6} />
                </mesh>
            </group>
            {/* Right wing */}
            <group position={[0.28, 0.1, 0]} rotation={[0, -0.3, -0.2]}>
                <mesh position={[0, 0.12, 0]}>
                    <boxGeometry args={[0.02, 0.25, 0.15]} />
                    <meshStandardMaterial color="#f5f5f5" roughness={0.6} />
                </mesh>
                <mesh position={[0.08, 0.18, 0]}>
                    <boxGeometry args={[0.02, 0.2, 0.12]} />
                    <meshStandardMaterial color="#e8e8e8" roughness={0.6} />
                </mesh>
                <mesh position={[0.14, 0.22, 0]}>
                    <boxGeometry args={[0.02, 0.15, 0.08]} />
                    <meshStandardMaterial color="#dcdcdc" roughness={0.6} />
                </mesh>
            </group>
        </group>
    );
}

// Crown
export function CrownHelmet({ armorColor }) {
    return (
        <group position={[0, 1.5, 0]}>
            {/* Head (visible) */}
            <mesh>
                <sphereGeometry args={[0.22, 8, 6]} />
                <meshStandardMaterial color="#e8c9a0" roughness={0.7} flatShading />
            </mesh>

            {/* Crown base */}
            <mesh position={[0, 0.18, 0]}>
                <cylinderGeometry args={[0.24, 0.22, 0.12, 8]} />
                <meshStandardMaterial color="#ffd700" metalness={0.7} roughness={0.3} />
            </mesh>

            {/* Crown points */}
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                <mesh
                    key={i}
                    position={[
                        Math.cos((i / 8) * Math.PI * 2) * 0.2,
                        0.32,
                        Math.sin((i / 8) * Math.PI * 2) * 0.2
                    ]}
                >
                    <boxGeometry args={[0.06, 0.12, 0.04]} />
                    <meshStandardMaterial color="#ffd700" metalness={0.7} roughness={0.3} />
                </mesh>
            ))}

            {/* Gems on front */}
            <mesh position={[0, 0.28, 0.22]}>
                <sphereGeometry args={[0.03, 6, 4]} />
                <meshStandardMaterial color="#cc0000" metalness={0.3} roughness={0.4} />
            </mesh>
        </group>
    );
}

// No Helmet (bare head)
export function BareHead() {
    return (
        <group position={[0, 1.5, 0]}>
            {/* Head */}
            <mesh>
                <sphereGeometry args={[0.22, 8, 6]} />
                <meshStandardMaterial color="#e8c9a0" roughness={0.7} flatShading />
            </mesh>
            {/* Simple eyes */}
            <mesh position={[-0.08, 0.02, 0.18]}>
                <sphereGeometry args={[0.03, 4, 4]} />
                <meshStandardMaterial color="#2a2a2a" />
            </mesh>
            <mesh position={[0.08, 0.02, 0.18]}>
                <sphereGeometry args={[0.03, 4, 4]} />
                <meshStandardMaterial color="#2a2a2a" />
            </mesh>
        </group>
    );
}

// Plume component (for helmets that have it)
export function HelmetPlume({ plumeColor, helmetType }) {
    if (helmetType === 'none' || helmetType === 'crown') return null;

    return (
        <mesh position={[0, 1.9, -0.05]}>
            <boxGeometry args={[0.08, 0.4, 0.3]} />
            <meshStandardMaterial color={plumeColor} roughness={0.8} flatShading />
        </mesh>
    );
}

// Spiked Shoulder Armor - BIG prominent spikes
export function SpikedShoulders({ armorColor }) {
    return (
        <>
            {/* Left shoulder with BIG spikes */}
            <group position={[-0.5, 1.1, 0]}>
                <mesh>
                    <sphereGeometry args={[0.24, 6, 4]} />
                    <meshStandardMaterial color={armorColor} roughness={0.3} metalness={0.6} flatShading />
                </mesh>
                {/* Big center spike */}
                <mesh position={[0, 0.28, 0]}>
                    <coneGeometry args={[0.08, 0.4, 6]} />
                    <meshStandardMaterial color={armorColor} roughness={0.3} metalness={0.7} />
                </mesh>
                {/* Side spike - back left */}
                <mesh position={[-0.18, 0.15, -0.08]} rotation={[0.3, 0, 0.7]}>
                    <coneGeometry args={[0.06, 0.32, 6]} />
                    <meshStandardMaterial color={armorColor} roughness={0.3} metalness={0.7} />
                </mesh>
                {/* Side spike - front left */}
                <mesh position={[-0.18, 0.15, 0.08]} rotation={[-0.3, 0, 0.7]}>
                    <coneGeometry args={[0.06, 0.32, 6]} />
                    <meshStandardMaterial color={armorColor} roughness={0.3} metalness={0.7} />
                </mesh>
                {/* Small accent spikes */}
                <mesh position={[-0.12, 0.22, 0]} rotation={[0, 0, 0.5]}>
                    <coneGeometry args={[0.04, 0.2, 4]} />
                    <meshStandardMaterial color={armorColor} roughness={0.3} metalness={0.6} />
                </mesh>
            </group>
            {/* Right shoulder with BIG spikes */}
            <group position={[0.5, 1.1, 0]}>
                <mesh>
                    <sphereGeometry args={[0.24, 6, 4]} />
                    <meshStandardMaterial color={armorColor} roughness={0.3} metalness={0.6} flatShading />
                </mesh>
                {/* Big center spike */}
                <mesh position={[0, 0.28, 0]}>
                    <coneGeometry args={[0.08, 0.4, 6]} />
                    <meshStandardMaterial color={armorColor} roughness={0.3} metalness={0.7} />
                </mesh>
                {/* Side spike - back right */}
                <mesh position={[0.18, 0.15, -0.08]} rotation={[0.3, 0, -0.7]}>
                    <coneGeometry args={[0.06, 0.32, 6]} />
                    <meshStandardMaterial color={armorColor} roughness={0.3} metalness={0.7} />
                </mesh>
                {/* Side spike - front right */}
                <mesh position={[0.18, 0.15, 0.08]} rotation={[-0.3, 0, -0.7]}>
                    <coneGeometry args={[0.06, 0.32, 6]} />
                    <meshStandardMaterial color={armorColor} roughness={0.3} metalness={0.7} />
                </mesh>
                {/* Small accent spikes */}
                <mesh position={[0.12, 0.22, 0]} rotation={[0, 0, -0.5]}>
                    <coneGeometry args={[0.04, 0.2, 4]} />
                    <meshStandardMaterial color={armorColor} roughness={0.3} metalness={0.6} />
                </mesh>
            </group>
        </>
    );
}

// Regular Shoulders
export function RegularShoulders({ armorColor }) {
    return (
        <>
            <mesh position={[-0.5, 1.1, 0]}>
                <sphereGeometry args={[0.2, 6, 4]} />
                <meshStandardMaterial color={armorColor} roughness={0.3} metalness={0.6} flatShading />
            </mesh>
            <mesh position={[0.5, 1.1, 0]}>
                <sphereGeometry args={[0.2, 6, 4]} />
                <meshStandardMaterial color={armorColor} roughness={0.3} metalness={0.6} flatShading />
            </mesh>
        </>
    );
}

// Chainmail visible on torso
export function ChainmailTorso({ armorColor, armorDark }) {
    return (
        <group>
            {/* Chainmail body - slightly larger to show under plate */}
            <mesh position={[0, 0.8, 0]}>
                <boxGeometry args={[0.72, 0.92, 0.42]} />
                <meshStandardMaterial color="#6a6a6a" roughness={0.6} metalness={0.4} flatShading />
            </mesh>
            {/* Plate overlay - smaller gaps */}
            <mesh position={[0, 0.9, 0.05]}>
                <boxGeometry args={[0.6, 0.6, 0.35]} />
                <meshStandardMaterial color={armorColor} roughness={0.3} metalness={0.6} flatShading />
            </mesh>
            {/* Lower plate */}
            <mesh position={[0, 0.5, 0]}>
                <boxGeometry args={[0.55, 0.35, 0.32]} />
                <meshStandardMaterial color={armorDark} roughness={0.4} metalness={0.5} flatShading />
            </mesh>
        </group>
    );
}

// Leather Armor - less metallic
export function LeatherTorso() {
    const leatherColor = '#6b4423';
    const leatherDark = '#4a2f15';

    return (
        <group>
            {/* Main leather chest */}
            <mesh position={[0, 0.8, 0]}>
                <boxGeometry args={[0.68, 0.88, 0.38]} />
                <meshStandardMaterial color={leatherColor} roughness={0.85} metalness={0.1} flatShading />
            </mesh>
            {/* Belt */}
            <mesh position={[0, 0.4, 0.02]}>
                <boxGeometry args={[0.7, 0.1, 0.4]} />
                <meshStandardMaterial color={leatherDark} roughness={0.8} />
            </mesh>
            {/* Belt buckle */}
            <mesh position={[0, 0.4, 0.22]}>
                <boxGeometry args={[0.1, 0.08, 0.02]} />
                <meshStandardMaterial color="#b8860b" metalness={0.6} roughness={0.4} />
            </mesh>
            {/* Straps */}
            <mesh position={[-0.2, 0.9, 0.2]}>
                <boxGeometry args={[0.08, 0.5, 0.02]} />
                <meshStandardMaterial color={leatherDark} roughness={0.8} />
            </mesh>
            <mesh position={[0.2, 0.9, 0.2]}>
                <boxGeometry args={[0.08, 0.5, 0.02]} />
                <meshStandardMaterial color={leatherDark} roughness={0.8} />
            </mesh>
        </group>
    );
}

// Helmet selector component
export function KnightHelmet({ type, armorColor, armorDark, plumeColor }) {
    let helmet;
    switch (type) {
        case 'basic':
            helmet = <BasicHelmet armorColor={armorColor} armorDark={armorDark} />;
            break;
        case 'horned':
            helmet = <HornedHelmet armorColor={armorColor} armorDark={armorDark} />;
            break;
        case 'winged':
            helmet = <WingedHelmet armorColor={armorColor} armorDark={armorDark} />;
            break;
        case 'crown':
            helmet = <CrownHelmet armorColor={armorColor} />;
            break;
        case 'none':
            helmet = <BareHead />;
            break;
        default:
            helmet = <BasicHelmet armorColor={armorColor} armorDark={armorDark} />;
    }

    return (
        <>
            {helmet}
            <HelmetPlume plumeColor={plumeColor} helmetType={type} />
        </>
    );
}

// Torso armor selector
export function KnightTorso({ type, armorColor, armorDark }) {
    switch (type) {
        case 'chainmail':
            return <ChainmailTorso armorColor={armorColor} armorDark={armorDark} />;
        case 'leather':
            return <LeatherTorso armorColor={armorColor} armorDark={armorDark} />;
        case 'plate':
        case 'spiked':
        default:
            return (
                <>
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
                </>
            );
    }
}

// Shoulder selector
export function KnightShoulders({ armorType, armorColor }) {
    if (armorType === 'spiked') {
        return <SpikedShoulders armorColor={armorColor} />;
    }
    return <RegularShoulders armorColor={armorColor} />;
}

export default { KnightHelmet, KnightTorso, KnightShoulders };
