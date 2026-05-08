import React from 'react';
import Scene from './components/Scene';
import { useGameStore } from './store/gameStore';
import { questions } from './data/questions';

function App() {
    const score = useGameStore(state => state.score);
    const highScore = useGameStore(state => state.highScore);
    const status = useGameStore(state => state.status);
    const questionIndex = useGameStore(state => state.questionIndex);
    const gameOverReason = useGameStore(state => state.gameOverReason);
    const setSkin = useGameStore(state => state.setSkin);
    const levelId = useGameStore(state => state.currentLevelId);
    const levelName = useGameStore(state => state.levelName);
    const isTransitioning = useGameStore(state => state.isTransitioning);

    const currentQuestion = questions[questionIndex] || questions[0];

    return (
        <div className="w-full h-screen overflow-hidden relative bg-[#020408]" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
            {/* 3D Canvas */}
            <div className="absolute inset-0">
                <Scene />
            </div>

            {/* Neon Overlay HUD */}
            <div className="absolute top-0 left-0 right-0 flex justify-between items-start p-6 pointer-events-none z-10">
                {/* Left: Score with Pixel Font Style */}
                <div
                    className="text-3xl font-bold text-white tracking-widest uppercase"
                    style={{ textShadow: '0 0 10px #fff, 0 0 20px #22c55e, 0 0 30px #22c55e' }}
                >
                    Score: {score}
                </div>

                {/* Center: Branding */}
                <div className="text-center">
                    <div
                        className="px-6 py-2 border-4 border-cyan-400 rounded-lg bg-black/40"
                        style={{ boxShadow: '0 0 15px rgba(34,211,238,0.5), inset 0 0 15px rgba(34,211,238,0.5)' }}
                    >
                        <h1
                            className="text-4xl font-black text-white px-2 tracking-tighter italic"
                            style={{ textShadow: '0 0 10px #fff, 0 0 20px #ec4899, 0 0 30px #ec4899' }}
                        >
                            NEON SNAKE
                        </h1>
                    </div>
                </div>

                {/* Right: Best / Level */}
                <div className="text-right flex flex-col gap-2">
                    <div
                        className="text-xl font-bold text-yellow-400 tracking-wider"
                        style={{ textShadow: '0 0 10px #fbbf24' }}
                    >
                        BEST: {highScore}
                    </div>
                    <div
                        className="text-lg font-bold text-cyan-400 uppercase"
                        style={{ textShadow: '0 0 8px #22d3ee' }}
                    >
                        LEVEL {levelId}: {levelName}
                    </div>
                </div>
            </div>

            {/* Question panel — bottom center */}
            {status === 'PLAYING' && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none z-10">
                    <div
                        className="text-center px-10 py-5 rounded-3xl border-2 border-pink-500/50"
                        style={{
                            background: 'rgba(0,0,0,0.85)',
                            backdropFilter: 'blur(12px)',
                            boxShadow: '0 0 40px rgba(236,72,153,0.3)'
                        }}
                    >
                        <p className="text-[10px] text-pink-400 font-bold uppercase tracking-[0.3em] mb-2">Current Mission</p>
                        <p className="text-2xl font-bold text-white mb-2 tracking-tight">{currentQuestion.question}</p>
                        <p className="text-sm text-gray-500 italic">Navigate high ground to find the correct symbol!</p>
                    </div>
                </div>
            )}

            {/* Level Transition Overlay */}
            {isTransitioning && (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center">
                    <div className="text-center animate-pulse">
                        <h2 className="text-6xl font-black text-cyan-400 italic mb-4" style={{ textShadow: '0 0 30px #22d3ee' }}>
                            LEVEL CLEAR
                        </h2>
                        <p className="text-xl text-white tracking-[0.5em] font-bold">PREPARING NEXT ZONE...</p>
                    </div>
                </div>
            )}

            {/* IDLE / START OVERLAY */}
            {status === 'IDLE' && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                    <div
                        className="text-center p-12 rounded-[3rem] pointer-events-auto max-w-lg border-2 border-green-400/30"
                        style={{
                            background: 'rgba(2,4,8,0.92)',
                            backdropFilter: 'blur(30px)',
                            boxShadow: '0 0 100px rgba(34,197,94,0.15)'
                        }}
                    >
                        <div className="text-8xl mb-6">🐍</div>
                        <h2 className="text-5xl font-black text-green-400 italic mb-4 tracking-tighter" style={{ textShadow: '0 0 20px #22c55e' }}>
                            ENTER THE GRID
                        </h2>
                        <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                            Ascend ramps, dodge Tetris structures, and collect science symbols in a 3D neon universe.
                        </p>

                        {/* Skin Selector */}
                        <div className="flex justify-center gap-4 mb-10">
                            {[
                                { id: 'default', icon: '🟢', label: 'NEON' },
                                { id: 'dragon', icon: '🐉', label: 'GOLD' },
                                { id: 'reptile', icon: '🦎', label: 'CYBER' }
                            ].map((s) => (
                                <button
                                    key={s.id}
                                    onClick={() => setSkin(s.id)}
                                    className={`flex flex-col items-center p-4 rounded-2xl border-2 transition-all group ${useGameStore.getState().skin === s.id
                                            ? 'bg-green-500/20 border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.4)] scale-110'
                                            : 'bg-white/5 border-white/10 hover:border-white/30'
                                        }`}
                                >
                                    <span className="text-3xl mb-1 group-hover:scale-125 transition-transform">{s.icon}</span>
                                    <span className="text-[10px] font-black text-white tracking-widest">{s.label}</span>
                                </button>
                            ))}
                        </div>

                        <div className="text-2xl font-bold text-yellow-400 animate-pulse uppercase tracking-[0.2em]" style={{ textShadow: '0 0 15px #fbbf24' }}>
                            Press SPACE to Play
                        </div>
                    </div>
                </div>
            )}

            {/* GAMEOVER OVERLAY */}
            {status === 'GAMEOVER' && (
                <div className="absolute inset-0 bg-red-950/40 backdrop-blur-lg flex items-center justify-center z-50">
                    <div
                        className="text-center p-12 rounded-[3rem] pointer-events-auto max-w-lg border-2 border-red-500/50"
                        style={{ background: 'rgba(2,4,8,0.95)', boxShadow: '0 0 100px rgba(239,68,68,0.2)' }}
                    >
                        <div className="text-8xl mb-4">💥</div>
                        <h2 className="text-6xl font-black text-red-500 italic mb-4 tracking-tighter" style={{ textShadow: '0 0 30px #ef4444' }}>
                            SYSTEM ERROR
                        </h2>
                        {gameOverReason && (
                            <p className="text-white text-xl font-bold mb-6 border-y border-white/10 py-4 uppercase tracking-wider">{gameOverReason}</p>
                        )}
                        <div className="flex gap-12 justify-center mb-10">
                            <div className="text-center">
                                <p className="text-xs text-gray-500 uppercase tracking-widest">Gained Score</p>
                                <p className="text-4xl font-black text-white">{score}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-xs text-gray-500 uppercase tracking-widest">Personal Best</p>
                                <p className="text-4xl font-black text-yellow-400">{highScore}</p>
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-yellow-400 animate-bounce uppercase tracking-widest">
                            Press SPACE to Reboot
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
