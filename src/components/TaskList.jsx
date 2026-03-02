import { useState } from 'react'
import { DEFAULT_CATEGORIES } from '../utils/constants'
import TaskCard from './TaskCard'

export default function TaskList({ tasks, onComplete, onDelete, xpEvent, settings }) {
  const [filter, setFilter] = useState('all')

  const activeTasks = tasks.filter(t => t.status === 'active')

  const allCategories = [...new Set([
    ...DEFAULT_CATEGORIES,
    ...(settings?.custom_categories || []),
    ...activeTasks.map(t => t.category),
  ])]

  const filteredTasks = filter === 'all'
    ? activeTasks
    : activeTasks.filter(t => t.category === filter)

  return (
    <div className="pb-24">
      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-3 -mx-1 px-1 scrollbar-hide">
        <FilterPill label="All" active={filter === 'all'} onClick={() => setFilter('all')} count={activeTasks.length} />
        {allCategories.map(cat => {
          const count = activeTasks.filter(t => t.category === cat).length
          if (count === 0) return null
          return (
            <FilterPill
              key={cat}
              label={cat}
              active={filter === cat}
              onClick={() => setFilter(cat)}
              count={count}
            />
          )
        })}
      </div>

      {/* Tasks */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-3">{activeTasks.length === 0 ? '\u2694\uFE0F' : '\uD83D\uDD0D'}</div>
          <div className="text-text-secondary text-sm">
            {activeTasks.length === 0
              ? 'No active quests. Add one to start grinding!'
              : 'No quests in this category.'}
          </div>
        </div>
      ) : (
        filteredTasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onComplete={onComplete}
            onDelete={onDelete}
            xpEvent={xpEvent}
          />
        ))
      )}
    </div>
  )
}

function FilterPill({ label, active, onClick, count }) {
  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors min-h-0
        ${active
          ? 'bg-accent text-white'
          : 'bg-bg-card text-text-secondary hover:bg-bg-card/80'
        }`}
    >
      {label}{count > 0 ? ` (${count})` : ''}
    </button>
  )
}
