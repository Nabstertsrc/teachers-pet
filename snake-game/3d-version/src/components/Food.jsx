import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Billboard } from '@react-three/drei';
import { useGameStore } from '../store/gameStore';

const FoodOrb = ({ item }) => {
    const meshRef = useRef();
    const glowRef = useRef();

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.04;
            meshRef.current.rotation.x += 0.02;
            meshRef.current.position.y = 0.8 + Math.sin(state.clock.elapsedTime * 3 + item.id) * 0.15;
        }
        if (glowRef.current) {
            glowRef.current.scale.setScalar(1.2 + Math.sin(state.clock.elapsedTime * 5) * 0.1);
        }
    });

    // High intensity neon colors
    const color = item.isCorrect ? '#00ff88' : '#ff0055';

    return (
        <group position={[item.x, item.y, item.z]}>
            <mesh ref={meshRef}>
                <boxGeometry args={[0.5, 0.5, 0.5]} />
                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={4}
                    roughness={0}
                    metalness={1}
                />
            </mesh>

            {/* Outer glow sphere */}
            <mesh ref={glowRef} position={[0, 0.8, 0]}>
                <sphereGeometry args={[0.4, 16, 16]} />
                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={2}
                    transparent
                    opacity={0.3}
                />
            </mesh>

            <Billboard position={[0, 1.8, 0]}>
                <Text
                    fontSize={0.6}
                    color="white"
                    outlineColor={color}
                    outlineWidth={0.06}
                    anchorX="center"
                    anchorY="middle"
                >
                    {item.label}
                </Text>
            </Billboard>

            <pointLight position={[0, 1, 0]} color={color} intensity={5} distance={4} />
        </group>
    );
};

const Food = () => {
    const foodItems = useGameStore(state => state.foodItems);
    const status = useGameStore(state => state.status);

    if (status !== 'PLAYING' || !foodItems.length) return null;

    return (
        <group>
            {foodItems.map(item => (
                <FoodOrb key={item.id} item={item} />
            ))}
        </group>
    );
};

export default Food;
