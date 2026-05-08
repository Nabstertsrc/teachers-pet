import React, { useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, PerspectiveCamera } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { useGameStore } from '../store/gameStore';
import Snake from './Snake';
import Food from './Food';
import TetrisBlocks from './TetrisBlocks';
import VisualEffects from './VisualEffects';

const GRID_SIZE = 20;

// Neon Terrain with height-based tiles
const Terrain = () => {
    const levelMap = useGameStore(state => state.levelMap);

    const tiles = useMemo(() => {
        const items = [];
        for (let z = 0; z < GRID_SIZE; z++) {
            for (let x = 0; x < GRID_SIZE; x++) {
                const height = levelMap[z][x];
                const posX = x - GRID_SIZE / 2 + 0.5;
                const posZ = z - GRID_SIZE / 2 + 0.5;

                // Color based on height
                const color = height === 0 ? '#0a1628' : height === 1 ? '#0f2a4a' : '#1a3a6a';
                const borderColor = height === 0 ? '#1a3a6a' : height === 1 ? '#3a7abd' : '#5a9ae8';

                items.push(
                    <group key={`${x}-${z}`}>
                        {/* Solid tile */}
                        <mesh position={[posX, height / 2 - 0.05, posZ]}>
                            <boxGeometry args={[0.95, height + 0.1, 0.95]} />
                            <meshStandardMaterial color={color} roughness={0.2} metalness={0.8} />
                        </mesh>
                        {/* Neon border/wireframe */}
                        <mesh position={[posX, height + 0.01, posZ]} rotation={[-Math.PI / 2, 0, 0]}>
                            <planeGeometry args={[0.95, 0.95]} />
                            <meshStandardMaterial
                                color={borderColor}
                                emissive={borderColor}
                                emissiveIntensity={2}
                                wireframe
                            />
                        </mesh>
                    </group>
                );
            }
        }
        return items;
    }, [levelMap]);

    return <group>{tiles}</group>;
};

const GameLoop = () => {
    const moveSnake = useGameStore(state => state.moveSnake);
    const status = useGameStore(state => state.status);
    const lastUpdate = useRef(0);
    const TICK_RATE = 0.18;

    useFrame((state) => {
        if (status === 'PLAYING') {
            if (state.clock.elapsedTime - lastUpdate.current > TICK_RATE) {
                moveSnake();
                lastUpdate.current = state.clock.elapsedTime;
            }
        }
    });
    return null;
};

const Scene = () => {
    const setDirection = useGameStore(state => state.setDirection);
    const startGame = useGameStore(state => state.startGame);
    const status = useGameStore(state => state.status);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
                e.preventDefault();
            }
            if (status === 'IDLE' || status === 'GAMEOVER') {
                if (e.code === 'Space') startGame();
                return;
            }
            switch (e.key) {
                case 'w': case 'W': case 'ArrowUp': setDirection({ x: 0, y: 0, z: -1 }); break;
                case 's': case 'S': case 'ArrowDown': setDirection({ x: 0, y: 0, z: 1 }); break;
                case 'a': case 'A': case 'ArrowLeft': setDirection({ x: -1, y: 0, z: 0 }); break;
                case 'd': case 'D': case 'ArrowRight': setDirection({ x: 1, y: 0, z: 0 }); break;
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [status, setDirection, startGame]);

    return (
        <Canvas
            shadows
            style={{ height: '100vh', width: '100vw' }}
            gl={{ antialias: false, stencil: false, depth: true }}
        >
            <color attach="background" args={['#020408']} />
            <fog attach="fog" args={['#020408', 15, 35]} />

            <PerspectiveCamera makeDefault position={[0, 18, 22]} fov={45} />
            <OrbitControls
                enableZoom={true}
                enablePan={false}
                maxPolarAngle={Math.PI / 2.5}
                minDistance={10}
                maxDistance={40}
            />

            <ambientLight intensity={0.1} />
            <directionalLight position={[5, 10, 5]} intensity={0.5} castShadow />
            <pointLight position={[0, 5, 0]} intensity={1} color="#4488ff" />

            <Stars radius={100} depth={50} count={5000} factor={4} saturation={1} fade speed={1} />

            <Terrain />
            <Snake />
            <Food />
            <TetrisBlocks />
            <VisualEffects />

            <GameLoop />

            {/* Post-processing: BLOOM is key for Neon */}
            <EffectComposer disableNormalPass>
                <Bloom
                    intensity={1.5}
                    luminanceThreshold={0.2}
                    luminanceSmoothing={0.9}
                    mipmapBlur
                />
                <ChromaticAberration offset={[0.001, 0.001]} />
                <Vignette eskil={false} offset={0.1} darkness={1.1} />
            </EffectComposer>
        </Canvas>
    );
};

export default Scene;
