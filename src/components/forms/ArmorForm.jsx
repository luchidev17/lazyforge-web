import React from 'react'
import { Shield, ArrowLeft, AlertTriangle, Upload, Grid3x3, Package, Layers } from 'lucide-react'
import { FieldLabel } from '../ui/FieldLabel'
import { TextInput } from '../ui/TextInput'
import { SelectInput } from '../ui/SelectInput'
import { CraftingGrid } from '../crafting/CraftingGrid'
import { Steve3DViewer } from '../preview/Steve3DViewer'

const ARMOR_SLOT_OPTIONS = [
  { value: 'helmet', label: 'Casco (Cabeza)' },
  { value: 'chestplate', label: 'Peto (Pecho)' },
  { value: 'leggings', label: 'Pantalones (Piernas)' },
  { value: 'boots', label: 'Botas (Pies)' },
]

export function ArmorForm({ ws, cartItems }) {
  const {
    editingId, closeForm, handleSaveArmor,
    armorId, handleArmorIdChange, armorIdError,
    armorName, setArmorName,
    armorSlot, setArmorSlot,
    armorData, setArmorData,
    armorFileInputRef, handleArmorTextureChange, armorTextureUrl, armorTexture, armorTextureError, armorTextureBase64,
    armorLayerFileInputRef, handleArmorLayerTextureChange, armorLayerTextureUrl, armorLayerTexture, armorLayerTextureError,
    setArmorLayerTexture, setArmorLayerTextureUrl, setArmorLayerTextureBase64,
    hasCrafting, setHasCrafting, craftSlots, setCraftSlots,
    craftResultCount, setCraftResultCount, craftShapeless, setCraftShapeless,
  } = ws

  const currentTexture = armorTextureUrl || (armorTextureBase64 ? `data:image/png;base64,${armorTextureBase64}` : null)

  const handleStatChange = (field, val) => {
    setArmorData(prev => ({ ...prev, [field]: val }))
  }

  return (
    <div className="flex-1 bg-mc-panel rounded-lg border-2 border-mc-border p-6 flex flex-col shadow-2xl overflow-hidden">
      {/* Form Header */}
      <div className="flex justify-between items-center border-b-2 border-mc-border pb-4 mb-6 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-950/80 border border-purple-700/60 rounded-lg text-purple-400">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-pixel text-3xl text-purple-400">
              {editingId ? 'Editar Armadura' : 'Crear Nueva Armadura'}
            </h2>
            <p className="text-xs text-slate-400">
              {editingId ? 'Modifica la armadura y sus atributos' : 'Define el nombre, pieza, textura y receta de la armadura'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={closeForm}
          className="px-3 py-1.5 bg-mc-slot hover:bg-slate-700 rounded text-xs transition-colors cursor-pointer border border-mc-border flex items-center gap-1.5 text-slate-200"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Volver al inicio
        </button>
      </div>

      <form onSubmit={handleSaveArmor} className="flex-1 overflow-y-auto pr-2 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Main Info Column */}
          <div className="space-y-5">
            <div>
              <FieldLabel required>ID de la Armadura (nombre_id)</FieldLabel>
              <TextInput
                value={armorId}
                onChange={handleArmorIdChange}
                placeholder="ej. ruby_helmet o armadura_rubi"
                className="font-mono text-sm"
                required
              />
              {armorIdError ? (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> {armorIdError}
                </p>
              ) : (
                <p className="text-[11px] text-slate-400 mt-1">Identificador único en el registro de Minecraft.</p>
              )}
            </div>

            <div>
              <FieldLabel required>Nombre In-Game (Nombre visible)</FieldLabel>
              <TextInput
                value={armorName}
                onChange={(e) => setArmorName(e.target.value)}
                placeholder="ej. Casco de Rubí"
                required
              />
              <p className="text-[11px] text-slate-400 mt-1">Nombre que aparecerá en el inventario del juego.</p>
            </div>

            <div>
              <FieldLabel required>Parte de la Armadura</FieldLabel>
              <SelectInput
                value={armorSlot}
                onChange={(e) => {
                  const newSlot = e.target.value
                  
                  // Reset 3D texture when switching between leggings and other slots
                  if ((armorSlot === 'leggings' && newSlot !== 'leggings') || (armorSlot !== 'leggings' && newSlot === 'leggings')) {
                    setArmorLayerTexture(null)
                    setArmorLayerTextureUrl('')
                    setArmorLayerTextureBase64('')
                    if (armorLayerFileInputRef.current) {
                      armorLayerFileInputRef.current.value = ''
                    }
                  }

                  setArmorSlot(newSlot)
                  // Auto adjust default defense based on slot if unchanged
                  const defaults = { helmet: '3', chestplate: '8', leggings: '6', boots: '3' }
                  const durables = { helmet: '165', chestplate: '240', leggings: '225', boots: '195' }
                  setArmorData(prev => ({
                    ...prev,
                    slot: newSlot,
                    defense: defaults[newSlot] || '3',
                    durability: durables[newSlot] || '165',
                  }))
                }}
                options={ARMOR_SLOT_OPTIONS}
              />
              <p className="text-[11px] text-slate-400 mt-1">Selecciona la ranura de equipamiento de esta parte.</p>
            </div>

            {/* Inventory Texture Selection */}
            <div>
              <FieldLabel required>Textura en el Inventario (PNG 16x16 o 32x32)</FieldLabel>
              <div className="flex items-center gap-4 mt-2 bg-mc-slot p-4 rounded-lg border border-mc-border">
                <div className="w-16 h-16 bg-slate-900 rounded border border-slate-700 flex items-center justify-center relative overflow-hidden shrink-0 shadow-inner">
                  {currentTexture ? (
                    <img
                      src={currentTexture}
                      alt="Armor Texture Preview"
                      className="w-12 h-12 object-contain image-rendering-pixelated"
                    />
                  ) : (
                    <Package className="w-8 h-8 text-slate-600" />
                  )}
                </div>

                <div className="flex-1">
                  <input
                    ref={armorFileInputRef}
                    type="file"
                    accept=".png"
                    onChange={handleArmorTextureChange}
                    className="hidden"
                    id="armor-texture-upload"
                  />
                  <label
                    htmlFor="armor-texture-upload"
                    className="inline-flex items-center gap-2 px-3 py-2 bg-purple-900/60 hover:bg-purple-800/80 text-purple-200 border border-purple-700/60 rounded text-xs cursor-pointer transition-colors font-medium shadow"
                  >
                    <Upload className="w-4 h-4" /> Seleccionar Textura (.png)
                  </label>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {armorTexture ? armorTexture.name : currentTexture ? 'Textura guardada' : 'Máx 50KB. Formato PNG pixel art.'}
                  </p>
                </div>
              </div>
              {armorTextureError && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> {armorTextureError}
                </p>
              )}
            </div>

            {/* Armor Stats */}
            <div className="grid grid-cols-2 gap-4 bg-slate-900/60 p-4 rounded-lg border border-slate-800">
              <div>
                <FieldLabel>Puntos de Protección</FieldLabel>
                <TextInput
                  type="number"
                  min="0"
                  max="30"
                  value={armorData.defense}
                  onChange={(e) => handleStatChange('defense', e.target.value)}
                  placeholder="3"
                />
              </div>

              <div>
                <FieldLabel>Durabilidad</FieldLabel>
                <TextInput
                  type="number"
                  min="1"
                  max="10000"
                  value={armorData.durability}
                  onChange={(e) => handleStatChange('durability', e.target.value)}
                  placeholder="165"
                />
              </div>
            </div>

            {/* Nueva sección: Botín en Cofres (Loot Injection) */}
            <div className="bg-slate-900/60 p-4 rounded-lg border border-slate-800 space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="loot-injection"
                  checked={ws.lootInjection}
                  onChange={(e) => ws.setLootInjection(e.target.checked)}
                  className="accent-purple-600 cursor-pointer"
                />
                <label htmlFor="loot-injection" className="text-sm font-semibold text-purple-300 cursor-pointer">
                  Aparece en Cofres del Mundo
                </label>
              </div>

              {ws.lootInjection && (
                <div className="space-y-3 pl-6">
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
                          <input
                            type="checkbox"
                            checked={ws.lootChests.includes(chest.id)}
                            onChange={(e) => {
                              if (e.target.checked) ws.setLootChests([...ws.lootChests, chest.id])
                              else ws.setLootChests(ws.lootChests.filter(id => id !== chest.id))
                            }}
                            className="accent-purple-600"
                          />
                          {chest.label}
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] text-slate-400 font-semibold mb-1">Probabilidad ({(ws.lootChance * 100).toFixed(0)}%)</label>
                      <input
                        type="range"
                        min="0.01"
                        max="1.0"
                        step="0.05"
                        value={ws.lootChance}
                        onChange={(e) => ws.setLootChance(parseFloat(e.target.value))}
                        className="w-full accent-purple-600 bg-mc-slot"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 font-semibold mb-1">Peso en Loot (Rareza: {ws.lootWeight})</label>
                      <input
                        type="range"
                        min="1"
                        max="100"
                        step="1"
                        value={ws.lootWeight}
                        onChange={(e) => ws.setLootWeight(parseInt(e.target.value))}
                        className="w-full accent-purple-600 bg-mc-slot"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 3D Viewer & Preview Column */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-purple-300 flex items-center gap-2">
              <Shield className="w-4 h-4 text-purple-400" /> Vista Previa 3D
            </h3>
            <Steve3DViewer
              armorSlot={armorSlot}
              armorLayerTextureUrl={armorLayerTextureUrl || (ws.armorLayerTextureBase64 ? `data:image/png;base64,${ws.armorLayerTextureBase64}` : null)}
            />

            {/* Armor Layer Texture Import */}
            <div className="bg-slate-900/60 p-4 rounded-lg border border-slate-800 space-y-3">
              <FieldLabel required>
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-purple-400" />
                  {armorSlot === 'leggings' 
                    ? 'Textura del Modelo 3D de Pantalones (layer_2.png)' 
                    : 'Textura del Modelo 3D de la Pieza (layer_1.png)'}
                </span>
              </FieldLabel>
              <p className="text-[10px] text-slate-500 -mt-1 font-medium leading-relaxed">
                {armorSlot === 'leggings' 
                  ? 'Archivo PNG de 64×32 o 128×64 px — define la apariencia visual del modelo 3D de los pantalones en las piernas del jugador.' 
                  : 'Archivo PNG de 64×32 o 128×64 px — define la apariencia visual del modelo 3D del casco, el peto y las botas en el cuerpo del jugador.'}
              </p>
 
              <div className="flex items-center gap-3">
                {/* Preview thumbnail */}
                <div className="w-20 h-10 bg-slate-950 rounded border border-slate-700 overflow-hidden shrink-0 flex items-center justify-center relative">
                  {armorLayerTextureUrl ? (
                    <img
                      src={armorLayerTextureUrl}
                      alt="Layer texture"
                      className="w-full h-full object-contain"
                      style={{ imageRendering: 'pixelated' }}
                    />
                  ) : (
                    <Layers className="w-5 h-5 text-slate-600" />
                  )}
                </div>
 
                <div className="flex-1">
                  <input
                    ref={armorLayerFileInputRef}
                    type="file"
                    accept=".png"
                    onChange={handleArmorLayerTextureChange}
                    className="hidden"
                    id="armor-layer-texture-upload"
                  />
                  <label
                    htmlFor="armor-layer-texture-upload"
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-900/60 hover:bg-purple-800/80 text-purple-200 border border-purple-700/60 rounded text-xs cursor-pointer transition-colors font-medium shadow-sm"
                  >
                    <Upload className="w-3.5 h-3.5" /> {armorSlot === 'leggings' ? 'Importar layer_2.png' : 'Importar layer_1.png'}
                  </label>
                  <p className="text-[10px] text-slate-500 mt-1">
                    {armorLayerTexture ? armorLayerTexture.name : armorLayerTextureUrl ? 'Textura del modelo cargada ✓' : 'Sin textura 3D cargada'}
                  </p>
                </div>
              </div>

              {ws.armorLayerTextureError && (
                <p className="text-red-400 text-xs flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> {ws.armorLayerTextureError}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Crafting Recipe Section */}
        <div>
          <div
            onClick={() => setHasCrafting(h => !h)}
            className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${hasCrafting
              ? 'bg-mc-slot border-purple-600/60'
              : 'bg-mc-dark border-mc-border hover:border-slate-500'
            }`}
          >
            <div className={`w-11 h-6 rounded-full relative transition-colors shrink-0 ${hasCrafting ? 'bg-purple-600' : 'bg-slate-600'}`}>
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${hasCrafting ? 'left-6' : 'left-1'}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Grid3x3 className={`w-4 h-4 ${hasCrafting ? 'text-purple-400' : 'text-slate-400'}`} />
                <span className={`text-sm font-semibold ${hasCrafting ? 'text-slate-100' : 'text-slate-400'}`}>
                  ¿Esta armadura se puede craftear?
                </span>
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5">
                {hasCrafting ? 'Configura la receta en la mesa de crafteo a continuación.' : 'Activa para definir la receta de crafteo.'}
              </p>
            </div>
            <Package className={`ml-auto w-5 h-5 ${hasCrafting ? 'text-purple-400' : 'text-slate-600'}`} />
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
            resultTexture={currentTexture}
          />
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 border-t border-slate-800 pt-4 pb-2">
          <button
            type="button"
            onClick={closeForm}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-sm transition-colors border border-slate-700"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded text-sm transition-colors shadow-lg border border-purple-400 cursor-pointer flex items-center gap-2"
          >
            <Shield className="w-4 h-4" /> {editingId ? 'Guardar Cambios' : 'Crear Armadura'}
          </button>
        </div>
      </form>
    </div>
  )
}
