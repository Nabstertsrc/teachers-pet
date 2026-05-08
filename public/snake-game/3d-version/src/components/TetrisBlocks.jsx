import React, { useMemo } from 'react';
import * as THREE from 'three';

const TETRIS_SHAPES = {
    I: [[0, 0], [1, 0], [2, 0], [3, 0]],
    L: [[0, 0], [0, 1], [0, 2], [1, 2]],
    J: [[1, 0], [1, 1], [1, 2], [0, 2]],
    O: [[0, 0], [1, 0], [0, 1], [1, 1]],
    T: [[0, 0], [1, 0], [2, 0], [1, 1]],
    S: [[1, 0], [2, 0], [0, 1], [1, 1]],
    Z: [[0, 0], [1, 0], [1, 1], [2, 1]],
};

const TetrisPiece = ({ type, position, color }) => {
    const shape = TETRIS_SHAPES[type] || TETRIS_SHAPES.O;

    return (
        <group position={position}>
            {shape.map((block, i) => (
                <mesh key={i} position={[block[0], 0, block[1]]} castShadow receiveShadow>
                    <boxGeometry args={[0.9, 0.9, 0.9]} />
                    <meshStandardMaterial
                        color={color}
                        emissive={color}
                        emissiveIntensity={1.5}
                        roughness={0}
                        metalness={1}
                    />
                    {/* Interior wireframe for detail */}
                    <mesh scale={1.05}>
                        <boxGeometry args={[0.92, 0.92, 0.92]} />
                        <meshStandardMaterial color="#ffffff" wireframe transparent opacity={0.2} />
                    </mesh>
                </mesh>
            ))}
        </group>
    );
};

const TetrisBlocks = () => {
    // Random placement for demo - in final version this should come from level config
    const pieces = useMemo(() => [
        { type: 'T', pos: [-6, 0.5, -6], col: '#ff00ff' },
        { type: 'L', pos: [5, 1.5, -4], col: '#00ffff' },
        { type: 'O', pos: [-4, 2.5, 4], col: '#ffff00' },
        { type: 'S', pos: [4, 0.5, 6], col: '#00ff00' },
        { type: 'I', pos: [0, 1.5, -8], col: '#ff8800' },
    ], []);

    return (
        <group>
            {pieces.map((p, i) => (
                <TetrisPiece key={i} type={p.type} position={p.pos} color={p.col} />
            ))}
        </group>
    );
};

export default TetrisBlocks;
