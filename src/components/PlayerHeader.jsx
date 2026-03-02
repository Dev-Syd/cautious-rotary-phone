import { getLevelFromXP, STREAK_MILESTONES } from '../utils/constants'
import XPBar from './XPBar'

export default function PlayerHeader({ player, levelUpEvent }) {
  const { level } = getLevelFromXP(player.total_xp)
  const isLevelUp = levelUpEvent !== null

  const streakMilestone = STREAK_MILESTONES.find(m => player.current_streak >= m)
  const showStreakFire = player.current_streak >= 3

  return (
    <div className={`bg-bg-secondary rounded-xl p-4 mb-4 ${isLevelUp ? 'animate-level-glow' : ''}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-bg-card flex items-center justify-center text-xl">
            {level < 5 ? '\u2694\uFE0F' : level < 10 ? '\uD83D\uDEE1\uFE0F' : level < 20 ? '\uD83D\uDC51' : '\u2B50'}
          </div>
          <div>
            <div className="font-bold text-sm">Level {level} Adventurer</div>
            <div className="text-xs text-text-secondary">{player.total_xp} Total XP</div>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-sm font-bold ${showStreakFire ? 'text-streak animate-fire' : 'text-text-secondary'}`}>
            {showStreakFire ? '\uD83D\uDD25' : ''} {player.current_streak}d streak
          </div>
          {streakMilestone && (
            <div className="text-xs text-gold">
              {streakMilestone}d milestone!
            </div>
          )}
        </div>
      </div>
      <XPBar xp={player.total_xp} />
      {isLevelUp && (
        <div className="mt-2 text-center text-gold font-bold animate-burst text-lg">
          \u2B50 LEVEL UP! Level {levelUpEvent.level} \u2B50
        </div>
      )}
    </div>
  )
}
