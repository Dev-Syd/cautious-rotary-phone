import { getLevelFromXP, DIFFICULTY_XP } from './constants'

export function exportToObsidian(tasks, player) {
  const today = new Date().toISOString().split('T')[0]
  const { level, xpIntoLevel, xpForNext } = getLevelFromXP(player.total_xp)

  const activeTasks = tasks.filter(t => t.status === 'active')
  const completedToday = tasks.filter(
    t => t.status === 'completed' && t.completed_at && t.completed_at.startsWith(today)
  )

  const categoryEntries = Object.entries(player.categories || {})
  const categoryTable = categoryEntries.length > 0
    ? categoryEntries.map(([cat, data]) => {
        const catLevel = getLevelFromXP(data.xp)
        return `| ${cat} | ${catLevel.level} | ${data.xp} |`
      }).join('\n')
    : '| - | - | - |'

  const activeList = activeTasks.map(t => {
    const diff = t.difficulty
    const xp = DIFFICULTY_XP[diff] || 0
    const icon = t.type === 'habit' ? '\uD83D\uDD04' : ({ easy: '\u2694\uFE0F', medium: '\uD83D\uDDE1\uFE0F', hard: '\u2694\uFE0F', epic: '\uD83D\uDC51' }[diff] || '')
    const tag = `#${t.category.toLowerCase().replace(/\s+/g, '-')}`
    return `- [ ] ${t.title} ${icon} ${diff.charAt(0).toUpperCase() + diff.slice(1)} (${xp} XP) ${tag}`
  }).join('\n')

  const completedList = completedToday.map(t => {
    const xp = DIFFICULTY_XP[t.difficulty] || 0
    const tag = `#${t.category.toLowerCase().replace(/\s+/g, '-')}`
    return `- [x] ${t.title} +${xp} XP ${tag}`
  }).join('\n')

  const md = `---
type: quest-log-export
date: ${today}
total_xp: ${player.total_xp}
level: ${level}
tasks_completed_alltime: ${player.tasks_completed}
current_streak: ${player.current_streak}
---

# Quest Log \u2014 ${today}

## Stats
- **Level:** ${level} (${xpIntoLevel} / ${xpForNext} XP to next)
- **Streak:** ${player.current_streak} days
- **Tasks completed:** ${player.tasks_completed} all time

## Category Levels
| Category | Level | XP |
|----------|-------|----|
${categoryTable}

## Active Tasks
${activeList || '_No active tasks_'}

## Completed Today
${completedList || '_Nothing completed today_'}
`

  return md
}
