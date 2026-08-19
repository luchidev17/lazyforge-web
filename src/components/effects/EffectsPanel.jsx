import { Plus, Trash2, FlaskConical } from 'lucide-react'
import { EFFECT_TYPES } from '../../constants/effectTypes'

const defaultEffect = () => ({
  type: 'speed',
  level: 1,
  duration: 10,
  probability: 100,
})

/**
 * Panel de efectos de poción editable.
 * Recibe el array de efectos y un onChange — no tiene estado interno.
 */
export const EffectsPanel = ({ title, effects, onChange }) => {
  const addEffect = () => onChange([...effects, defaultEffect()])

  const updateEffect = (index, key, val) => {
    const next = effects.map((e, i) => i === index ? { ...e, [key]: val } : e)
    onChange(next)
  }

  const removeEffect = (index) => onChange(effects.filter((_, i) => i !== index))

  return (
    <div className="pt-3 border-t border-mc-border space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <FlaskConical className="w-4 h-4 text-violet-400" />
          <span className="text-xs font-semibold text-violet-300 uppercase tracking-wider">{title}</span>
        </div>
        <button
          type="button"
          onClick={addEffect}
          className="flex items-center gap-1 px-2.5 py-1 bg-violet-900/40 hover:bg-violet-800/60 border border-violet-700/50 rounded text-xs text-violet-300 cursor-pointer transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Añadir Efecto
        </button>
      </div>

      {effects.length === 0 && (
        <p className="text-[10px] text-slate-600 italic">Sin efectos configurados. Haz clic en "+ Añadir Efecto" para comenzar.</p>
      )}

      {/* Effect rows */}
      <div className="space-y-2">
        {effects.map((eff, i) => {
          const typeColor = EFFECT_TYPES.find(t => t.value === eff.type)?.color ?? 'text-slate-300'
          return (
            <div
              key={i}
              className="grid gap-2 p-2.5 bg-[#161616] rounded border border-violet-900/40 group"
              style={{ gridTemplateColumns: '1fr 56px 72px 72px 28px' }}
            >
              {/* Type */}
              <select
                value={eff.type}
                onChange={(e) => updateEffect(i, 'type', e.target.value)}
                className={`px-2 py-1.5 bg-mc-dark border border-mc-border rounded text-xs focus:outline-none focus:border-violet-500 cursor-pointer ${typeColor} transition-colors`}
              >
                {EFFECT_TYPES.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>

              {/* Level */}
              <div className="relative">
                <input
                  type="number" value={eff.level} min="1" max="255"
                  onChange={(e) => updateEffect(i, 'level', Math.max(1, Math.min(255, parseInt(e.target.value) || 1)))}
                  className="w-full px-2 py-1.5 bg-mc-dark border border-mc-border rounded text-xs text-slate-200 focus:outline-none focus:border-violet-500 text-center"
                />
                <span className="absolute -top-2 left-0 right-0 text-center text-[8px] text-slate-600">Niv.</span>
              </div>

              {/* Duration */}
              <div className="relative">
                <input
                  type="number" value={eff.duration} min="1"
                  onChange={(e) => updateEffect(i, 'duration', Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-2 py-1.5 bg-mc-dark border border-mc-border rounded text-xs text-slate-200 focus:outline-none focus:border-violet-500 text-center"
                />
                <span className="absolute -top-2 left-0 right-0 text-center text-[8px] text-slate-600">Seg.</span>
              </div>

              {/* Probability */}
              <div className="relative">
                <input
                  type="number" value={eff.probability} min="1" max="100"
                  onChange={(e) => updateEffect(i, 'probability', Math.max(1, Math.min(100, parseInt(e.target.value) || 100)))}
                  className="w-full px-2 py-1.5 bg-mc-dark border border-mc-border rounded text-xs text-slate-200 focus:outline-none focus:border-violet-500 text-center"
                />
                <span className="absolute -top-2 left-0 right-0 text-center text-[8px] text-slate-600">%</span>
              </div>

              {/* Delete */}
              <button
                type="button"
                onClick={() => removeEffect(i)}
                className="flex items-center justify-center text-slate-600 hover:text-rose-400 hover:bg-rose-950/40 rounded transition-colors cursor-pointer"
                title="Eliminar efecto"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
