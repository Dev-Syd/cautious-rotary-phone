import { getLevelFromXP } from '../utils/constants'
import XPBar from './XPBar'

export default function StatsView({ player, tasks }) {
  const today = new Date().toISOString().split('T')[0]
  const todayHistory = player.history.find(h => h.date === today)

  // Last 7 days
  const last7 = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().split('T')[0]
    const entry = player.history.find(h => h.date === dateStr)
    last7.push({
      date: dateStr,
      day: d.toLocaleDateString('en', { weekday: 'short' }),
      tasks: entry?.tasks_completed || 0,
      xp: entry?.xp_earned || 0,
    })
  }

  const maxTasks7 = Math.max(...last7.map(d => d.tasks), 1)

  // Last 30 days for heatmap
  const last30 = []
  for (let i = 29; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().split('T')[0]
    const entry = player.history.find(h => h.date === dateStr)
    last30.push({
      date: dateStr,
      tasks: entry?.tasks_completed || 0,
    })
  }

  const max30 = Math.max(...last30.map(d => d.tasks), 1)
  const getHeatColor = (count) => {
    if (count === 0) return 'bg-bg-input'
    const intensity = Math.min(count / max30, 1)
    if (intensity < 0.33) return 'bg-xp-bar/30'
    if (intensity < 0.66) return 'bg-xp-bar/60'
    return 'bg-xp-bar'
  }

  const categoryEntries = Object.entries(player.categories || {}).sort((a, b) => b[1].xp - a[1].xp)

  const weekTotal = last7.reduce((sum, d) => sum + d.tasks, 0)

  return (
    <div className="space-y-4 pb-24 animate-fade-in">
      {/* Overview */}
      <div className="bg-bg-secondary rounded-xl p-4">
        <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wide mb-3">Overview</h3>
        <div className="grid grid-cols-2 gap-3">
          <StatBox label="Total XP" value={player.total_xp.toLocaleString()} icon="\u2B50" />
          <StatBox label="Level" value={getLevelFromXP(player.total_xp).level} icon="\uD83D\uDEE1\uFE0F" />
          <StatBox label="Tasks Done" value={player.tasks_completed} icon="\u2705" />
          <StatBox label="Best Streak" value={`${player.longest_streak}d`} icon="\uD83D\uDD25" />
        </div>
      </div>

      {/* Today / This Week */}
      <div className="bg-bg-secondary rounded-xl p-4">
        <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wide mb-3">Activity</h3>
        <div className="grid grid-cols-3 gap-3">
          <StatBox label="Today" value={todayHistory?.tasks_completed || 0} small />
          <StatBox label="This Week" value={weekTotal} small />
          <StatBox label="Today XP" value={`+${todayHistory?.xp_earned || 0}`} small />
        </div>
      </div>

      {/* 7-Day Bar Chart */}
      <div className="bg-bg-secondary rounded-xl p-4">
        <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wide mb-3">Last 7 Days</h3>
        <div className="flex items-end gap-1 h-24">
          {last7.map(d => (
            <div key={d.date} className="flex-1 flex flex-col items-center">
              <div className="text-xs text-text-muted mb-1">{d.tasks > 0 ? d.tasks : ''}</div>
              <div
                className="w-full bg-xp-bar rounded-t transition-all"
                style={{ height: `${(d.tasks / maxTasks7) * 80}px`, minHeight: d.tasks > 0 ? '4px' : '2px' }}
              />
              <div className="text-[10px] text-text-muted mt-1">{d.day}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 30-Day Heatmap */}
      <div className="bg-bg-secondary rounded-xl p-4">
        <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wide mb-3">Last 30 Days</h3>
        <div className="grid grid-cols-10 gap-1">
          {last30.map(d => (
            <div
              key={d.date}
              className={`aspect-square rounded-sm ${getHeatColor(d.tasks)}`}
              title={`${d.date}: ${d.tasks} tasks`}
            />
          ))}
        </div>
        <div className="flex items-center gap-2 mt-2 justify-end">
          <span className="text-[10px] text-text-muted">Less</span>
          <div className="w-3 h-3 rounded-sm bg-bg-input" />
          <div className="w-3 h-3 rounded-sm bg-xp-bar/30" />
          <div className="w-3 h-3 rounded-sm bg-xp-bar/60" />
          <div className="w-3 h-3 rounded-sm bg-xp-bar" />
          <span className="text-[10px] text-text-muted">More</span>
        </div>
      </div>

      {/* Category Levels */}
      {categoryEntries.length > 0 && (
        <div className="bg-bg-secondary rounded-xl p-4">
          <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wide mb-3">Category Levels</h3>
          <div className="space-y-3">
            {categoryEntries.map(([cat, data]) => (
              <XPBar key={cat} xp={data.xp} label={cat} size="small" />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function StatBox({ label, value, icon, small }) {
  return (
    <div className={`bg-bg-card rounded-lg ${small ? 'p-2' : 'p-3'} text-center`}>
      {icon && <div className="text-lg mb-0.5">{icon}</div>}
      <div className={`font-bold ${small ? 'text-lg' : 'text-xl'} text-text-primary`}>{value}</div>
      <div className={`${small ? 'text-[10px]' : 'text-xs'} text-text-secondary`}>{label}</div>
    </div>
  )
}
