import { getLevelFromXP } from '../utils/constants'

export default function XPBar({ xp, label, size = 'normal' }) {
  const { level, xpIntoLevel, xpForNext } = getLevelFromXP(xp)
  const pct = xpForNext > 0 ? Math.min((xpIntoLevel / xpForNext) * 100, 100) : 0

  if (size === 'small') {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-text-secondary whitespace-nowrap">
          {label && `${label} `}Lv.{level}
        </span>
        <div className="flex-1 h-2 bg-xp-bg rounded-full overflow-hidden">
          <div
            className="h-full bg-xp-bar rounded-full xp-bar-fill"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="text-xs text-text-muted">{xpIntoLevel}/{xpForNext}</span>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-baseline mb-1">
        <span className="text-sm font-bold text-gold">
          {label && `${label} \u2014 `}Level {level}
        </span>
        <span className="text-xs text-text-secondary">
          {xpIntoLevel} / {xpForNext} XP
        </span>
      </div>
      <div className="w-full h-4 bg-xp-bg rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-xp-bar to-blue-400 rounded-full xp-bar-fill transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
