import { useState } from 'react'
import { DIFFICULTY_COLORS, DIFFICULTY_XP } from '../utils/constants'

export default function TaskCard({ task, onComplete, onDelete, xpEvent }) {
  const [completing, setCompleting] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const showXp = xpEvent && xpEvent.taskId === task.id

  const handleComplete = () => {
    setCompleting(true)
    onComplete(task.id)
    setTimeout(() => setCompleting(false), 600)
  }

  const diffColor = DIFFICULTY_COLORS[task.difficulty] || 'text-text-secondary'
  const xp = DIFFICULTY_XP[task.difficulty] || task.xp_value

  return (
    <div
      className={`relative bg-bg-card rounded-xl p-4 mb-3 animate-fade-in
        ${completing ? 'animate-slide-out' : ''}
        active:scale-[0.98] transition-transform`}
    >
      {showXp && (
        <div className="absolute top-2 right-2 text-gold font-bold text-lg animate-fly-up z-10">
          +{xp} XP
        </div>
      )}

      <div className="flex items-start gap-3">
        {/* Completion button */}
        <button
          onClick={handleComplete}
          className={`flex-shrink-0 w-8 h-8 min-h-0 min-w-0 mt-0.5 rounded-full border-2 border-text-muted
            flex items-center justify-center transition-all
            ${completing ? 'bg-easy border-easy animate-burst' : 'hover:border-accent'}`}
          aria-label="Complete task"
        >
          {completing && (
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        {/* Task info */}
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm leading-tight">{task.title}</div>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className={`text-xs font-semibold ${diffColor} uppercase`}>
              {task.difficulty}
            </span>
            <span className="text-xs text-text-muted">{xp} XP</span>
            <span className="text-xs bg-bg-secondary text-text-secondary px-2 py-0.5 rounded-full">
              {task.category}
            </span>
            {task.type === 'habit' && (
              <span className="text-xs text-streak">\uD83D\uDD04 {task.recurring?.frequency}</span>
            )}
            {task.recurring?.streak > 0 && (
              <span className="text-xs text-gold">\uD83D\uDD25{task.recurring.streak}</span>
            )}
          </div>
        </div>

        {/* Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="min-h-0 min-w-0 w-8 h-8 flex items-center justify-center text-text-muted hover:text-text-primary"
            aria-label="Task menu"
          >
            \u22EE
          </button>
          {showMenu && (
            <div className="absolute right-0 top-8 bg-bg-secondary rounded-lg shadow-lg z-20 py-1 min-w-[120px]">
              <button
                onClick={() => { onDelete(task.id); setShowMenu(false) }}
                className="w-full text-left px-4 py-2 text-sm text-hard hover:bg-bg-card min-h-0"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
