import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';

// Medieval components
import CastleBackground from './CastleBackground';
import StoneLogo from './StoneLogo';
import AnimatedTorches from './AnimatedTorches';
import DoorNavigation from './DoorNavigation';

export default function Scene({ onNavigate }) {
    const [isMobile, setIsMobile] = useState(false);
    const [isTablet, setIsTablet] = useState(false);

    useEffect(() => {
        const checkDevice = () => {
            const width = window.innerWidth;
            setIsMobile(width <= 480);
            setIsTablet(width > 480 && width <= 1024);
        };
        checkDevice();
        window.addEventListener('resize', checkDevice);
        return () => window.removeEventListener('resize', checkDevice);
    }, []);

    // Responsive camera settings
    const cameraPosition = isMobile ? [0, 2, 12] : isTablet ? [0, 1.5, 10] : [0, 1, 8];
    const cameraFov = isMobile ? 65 : isTablet ? 55 : 50;
    const logoPosition = isMobile ? [0, 5, -5] : isTablet ? [0, 4.8, -5] : [0, 4.5, -5];

    return (
        <Canvas
            style={{ touchAction: 'none' }}
            gl={{ antialias: true, alpha: false }}
            dpr={[1, 2]}
        >
            <PerspectiveCamera
                makeDefault
                position={cameraPosition}
                fov={cameraFov}
            />

            {/* Bright lighting */}
            <ambientLight intensity={0.6} color="#fff5e6" />

            {/* Main light */}
            <directionalLight
                position={[5, 10, 5]}
                intensity={1.5}
                color="#ffffff"
            />

            {/* Front fill */}
            <pointLight position={[0, 3, 6]} intensity={2} color="#ffcc88" distance={20} />

            {/* Back light */}
            <pointLight position={[0, 4, -6]} intensity={1.5} color="#ff8c42" distance={15} />

            {/* Knight spotlight */}
            <spotLight
                position={[0, 5, 3]}
                angle={0.6}
                penumbra={0.5}
                intensity={2}
                color="#ffffff"
                target-position={[0, -1.5, 2]}
            />

            {/* Side lights */}
            <pointLight position={[-6, 2, 0]} intensity={1} color="#ff9955" distance={12} />
            <pointLight position={[6, 2, 0]} intensity={1} color="#ff9955" distance={12} />

            <Suspense fallback={null}>
                {/* Castle Environment */}
                <CastleBackground />

                {/* Stone Logo - responsive position */}
                <StoneLogo position={logoPosition} />

                {/* Animated Torches */}
                <AnimatedTorches />

                {/* Door Navigation with Knight */}
                <DoorNavigation onNavigate={onNavigate} />
            </Suspense>
        </Canvas>
    );
}
