import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../store/gameStore';

const SnakeSegment = ({ pos, index, skin, total }) => {
    const meshRef = useRef();
    const wireRef = useRef();

    // Pulse effect for neon segments
    useFrame((state) => {
        if (meshRef.current && wireRef.current) {
            const pulse = 1 + Math.sin(state.clock.elapsedTime * 4 - index * 0.5) * 0.05;
            meshRef.current.scale.setScalar(pulse);
            wireRef.current.scale.setScalar(pulse * 1.05);
        }
    });

    const colors = useMemo(() => {
        if (skin === 'dragon') return { main: '#ffd700', wire: '#ff4400' };
        if (skin === 'reptile') return { main: '#44ffaa', wire: '#00ccff' };
        // Default green neon
        const t = index / total;
        return {
            main: new THREE.Color('#22c55e').lerp(new THREE.Color('#3b82f6'), t).getStyle(),
            wire: '#ffffff'
        };
    }, [skin, index, total]);

    return (
        <group position={[pos.x, pos.y + 0.51, pos.z]}>
            {/* Inner glowing block */}
            <mesh ref={meshRef}>
                <boxGeometry args={[0.85, 0.85, 0.85]} />
                <meshStandardMaterial
                    color={colors.main}
                    emissive={colors.main}
                    emissiveIntensity={2}
                    roughness={0}
                    metalness={1}
                />
            </mesh>
            {/* Outer wireframe glow */}
            <mesh ref={wireRef}>
                <boxGeometry args={[0.87, 0.87, 0.87]} />
                <meshStandardMaterial
                    color={colors.wire}
                    emissive={colors.wire}
                    emissiveIntensity={5}
                    wireframe
                    transparent
                    opacity={0.5}
                />
            </mesh>
        </group>
    );
};

const Snake = () => {
    const snake = useGameStore(state => state.snake);
    const skin = useGameStore(state => state.skin);
    const status = useGameStore(state => state.status);

    if (snake.length === 0) return null;

    return (
        <group shadow={true}>
            {snake.map((pos, i) => (
                <SnakeSegment
                    key={`${i}-${pos.x}-${pos.z}`}
                    pos={pos}
                    index={i}
                    skin={skin}
                    total={snake.length}
                />
            ))}
        </group>
    );
};

export default Snake;
