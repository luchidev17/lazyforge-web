import { Crosshair } from 'lucide-react'
import { FieldLabel }   from '../ui/FieldLabel'
import { NumberInput }  from '../ui/NumberInput'
import { SelectInput }  from '../ui/SelectInput'
import { EffectsPanel } from '../effects/EffectsPanel'
import { SOUND_OPTIONS } from '../../constants/soundOptions'

/** Sección de formulario con las propiedades específicas de ítems Arrojadizos. */
export const ThrowableFields = ({ data, onChange }) => {
  const field = (key) => (val) => onChange({ ...data, [key]: val })
  return (
    <div className="md:col-span-2 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="bg-mc-dark border-2 border-mc-border rounded-lg p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Crosshair className="w-4 h-4 text-rose-400" />
          <span className="text-xs font-semibold text-mc-gold uppercase tracking-wider">Propiedades de Arrojadizo</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <FieldLabel>Cooldown de uso (ticks)</FieldLabel>
            <NumberInput value={data.cooldownTicks} onChange={(e) => field('cooldownTicks')(e.target.value)} placeholder="ej. 20" step="1" min="0" />
            <span className="text-[10px] text-slate-500 mt-1 block">20 ticks = 1 segundo · 0 = sin espera</span>
          </div>
          <div>
            <FieldLabel>Fuerza de lanzamiento</FieldLabel>
            <NumberInput value={data.throwForce} onChange={(e) => field('throwForce')(e.target.value)} placeholder="ej. 1.5" step="0.1" min="0.1" max="5" />
            <span className="text-[10px] text-slate-500 mt-1 block">1.5 = normal · 2.5 = fuerte · 3.0 = máximo</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <FieldLabel>Sonido al lanzar</FieldLabel>
            <SelectInput value={data.throwSound} onChange={(e) => field('throwSound')(e.target.value)}>
              {SOUND_OPTIONS.map(s => (
                <option key={s.value} value={s.value}>{s.label}{s.value ? ` — ${s.value}` : ''}</option>
              ))}
            </SelectInput>
          </div>
          <div>
            <FieldLabel>Sonido al impactar</FieldLabel>
            <SelectInput value={data.impactSound} onChange={(e) => field('impactSound')(e.target.value)}>
              {SOUND_OPTIONS.map(s => (
                <option key={s.value} value={s.value}>{s.label}{s.value ? ` — ${s.value}` : ''}</option>
              ))}
            </SelectInput>
          </div>
        </div>
        <EffectsPanel
          title="Efectos al impactar entidad"
          effects={data.effects}
          onChange={field('effects')}
        />
      </div>
    </div>
  )
}
