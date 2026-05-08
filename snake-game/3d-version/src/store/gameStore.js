import { create } from 'zustand';
import { questions } from '../data/questions';

const GRID_WIDTH = 20;
const GRID_DEPTH = 20;

const LEVELS = [
    {
        id: 1,
        name: "NEON PLATEAU",
        heightMap: [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0],
            [0, 0, 1, 1, 1, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 1, 1, 1, 0, 0],
            [0, 0, 1, 1, 1, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 1, 1, 1, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 1, 2, 3, 3, 3, 3, 2, 1, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 4, 3, 2, 1, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 4, 3, 2, 1, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 1, 1, 0, 0, 1, 2, 3, 3, 3, 2, 1, 0, 0, 1, 1, 0, 0],
            [0, 0, 0, 1, 1, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 1, 1, 1, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0],
            [0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0],
            [0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        ]
    },
    {
        id: 2,
        name: "CYBER COLUMNS",
        heightMap: [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 0],
            [0, 2, 1, 1, 1, 1, 1, 1, 2, 0, 0, 2, 1, 1, 1, 1, 1, 1, 2, 0],
            [0, 2, 1, 0, 0, 0, 0, 1, 2, 0, 0, 2, 1, 0, 0, 0, 0, 1, 2, 0],
            [0, 2, 1, 0, 0, 0, 0, 1, 2, 0, 0, 2, 1, 0, 0, 0, 0, 1, 2, 0],
            [0, 2, 1, 1, 1, 1, 1, 1, 2, 0, 0, 2, 1, 1, 1, 1, 1, 1, 2, 0],
            [0, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 2, 3, 3, 3, 3, 3, 3, 2, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 2, 3, 3, 3, 3, 3, 3, 2, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
            [1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1],
            [1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1],
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        ]
    }
];

const DISTRACTORS = ['H₂O', 'CO₂', 'NaCl', 'O₂', 'NH₃', 'CH₄', 'C₆H₁₂O₆', 'HCl', 'NaOH', 'NO₂', 'N₂', 'Cl₂'];

function getTerrainHeight(x, z, levelId) {
    const level = LEVELS.find(l => l.id === levelId) || LEVELS[0];
    const gridX = Math.floor(x + GRID_WIDTH / 2);
    const gridZ = Math.floor(z + GRID_DEPTH / 2);
    if (gridX < 0 || gridX >= GRID_WIDTH || gridZ < 0 || gridZ >= GRID_DEPTH) return 0;
    return level.heightMap[gridZ][gridX];
}

function randomPos(occupied, levelId) {
    let pos;
    let attempts = 0;
    do {
        pos = {
            x: Math.floor(Math.random() * (GRID_WIDTH - 2)) - (GRID_WIDTH / 2 - 1),
            z: Math.floor(Math.random() * (GRID_DEPTH - 2)) - (GRID_DEPTH / 2 - 1),
        };
        attempts++;
    } while (occupied.some(o => o.x === pos.x && o.z === pos.z) && attempts < 100);
    pos.y = getTerrainHeight(pos.x, pos.z, levelId);
    return pos;
}

function buildFoodItems(questionIndex, snake, levelId) {
    const question = questions[questionIndex];
    const correctSymbol = question.symbol;
    const shuffled = DISTRACTORS.filter(d => d !== correctSymbol).sort(() => Math.random() - 0.5);
    const allLabels = [correctSymbol, ...shuffled.slice(0, 3)].sort(() => Math.random() - 0.5);
    const occupied = snake.map(s => ({ x: s.x, z: s.z }));
    return allLabels.map((label, i) => {
        const pos = randomPos(occupied, levelId);
        occupied.push(pos);
        return { id: i, ...pos, label, isCorrect: label === correctSymbol };
    });
}

const initialSnake = [
    { x: 0, y: 0, z: 0 },
    { x: -1, y: 0, z: 0 },
    { x: -2, y: 0, z: 0 },
];

export const useGameStore = create((set, get) => ({
    snake: initialSnake,
    direction: { x: 1, y: 0, z: 0 },
    nextDirection: { x: 1, y: 0, z: 0 },
    foodItems: [],
    questionIndex: 0,
    score: 0,
    highScore: parseInt(localStorage.getItem('snake3d_highscore') || '0'),
    status: 'IDLE',
    gameOverReason: '',
    skin: 'default',
    eatEffect: null,
    tetrisExplosion: null,
    currentLevelId: 1,
    levelMap: LEVELS[0].heightMap,
    levelName: LEVELS[0].name,
    isTransitioning: false,

    setSkin: (skin) => set({ skin }),

    startGame: () => {
        const levelId = 1;
        const level = LEVELS[0];
        const snake = initialSnake.map(s => ({ ...s, y: getTerrainHeight(s.x, s.z, levelId) }));
        const foodItems = buildFoodItems(0, snake, levelId);
        set({
            status: 'PLAYING',
            snake,
            direction: { x: 1, y: 0, z: 0 },
            nextDirection: { x: 1, y: 0, z: 0 },
            foodItems,
            questionIndex: 0,
            score: 0,
            gameOverReason: '',
            eatEffect: null,
            tetrisExplosion: null,
            currentLevelId: levelId,
            levelMap: level.heightMap,
            levelName: level.name,
            isTransitioning: false,
        });
    },

    nextLevel: () => {
        const { currentLevelId } = get();
        const nextId = currentLevelId + 1;
        const nextLevel = LEVELS.find(l => l.id === nextId);

        if (!nextLevel) {
            set({ status: 'GAMEOVER', gameOverReason: "YOU CLEARED ALL NEON LEVELS!" });
            return;
        }

        set({ isTransitioning: true });

        setTimeout(() => {
            const newSnake = initialSnake.map(s => ({ ...s, y: getTerrainHeight(s.x, s.z, nextId) }));
            const foodItems = buildFoodItems(0, newSnake, nextId);
            set({
                currentLevelId: nextId,
                levelMap: nextLevel.heightMap,
                levelName: nextLevel.name,
                snake: newSnake,
                foodItems,
                questionIndex: 0,
                isTransitioning: false,
                direction: { x: 1, y: 0, z: 0 },
                nextDirection: { x: 1, y: 0, z: 0 },
            });
        }, 1500);
    },

    setDirection: (dir) => {
        const currentDir = get().direction;
        if (dir.x !== 0 && currentDir.x !== 0) return;
        if (dir.z !== 0 && currentDir.z !== 0) return;
        set({ nextDirection: dir });
    },

    moveSnake: () => {
        const { snake, nextDirection, foodItems, status, questionIndex, score, currentLevelId, isTransitioning } = get();
        if (status !== 'PLAYING' || isTransitioning) return;

        const direction = nextDirection;
        set({ direction });

        const head = snake[0];
        const targetX = head.x + direction.x;
        const targetZ = head.z + direction.z;

        if (Math.abs(targetX) >= GRID_WIDTH / 2 || Math.abs(targetZ) >= GRID_DEPTH / 2) {
            set({ status: 'GAMEOVER', gameOverReason: "You drifted into the void!" });
            return;
        }

        const targetY = getTerrainHeight(targetX, targetZ, currentLevelId);
        if (Math.abs(targetY - head.y) > 1) {
            set({ status: 'GAMEOVER', gameOverReason: "You hit a wall too high to climb!" });
            return;
        }

        const newHead = { x: targetX, y: targetY, z: targetZ };

        if (snake.slice(1).some(s => s.x === newHead.x && s.z === newHead.z && s.y === newHead.y)) {
            set({ status: 'GAMEOVER', gameOverReason: "Self-intersection detected!" });
            return;
        }

        const tetrisPieces = [
            { type: 'T', pos: [-6, 0.5, -6], col: '#ff00ff' },
            { type: 'L', pos: [5, 1.5, -4], col: '#00ffff' },
            { type: 'O', pos: [-4, 2.5, 4], col: '#ffff00' },
            { type: 'S', pos: [4, 0.5, 6], col: '#00ff00' },
            { type: 'I', pos: [0, 1.5, -8], col: '#ff8800' },
        ];

        const TETRIS_SHAPES = {
            I: [[0, 0], [1, 0], [2, 0], [3, 0]], L: [[0, 0], [0, 1], [0, 2], [1, 2]],
            J: [[1, 0], [1, 1], [1, 2], [0, 2]], O: [[0, 0], [1, 0], [0, 1], [1, 1]],
            T: [[0, 0], [1, 0], [2, 0], [1, 1]], S: [[1, 0], [2, 0], [0, 1], [1, 1]],
            Z: [[0, 0], [1, 0], [1, 1], [2, 1]],
        };

        const hitPiece = tetrisPieces.find(p => {
            const shape = TETRIS_SHAPES[p.type];
            return shape.some(offset => (
                Math.round(p.pos[0] + offset[0]) === targetX &&
                Math.round(p.pos[2] + offset[1]) === targetZ &&
                Math.round(p.pos[1]) === targetY
            ));
        });

        if (hitPiece) {
            set({
                status: 'GAMEOVER', gameOverReason: "Neon structure impact!",
                tetrisExplosion: { x: targetX, y: targetY, z: targetZ, color: hitPiece.col }
            });
            return;
        }

        const hitFood = foodItems.find(f => f.x === newHead.x && f.z === newHead.z);

        if (hitFood) {
            if (hitFood.isCorrect) {
                const newScore = score + 10;
                const nextQIdx = (questionIndex + 1) % questions.length;

                if (nextQIdx === 0) {
                    get().nextLevel();
                    return;
                }

                const newSnake = [newHead, ...snake];
                const newFood = buildFoodItems(nextQIdx, newSnake, currentLevelId);
                const hs = Math.max(newScore, get().highScore);
                localStorage.setItem('snake3d_highscore', hs);
                set({
                    snake: newSnake, score: newScore, highScore: hs,
                    questionIndex: nextQIdx, foodItems: newFood,
                    eatEffect: { x: newHead.x, y: newHead.y, z: newHead.z, correct: true },
                });
            } else {
                set({
                    status: 'GAMEOVER',
                    gameOverReason: `Wrong symbol! The correct one was ${questions[questionIndex].symbol}`,
                    eatEffect: { x: newHead.x, y: newHead.y, z: newHead.z, correct: false },
                });
            }
        } else {
            set({ snake: [newHead, ...snake.slice(0, -1)], eatEffect: null });
        }
    },
}));
