const tabs = [
  { id: 'quests', label: 'Quests', icon: '\u2694\uFE0F' },
  { id: 'stats', label: 'Stats', icon: '\uD83D\uDCCA' },
  { id: 'data', label: 'Data', icon: '\uD83D\uDCBE' },
]

export default function BottomNav({ activeTab, onTabChange }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-bg-secondary border-t border-bg-card">
      <div className="max-w-lg mx-auto flex">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 flex flex-col items-center py-2 pt-3 transition-colors
              ${activeTab === tab.id ? 'text-accent' : 'text-text-muted hover:text-text-secondary'}`}
          >
            <span className="text-lg">{tab.icon}</span>
            <span className="text-[10px] mt-0.5 font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
      {/* Safe area for notched phones */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  )
}
