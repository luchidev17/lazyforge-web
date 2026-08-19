import {
  Download, Upload, AlertTriangle, Blocks, Trash2, Pencil,
  Flame, ArrowDown, ShieldAlert, Sun, Grid3x3, Heart,
} from 'lucide-react'
import { FieldLabel } from '../ui/FieldLabel'
import { TextInput } from '../ui/TextInput'
import { BlockPreview3D } from '../preview/BlockPreview3D'

export function ModSidebar({ ws }) {
  const {
    modName, setModName, modId, handleModIdChange, modIdError,
    modTabIconUrl, modTabIconError, modTabIconInputRef, handleModTabIconChange,
    items, blocks, armors, totalEntries, categoryBadgeColor,
    handleEditBlock, handleDeleteBlock, handleEditItem, handleDeleteItem,
    handleEditArmor, handleDeleteArmor,
    handleDownloadMod,
  } = ws

  return (
    <section className="w-full md:w-[30%] bg-mc-panel p-6 flex flex-col gap-4 min-h-[500px] md:min-h-0">
      <div className="bg-mc-dark border-2 border-mc-border rounded-lg p-4 space-y-3">
        <span className="text-xs font-semibold text-mc-gold uppercase tracking-wider block">Configuración del Mod</span>
        <div>
          <FieldLabel required>Nombre del Mod</FieldLabel>
          <TextInput value={modName} onChange={(e) => setModName(e.target.value)} placeholder="ej. Mi Mod Increíble" />
        </div>
        <div>
          <FieldLabel required>ID del Mod (MOD_ID)</FieldLabel>
          <TextInput value={modId} onChange={handleModIdChange} placeholder="ej. mi_mod" className="font-mono text-sm" />
          {modIdError ? (
            <span className="text-[10px] text-rose-400 flex items-center gap-1 mt-1">
              <AlertTriangle className="w-3 h-3" /> {modIdError}
            </span>
          ) : (
            <span className="text-[9px] text-slate-500 block mt-0.5">Solo minúsculas y guiones bajos.</span>
          )}
        </div>

        <div className="pt-2 border-t border-mc-border/40">
          <FieldLabel>Icono de Solapa Creativa (PNG)</FieldLabel>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-mc-slot border border-mc-border rounded flex items-center justify-center relative overflow-hidden shrink-0">
              {modTabIconUrl ? (
                <img src={modTabIconUrl} alt="Tab Icon" className="w-8 h-8 object-contain" style={{ imageRendering: 'pixelated' }} />
              ) : (
                <Upload className="w-5 h-5 text-slate-500" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <input type="file" ref={modTabIconInputRef} onChange={handleModTabIconChange} accept=".png" className="hidden" />
              <button
                type="button"
                onClick={() => modTabIconInputRef.current?.click()}
                className="w-full px-2.5 py-1.5 bg-mc-slot hover:bg-slate-700 border border-mc-border rounded text-xs text-slate-300 font-pixel cursor-pointer text-center"
              >
                {modTabIconUrl ? 'Cambiar' : 'Subir Icono'}
              </button>
            </div>
          </div>
          {modTabIconError && (
            <span className="text-[9px] text-rose-400 block mt-1">{modTabIconError}</span>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center border-b-2 border-mc-border pb-3">
        <h2 className="font-pixel text-2xl text-slate-100 tracking-wider">Tu Mod</h2>
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1 bg-mc-gold/10 border border-mc-gold/30 px-2.5 py-1 rounded-lg" title="Ítems">
            <span className="font-pixel text-lg text-mc-gold leading-none">{items.length}</span>
            <span className="text-[10px] text-mc-gold/70 font-semibold uppercase">ítems</span>
          </div>
          <div className="flex items-center gap-1 bg-sky-500/10 border border-sky-500/30 px-2.5 py-1 rounded-lg" title="Bloques">
            <span className="font-pixel text-lg text-sky-400 leading-none">{blocks.length}</span>
            <span className="text-[10px] text-sky-400/70 font-semibold uppercase">bloques</span>
          </div>
          <div className="flex items-center gap-1 bg-purple-500/10 border border-purple-500/30 px-2.5 py-1 rounded-lg" title="Armaduras">
            <span className="font-pixel text-lg text-purple-400 leading-none">{armors ? armors.length : 0}</span>
            <span className="text-[10px] text-purple-400/70 font-semibold uppercase">armaduras</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[450px] md:max-h-none">
        {totalEntries === 0 ? (
          <div className="h-48 border-2 border-dashed border-mc-border rounded flex flex-col items-center justify-center text-center p-4 bg-mc-dark/30 text-slate-500">
            <Blocks className="w-8 h-8 mb-2 opacity-50 text-slate-600" />
            <p className="text-xs">No hay contenido en tu mod todavía.</p>
            <p className="text-[10px] text-slate-600 mt-1">¡Añade tu primer ítem, bloque o armadura!</p>
          </div>
        ) : (
          <>
            {armors && armors.map((armor) => (
              <div key={`armor-${armor.id}`} className="flex items-start justify-between p-3.5 bg-mc-dark hover:bg-slate-900 rounded-lg border border-purple-900/40 group transition-all">
                <div className="flex gap-3">
                  <div className="w-14 h-14 bg-mc-slot flex items-center justify-center rounded-lg border border-purple-700/40 shadow-inner shrink-0 overflow-hidden relative">
                    <img src={armor.textureUrl} alt={armor.name} className="w-10 h-10 object-contain image-rendering-pixelated" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-base font-bold text-slate-100 truncate flex items-center gap-1.5">
                      {armor.name}
                    </h4>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">ID: {armor.id}</p>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      <span className="text-xs bg-purple-950/60 text-purple-300 px-2 py-0.5 rounded-full font-pixel uppercase">
                        {armor.slot === 'helmet' ? 'Casco' : armor.slot === 'chestplate' ? 'Peto' : armor.slot === 'leggings' ? 'Pantalones' : 'Botas'}
                      </span>
                      <span className="text-xs bg-slate-800 text-purple-300 px-2 py-0.5 rounded-full font-pixel">
                        🛡️ +{armor.defense}
                      </span>
                      {armor.recipe && (
                        <span className={`text-xs px-2 py-0.5 rounded-full font-pixel flex items-center gap-0.5 ${armor.recipe.shapeless ? 'bg-purple-950/50 text-purple-300' : 'bg-blue-950/50 text-blue-300'}`}>
                          <Grid3x3 className="w-3 h-3" />
                          {armor.recipe.shapeless ? 'SL' : 'SH'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-0.5 shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100">
                  <button onClick={() => handleEditArmor(armor)}
                    className="p-1.5 hover:bg-purple-950/50 hover:text-purple-400 rounded text-slate-500 transition-colors cursor-pointer"
                    title="Editar armadura">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDeleteArmor(armor.id)}
                    className="p-1.5 hover:bg-rose-950/50 hover:text-rose-400 rounded text-slate-500 transition-colors cursor-pointer"
                    title="Eliminar armadura">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            {blocks.map((block) => (
              <div key={`block-${block.id}`} className="flex items-start justify-between p-3.5 bg-mc-dark hover:bg-slate-900 rounded-lg border border-sky-900/40 group transition-all">
                <div className="flex gap-3">
                  <div className="w-14 h-14 bg-mc-slot flex items-center justify-center rounded-lg border border-mc-border shadow-inner shrink-0 overflow-hidden relative">
                    <BlockPreview3D
                      textureUrl={block.textureUrl}
                      topUrl={block.slabTopTextureUrl}
                      sideUrl={block.slabSideTextureUrl}
                      upUrl={block.faceUpTextureUrl}
                      downUrl={block.faceDownTextureUrl}
                      northUrl={block.faceNorthTextureUrl}
                      southUrl={block.faceSouthTextureUrl}
                      eastUrl={block.faceEastTextureUrl}
                      westUrl={block.faceWestTextureUrl}
                      variant={block.blockShape}
                      size="sm"
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-base font-bold text-slate-100 truncate flex items-center gap-1.5">
                      {block.name}
                      {block.hasGravity && <ArrowDown className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                      {block.explosionResistant && <ShieldAlert className="w-3.5 h-3.5 text-slate-300 shrink-0" />}
                      {block.luminance > 0 && <Sun className="w-3.5 h-3.5 text-yellow-300 shrink-0" />}
                    </h4>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">ID: {block.id}</p>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                       <span className="text-xs px-2 py-0.5 rounded-full font-pixel uppercase text-sky-300 bg-sky-950/60">
                        {block.blockShape === 'slab'
                          ? 'Losa'
                          : block.blockShape === 'pillar'
                          ? 'Columna'
                          : block.blockShape === 'stairs'
                          ? 'Escalera'
                          : block.blockShape === 'six_faces'
                          ? '6 Caras'
                          : 'Bloque'}
                      </span>
                      {block.noCollision && (
                        <span className="text-xs bg-emerald-950/50 text-emerald-300 px-2 py-0.5 rounded-full font-pixel">Intangible</span>
                      )}
                      {block.dealsDamage && (
                        <span className="text-xs bg-rose-950/50 text-rose-300 px-2 py-0.5 rounded-full font-pixel">Daño (Cactus)</span>
                      )}
                      {block.hasGravity && (
                        <span className="text-xs bg-amber-950/50 text-amber-300 px-2 py-0.5 rounded-full font-pixel">Gravedad</span>
                      )}
                      {block.explosionResistant && (
                        <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-pixel">Anti-exp</span>
                      )}
                      {block.luminance > 0 && (
                        <span className="text-xs bg-yellow-950/50 text-yellow-300 px-2 py-0.5 rounded-full font-pixel">✨ {block.luminance}</span>
                      )}
                      {block.requiredTool && block.requiredTool !== 'none' && (
                        <span className="text-xs bg-[#1e2e3e] text-sky-300 px-2 py-0.5 rounded-full font-pixel">
                          {block.requiredTool === 'pickaxe' ? '⛏️' : block.requiredTool === 'axe' ? '🪓' : '🧹'}
                        </span>
                      )}
                      {block.dropType && block.dropType !== 'self' && (
                        <span className="text-xs bg-rose-950/60 text-rose-300 px-2 py-0.5 rounded-full font-pixel">
                          {block.dropType === 'nothing' ? 'Sin drop' : block.customDrop.replace('mod:', '')}
                        </span>
                      )}
                      {block.recipe && (
                        <span className={`text-xs px-2 py-0.5 rounded-full font-pixel flex items-center gap-0.5 ${block.recipe.shapeless ? 'bg-purple-950/50 text-purple-300' : 'bg-blue-950/50 text-blue-300'}`}>
                          <Grid3x3 className="w-3 h-3" />
                          {block.recipe.shapeless ? 'SL' : 'SH'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-0.5 shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100">
                  <button onClick={() => handleEditBlock(block)}
                    className="p-1.5 hover:bg-sky-950/50 hover:text-sky-400 rounded text-slate-500 transition-colors cursor-pointer"
                    title="Editar bloque">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDeleteBlock(block.id)}
                    className="p-1.5 hover:bg-rose-950/50 hover:text-rose-400 rounded text-slate-500 transition-colors cursor-pointer"
                    title="Eliminar bloque">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            {items.map((item) => (
              <div key={item.id} className="flex items-start justify-between p-3.5 bg-mc-dark hover:bg-slate-900 rounded-lg border border-mc-border group transition-all">
                <div className="flex gap-3">
                  <div className="w-14 h-14 bg-mc-slot flex items-center justify-center rounded-lg border border-mc-border shadow-inner shrink-0 overflow-hidden relative">
                    <img src={item.textureUrl} alt={item.name} className="w-10 h-10 object-contain" style={{ imageRendering: 'pixelated' }} />
                    {item.enchantedGlow && <div className="absolute inset-0 bg-purple-500/20 mix-blend-color-dodge animate-pulse" />}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-base font-bold text-slate-100 truncate flex items-center gap-1.5">
                      {item.name}
                      {item.immuneToLava && <Flame className="w-3.5 h-3.5 text-orange-500 shrink-0" />}
                    </h4>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">ID: {item.id}</p>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      <span className="text-xs bg-mc-slot text-slate-400 px-2 py-0.5 rounded-full font-pixel">x{item.stackSize}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-pixel uppercase ${categoryBadgeColor(item.category)}`}>
                        {item.category === 'Herramienta/Arma' ? (item.toolType ?? 'Arma') : item.category}
                      </span>
                      {item.category === 'Herramienta/Arma' && item.material && (
                        <span className="text-xs bg-mc-slot text-slate-400 px-2 py-0.5 rounded-full font-pixel">{item.material}</span>
                      )}
                      {item.category === 'Comida' && item.nutrition != null && (
                        <span className="text-xs bg-rose-950/50 text-rose-300 px-2 py-0.5 rounded-full font-pixel flex items-center gap-0.5">
                          <Heart className="w-3 h-3 text-rose-400" />{item.nutrition}
                        </span>
                      )}
                      {item.recipe && (
                        <span className={`text-xs px-2 py-0.5 rounded-full font-pixel flex items-center gap-0.5 ${item.recipe.shapeless ? 'bg-purple-950/50 text-purple-300' : 'bg-blue-950/50 text-blue-300'}`}>
                          <Grid3x3 className="w-3 h-3" />
                          {item.recipe.shapeless ? 'Shapeless' : 'Shaped'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-0.5 shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100">
                  <button onClick={() => handleEditItem(item)}
                    className="p-1.5 hover:bg-amber-950/50 hover:text-mc-gold rounded text-slate-500 transition-colors cursor-pointer"
                    title="Editar ítem">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDeleteItem(item.id)}
                    className="p-1.5 hover:bg-rose-950/50 hover:text-rose-400 rounded text-slate-500 transition-colors cursor-pointer"
                    title="Eliminar ítem">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      <div className="pt-4 border-t-2 border-mc-border mt-auto flex flex-col gap-3">
        <div className="flex justify-between items-center text-sm px-1">
          <span className="text-slate-400">Total:</span>
          <span className="font-pixel text-xl text-mc-gold">{totalEntries}</span>
        </div>
        <button onClick={handleDownloadMod} disabled={totalEntries === 0 || !modName.trim() || !modId.trim() || !!modIdError}
          className={`w-full py-3.5 px-4 font-pixel text-xl tracking-wider rounded border-b-4 flex items-center justify-center gap-2 transition-all shadow-md
            ${(totalEntries > 0 && modName.trim() && modId.trim() && !modIdError)
              ? 'bg-mc-green hover:bg-mc-green-hover text-white border-orange-950 active:border-b-0 active:translate-y-1 cursor-pointer'
              : 'bg-slate-700 text-slate-400 border-slate-900 cursor-not-allowed'
            }`}>
          <Download className="w-5 h-5" />
          Generar y Descargar Mod
        </button>
      </div>
    </section>
  )
}
