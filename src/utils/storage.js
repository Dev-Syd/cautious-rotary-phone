import { STORAGE_KEYS } from './constants'

export function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TASKS)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks))
}

export function loadPlayer() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PLAYER)
    return raw ? JSON.parse(raw) : createDefaultPlayer()
  } catch {
    return createDefaultPlayer()
  }
}

export function savePlayer(player) {
  localStorage.setItem(STORAGE_KEYS.PLAYER, JSON.stringify(player))
}

export function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS)
    return raw ? JSON.parse(raw) : createDefaultSettings()
  } catch {
    return createDefaultSettings()
  }
}

export function saveSettings(settings) {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings))
}

function createDefaultPlayer() {
  return {
    total_xp: 0,
    level: 0,
    categories: {},
    tasks_completed: 0,
    current_streak: 0,
    longest_streak: 0,
    last_completion_date: null,
    history: [],
  }
}

function createDefaultSettings() {
  return {
    sound_enabled: false,
    custom_categories: [],
  }
}

export function exportJSON() {
  return JSON.stringify({
    tasks: loadTasks(),
    player: loadPlayer(),
    settings: loadSettings(),
    exported_at: new Date().toISOString(),
  }, null, 2)
}

export function importJSON(jsonString) {
  const data = JSON.parse(jsonString)
  if (data.tasks) saveTasks(data.tasks)
  if (data.player) savePlayer(data.player)
  if (data.settings) saveSettings(data.settings)
  return data
}
