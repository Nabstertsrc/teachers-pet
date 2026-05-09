const STORAGE_PREFIX = 'adaptive-plan-v1'
const GAME_STORAGE_PREFIX = 'adaptive-game-v1'
const DEFAULT_STATE = { attempts: 0, correct: 0, streak: 0, mastery: 0, updatedAt: null }
const DEFAULT_GAME_STATE = {
  attempts: 0,
  solved: 0,
  supportSignals: 0,
  streak: 0,
  mastery: 0,
  recommendedLevel: 'Core',
  preferredMode: 'Practice',
  updatedAt: null,
}

function safeParse(json, fallback) {
  try {
    return JSON.parse(json)
  } catch {
    return fallback
  }
}

function getKey(subject, grade) {
  return `${STORAGE_PREFIX}:${subject}:${grade}`
}

function getGameKey(gameId) {
  return `${GAME_STORAGE_PREFIX}:${gameId}`
}

function gradeBand(grade) {
  const g = Number(grade)
  if (Number.isNaN(g) || g <= 3) return 'foundation'
  if (g <= 6) return 'intermediate'
  if (g <= 9) return 'senior'
  return 'fet'
}

function computeLevel(mastery) {
  if (mastery < 35) return 'Support'
  if (mastery < 70) return 'Core'
  return 'Advanced'
}

function normalizeMode(mode) {
  const clean = String(mode || '').toLowerCase()
  if (clean === 'sprint') return 'Sprint'
  if (clean === 'mastery') return 'Mastery'
  return 'Practice'
}

export function getAdaptiveState(subject, grade) {
  if (typeof window === 'undefined') {
    return DEFAULT_STATE
  }
  const raw = localStorage.getItem(getKey(subject, grade))
  const parsed = safeParse(raw, DEFAULT_STATE)
  if (!parsed || typeof parsed !== 'object') return DEFAULT_STATE
  return {
    attempts: Number(parsed.attempts) || 0,
    correct: Number(parsed.correct) || 0,
    streak: Number(parsed.streak) || 0,
    mastery: Number(parsed.mastery) || 0,
    updatedAt: parsed.updatedAt || null,
  }
}

export function saveAdaptiveState(subject, grade, state) {
  if (typeof window === 'undefined') return
  localStorage.setItem(getKey(subject, grade), JSON.stringify(state))
}

export function recordAdaptiveResult(subject, grade, isCorrect) {
  const current = getAdaptiveState(subject, grade)
  const next = {
    attempts: current.attempts + 1,
    correct: current.correct + (isCorrect ? 1 : 0),
    streak: isCorrect ? current.streak + 1 : 0,
    mastery: 0,
    updatedAt: new Date().toISOString(),
  }
  const accuracy = next.correct / Math.max(1, next.attempts)
  next.mastery = Math.max(0, Math.min(100, Math.round(accuracy * 80 + next.streak * 4)))
  saveAdaptiveState(subject, grade, next)
  return next
}

export function getAdaptivePlan(subject, grade) {
  const state = getAdaptiveState(subject, grade) || DEFAULT_STATE
  const band = gradeBand(grade)
  const level = computeLevel(state.mastery)
  const objective =
    level === 'Support'
      ? 'Revise foundations with guided examples.'
      : level === 'Core'
      ? 'Consolidate concepts with mixed practice.'
      : 'Apply concepts in multi-step problems.'
  const pacing =
    band === 'foundation' ? 'Short 8-10 minute bursts' :
    band === 'intermediate' ? '15 minute concept-practice cycles' :
    band === 'senior' ? '20 minute worked-example blocks' :
    'Exam-style timed sets with reflection'

  return {
    subject,
    grade,
    level,
    mastery: state.mastery,
    streak: state.streak,
    objective,
    pacing,
    attempts: state.attempts,
  }
}

export function getGameAdaptiveState(gameId) {
  if (typeof window === 'undefined') return DEFAULT_GAME_STATE
  const raw = localStorage.getItem(getGameKey(gameId))
  const parsed = safeParse(raw, DEFAULT_GAME_STATE)
  if (!parsed || typeof parsed !== 'object') return DEFAULT_GAME_STATE
  const mastery = Number(parsed.mastery)
  const normalizedMastery = Number.isFinite(mastery) ? Math.max(0, Math.min(100, mastery)) : 0
  return {
    attempts: Number(parsed.attempts) || 0,
    solved: Number(parsed.solved) || 0,
    supportSignals: Number(parsed.supportSignals) || 0,
    streak: Number(parsed.streak) || 0,
    mastery: normalizedMastery,
    recommendedLevel: computeLevel(normalizedMastery),
    preferredMode: normalizeMode(parsed.preferredMode),
    updatedAt: parsed.updatedAt || null,
  }
}

export function saveGameAdaptiveState(gameId, state) {
  if (typeof window === 'undefined') return
  localStorage.setItem(getGameKey(gameId), JSON.stringify(state))
}

export function recordGameResult(gameId, outcome, mode = 'Practice') {
  const current = getGameAdaptiveState(gameId)
  const solvedBoost = outcome === 'solved' ? 1 : 0
  const supportBoost = outcome === 'support' ? 1 : 0
  const streak = outcome === 'solved' ? current.streak + 1 : 0
  const next = {
    attempts: current.attempts + 1,
    solved: current.solved + solvedBoost,
    supportSignals: current.supportSignals + supportBoost,
    streak,
    mastery: 0,
    recommendedLevel: 'Core',
    preferredMode: normalizeMode(mode),
    updatedAt: new Date().toISOString(),
  }
  const solveRate = next.solved / Math.max(1, next.attempts)
  const supportPenalty = next.supportSignals * 8
  next.mastery = Math.max(0, Math.min(100, Math.round(solveRate * 85 + streak * 4 - supportPenalty)))
  next.recommendedLevel = computeLevel(next.mastery)
  saveGameAdaptiveState(gameId, next)
  return next
}

export function getRecommendedGameSession(game) {
  const gameState = getGameAdaptiveState(game.id)
  const recommendedLevel = gameState.recommendedLevel || 'Core'
  const modes = Array.isArray(game.modes) && game.modes.length ? game.modes : ['Practice']
  let recommendedMode = gameState.preferredMode
  if (!modes.includes(recommendedMode)) {
    recommendedMode = recommendedLevel === 'Advanced' && modes.includes('Mastery')
      ? 'Mastery'
      : recommendedLevel === 'Core' && modes.includes('Sprint')
      ? 'Sprint'
      : modes[0]
  }
  const challenge =
    recommendedLevel === 'Support'
      ? 'Use guided rounds, slower pacing, and extra hints.'
      : recommendedLevel === 'Core'
      ? 'Mix accuracy with pace and keep a steady streak.'
      : 'Push for longer streaks with fewer hints and higher complexity.'

  return {
    state: gameState,
    recommendedLevel,
    recommendedMode,
    challenge,
  }
}
