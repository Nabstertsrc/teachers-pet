import React, { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import { useGameStore } from '../store/gameStore';

const VisualEffects = () => {
    const eatEffect = useGameStore(state => state.eatEffect);
    const tetrisExplosion = useGameStore(state => state.tetrisExplosion);
    const [burst, setBurst] = useState(null);
    const [tetrisBurst, setTetrisBurst] = useState(null);
    const prevEffect = useRef(null);
    const prevTetris = useRef(null);

    useEffect(() => {
        if (eatEffect && eatEffect !== prevEffect.current) {
            prevEffect.current = eatEffect;
            setBurst({ ...eatEffect, key: Date.now() });
            const t = setTimeout(() => setBurst(null), 900);
            return () => clearTimeout(t);
        }
    }, [eatEffect]);

    useEffect(() => {
        if (tetrisExplosion && tetrisExplosion !== prevTetris.current) {
            prevTetris.current = tetrisExplosion;
            setTetrisBurst({ ...tetrisExplosion, key: Date.now() });
            const t = setTimeout(() => setTetrisBurst(null), 1500);
            return () => clearTimeout(t);
        }
    }, [tetrisExplosion]);

    return (
        <group>
            {burst && (
                <Sparkles
                    key={burst.key}
                    position={[burst.x, burst.y + 0.5, burst.z]}
                    count={60}
                    scale={3}
                    size={5}
                    speed={2.5}
                    opacity={1}
                    color={burst.correct ? '#00ff88' : '#ff3300'}
                />
            )}
            {tetrisBurst && (
                <Sparkles
                    key={tetrisBurst.key}
                    position={[tetrisBurst.x, tetrisBurst.y + 0.5, tetrisBurst.z]}
                    count={200}
                    scale={5}
                    size={8}
                    speed={4}
                    opacity={1}
                    color={tetrisBurst.color || '#ff00ff'}
                />
            )}
        </group>
    );
};

export default VisualEffects;
