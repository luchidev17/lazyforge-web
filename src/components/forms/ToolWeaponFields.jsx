import { Sword } from 'lucide-react'
import { FieldLabel }   from '../ui/FieldLabel'
import { SelectInput }  from '../ui/SelectInput'
import { NumberInput }  from '../ui/NumberInput'
import { EffectsPanel } from '../effects/EffectsPanel'

/** Sección de formulario con las propiedades específicas de Herramientas y Armas. */
export const ToolWeaponFields = ({ data, onChange }) => {
  const field = (key) => (val) => onChange({ ...data, [key]: val })
  return (
    <div className="md:col-span-2 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="bg-mc-dark border-2 border-mc-border rounded-lg p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Sword className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-mc-gold uppercase tracking-wider">Propiedades de Herramienta / Arma</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <FieldLabel>Tipo de Herramienta</FieldLabel>
            <SelectInput value={data.toolType} onChange={(e) => field('toolType')(e.target.value)}>
              {['Espada','Pico','Hacha','Pala','Azada'].map(t => <option key={t} value={t}>{t}</option>)}
            </SelectInput>
          </div>
          <div>
            <FieldLabel>Material Base</FieldLabel>
            <SelectInput value={data.material} onChange={(e) => field('material')(e.target.value)}>
              {['Madera','Piedra','Hierro','Oro','Diamante','Netherite'].map(m => <option key={m} value={m}>{m}</option>)}
            </SelectInput>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <FieldLabel>Daño Extra</FieldLabel>
            <NumberInput value={data.attackDamage} onChange={(e) => field('attackDamage')(e.target.value)} placeholder="ej. 3.5" step="0.5" min="0" />
            <span className="text-[10px] text-slate-500 mt-1 block">Puntos adicionales</span>
          </div>
          <div>
            <FieldLabel>Vel. de Ataque</FieldLabel>
            <NumberInput value={data.attackSpeed} onChange={(e) => field('attackSpeed')(e.target.value)} placeholder="ej. 1.6" step="0.1" min="0" />
            <span className="text-[10px] text-slate-500 mt-1 block">Ataques por segundo</span>
          </div>
          <div>
            <FieldLabel>Durabilidad</FieldLabel>
            <NumberInput value={data.durability} onChange={(e) => field('durability')(e.target.value)} placeholder="ej. 1561" step="1" min="1" />
            <span className="text-[10px] text-slate-500 mt-1 block">Usos totales</span>
          </div>
        </div>
        <EffectsPanel
          title="Efectos al golpear objetivo"
          effects={data.effects}
          onChange={field('effects')}
        />
        <EffectsPanel
          title="Efectos al portador (mientras sostiene el arma)"
          effects={data.holderEffects}
          onChange={field('holderEffects')}
        />
      </div>
    </div>
  )
}
