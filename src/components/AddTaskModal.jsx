import { useState } from 'react'
import { DEFAULT_CATEGORIES } from '../utils/constants'

export default function AddTaskModal({ onAdd, onClose, settings }) {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState(DEFAULT_CATEGORIES[0])
  const [difficulty, setDifficulty] = useState('medium')
  const [type, setType] = useState('task')
  const [frequency, setFrequency] = useState('daily')

  const allCategories = [...DEFAULT_CATEGORIES, ...(settings?.custom_categories || [])]

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) return

    const taskData = {
      title: title.trim(),
      category,
      difficulty,
      type,
    }

    if (type === 'habit') {
      taskData.recurring = {
        frequency,
        interval: frequency === 'daily' ? 1 : frequency === 'weekly' ? 7 : 1,
        last_completed: null,
        streak: 0,
      }
    }

    onAdd(taskData)
    onClose()
  }

  const difficulties = ['easy', 'medium', 'hard', 'epic']
  const diffColors = {
    easy: 'border-easy text-easy',
    medium: 'border-medium text-medium',
    hard: 'border-hard text-hard',
    epic: 'border-epic text-epic',
  }
  const diffActive = {
    easy: 'bg-easy text-white',
    medium: 'bg-medium text-white',
    hard: 'bg-hard text-white',
    epic: 'bg-epic text-white',
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center" onClick={onClose}>
      <div
        className="bg-bg-secondary w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl p-6 animate-fade-in max-h-[85vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-bold">New Quest</h2>
          <button
            onClick={onClose}
            className="min-h-0 min-w-0 w-8 h-8 flex items-center justify-center text-text-muted hover:text-text-primary text-xl"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs text-text-secondary mb-1 uppercase tracking-wide">Quest Name</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="What needs doing?"
              className="w-full bg-bg-input border border-bg-card rounded-lg px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent"
              autoFocus
            />
          </div>

          {/* Type toggle */}
          <div>
            <label className="block text-xs text-text-secondary mb-1 uppercase tracking-wide">Type</label>
            <div className="flex gap-2">
              {['task', 'habit'].map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors
                    ${type === t
                      ? 'bg-accent border-accent text-white'
                      : 'border-bg-card text-text-secondary hover:border-text-muted'
                    }`}
                >
                  {t === 'task' ? '\u2694\uFE0F Task' : '\uD83D\uDD04 Habit'}
                </button>
              ))}
            </div>
          </div>

          {/* Frequency (for habits) */}
          {type === 'habit' && (
            <div>
              <label className="block text-xs text-text-secondary mb-1 uppercase tracking-wide">Frequency</label>
              <div className="flex gap-2">
                {['daily', 'weekly'].map(f => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFrequency(f)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors
                      ${frequency === f
                        ? 'bg-accent border-accent text-white'
                        : 'border-bg-card text-text-secondary hover:border-text-muted'
                      }`}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Category */}
          <div>
            <label className="block text-xs text-text-secondary mb-1 uppercase tracking-wide">Category</label>
            <div className="flex flex-wrap gap-2">
              {allCategories.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors min-h-0
                    ${category === c
                      ? 'bg-xp-bar border-xp-bar text-bg-primary'
                      : 'border-bg-card text-text-secondary hover:border-text-muted'
                    }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-xs text-text-secondary mb-1 uppercase tracking-wide">Difficulty</label>
            <div className="grid grid-cols-4 gap-2">
              {difficulties.map(d => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDifficulty(d)}
                  className={`py-2 rounded-lg text-xs font-bold border transition-colors uppercase
                    ${difficulty === d
                      ? diffActive[d]
                      : diffColors[d] + ' bg-transparent'
                    }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!title.trim()}
            className="w-full py-3 bg-accent hover:bg-accent-hover text-white font-bold rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Add Quest
          </button>
        </form>
      </div>
    </div>
  )
}
