import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

// Secret Constellation Component
function SecretConstellation() {
    const textRef = useRef();

    useFrame((state) => {
        if (textRef.current) {
            const time = state.clock.getElapsedTime();
            // Complex fade in/out logic
            // Only appear occasionally (e.g., essentially invisible mostly, then pulses)

            // Base sine wave for slow pulsing
            const slowPulse = Math.sin(time * 0.2);

            // Only visible when slowPulse is near peak (> 0.8)
            let opacity = 0;

            if (slowPulse > 0.8) {
                // Add a flicker
                opacity = (slowPulse - 0.8) * 5 * (0.8 + Math.random() * 0.2);
            }

            // Random glitchy flash
            if (Math.random() > 0.995) {
                opacity = Math.random() * 0.8;
            }

            textRef.current.material.opacity = opacity;
        }
    });

    return (
        <Text
            ref={textRef}
            position={[0, 11, -5]} // High up in the ceiling
            rotation={[Math.PI / 2, 0, 0]} // Rotate to face down/viewer from ceiling
            fontSize={0.8}
            color="#ffffff" // White stars
            font="/fonts/MedievalSharp-Regular.ttf" // Use project font if available, or default
            textAlign="center"
            anchorX="center"
            anchorY="middle"
            maxWidth={10}
        >
            perpetually outside the box
            <meshBasicMaterial attach="material" color="#aaddff" transparent opacity={0} />
        </Text>
    );
}

// Matrix-style falling code animation
function MatrixWall({ position, size }) {
    const canvasRef = useRef(document.createElement('canvas'));
    const textureRef = useRef();

    useMemo(() => {
        const canvas = canvasRef.current;
        canvas.width = 512;
        canvas.height = 512;
        textureRef.current = new THREE.CanvasTexture(canvas);
    }, []);

    const columns = useMemo(() => {
        const cols = [];
        for (let i = 0; i < 32; i++) {
            cols.push({
                x: i * 16,
                y: Math.random() * 512,
                speed: 2 + Math.random() * 4,
                chars: Array(25).fill().map(() => String.fromCharCode(0x30A0 + Math.random() * 96))
            });
        }
        return cols;
    }, []);

    useFrame(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
        ctx.fillRect(0, 0, 512, 512);
        ctx.font = '14px monospace';

        columns.forEach(col => {
            const charIndex = Math.floor(col.y / 16) % col.chars.length;

            ctx.fillStyle = '#aaffaa';
            ctx.fillText(col.chars[charIndex], col.x, col.y);

            for (let i = 1; i < 10; i++) {
                const trailY = col.y - i * 16;
                if (trailY > 0) {
                    ctx.fillStyle = `rgba(0, ${200 - i * 18}, 0, ${1 - i / 10})`;
                    ctx.fillText(col.chars[(charIndex - i + col.chars.length) % col.chars.length], col.x, trailY);
                }
            }

            col.y += col.speed;
            if (col.y > 560) {
                col.y = -30;
                col.chars[Math.floor(Math.random() * col.chars.length)] = String.fromCharCode(0x30A0 + Math.random() * 96);
            }
        });

        if (textureRef.current) textureRef.current.needsUpdate = true;
    });

    return (
        <mesh position={position} rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={size} />
            <meshBasicMaterial map={textureRef.current} side={THREE.DoubleSide} />
        </mesh>
    );
}

// REFINED Jungle wall with better dinosaurs
function JungleWall({ position, size }) {
    const canvasRef = useRef(document.createElement('canvas'));
    const textureRef = useRef();

    const dinos = useRef([
        { x: 80, y: 360, dir: 1, type: 'trex', speed: 0.35 },
        { x: 380, y: 380, dir: -1, type: 'raptor', speed: 0.6 },
        { x: 220, y: 350, dir: 1, type: 'stego', speed: 0.22 },
    ]);

    useMemo(() => {
        const canvas = canvasRef.current;
        canvas.width = 512;
        canvas.height = 512;
        textureRef.current = new THREE.CanvasTexture(canvas);
    }, []);

    // Better dinosaur drawing
    const drawDino = (ctx, x, y, type, dir) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(dir * 1.3, 1.3);

        if (type === 'trex') {
            // T-Rex - bigger, more detailed
            ctx.fillStyle = '#3a5a2a';
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(25, -18);
            ctx.lineTo(42, -22);
            ctx.lineTo(50, -28);
            ctx.lineTo(55, -22);
            ctx.lineTo(48, -15);
            ctx.lineTo(38, -5);
            ctx.lineTo(32, 8);
            ctx.lineTo(28, 28);
            ctx.lineTo(22, 28);
            ctx.lineTo(20, 12);
            ctx.lineTo(15, 12);
            ctx.lineTo(12, 28);
            ctx.lineTo(6, 28);
            ctx.lineTo(4, 10);
            ctx.lineTo(-8, 5);
            ctx.lineTo(-12, 0);
            ctx.closePath();
            ctx.fill();
            // Belly
            ctx.fillStyle = '#4a6a3a';
            ctx.beginPath();
            ctx.ellipse(20, 5, 12, 8, 0, 0, Math.PI);
            ctx.fill();
            // Eye
            ctx.fillStyle = '#ffff00';
            ctx.beginPath();
            ctx.arc(50, -24, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#000000';
            ctx.beginPath();
            ctx.arc(50, -24, 1.5, 0, Math.PI * 2);
            ctx.fill();
            // Arms
            ctx.fillStyle = '#3a5a2a';
            ctx.fillRect(30, -2, 8, 3);
        } else if (type === 'raptor') {
            // Velociraptor - sleek and fast
            ctx.fillStyle = '#4a6b3a';
            ctx.beginPath();
            ctx.moveTo(-10, 0);
            ctx.lineTo(15, -12);
            ctx.lineTo(30, -16);
            ctx.lineTo(38, -12);
            ctx.lineTo(28, -5);
            ctx.lineTo(22, 5);
            ctx.lineTo(20, 18);
            ctx.lineTo(16, 18);
            ctx.lineTo(15, 8);
            ctx.lineTo(8, 8);
            ctx.lineTo(6, 18);
            ctx.lineTo(2, 18);
            ctx.lineTo(0, 5);
            ctx.lineTo(-15, 8);
            ctx.lineTo(-20, 5);
            ctx.closePath();
            ctx.fill();
            // Eye
            ctx.fillStyle = '#ff6600';
            ctx.beginPath();
            ctx.arc(32, -14, 2, 0, Math.PI * 2);
            ctx.fill();
            // Claw
            ctx.fillStyle = '#888888';
            ctx.beginPath();
            ctx.moveTo(10, 18);
            ctx.lineTo(12, 22);
            ctx.lineTo(8, 22);
            ctx.closePath();
            ctx.fill();
        } else {
            // Stegosaurus - with plates
            ctx.fillStyle = '#5a7a4a';
            ctx.beginPath();
            ctx.moveTo(-25, 5);
            ctx.lineTo(-15, 0);
            ctx.lineTo(10, -8);
            ctx.lineTo(35, -5);
            ctx.lineTo(45, 0);
            ctx.lineTo(48, 8);
            ctx.lineTo(42, 15);
            ctx.lineTo(38, 25);
            ctx.lineTo(32, 25);
            ctx.lineTo(30, 15);
            ctx.lineTo(15, 15);
            ctx.lineTo(12, 25);
            ctx.lineTo(6, 25);
            ctx.lineTo(3, 15);
            ctx.lineTo(-10, 12);
            ctx.lineTo(-20, 10);
            ctx.closePath();
            ctx.fill();
            // Plates on back
            ctx.fillStyle = '#8a6b4a';
            for (let i = 0; i < 5; i++) {
                ctx.beginPath();
                ctx.moveTo(-5 + i * 10, -8);
                ctx.lineTo(-5 + i * 10 + 5, -25 - Math.sin(i) * 5);
                ctx.lineTo(-5 + i * 10 + 10, -8);
                ctx.closePath();
                ctx.fill();
            }
            // Eye
            ctx.fillStyle = '#000000';
            ctx.beginPath();
            ctx.arc(-18, 2, 2, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    };

    useFrame((state) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const t = state.clock.elapsedTime;

        // Jungle background - richer gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, 512);
        gradient.addColorStop(0, '#0a2a0a');
        gradient.addColorStop(0.3, '#1a4a1a');
        gradient.addColorStop(0.6, '#2a5a2a');
        gradient.addColorStop(1, '#2a4a2a');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 512, 512);

        // Background trees
        for (let i = 0; i < 8; i++) {
            const tx = i * 70 + 20;
            ctx.fillStyle = '#0a3a0a';
            ctx.beginPath();
            ctx.moveTo(tx, 512);
            ctx.lineTo(tx + 8, 100 + Math.sin(t * 0.5 + i) * 10);
            ctx.lineTo(tx - 8, 100 + Math.sin(t * 0.5 + i) * 10);
            ctx.closePath();
            ctx.fill();
            // Leaves
            ctx.fillStyle = '#1a5a1a';
            ctx.beginPath();
            ctx.arc(tx, 100 + Math.sin(t * 0.5 + i) * 10, 30, 0, Math.PI * 2);
            ctx.fill();
        }

        // Vines swaying
        ctx.strokeStyle = '#2a6a2a';
        ctx.lineWidth = 4;
        for (let i = 0; i < 6; i++) {
            ctx.beginPath();
            ctx.moveTo(i * 90, 0);
            for (let j = 0; j < 8; j++) {
                ctx.lineTo(i * 90 + Math.sin(t * 1.5 + j * 0.5 + i) * 20, j * 60);
            }
            ctx.stroke();
        }

        // Ferns on ground
        ctx.fillStyle = '#3a6a3a';
        for (let i = 0; i < 15; i++) {
            const fx = i * 35 + 10;
            ctx.beginPath();
            for (let j = 0; j < 5; j++) {
                ctx.ellipse(fx + j * 3, 480 - j * 8, 8, 3, j * 0.3, 0, Math.PI * 2);
            }
            ctx.fill();
        }

        // Move and draw dinosaurs
        dinos.current.forEach(dino => {
            dino.x += dino.speed * dino.dir;
            if (dino.x > 480) dino.dir = -1;
            if (dino.x < 60) dino.dir = 1;
            drawDino(ctx, dino.x, dino.y, dino.type, dino.dir);
        });

        // Ground
        ctx.fillStyle = '#2a4a2a';
        ctx.fillRect(0, 460, 512, 52);

        if (textureRef.current) textureRef.current.needsUpdate = true;
    });

    return (
        <mesh position={position} rotation={[0, -Math.PI / 2, 0]}>
            <planeGeometry args={size} />
            <meshBasicMaterial map={textureRef.current} side={THREE.DoubleSide} />
        </mesh>
    );
}

// MORE REALISTIC space ceiling
function SpaceCeiling({ position, size }) {
    const canvasRef = useRef(document.createElement('canvas'));
    const textureRef = useRef();

    const stars = useMemo(() => {
        const s = [];
        // More stars, varied sizes
        for (let i = 0; i < 300; i++) {
            s.push({
                x: Math.random() * 512,
                y: Math.random() * 512,
                size: 0.5 + Math.random() * 2,
                brightness: 0.4 + Math.random() * 0.6,
                twinkleSpeed: 0.5 + Math.random() * 3,
                twinkleOffset: Math.random() * Math.PI * 2,
                color: Math.random() > 0.8 ? 'blue' : Math.random() > 0.9 ? 'red' : 'white'
            });
        }
        return s;
    }, []);

    useMemo(() => {
        const canvas = canvasRef.current;
        canvas.width = 512;
        canvas.height = 512;
        textureRef.current = new THREE.CanvasTexture(canvas);
    }, []);

    useFrame((state) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const t = state.clock.elapsedTime;

        // Deep realistic space gradient
        const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 400);
        gradient.addColorStop(0, '#0a0515');
        gradient.addColorStop(0.4, '#050210');
        gradient.addColorStop(0.7, '#02010a');
        gradient.addColorStop(1, '#000002');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 512, 512);

        // Subtle nebula clouds
        for (let n = 0; n < 3; n++) {
            const nx = 150 + n * 100 + Math.sin(t * 0.1 + n) * 30;
            const ny = 150 + n * 80 + Math.cos(t * 0.08 + n) * 25;
            const nebulaGrad = ctx.createRadialGradient(nx, ny, 0, nx, ny, 80);
            nebulaGrad.addColorStop(0, `rgba(${80 + n * 30}, ${40 + n * 20}, ${120 - n * 20}, 0.15)`);
            nebulaGrad.addColorStop(0.5, `rgba(${60 + n * 20}, ${80 + n * 10}, ${140 - n * 15}, 0.08)`);
            nebulaGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = nebulaGrad;
            ctx.fillRect(0, 0, 512, 512);
        }

        // Stars with realistic twinkle
        stars.forEach(star => {
            const twinkle = (Math.sin(t * star.twinkleSpeed + star.twinkleOffset) + 1) / 2;
            const brightness = star.brightness * (0.6 + twinkle * 0.4);

            let r = 255, g = 255, b = 255;
            if (star.color === 'blue') { r = 180; g = 200; b = 255; }
            if (star.color === 'red') { r = 255; g = 180; b = 150; }

            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${brightness})`;
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size * (0.7 + twinkle * 0.3), 0, Math.PI * 2);
            ctx.fill();

            // Star glow
            if (star.size > 1.5) {
                ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${brightness * 0.2})`;
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2);
                ctx.fill();
            }
        });

        // Occasional shooting star
        if (Math.random() < 0.015) {
            const sx = Math.random() * 400;
            const sy = Math.random() * 200;
            const gradient = ctx.createLinearGradient(sx, sy, sx + 100, sy + 50);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(sx, sy);
            ctx.lineTo(sx + 100, sy + 50);
            ctx.stroke();
        }

        if (textureRef.current) textureRef.current.needsUpdate = true;
    });

    return (
        <mesh position={position} rotation={[Math.PI / 2, 0, 0]}>
            <planeGeometry args={size} />
            <meshBasicMaterial map={textureRef.current} side={THREE.DoubleSide} />
        </mesh>
    );
}

// Realistic stone floor texture
function createStoneFloorTexture(size = 512) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    // Base stone color
    ctx.fillStyle = '#4a4a4a';
    ctx.fillRect(0, 0, size, size);

    // Draw irregular stone tiles
    const stones = [];
    const rows = 5;
    const cols = 5;
    const baseWidth = size / cols;
    const baseHeight = size / rows;

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const x = col * baseWidth + (Math.random() - 0.5) * 10;
            const y = row * baseHeight + (Math.random() - 0.5) * 10;
            const w = baseWidth - 8 + (Math.random() - 0.5) * 15;
            const h = baseHeight - 8 + (Math.random() - 0.5) * 15;

            // Stone color variation
            const shade = 55 + Math.random() * 30;
            const warmth = Math.random() * 10;
            ctx.fillStyle = `rgb(${shade + warmth}, ${shade + warmth * 0.5}, ${shade})`;

            // Rounded rectangle for stone
            ctx.beginPath();
            ctx.roundRect(x + 4, y + 4, w, h, 6);
            ctx.fill();

            // Stone cracks/texture
            ctx.strokeStyle = `rgba(30, 30, 30, 0.3)`;
            ctx.lineWidth = 1;
            for (let c = 0; c < 3; c++) {
                ctx.beginPath();
                ctx.moveTo(x + 10 + Math.random() * w * 0.8, y + 10 + Math.random() * h * 0.3);
                ctx.lineTo(x + 10 + Math.random() * w * 0.8, y + h * 0.5 + Math.random() * h * 0.4);
                ctx.stroke();
            }

            // Highlight edge
            ctx.strokeStyle = `rgba(100, 100, 100, 0.4)`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x + 6, y + 5);
            ctx.lineTo(x + w + 2, y + 5);
            ctx.stroke();
        }
    }

    // Grout lines
    ctx.strokeStyle = '#252525';
    ctx.lineWidth = 4;
    for (let row = 1; row < rows; row++) {
        ctx.beginPath();
        ctx.moveTo(0, row * baseHeight);
        ctx.lineTo(size, row * baseHeight);
        ctx.stroke();
    }
    for (let col = 1; col < cols; col++) {
        ctx.beginPath();
        ctx.moveTo(col * baseWidth, 0);
        ctx.lineTo(col * baseWidth, size);
        ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 4);
    return texture;
}

// Brick texture for back wall
function createBrickTexture(size = 512) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#2a2520';
    ctx.fillRect(0, 0, size, size);

    const brickHeight = size / 8;
    const brickWidth = size / 4;

    for (let row = 0; row < 8; row++) {
        const offset = row % 2 === 0 ? 0 : brickWidth / 2;
        for (let col = -1; col < 5; col++) {
            const x = col * brickWidth + offset + 3;
            const y = row * brickHeight + 3;

            const shade = 55 + Math.random() * 25;
            ctx.fillStyle = `rgb(${shade + 18}, ${shade + 5}, ${shade - 5})`;
            ctx.fillRect(x, y, brickWidth - 6, brickHeight - 6);
        }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
}

// Thick stone pillar
function ThickPillar({ position }) {
    return (
        <group position={position}>
            <mesh position={[0, 0.4, 0]}>
                <boxGeometry args={[1.2, 0.8, 1.2]} />
                <meshStandardMaterial color="#5a5a5a" roughness={0.9} />
            </mesh>
            <mesh position={[0, 4, 0]}>
                <cylinderGeometry args={[0.5, 0.6, 7, 12]} />
                <meshStandardMaterial color="#666666" roughness={0.85} />
            </mesh>
            <mesh position={[0, 7.8, 0]}>
                <boxGeometry args={[1.2, 0.5, 1.2]} />
                <meshStandardMaterial color="#5a5a5a" roughness={0.9} />
            </mesh>
        </group>
    );
}

export default function CastleBackground() {
    const floorTexture = useMemo(() => createStoneFloorTexture(), []);
    const brickTexture = useMemo(() => {
        const tex = createBrickTexture();
        tex.repeat.set(4, 3);
        return tex;
    }, []);

    return (
        <group>
            <color attach="background" args={['#080810']} />

            {/* REALISTIC STONE Floor */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, -5]}>
                <planeGeometry args={[30, 30]} />
                <meshStandardMaterial map={floorTexture} roughness={0.8} />
            </mesh>

            {/* Back Wall - BRICK */}
            <mesh position={[0, 3, -10]}>
                <planeGeometry args={[18, 12]} />
                <meshStandardMaterial map={brickTexture} roughness={0.9} />
            </mesh>

            {/* Left Wall - MATRIX */}
            <MatrixWall position={[-8, 3, -4]} size={[14, 12]} />

            {/* Right Wall - JUNGLE with dinosaurs */}
            <JungleWall position={[8, 3, -4]} size={[14, 12]} />

            {/* Ceiling - REALISTIC SPACE */}
            <SpaceCeiling position={[0, 8, -4]} size={[16, 14]} />
            <SecretConstellation />

            {/* PILLARS - now BEHIND torches (further back on z) */}
            <ThickPillar position={[-5, -2, -1]} />
            <ThickPillar position={[5, -2, -1]} />

            {/* Ground lighting */}
            <pointLight position={[0, 1, 0]} intensity={1.5} color="#ffaa66" distance={15} />
            <pointLight position={[-5, 2, 2]} intensity={0.6} color="#00ff00" distance={6} />
            <pointLight position={[5, 2, 2]} intensity={0.4} color="#55aa55" distance={6} />
        </group>
    );
}
