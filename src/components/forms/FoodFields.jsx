import { UtensilsCrossed, Zap, Bone, Heart } from 'lucide-react'
import { FieldLabel }   from '../ui/FieldLabel'
import { NumberInput }  from '../ui/NumberInput'
import { CheckboxRow }  from '../ui/CheckboxRow'
import { EffectsPanel } from '../effects/EffectsPanel'

/** Sección de formulario con las propiedades específicas de ítems de Comida. */
export const FoodFields = ({ data, onChange }) => {
  const field = (key) => (val) => onChange({ ...data, [key]: val })
  return (
    <div className="md:col-span-2 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="bg-mc-dark border-2 border-mc-border rounded-lg p-5 space-y-4">
        <div className="flex items-center gap-2">
          <UtensilsCrossed className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-mc-gold uppercase tracking-wider">Propiedades de Comida</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <FieldLabel>Puntos de Nutrición</FieldLabel>
            <NumberInput value={data.nutrition} onChange={(e) => field('nutrition')(e.target.value)} placeholder="ej. 6" step="1" min="1" max="20" />
            <span className="text-[10px] text-slate-500 mt-1 block flex items-center gap-1">
              <Heart className="w-3 h-3 inline text-rose-400" /> Muslitos restaurados (1–20)
            </span>
          </div>
          <div>
            <FieldLabel>Saturación</FieldLabel>
            <NumberInput value={data.saturation} onChange={(e) => field('saturation')(e.target.value)} placeholder="ej. 0.8" step="0.1" min="0.1" max="20" />
            <span className="text-[10px] text-slate-500 mt-1 block">Multiplicador de saciedad</span>
          </div>
        </div>
        <div className="pt-2 border-t border-mc-border space-y-3">
          <span className="text-xs text-slate-500 block">Propiedades Especiales</span>
          <CheckboxRow checked={data.alwaysEdible} onChange={field('alwaysEdible')} icon={<Zap className="w-4 h-4 text-yellow-400" />} label="Siempre comestible (aunque estés lleno)" />
          <CheckboxRow checked={data.wolfFood}     onChange={field('wolfFood')}     icon={<Bone className="w-4 h-4 text-slate-400" />} label="Comida para lobos" />
        </div>
        <EffectsPanel
          title="Efectos al consumir"
          effects={data.effects}
          onChange={field('effects')}
        />
      </div>
    </div>
  )
}
