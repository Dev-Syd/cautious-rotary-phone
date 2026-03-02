export const DIFFICULTY_XP = {
  easy: 10,
  medium: 25,
  hard: 50,
  epic: 100,
}

export const DIFFICULTY_COLORS = {
  easy: 'text-easy',
  medium: 'text-medium',
  hard: 'text-hard',
  epic: 'text-epic',
}

export const DIFFICULTY_BG = {
  easy: 'bg-easy',
  medium: 'bg-medium',
  hard: 'bg-hard',
  epic: 'bg-epic',
}

export const DIFFICULTY_ICONS = {
  easy: '\u2694\uFE0F',
  medium: '\uD83D\uDDE1\uFE0F',
  hard: '\u2694\uFE0F',
  epic: '\uD83D\uDC51',
}

export const DEFAULT_CATEGORIES = ['Health', 'Career', 'Home Lab', 'Home', 'Learning']

export const STORAGE_KEYS = {
  TASKS: 'questlog_tasks',
  PLAYER: 'questlog_player',
  SETTINGS: 'questlog_settings',
}

export const STREAK_MILESTONES = [3, 7, 14, 30, 60, 100]

export function xpForLevel(n) {
  return 100 * n
}

export function getLevelFromXP(totalXP) {
  let level = 0
  let xpRemaining = totalXP
  while (xpRemaining >= xpForLevel(level + 1)) {
    level++
    xpRemaining -= xpForLevel(level)
  }
  return { level, xpIntoLevel: xpRemaining, xpForNext: xpForLevel(level + 1) }
}
