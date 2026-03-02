import { useState, useCallback, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { loadTasks, saveTasks, loadPlayer, savePlayer, loadSettings, saveSettings } from '../utils/storage'
import { DIFFICULTY_XP, getLevelFromXP } from '../utils/constants'

export function useGameState() {
  const [tasks, setTasks] = useState(() => loadTasks())
  const [player, setPlayer] = useState(() => loadPlayer())
  const [settings, setSettings] = useState(() => loadSettings())
  const [xpEvent, setXpEvent] = useState(null)
  const [levelUpEvent, setLevelUpEvent] = useState(null)

  useEffect(() => { saveTasks(tasks) }, [tasks])
  useEffect(() => { savePlayer(player) }, [player])
  useEffect(() => { saveSettings(settings) }, [settings])

  const addTask = useCallback((taskData) => {
    const task = {
      id: uuidv4(),
      title: taskData.title,
      description: taskData.description || null,
      category: taskData.category,
      type: taskData.type || 'task',
      xp_value: DIFFICULTY_XP[taskData.difficulty] || 10,
      difficulty: taskData.difficulty || 'easy',
      status: 'active',
      created_at: new Date().toISOString(),
      completed_at: null,
      recurring: taskData.recurring || null,
    }
    setTasks(prev => [task, ...prev])
    return task
  }, [])

  const completeTask = useCallback((taskId) => {
    const task = tasks.find(t => t.id === taskId)
    if (!task || task.status !== 'active') return

    const xp = task.xp_value
    const now = new Date()
    const today = now.toISOString().split('T')[0]
    const oldLevel = getLevelFromXP(player.total_xp).level

    setTasks(prev => prev.map(t => {
      if (t.id !== taskId) return t
      if (t.recurring) {
        return {
          ...t,
          recurring: {
            ...t.recurring,
            last_completed: now.toISOString(),
            streak: (t.recurring.streak || 0) + 1,
          },
          completed_at: now.toISOString(),
          status: 'completed',
        }
      }
      return { ...t, status: 'completed', completed_at: now.toISOString() }
    }))

    setPlayer(prev => {
      const lastDate = prev.last_completion_date
      const yesterday = new Date(now)
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toISOString().split('T')[0]

      let streak = prev.current_streak
      if (lastDate === today) {
        // Already completed something today, keep streak
      } else if (lastDate === yesterdayStr) {
        streak += 1
      } else {
        streak = 1
      }

      const catXp = prev.categories[task.category]?.xp || 0
      const historyEntry = prev.history.find(h => h.date === today)
      let history
      if (historyEntry) {
        history = prev.history.map(h =>
          h.date === today
            ? { ...h, tasks_completed: h.tasks_completed + 1, xp_earned: h.xp_earned + xp }
            : h
        )
      } else {
        history = [...prev.history, { date: today, tasks_completed: 1, xp_earned: xp }]
      }

      return {
        ...prev,
        total_xp: prev.total_xp + xp,
        tasks_completed: prev.tasks_completed + 1,
        current_streak: streak,
        longest_streak: Math.max(prev.longest_streak, streak),
        last_completion_date: today,
        categories: {
          ...prev.categories,
          [task.category]: {
            xp: catXp + xp,
          },
        },
        history,
      }
    })

    // Trigger XP animation
    setXpEvent({ xp, taskId, timestamp: Date.now() })
    setTimeout(() => setXpEvent(null), 1200)

    // Check for level up
    const newLevel = getLevelFromXP(player.total_xp + xp).level
    if (newLevel > oldLevel) {
      setLevelUpEvent({ level: newLevel, timestamp: Date.now() })
      setTimeout(() => setLevelUpEvent(null), 3000)
    }
  }, [tasks, player])

  const deleteTask = useCallback((taskId) => {
    setTasks(prev => prev.filter(t => t.id !== taskId))
  }, [])

  const archiveTask = useCallback((taskId) => {
    setTasks(prev => prev.map(t =>
      t.id === taskId ? { ...t, status: 'archived' } : t
    ))
  }, [])

  const resetRecurringTasks = useCallback(() => {
    const now = new Date()
    setTasks(prev => prev.map(t => {
      if (!t.recurring || t.status !== 'completed') return t
      const last = new Date(t.recurring.last_completed || t.created_at)
      const diffDays = Math.floor((now - last) / (1000 * 60 * 60 * 24))

      let shouldReset = false
      if (t.recurring.frequency === 'daily' && diffDays >= 1) shouldReset = true
      if (t.recurring.frequency === 'weekly' && diffDays >= 7) shouldReset = true
      if (t.recurring.frequency === 'custom' && diffDays >= (t.recurring.interval || 1)) shouldReset = true

      if (shouldReset) {
        return { ...t, status: 'active', completed_at: null }
      }
      return t
    }))
  }, [])

  // Reset recurring tasks on mount and periodically
  useEffect(() => {
    resetRecurringTasks()
    const interval = setInterval(resetRecurringTasks, 60000)
    return () => clearInterval(interval)
  }, [resetRecurringTasks])

  const updateSettings = useCallback((newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }))
  }, [])

  const importData = useCallback((data) => {
    if (data.tasks) setTasks(data.tasks)
    if (data.player) setPlayer(data.player)
    if (data.settings) setSettings(data.settings)
  }, [])

  return {
    tasks,
    player,
    settings,
    xpEvent,
    levelUpEvent,
    addTask,
    completeTask,
    deleteTask,
    archiveTask,
    updateSettings,
    importData,
  }
}
