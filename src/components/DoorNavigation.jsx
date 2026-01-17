import React, { useState, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import MedievalDoor from './MedievalDoor';
import PolygonalKnight from './PolygonalKnight';

// Door configuration - Y position at -2 to sit on floor
const DOORS = [
    {
        id: 'about',
        label: 'ABOUT ME',
        position: [-5.5, -2, -8.5],
        route: 'about'
    },
    {
        id: 'tools',
        label: 'TOOLS',
        position: [-2.8, -2, -8.5],
        route: 'tools'
    },
    {
        id: 'games',
        label: 'GAMES',
        position: [0, -2, -8.5],
        route: 'games'
    },
    {
        id: 'chatbot',
        label: 'AI CHATBOT',
        position: [2.8, -2, -8.5],
        route: 'chatbot'
    },
    {
        id: 'contact',
        label: 'CONTACT',
        position: [5.5, -2, -8.5],
        route: 'contact'
    },
];

// Clickable floor component
function ClickableFloor({ onFloorClick }) {
    const handleClick = (event) => {
        event.stopPropagation();
        const point = event.point;
        // Only allow clicking within bounds
        if (point.x >= -7 && point.x <= 7 && point.z >= -7 && point.z <= 4) {
            onFloorClick([point.x, -1.1, point.z]);
        }
    };

    return (
        <mesh
            position={[0, -2.01, -2]}
            rotation={[-Math.PI / 2, 0, 0]}
            onClick={handleClick}
        >
            <planeGeometry args={[16, 14]} />
            <meshBasicMaterial transparent opacity={0} />
        </mesh>
    );
}

export default function DoorNavigation({ onNavigate }) {
    const [targetPosition, setTargetPosition] = useState(null);
    const [targetDoor, setTargetDoor] = useState(null);
    const [activeDoorId, setActiveDoorId] = useState(null);

    const handleFloorClick = (position) => {
        // If already going to a door, ignore floor clicks
        if (targetDoor) return;

        // Just walk to the position (no navigation)
        setTargetPosition(position);
        setActiveDoorId(null);
    };

    const handleDoorClick = (door) => {
        // Set door as target
        setTargetDoor(door);
        setActiveDoorId(door.id);

        // Calculate position in front of door
        const doorPos = [
            door.position[0],
            -1.1,
            door.position[2] + 1.5
        ];
        setTargetPosition(doorPos);
    };

    const handleKnightReached = () => {
        // Only navigate if we clicked a door
        if (targetDoor && onNavigate) {
            setTimeout(() => {
                if (targetDoor.route) {
                    onNavigate(targetDoor.route);
                }
            }, 300);
        } else {
            // Just reached a floor position, reset
            setTargetPosition(null);
        }
    };

    return (
        <group>
            {/* Invisible clickable floor */}
            <ClickableFloor onFloorClick={handleFloorClick} />

            {/* Doors */}
            {DOORS.map((door) => (
                <MedievalDoor
                    key={door.id}
                    position={door.position}
                    label={door.label}
                    onClick={() => handleDoorClick(door)}
                    isActive={activeDoorId === door.id}
                    isHighlighted={activeDoorId === door.id}
                />
            ))}

            {/* Knight */}
            <PolygonalKnight
                targetPosition={targetPosition}
                onReachedTarget={handleKnightReached}
                initialPosition={[0, -1.1, 2]}
            />
        </group>
    );
}
