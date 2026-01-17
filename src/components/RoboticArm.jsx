import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// No offset - fingertips align exactly with cursor
const FINGER_OFFSET = 0;
// Vertical offset to align hand with cursor (hand was appearing below)
const Y_OFFSET = 1.5;

export default function RoboticArm(props) {
    const handGroupRef = useRef();
    const laserRef = useRef();
    const laserGroupRef = useRef();

    // Load the GLB model
    const { scene } = useGLTF('/src/assets/robotic_hand.glb');

    // Target position for the fingertips (world coords)
    const targetPos = useRef(new THREE.Vector3(0, 0, 4));

    // Laser state
    const laserState = useRef({
        active: false,
        startPos: new THREE.Vector3(),
        endPos: new THREE.Vector3(),
        progress: 0,
    });

    const animationState = useRef({ phase: 'IDLE', timer: 0 });
    const [currentPose, setCurrentPose] = useState('OPEN');

    // Apply bright, visible material
    useEffect(() => {
        if (scene) {
            scene.traverse((child) => {
                if (child.isMesh) {
                    // Use a translucent, glassy material with proper transparency
                    child.material = new THREE.MeshPhysicalMaterial({
                        color: '#00ccff',
                        transparent: true,
                        opacity: 0.3,
                        roughness: 0.1,
                        metalness: 0.2,
                        transmission: 0.7,  // Glass-like transmission
                        thickness: 0.5,
                        clearcoat: 1.0,
                        emissive: '#004488',
                        emissiveIntensity: 0.3,
                        side: THREE.DoubleSide,
                        depthWrite: false,  // Required for proper transparency
                    });
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
        }
    }, [scene]);

    useFrame((state, delta) => {
        const t = state.clock.elapsedTime;

        // --- TARGETED MODE (for CARRY/DESTROY actions) ---
        if (props.targetPosition) {
            const [tx, ty, tz] = props.targetPosition;
            const destPos = new THREE.Vector3(tx, ty, tz);
            const mode = props.mode || 'CARRY';

            if (mode === 'DESTROY') {
                if (animationState.current.phase === 'IDLE') {
                    animationState.current.phase = 'AIM';
                    animationState.current.timer = 0;
                    setCurrentPose('FINGER_GUN');
                }

                if (animationState.current.phase === 'AIM') {
                    targetPos.current.lerp(destPos, 1 - Math.exp(-4 * delta));
                    if (targetPos.current.distanceTo(destPos) < 3.0) {
                        animationState.current.phase = 'ATTACK';
                        laserState.current.active = true;
                        laserState.current.startPos.copy(targetPos.current);
                        laserState.current.endPos.copy(destPos);
                        laserState.current.progress = 0;
                    }
                } else if (animationState.current.phase === 'ATTACK') {
                    animationState.current.timer += delta;
                    if (laserState.current.active) {
                        laserState.current.progress = Math.min(laserState.current.progress + delta * 8, 1);
                        if (laserState.current.progress >= 1) {
                            if (props.onContact) props.onContact();
                            setTimeout(() => { laserState.current.active = false; }, 150);
                            animationState.current.phase = 'RETRACT';
                        }
                    }
                } else if (animationState.current.phase === 'RETRACT') {
                    if (props.onComplete) props.onComplete();
                    animationState.current.phase = 'IDLE';
                    setCurrentPose('OPEN');
                    laserState.current.active = false;
                }
            } else {
                // CARRY mode
                if (animationState.current.phase === 'IDLE') {
                    animationState.current.phase = 'REACH';
                    setCurrentPose('OPEN');
                }
                if (animationState.current.phase === 'REACH') {
                    // Move to target
                    targetPos.current.lerp(destPos, 1 - Math.exp(-6 * delta));

                    // If close enough, Grab
                    if (targetPos.current.distanceTo(destPos) < 0.8) {
                        animationState.current.phase = 'GRAB';
                        animationState.current.timer = 0;
                        setCurrentPose('GRAB');
                    }
                } else if (animationState.current.phase === 'GRAB') {
                    animationState.current.timer += delta;

                    // Brief grab animation (0.5s) then activate
                    if (animationState.current.timer > 0.5) {
                        // TRIGGER ACTIVATION DIRECTLY
                        // No delivery, just trigger the "drop" (which is now 'activate')
                        if (props.onDrop) props.onDrop();

                        // Wait a moment holding it, then retract
                        animationState.current.phase = 'HOLD';
                        animationState.current.timer = 0;
                    }
                } else if (animationState.current.phase === 'HOLD') {
                    animationState.current.timer += delta;
                    // Hold for 0.5s while page transitions
                    if (animationState.current.timer > 0.5) {
                        animationState.current.phase = 'RETRACT';
                    }
                } else if (animationState.current.phase === 'RETRACT') {
                    animationState.current.phase = 'IDLE';
                    if (props.onComplete) props.onComplete();
                }
            }

            // Update legacy frame callback if needed (for attached object position)
            if (props.onFrameUpdate && (animationState.current.phase === 'GRAB' || animationState.current.phase === 'HOLD')) {
                props.onFrameUpdate([targetPos.current.x, targetPos.current.y, targetPos.current.z]);
            }

        } else {
            // --- MOUSE TRACKING MODE (default idle state) ---
            animationState.current.phase = 'IDLE';
            setCurrentPose('OPEN');
            laserState.current.active = false;

            // --- RAYCASTER TRACKING ---
            // Use the built-in raycaster which is automatically updated with mouse position
            // Calculate intersection with the Z=0 plane (where the hand primarily operates)

            const ray = state.raycaster.ray;

            // Calculate distance to Z=0 plane
            // Plane equation: Z = 0
            // Ray equation: Origin + t * Direction = Point
            // Origin.z + t * Direction.z = 0  =>  t = -Origin.z / Direction.z

            // Protect against divide by zero if ray is parallel to plane (unlikely)
            const targetZ = 0;
            const dist = (targetZ - ray.origin.z) / ray.direction.z;

            const worldX = ray.origin.x + ray.direction.x * dist;
            const worldY = ray.origin.y + ray.direction.y * dist;
            const worldZ = targetZ;

            // INSTANT TRACKING (No Lerp)
            targetPos.current.set(worldX, worldY, worldZ);
        }

        // --- UPDATE HAND POSITION & ROTATION ---
        if (handGroupRef.current) {
            // Calculate wrist position: fingertips at targetPos, wrist offset to the left
            const wristX = targetPos.current.x - FINGER_OFFSET;
            // Add Y_OFFSET to raise the hand up to the cursor
            const wristY = targetPos.current.y + Y_OFFSET + Math.sin(t * 1.5) * 0.03;
            const wristZ = targetPos.current.z;

            handGroupRef.current.position.set(wristX, wristY, wristZ);

            // Rotation: horizontal, palm DOWN, rotated 90 degrees left
            // Y = PI + PI/2 = 3*PI/2 (270 degrees)
            handGroupRef.current.rotation.set(-Math.PI / 2, Math.PI * 1.5, -Math.PI / 2);
        }

        // --- LASER VISUALS ---
        if (laserGroupRef.current) {
            laserGroupRef.current.visible = laserState.current.active;

            if (laserState.current.active && laserRef.current) {
                const start = laserState.current.startPos;
                const end = laserState.current.endPos;
                const progress = laserState.current.progress;

                const currentEnd = new THREE.Vector3().lerpVectors(start, end, progress);
                const beamLength = start.distanceTo(currentEnd);
                const midPoint = new THREE.Vector3().addVectors(start, currentEnd).multiplyScalar(0.5);

                laserGroupRef.current.position.copy(midPoint);
                laserGroupRef.current.lookAt(currentEnd);
                laserRef.current.scale.set(1, 1, beamLength);
            }
        }
    });

    return (
        <group {...props}>
            {/* Hand group - horizontal orientation (fingers point right) */}
            <group ref={handGroupRef} scale={0.5} rotation={[-Math.PI / 2, Math.PI * 1.5, -Math.PI / 2]}>
                <primitive object={scene.clone()} />
                <pointLight color="#00ffff" intensity={2} distance={4} />
            </group>

            {/* LASER BEAM */}
            <group ref={laserGroupRef} visible={false}>
                <mesh ref={laserRef}>
                    <cylinderGeometry args={[0.03, 0.03, 1, 8]} />
                    <meshBasicMaterial
                        color="#00ffff"
                        transparent
                        opacity={0.9}
                        blending={THREE.AdditiveBlending}
                    />
                </mesh>
                <mesh scale={[2, 1, 2]}>
                    <cylinderGeometry args={[0.05, 0.05, 1, 8]} />
                    <meshBasicMaterial
                        color="#00ffff"
                        transparent
                        opacity={0.3}
                        blending={THREE.AdditiveBlending}
                    />
                </mesh>
                <mesh position={[0, 0.5, 0]}>
                    <sphereGeometry args={[0.15, 16, 16]} />
                    <meshBasicMaterial
                        color="#ffffff"
                        transparent
                        opacity={0.8}
                        blending={THREE.AdditiveBlending}
                    />
                </mesh>
            </group>
        </group>
    );
}

useGLTF.preload('/src/assets/robotic_hand.glb');
