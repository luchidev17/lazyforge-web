import {
  Sparkles, ArrowLeft, AlertTriangle, Music2, Flame, Check, Upload,
  ShieldAlert, Grid3x3, Package,
} from 'lucide-react'
import { SOUND_OPTIONS } from '../../constants/soundOptions'
import { FieldLabel } from '../ui/FieldLabel'
import { TextInput } from '../ui/TextInput'
import { SelectInput } from '../ui/SelectInput'
import { CheckboxRow } from '../ui/CheckboxRow'
import { CraftingGrid } from '../crafting/CraftingGrid'
import { ToolWeaponFields } from '../forms/ToolWeaponFields'
import { FoodFields } from '../forms/FoodFields'
import { ThrowableFields } from '../forms/ThrowableFields'

export function ItemForm({ ws, cartItems }) {
  const {
    editingId, closeForm, handleSaveItem,
    itemId, handleIdChange, idError, itemName, setItemName,
    stackSize, setStackSize, category, handleCategoryChange,
    useSound, setUseSound, immuneToLava, setImmuneToLava,
    enchantedGlow, setEnchantedGlow,
    fileInputRef, handleTextureChange, textureUrl, itemTexture, textureError,
    toolData, setToolData, foodData, setFoodData, throwableData, setThrowableData,
    hasCrafting, setHasCrafting, craftSlots, setCraftSlots,
    craftResultCount, setCraftResultCount, craftShapeless, setCraftShapeless,
    textureBase64,
  } = ws

  return (
    <div className="flex-1 bg-mc-panel rounded-lg border-2 border-mc-border p-6 flex flex-col shadow-2xl overflow-hidden">
      <div className="flex justify-between items-center border-b-2 border-mc-border pb-4 mb-6 shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-mc-gold" />
          <div>
            <h2 className="font-pixel text-3xl text-mc-gold">{editingId ? 'Editar Elemento' : 'Crear Nuevo Elemento'}</h2>
            <p className="text-xs text-slate-400">{editingId ? 'Modifica las propiedades del ítem' : 'Rellena las propiedades del ítem'}</p>
          </div>
        </div>
        <button type="button" onClick={closeForm}
          className="px-3 py-1.5 bg-mc-slot hover:bg-slate-700 rounded text-xs transition-colors cursor-pointer border border-mc-border flex items-center gap-1.5">
          <ArrowLeft className="w-3.5 h-3.5" /> Volver al inicio
        </button>
      </div>

      <form onSubmit={handleSaveItem} className="flex-1 overflow-y-auto pr-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <FieldLabel required>ID del Ítem</FieldLabel>
              <TextInput value={itemId} onChange={handleIdChange} placeholder="ej. espada_flamigera" className="font-mono text-sm" required />
              {idError
                ? <span className="text-xs text-rose-400 flex items-center gap-1 mt-1"><AlertTriangle className="w-3.5 h-3.5" />{idError}</span>
                : <span className="text-[10px] text-slate-500 block mt-1">Solo minúsculas y guiones bajos</span>
              }
            </div>

            <div>
              <FieldLabel required>Nombre In-Game</FieldLabel>
              <TextInput value={itemName} onChange={(e) => setItemName(e.target.value)} placeholder="ej. Espada Flamígera" required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <FieldLabel>Tamaño de Stack</FieldLabel>
                <SelectInput value={stackSize} onChange={(e) => setStackSize(e.target.value)}>
                  <option value="1">1 (No apilable)</option>
                  <option value="16">16 (Poco apilable)</option>
                  <option value="64">64 (Por defecto)</option>
                </SelectInput>
              </div>
              <div>
                <FieldLabel>Categoría</FieldLabel>
                <SelectInput value={category} onChange={handleCategoryChange}>
                  <option value="Misceláneo">Misceláneo</option>
                  <option value="Herramienta/Arma">Herramienta / Arma</option>
                  <option value="Comida">Comida</option>
                  <option value="Arrojadizo">🎯 Arrojadizo (Proyectil)</option>
                </SelectInput>
              </div>
            </div>

            <div>
              <FieldLabel>
                <span className="flex items-center gap-1.5"><Music2 className="w-3.5 h-3.5 text-slate-400" />Sonido al usar / consumir</span>
              </FieldLabel>
              <SelectInput value={useSound} onChange={(e) => setUseSound(e.target.value)}>
                {SOUND_OPTIONS.map(s => (
                  <option key={s.value} value={s.value}>{s.label}{s.value ? ` — ${s.value}` : ''}</option>
                ))}
              </SelectInput>
            </div>

            <div className="bg-mc-dark p-4 rounded border-2 border-mc-border space-y-3">
              <span className="text-xs font-semibold text-mc-gold uppercase tracking-wider block">Propiedades Extra</span>
              <CheckboxRow checked={immuneToLava} onChange={setImmuneToLava} icon={<Flame className="w-4 h-4 text-orange-500" />} label="Inmune a la lava" />
              <CheckboxRow checked={enchantedGlow} onChange={setEnchantedGlow} icon={<Sparkles className="w-4 h-4 text-purple-400" />} label="Brillo Encantado" />
              
              {/* Nueva sección: Combustible */}
              <div className="border-t border-mc-border/40 pt-3 mt-2 space-y-2">
                <CheckboxRow checked={ws.isFuel} onChange={ws.setIsFuel} icon={<Flame className="w-4 h-4 text-amber-500 animate-pulse" />} label="¿Es Combustible?" />
                {ws.isFuel && (
                  <div className="pl-6 space-y-1">
                    <label className="block text-xs text-slate-400 font-semibold">Duración de quemado: {ws.burnTime}s (~{(ws.burnTime / 10).toFixed(1)} ítems)</label>
                    <input type="range" min="1" max="300" step="5" value={ws.burnTime} onChange={(e) => ws.setBurnTime(parseInt(e.target.value))} className="w-full accent-mc-gold bg-mc-slot" />
                  </div>
                )}
              </div>

              {/* Nueva sección: Botín en Cofres (Loot Injection) */}
              <div className="border-t border-mc-border/40 pt-3 mt-2 space-y-2">
                <CheckboxRow checked={ws.lootInjection} onChange={ws.setLootInjection} icon={<Package className="w-4 h-4 text-sky-400" />} label="Aparece en Cofres del Mundo" />
                {ws.lootInjection && (
                  <div className="pl-6 space-y-3">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Cofres donde puede aparecer:</label>
                      <div className="grid grid-cols-2 gap-1.5 text-xs text-slate-300">
                        {[
                          { id: 'simple_dungeon', label: 'Mazmorras' },
                          { id: 'abandoned_mineshaft', label: 'Minas Abandonadas' },
                          { id: 'village_weaponsmith', label: 'Herrería de Aldea' },
                          { id: 'nether_bridge', label: 'Fortalezas Nether' },
                          { id: 'end_city_treasure', label: 'Ciudades del End' },
                        ].map(chest => (
                          <label key={chest.id} className="flex items-center gap-1.5 cursor-pointer">
                            <input type="checkbox" checked={ws.lootChests.includes(chest.id)} onChange={(e) => {
                              if (e.target.checked) ws.setLootChests([...ws.lootChests, chest.id])
                              else ws.setLootChests(ws.lootChests.filter(id => id !== chest.id))
                            }} className="accent-mc-gold" />
                            {chest.label}
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] text-slate-400 font-semibold mb-1">Probabilidad ({(ws.lootChance * 100).toFixed(0)}%)</label>
                        <input type="range" min="0.01" max="1.0" step="0.05" value={ws.lootChance} onChange={(e) => ws.setLootChance(parseFloat(e.target.value))} className="w-full accent-mc-gold bg-mc-slot" />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-400 font-semibold mb-1">Peso en Loot (Rareza: {ws.lootWeight})</label>
                        <input type="range" min="1" max="100" step="1" value={ws.lootWeight} onChange={(e) => ws.setLootWeight(parseInt(e.target.value))} className="w-full accent-mc-gold bg-mc-slot" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <label className="block text-sm font-semibold text-slate-300">
              Textura (.png, 16×16 o 32×32, &lt;50KB) <span className="text-rose-500">*</span>
            </label>
            <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-mc-border bg-mc-dark rounded-lg p-6 text-center relative hover:border-mc-gold transition-colors group min-h-[180px]">
              <input type="file" ref={fileInputRef} onChange={handleTextureChange} accept=".png"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" required={!itemTexture && !textureBase64} />
              {textureUrl ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-24 h-24 bg-mc-slot border-4 border-mc-border rounded flex items-center justify-center shadow-inner overflow-hidden">
                    <img src={textureUrl} alt="Preview" className="w-16 h-16 object-contain" style={{ imageRendering: 'pixelated' }} />
                  </div>
                  <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Textura válida cargada
                  </span>
                  <span className="text-[10px] text-slate-500 truncate max-w-[200px]">
                    {itemTexture
                      ? `${itemTexture.name} (${(itemTexture.size / 1024).toFixed(1)} KB)`
                      : 'Textura existente (haz clic para reemplazar)'}
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="p-3 bg-mc-slot rounded-full border border-mc-border group-hover:scale-110 transition-transform duration-300">
                    <Upload className="w-6 h-6 text-slate-400" />
                  </div>
                  <span className="text-xs font-semibold text-slate-300">Haz clic o arrastra un archivo PNG</span>
                  <span className="text-[10px] text-slate-500">Solo 16×16 o 32×32 · Máx. 50 KB</span>
                </div>
              )}
            </div>
            {textureError && (
              <div className="p-3 bg-rose-950/40 border border-rose-900 rounded flex gap-2 items-start text-xs text-rose-300">
                <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                <span>{textureError}</span>
              </div>
            )}
          </div>

          {category === 'Herramienta/Arma' && <ToolWeaponFields data={toolData} onChange={setToolData} />}
          {category === 'Comida' && <FoodFields data={foodData} onChange={setFoodData} />}
          {category === 'Arrojadizo' && <ThrowableFields data={throwableData} onChange={setThrowableData} />}

          <div className="md:col-span-2">
            <div
              onClick={() => setHasCrafting(h => !h)}
              className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${hasCrafting
                ? 'bg-mc-slot border-mc-gold/60'
                : 'bg-mc-dark border-mc-border hover:border-slate-500'
                }`}
            >
              <div className={`w-11 h-6 rounded-full relative transition-colors shrink-0 ${hasCrafting ? 'bg-mc-green' : 'bg-slate-600'}`}>
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${hasCrafting ? 'left-6' : 'left-1'}`} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Grid3x3 className={`w-4 h-4 ${hasCrafting ? 'text-mc-gold' : 'text-slate-400'}`} />
                  <span className={`text-sm font-semibold ${hasCrafting ? 'text-slate-100' : 'text-slate-400'}`}>
                    ¿Este ítem se puede craftear?
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  {hasCrafting ? 'Configura la receta en la mesa de crafteo a continuación.' : 'Activa para definir la receta de crafteo.'}
                </p>
              </div>
              <Package className={`ml-auto w-5 h-5 ${hasCrafting ? 'text-mc-gold' : 'text-slate-600'}`} />
            </div>
          </div>

          {hasCrafting && (
            <CraftingGrid
              slots={craftSlots}
              onChange={setCraftSlots}
              resultCount={craftResultCount}
              onResultCountChange={setCraftResultCount}
              shapeless={craftShapeless}
              onShapelessChange={setCraftShapeless}
              cartItems={cartItems}
            />
          )}

          <div className="md:col-span-2 border-t-2 border-mc-border pt-4 mt-2 flex justify-end gap-3">
            <button type="button" onClick={closeForm}
              className="px-5 py-2.5 bg-mc-slot hover:bg-slate-700 rounded text-sm transition-colors border border-mc-border cursor-pointer font-pixel tracking-wider">
              Cancelar
            </button>
            <button type="submit"
              className="px-6 py-2.5 bg-mc-green hover:bg-mc-green-hover text-white rounded transition-colors border-b-4 border-orange-950 active:border-b-0 active:translate-y-0.5 cursor-pointer font-pixel tracking-wider">
              {editingId ? 'Actualizar Ítem' : 'Guardar Ítem'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
