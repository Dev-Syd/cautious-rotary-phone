import { useState } from 'react'
import { useGameState } from './hooks/useGameState'
import PlayerHeader from './components/PlayerHeader'
import TaskList from './components/TaskList'
import AddTaskModal from './components/AddTaskModal'
import StatsView from './components/StatsView'
import DataView from './components/DataView'
import BottomNav from './components/BottomNav'

export default function App() {
  const {
    tasks,
    player,
    settings,
    xpEvent,
    levelUpEvent,
    addTask,
    completeTask,
    deleteTask,
    updateSettings,
    importData,
  } = useGameState()

  const [activeTab, setActiveTab] = useState('quests')
  const [showAddModal, setShowAddModal] = useState(false)

  return (
    <div className="max-w-lg mx-auto px-4 pt-4 min-h-full">
      <PlayerHeader player={player} levelUpEvent={levelUpEvent} />

      {activeTab === 'quests' && (
        <>
          <TaskList
            tasks={tasks}
            onComplete={completeTask}
            onDelete={deleteTask}
            xpEvent={xpEvent}
            settings={settings}
          />

          {/* FAB */}
          <button
            onClick={() => setShowAddModal(true)}
            className="fixed bottom-20 right-4 w-14 h-14 bg-accent hover:bg-accent-hover
              text-white rounded-full shadow-lg shadow-accent/30 flex items-center justify-center
              text-2xl font-light transition-all active:scale-90 z-40"
            aria-label="Add new quest"
          >
            +
          </button>
        </>
      )}

      {activeTab === 'stats' && (
        <StatsView player={player} tasks={tasks} />
      )}

      {activeTab === 'data' && (
        <DataView
          tasks={tasks}
          player={player}
          settings={settings}
          onImport={importData}
          onSettingsChange={updateSettings}
        />
      )}

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      {showAddModal && (
        <AddTaskModal
          onAdd={addTask}
          onClose={() => setShowAddModal(false)}
          settings={settings}
        />
      )}
    </div>
  )
}
