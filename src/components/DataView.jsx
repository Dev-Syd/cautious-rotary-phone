import { useRef } from 'react'
import { exportJSON, importJSON } from '../utils/storage'
import { exportToObsidian } from '../utils/exportObsidian'

export default function DataView({ tasks, player, settings, onImport, onSettingsChange }) {
  const fileInputRef = useRef(null)

  const handleExportJSON = () => {
    const data = exportJSON()
    downloadFile(data, `questlog-backup-${new Date().toISOString().split('T')[0]}.json`, 'application/json')
  }

  const handleExportObsidian = () => {
    const md = exportToObsidian(tasks, player)
    const today = new Date().toISOString().split('T')[0]
    downloadFile(md, `quest-log-${today}.md`, 'text/markdown')
  }

  const handleImportJSON = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result)
        importJSON(JSON.stringify(data))
        onImport(data)
      } catch {
        alert('Invalid backup file')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const downloadFile = (content, filename, mimeType) => {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4 pb-24 animate-fade-in">
      {/* Export */}
      <div className="bg-bg-secondary rounded-xl p-4">
        <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wide mb-3">Export</h3>
        <div className="space-y-2">
          <button
            onClick={handleExportJSON}
            className="w-full py-3 bg-bg-card hover:bg-bg-card/80 text-text-primary rounded-xl text-sm font-medium transition-colors"
          >
            \uD83D\uDCBE Export JSON Backup
          </button>
          <button
            onClick={handleExportObsidian}
            className="w-full py-3 bg-bg-card hover:bg-bg-card/80 text-text-primary rounded-xl text-sm font-medium transition-colors"
          >
            \uD83D\uDCDD Export to Obsidian
          </button>
        </div>
      </div>

      {/* Import */}
      <div className="bg-bg-secondary rounded-xl p-4">
        <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wide mb-3">Import</h3>
        <input
          type="file"
          ref={fileInputRef}
          accept=".json"
          onChange={handleImportJSON}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full py-3 bg-bg-card hover:bg-bg-card/80 text-text-primary rounded-xl text-sm font-medium transition-colors"
        >
          \uD83D\uDCC2 Import JSON Backup
        </button>
      </div>

      {/* Settings */}
      <div className="bg-bg-secondary rounded-xl p-4">
        <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wide mb-3">Settings</h3>
        <label className="flex items-center justify-between py-2">
          <span className="text-sm text-text-primary">Sound Effects</span>
          <div
            role="button"
            onClick={() => onSettingsChange({ sound_enabled: !settings.sound_enabled })}
            className={`w-12 h-7 rounded-full transition-colors relative cursor-pointer min-h-0 min-w-0
              ${settings.sound_enabled ? 'bg-easy' : 'bg-bg-card'}`}
          >
            <div
              className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform
                ${settings.sound_enabled ? 'translate-x-6' : 'translate-x-1'}`}
            />
          </div>
        </label>
      </div>

      {/* Info */}
      <div className="bg-bg-secondary rounded-xl p-4">
        <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wide mb-3">About</h3>
        <p className="text-xs text-text-muted">
          QuestLog v1.0 &mdash; Gamified task tracker. All data stored locally in your browser.
        </p>
      </div>
    </div>
  )
}
