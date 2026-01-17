
import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Stars, Sparkles } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function SpaceBackground({ onAsteroidClick, destroyedAsteroidId, explosionPosition }) {
  const starsRef = useRef();
  const lastProcessedId = useRef(null);
  const [explosions, setExplosions] = useState([]);

  // Initialize meteors coming TOWARD the viewer on outer perimeter
  const [meteorData, setMeteorData] = useState(() => {
    return new Array(15).fill().map((_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const radius = 6 + Math.random() * 4;

      return {
        id: i,
        position: [
          Math.cos(angle) * radius,
          Math.sin(angle) * radius,
          -60 - Math.random() * 40
        ],
        angle: angle,
        radius: radius,
        scale: 0.05 + Math.random() * 0.1,
        speed: 3 + Math.random() * 4,
        rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0],
        rotSpeed: (Math.random() - 0.5) * 2.0
      };
    });
  });

  // Handle Destruction
  useEffect(() => {
    if (destroyedAsteroidId !== null && explosionPosition && destroyedAsteroidId !== lastProcessedId.current) {
      lastProcessedId.current = destroyedAsteroidId;
      setMeteorData(prev => {
        const target = prev.find(m => m.id === destroyedAsteroidId);
        if (target) {
          setExplosions(prevExp => [...prevExp, { ...target, position: explosionPosition, time: Date.now() }]);
          return prev.filter(m => m.id !== destroyedAsteroidId);
        }
        return prev;
      });
    }
  }, [destroyedAsteroidId, explosionPosition]);

  useFrame((state, delta) => {
    // Slowly rotate the stars
    if (starsRef.current) {
      starsRef.current.rotation.y -= delta * 0.02;
    }

    // Clean up old explosions
    if (explosions.length > 0) {
      const now = Date.now();
      const activeExplosions = explosions.filter(e => now - e.time < 1000);
      if (activeExplosions.length !== explosions.length) {
        setExplosions(activeExplosions);
      }
    }
  });

  return (
    <group>
      {/* Animated Nebula Clouds */}
      <NebulaCloud position={[0, 0, -40]} color="#ff6b35" scale={25} rotation={0} />
      <NebulaCloud position={[15, 10, -50]} color="#00d4ff" scale={20} rotation={Math.PI / 3} />
      <NebulaCloud position={[-20, -8, -45]} color="#1a4d6d" scale={22} rotation={-Math.PI / 4} />
      <NebulaCloud position={[10, -15, -55]} color="#ff8c42" scale={18} rotation={Math.PI / 2} />

      {/* Enhanced Starfield with Twinkling */}
      <Stars
        ref={starsRef}
        radius={300}
        depth={80}
        count={8000}
        factor={5}
        saturation={0}
        fade
        speed={1}
      />

      {/* Bright Star Layer */}
      <Stars
        radius={150}
        depth={60}
        count={3000}
        factor={7}
        saturation={0.3}
        fade
        speed={1.5}
      />

      {/* Enhanced Space Dust */}
      <Sparkles
        color="#88ccff"
        count={500}
        size={6}
        opacity={0.8}
        scale={[40, 40, 40]}
        speed={0.3}
        noise={1.5}
      />

      {/* Teal Dust Particles */}
      <Sparkles
        color="#00d4ff"
        count={200}
        size={3}
        opacity={0.5}
        scale={[35, 35, 35]}
        speed={0.15}
        noise={2}
      />

      {/* --- DIAGONAL METEORS --- */}
      {meteorData.map((data) => (
        <Meteor
          key={data.id}
          data={data}
          onClick={onAsteroidClick}
        />
      ))}

      {/* --- EXPLOSIONS --- */}
      {explosions.map(exp => (
        <Explosion key={`exp-${exp.id}`} position={exp.position} scale={exp.scale} />
      ))}

    </group>
  );
}

// Animated Nebula Cloud Component
function NebulaCloud({ position, color, scale, rotation }) {
  const meshRef = useRef();
  const materialRef = useRef();

  // Create gradient texture for nebula
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Create radial gradient
    const gradient = ctx.createRadialGradient(256, 256, 50, 256, 256, 256);
    gradient.addColorStop(0, color + 'ff');
    gradient.addColorStop(0.3, color + 'aa');
    gradient.addColorStop(0.6, color + '44');
    gradient.addColorStop(1, color + '00');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 512);

    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  }, [color]);

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Slow rotation
      meshRef.current.rotation.z += delta * 0.05;
    }

    if (materialRef.current) {
      // Pulsing opacity
      const pulse = Math.sin(state.clock.elapsedTime * 0.5) * 0.1 + 0.3;
      materialRef.current.opacity = pulse;
    }
  });

  return (
    <mesh ref={meshRef} position={position} rotation={[0, 0, rotation]}>
      <planeGeometry args={[scale, scale]} />
      <meshBasicMaterial
        ref={materialRef}
        map={texture}
        transparent
        opacity={0.3}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

// Meteor coming TOWARD viewer
function Meteor({ data, onClick }) {
  const meteorRef = useRef();
  const { position, rotation, scale, speed, rotSpeed, id } = data;

  const posRef = useRef(new THREE.Vector3(...position));

  useFrame((state, delta) => {
    if (meteorRef.current) {
      meteorRef.current.rotation.x += delta * rotSpeed;
      meteorRef.current.rotation.y += delta * rotSpeed;

      posRef.current.z += speed * delta * 2;

      if (posRef.current.z > 10) {
        const newAngle = Math.random() * Math.PI * 2;
        const newRadius = 6 + Math.random() * 4;
        posRef.current.x = Math.cos(newAngle) * newRadius;
        posRef.current.y = Math.sin(newAngle) * newRadius;
        posRef.current.z = -60 - Math.random() * 40;
      }

      meteorRef.current.position.copy(posRef.current);
    }
  });

  return (
    <group>
      <mesh
        ref={meteorRef}
        position={position}
        rotation={rotation}
        scale={scale}
        onClick={(e) => {
          e.stopPropagation();
          if (onClick) onClick(id, posRef.current.toArray());
        }}
      >
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color="#aaaaaa"
          transparent
          opacity={0.4}
          roughness={0.8}
        />
      </mesh>
    </group>
  );
}


function Explosion({ position, scale = 1 }) {
  const group = useRef();
  const [particles] = useState(() => new Array(12).fill().map(() => ({
    velocity: [(Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2],
    scale: Math.random() * scale * 0.5
  })));

  useFrame((state, delta) => {
    if (group.current) {
      group.current.children.forEach((child, i) => {
        child.position.x += particles[i].velocity[0] * delta * 15;
        child.position.y += particles[i].velocity[1] * delta * 15;
        child.position.z += particles[i].velocity[2] * delta * 15;

        if (child.material.opacity > 0) {
          child.material.opacity -= delta * 2;
          child.scale.multiplyScalar(0.92);
        } else {
          child.visible = false;
        }
      });
    }
  });

  return (
    <group ref={group} position={position}>
      {particles.map((p, i) => (
        <mesh key={i} position={[0, 0, 0]} scale={p.scale}>
          <sphereGeometry args={[0.8, 8, 8]} />
          <meshBasicMaterial
            color={i % 2 === 0 ? "#ff6600" : "#ffaa00"}
            transparent
            opacity={1}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

