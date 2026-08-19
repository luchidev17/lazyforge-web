import {
  Box, ArrowLeft, AlertTriangle, ShieldAlert, Flame, Sparkles, Blocks,
  ArrowDown, Check, Upload, Grid3x3, Package, Feather, Zap,
} from 'lucide-react'
import { MINECRAFT_ITEMS } from '../../constants/minecraftItems'
import { FieldLabel } from '../ui/FieldLabel'
import { TextInput } from '../ui/TextInput'
import { NumberInput } from '../ui/NumberInput'
import { SelectInput } from '../ui/SelectInput'
import { CheckboxRow } from '../ui/CheckboxRow'
import { CraftingGrid } from '../crafting/CraftingGrid'
import { BlockPreview3D } from '../preview/BlockPreview3D'

export function BlockForm({ ws, cartItems }) {
  const {
    editingId, closeForm, handleSaveBlock,
    blockId, handleBlockIdChange, blockIdError, blockName, setBlockName,
    blockShape, setBlockShape, blockHardness, setBlockHardness,
    blockLuminance, setBlockLuminance,
    hasGravity, setHasGravity, explosionResistant, setExplosionResistant, dealsDamage, setDealsDamage,
    noCollision, setNoCollision,
    cancelsFallDamage, setCancelsFallDamage, fallDamageModifier, setFallDamageModifier,
    hasBounce, setHasBounce, bounceVelocity, setBounceVelocity,
    isTransparent, setIsTransparent, soundGroup, setSoundGroup,
    isFlammable, setIsFlammable, burnChance, setBurnChance, spreadChance, setSpreadChance,
    blockTool, setBlockTool, miningTier, setMiningTier, silkTouch, setSilkTouch,
    blockDropType, setBlockDropType, blockCustomDrop, setBlockCustomDrop,
    items, blocks,
    blockFileInputRef, handleBlockTextureChange, blockTextureUrl, blockTexture, blockTextureBase64, blockTextureError,
    slabTopFileInputRef, slabSideFileInputRef, handleSlabTextureChange,
    slabTopTexture, slabTopTextureUrl, slabTopTextureBase64,
    slabSideTexture, slabSideTextureUrl, slabSideTextureBase64,
    // 6-faced block props
    faceUpTexture, faceUpTextureUrl, faceUpTextureBase64, faceDownTexture, faceDownTextureUrl, faceDownTextureBase64,
    faceNorthTexture, faceNorthTextureUrl, faceNorthTextureBase64, faceSouthTexture, faceSouthTextureUrl, faceSouthTextureBase64,
    faceEastTexture, faceEastTextureUrl, faceEastTextureBase64, faceWestTexture, faceWestTextureUrl, faceWestTextureBase64,
    faceUpFileInputRef, faceDownFileInputRef, faceNorthFileInputRef, faceSouthFileInputRef, faceEastFileInputRef, faceWestFileInputRef,
    handleFaceTextureChange,
    hasCrafting, setHasCrafting, craftSlots, setCraftSlots,
    craftResultCount, setCraftResultCount, craftShapeless, setCraftShapeless,
  } = ws

  return (
    <div className="flex-1 bg-mc-panel rounded-lg border-2 border-mc-border p-6 flex flex-col shadow-2xl overflow-hidden">
      <div className="flex justify-between items-center border-b-2 border-mc-border pb-4 mb-6 shrink-0">
        <div className="flex items-center gap-2">
          <Box className="w-6 h-6 text-sky-400" />
          <div>
            <h2 className="font-pixel text-3xl text-sky-400">{editingId ? 'Editar Bloque' : 'Crear Nuevo Bloque'}</h2>
            <p className="text-xs text-slate-400">{editingId ? 'Modifica las propiedades del bloque' : 'Define las propiedades del bloque'}</p>
          </div>
        </div>
        <button type="button" onClick={closeForm}
          className="px-3 py-1.5 bg-mc-slot hover:bg-slate-700 rounded text-xs transition-colors cursor-pointer border border-mc-border flex items-center gap-1.5">
          <ArrowLeft className="w-3.5 h-3.5" /> Volver al inicio
        </button>
      </div>

      <form onSubmit={handleSaveBlock} className="flex-1 overflow-y-auto pr-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <FieldLabel required>ID del Bloque</FieldLabel>
              <TextInput value={blockId} onChange={handleBlockIdChange} placeholder="ej. bloque_magico" className="font-mono text-sm" required />
              {blockIdError
                ? <span className="text-xs text-rose-400 flex items-center gap-1 mt-1"><AlertTriangle className="w-3.5 h-3.5" />{blockIdError}</span>
                : <span className="text-[10px] text-slate-500 block mt-1">Solo minúsculas y guiones bajos</span>
              }
            </div>

            <div>
              <FieldLabel required>Nombre In-Game</FieldLabel>
              <TextInput value={blockName} onChange={(e) => setBlockName(e.target.value)} placeholder="ej. Bloque Mágico" required />
            </div>

            <div className="bg-mc-dark p-4 rounded border-2 border-mc-border space-y-3">
              <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider block">Propiedades del Bloque</span>

              <div>
                <FieldLabel>Forma del Bloque</FieldLabel>
                <SelectInput value={blockShape} onChange={(e) => {
                  const val = e.target.value
                  setBlockShape(val)
                  if (val === 'cross') {
                    setNoCollision(true)
                    setDealsDamage(false)
                    setIsTransparent(true) // Flower blocks are cutout/transparent
                  }
                }}>
                  <option value="block">Bloque Estándar ⏹️</option>
                  <option value="slab">Losa / Slab 🎴</option>
                  <option value="pillar">Tronco / Columna 🪵</option>
                  <option value="stairs">Escalera 🪜</option>
                  <option value="six_faces">Bloque de 6 Caras Distintas 🎲</option>
                  <option value="cross">Plano Cruzado (Flor/Planta) 🌾</option>
                </SelectInput>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-mc-border/40">
                <div>
                  <FieldLabel>Dureza (Hardness)</FieldLabel>
                  <NumberInput value={blockHardness} onChange={(e) => setBlockHardness(e.target.value)} placeholder="2.0" step="0.1" min="0" />
                  <span className="text-[9px] text-slate-500 block mt-1">0.5: tierra · 2.0: roca · 50.0: obsidiana</span>
                </div>
                <div>
                  <FieldLabel>Luminosidad (0–15)</FieldLabel>
                  <NumberInput value={blockLuminance} onChange={(e) => setBlockLuminance(e.target.value)} placeholder="0" min="0" max="15" />
                  <span className="text-[9px] text-slate-500 block mt-1">0: sin luz · 15: antorcha</span>
                </div>
              </div>

              <div className="pt-2 border-t border-mc-border/40 space-y-2">
                <CheckboxRow checked={hasGravity} onChange={setHasGravity} icon={<ArrowDown className="w-4 h-4 text-amber-400" />} label="Tiene gravedad (como la arena)" />
                <CheckboxRow checked={explosionResistant} onChange={setExplosionResistant} icon={<ShieldAlert className="w-4 h-4 text-slate-300" />} label="A prueba de explosiones" />
                <CheckboxRow checked={isTransparent} onChange={setIsTransparent} icon={<Blocks className="w-4 h-4 text-sky-300" />} label="Es transparente (tipo cristal)" />
                <CheckboxRow checked={noCollision} onChange={(val) => {
                  setNoCollision(val)
                  if (val) setDealsDamage(false)
                }} icon={<Blocks className="w-4 h-4 text-emerald-400" />} label="Es intangible (sin colisión, atravesable)" />
                <CheckboxRow checked={dealsDamage} onChange={(val) => {
                  setDealsDamage(val)
                  if (val) setNoCollision(false)
                }} icon={<Flame className="w-4 h-4 text-rose-500" />} label="Causa daño al tocar (tipo Cactus)" />

                <CheckboxRow checked={cancelsFallDamage} onChange={(val) => {
                  setCancelsFallDamage(val)
                }} icon={<Feather className="w-4 h-4 text-sky-400" />} label="Reduce/Cancela daño de caída (tipo Heno)" />
                {cancelsFallDamage && (
                  <div className="ml-6 mt-1 p-2.5 bg-black/40 rounded border border-sky-900/40 animate-in fade-in slide-in-from-top-1 duration-200">
                    <FieldLabel>Multiplicador de daño por caída</FieldLabel>
                    <div className="flex items-center gap-3 mt-1">
                      <input
                        type="range" min="0" max="1" step="0.05"
                        value={fallDamageModifier}
                        onChange={e => setFallDamageModifier(e.target.value)}
                        className="flex-1 accent-sky-500 cursor-pointer"
                      />
                      <span className="text-sky-300 font-mono text-xs w-10 text-right">{parseFloat(fallDamageModifier).toFixed(2)}×</span>
                    </div>
                    <p className="text-[9px] text-slate-500 mt-1">0.0 = sin daño (como heno) · 0.2 = 20% · 1.0 = daño completo</p>
                  </div>
                )}

                <CheckboxRow checked={hasBounce} onChange={(val) => {
                  setHasBounce(val)
                }} icon={<Zap className="w-4 h-4 text-lime-400" />} label="Rebota entidades al caer (tipo Slime)" />
                {hasBounce && (
                  <div className="ml-6 mt-1 p-2.5 bg-black/40 rounded border border-lime-900/40 animate-in fade-in slide-in-from-top-1 duration-200">
                    <FieldLabel>Fuerza del rebote</FieldLabel>
                    <div className="flex items-center gap-3 mt-1">
                      <input
                        type="range" min="0" max="1.5" step="0.05"
                        value={bounceVelocity}
                        onChange={e => setBounceVelocity(e.target.value)}
                        className="flex-1 accent-lime-500 cursor-pointer"
                      />
                      <span className="text-lime-300 font-mono text-xs w-10 text-right">{parseFloat(bounceVelocity).toFixed(2)}</span>
                    </div>
                    <p className="text-[9px] text-slate-500 mt-1">0.0 = sin rebote · 0.8 = slime block · 1.0+ = rebote más fuerte</p>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-mc-border/40 space-y-3">
                <div>
                  <FieldLabel>Grupo de sonidos (Sound Type)</FieldLabel>
                  <SelectInput value={soundGroup} onChange={(e) => setSoundGroup(e.target.value)}>
                    <option value="STONE">Piedra 🧱</option>
                    <option value="WOOD">Madera 🪵</option>
                    <option value="METAL">Metal ⚙️</option>
                    <option value="GLASS">Cristal 💎</option>
                    <option value="SAND">Arena ⏳</option>
                    <option value="GRAVEL">Grava 🪨</option>
                    <option value="GRASS">Hierba 🌿</option>
                    <option value="SLIME">Limo 🟢</option>
                  </SelectInput>
                </div>

                <div>
                  <CheckboxRow checked={isFlammable} onChange={setIsFlammable} icon={<Flame className="w-4 h-4 text-orange-500" />} label="Es inflamable (puede quemarse)" />
                  {isFlammable && (
                    <div className="grid grid-cols-2 gap-4 mt-2 p-2.5 bg-black/40 rounded border border-orange-900/30 animate-in fade-in slide-in-from-top-1 duration-200">
                      <div>
                        <FieldLabel>Velocidad quemado</FieldLabel>
                        <NumberInput value={burnChance} onChange={(e) => setBurnChance(e.target.value)} min="1" max="100" />
                        <span className="text-[8px] text-slate-500 block">20: madera · 100: lana</span>
                      </div>
                      <div>
                        <FieldLabel>Ignición fácil</FieldLabel>
                        <NumberInput value={spreadChance} onChange={(e) => setSpreadChance(e.target.value)} min="1" max="100" />
                        <span className="text-[8px] text-slate-500 block">5: madera · 60: lana</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-mc-border space-y-3">
                <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider block">Minería y Drops</span>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <FieldLabel>Herramienta recomendada</FieldLabel>
                    <SelectInput value={blockTool} onChange={(e) => setBlockTool(e.target.value)}>
                      <option value="none">Ninguna (Mano)</option>
                      <option value="pickaxe">Pico ⛏️</option>
                      <option value="axe">Hacha 🪓</option>
                      <option value="shovel">Pala 🧹</option>
                    </SelectInput>
                  </div>
                  <div>
                    <FieldLabel>Nivel requerido</FieldLabel>
                    <SelectInput value={miningTier} onChange={(e) => setMiningTier(e.target.value)}>
                      <option value="none">Ninguno (Madera)</option>
                      <option value="stone">Piedra 🪨</option>
                      <option value="iron">Hierro 🪙</option>
                      <option value="diamond">Diamante 💎</option>
                      <option value="netherite">Netherite 🖤</option>
                    </SelectInput>
                  </div>
                </div>

                <CheckboxRow checked={silkTouch} onChange={setSilkTouch} icon={<Sparkles className="w-4 h-4 text-violet-400" />} label="Requiere toque de seda para soltarse" />

                <div>
                  <FieldLabel>Loot dropeado al romperse</FieldLabel>
                  <SelectInput value={blockDropType} onChange={(e) => {
                    setBlockDropType(e.target.value)
                    if (e.target.value !== 'custom') setBlockCustomDrop('')
                  }}>
                    <option value="self">Sí mismo (El propio bloque)</option>
                    <option value="nothing">Nada</option>
                    <option value="custom">Otro ítem o bloque...</option>
                  </SelectInput>
                </div>

                {blockDropType === 'custom' && (
                  <div className="animate-in fade-in slide-in-from-top-1 duration-200">
                    <FieldLabel required>Seleccionar Item / Bloque</FieldLabel>
                    <SelectInput value={blockCustomDrop} onChange={(e) => setBlockCustomDrop(e.target.value)}>
                      <option value="">-- Elige un ítem o bloque --</option>
                      <optgroup label="Tus ítems y bloques creados">
                        {items.map(item => (
                          <option key={`mod:${item.id}`} value={`mod:${item.id}`}>mod:{item.id} ({item.name})</option>
                        ))}
                        {blocks.map(b => (
                          <option key={`mod:${b.id}`} value={`mod:${b.id}`}>mod:{b.id} ({b.name})</option>
                        ))}
                      </optgroup>
                      <optgroup label="Minecraft Vanilla">
                        {MINECRAFT_ITEMS.map(id => (
                          <option key={id} value={id}>{id}</option>
                        ))}
                      </optgroup>
                    </SelectInput>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {blockShape === 'block' || blockShape === 'cross' ? (
              <>
                <label className="block text-sm font-semibold text-slate-300">
                  Textura (.png, 16×16 o 32×32, &lt;50KB) <span className="text-rose-500">*</span>
                </label>
                <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-mc-border bg-mc-dark rounded-lg p-6 text-center relative hover:border-sky-500 transition-colors group min-h-[180px]">
                  <input type="file" ref={blockFileInputRef} onChange={handleBlockTextureChange} accept=".png"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" required={!blockTexture && !blockTextureBase64} />
                  {blockTextureUrl ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-40 h-40 bg-mc-slot border-4 border-mc-border rounded flex items-center justify-center shadow-inner overflow-hidden">
                        <BlockPreview3D textureUrl={blockTextureUrl} variant={blockShape} size="lg" />
                      </div>
                      <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Textura válida cargada
                      </span>
                      <span className="text-[10px] text-slate-500 truncate max-w-[200px]">
                        {blockTexture
                          ? `${blockTexture.name} (${(blockTexture.size / 1024).toFixed(1)} KB)`
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
              </>
            ) : blockShape === 'six_faces' ? (
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-slate-300">
                  Texturas por Cara (.png, 16×16 o 32×32, &lt;50KB) <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { face: 'up', label: 'Arriba (Up) ⬆️', ref: faceUpFileInputRef, url: faceUpTextureUrl, tex: faceUpTexture, b64: faceUpTextureBase64 },
                    { face: 'down', label: 'Abajo (Down) ⬇️', ref: faceDownFileInputRef, url: faceDownTextureUrl, tex: faceDownTexture, b64: faceDownTextureBase64 },
                    { face: 'north', label: 'Norte (North) 🧭', ref: faceNorthFileInputRef, url: faceNorthTextureUrl, tex: faceNorthTexture, b64: faceNorthTextureBase64 },
                    { face: 'south', label: 'Sur (South) 🧭', ref: faceSouthFileInputRef, url: faceSouthTextureUrl, tex: faceSouthTexture, b64: faceSouthTextureBase64 },
                    { face: 'east', label: 'Este (East) 🧭', ref: faceEastFileInputRef, url: faceEastTextureUrl, tex: faceEastTexture, b64: faceEastTextureBase64 },
                    { face: 'west', label: 'Oeste (West) 🧭', ref: faceWestFileInputRef, url: faceWestTextureUrl, tex: faceWestTexture, b64: faceWestTextureBase64 },
                  ].map(({ face, label, ref, url, tex, b64 }) => (
                    <div key={face} className="space-y-1 bg-mc-dark p-2 rounded border border-mc-border/40">
                      <span className="text-[10px] text-slate-300 font-semibold block truncate">{label}</span>
                      <div className="h-16 flex flex-col items-center justify-center border border-dashed border-mc-border hover:border-sky-500 transition-colors relative group rounded">
                        <input type="file" ref={ref} onChange={(e) => handleFaceTextureChange(e, face)} accept=".png"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" required={!tex && !b64} />
                        {url ? (
                          <div className="flex items-center gap-1.5 font-pixel">
                            <div className="w-8 h-8 bg-mc-slot border border-mc-border rounded flex items-center justify-center shadow-inner overflow-hidden">
                              <img src={url} alt={`${face} Preview`} className="w-6 h-6 object-contain" style={{ imageRendering: 'pixelated' }} />
                            </div>
                            <span className="text-[9px] text-emerald-400">OK</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <Upload className="w-3.5 h-3.5 text-slate-500" />
                            <span className="text-[9px] text-slate-400">Subir</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {(faceUpTextureUrl || faceDownTextureUrl || faceNorthTextureUrl || faceSouthTextureUrl || faceEastTextureUrl || faceWestTextureUrl) && (
                  <div className="flex flex-col items-center justify-center p-4 bg-mc-dark rounded-lg border border-mc-border">
                    <BlockPreview3D
                      upUrl={faceUpTextureUrl}
                      downUrl={faceDownTextureUrl}
                      northUrl={faceNorthTextureUrl}
                      southUrl={faceSouthTextureUrl}
                      eastUrl={faceEastTextureUrl}
                      westUrl={faceWestTextureUrl}
                      variant={blockShape}
                      size="lg"
                    />
                    <span className="text-[10px] text-slate-500 mt-2">
                      Vista previa 3D del Bloque de 6 Caras
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-300">
                      Textura Superior <span className="text-rose-500">*</span>
                    </label>
                    <div className="h-32 flex flex-col items-center justify-center border-2 border-dashed border-mc-border bg-mc-dark rounded-lg p-2 text-center relative hover:border-sky-500 transition-colors group">
                      <input type="file" ref={slabTopFileInputRef} onChange={(e) => handleSlabTextureChange(e, 'top')} accept=".png"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" required={!slabTopTexture && !slabTopTextureBase64} />
                      {slabTopTextureUrl ? (
                        <div className="flex flex-col items-center gap-1">
                          <div className="w-12 h-12 bg-mc-slot border-2 border-mc-border rounded flex items-center justify-center shadow-inner overflow-hidden">
                            <img src={slabTopTextureUrl} alt="Top Preview" className="w-8 h-8 object-contain" style={{ imageRendering: 'pixelated' }} />
                          </div>
                          <span className="text-[9px] text-emerald-400 font-semibold font-pixel">Top OK</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <Upload className="w-4 h-4 text-slate-500" />
                          <span className="text-[10px] text-slate-400">Subir Top PNG</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-300">
                      Textura Lateral <span className="text-rose-500">*</span>
                    </label>
                    <div className="h-32 flex flex-col items-center justify-center border-2 border-dashed border-mc-border bg-mc-dark rounded-lg p-2 text-center relative hover:border-sky-500 transition-colors group">
                      <input type="file" ref={slabSideFileInputRef} onChange={(e) => handleSlabTextureChange(e, 'side')} accept=".png"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" required={!slabSideTexture && !slabSideTextureBase64} />
                      {slabSideTextureUrl ? (
                        <div className="flex flex-col items-center gap-1">
                          <div className="w-12 h-12 bg-mc-slot border-2 border-mc-border rounded flex items-center justify-center shadow-inner overflow-hidden">
                            <img src={slabSideTextureUrl} alt="Side Preview" className="w-8 h-8 object-contain" style={{ imageRendering: 'pixelated' }} />
                          </div>
                          <span className="text-[9px] text-emerald-400 font-semibold font-pixel">Side OK</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <Upload className="w-4 h-4 text-slate-500" />
                          <span className="text-[10px] text-slate-400">Subir Side PNG</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {(slabTopTextureUrl || slabSideTextureUrl) && (
                  <div className="flex flex-col items-center justify-center p-4 bg-mc-dark rounded-lg border border-mc-border">
                    <BlockPreview3D
                      textureUrl={slabSideTextureUrl}
                      topUrl={slabTopTextureUrl}
                      sideUrl={slabSideTextureUrl}
                      variant={blockShape}
                      size="lg"
                    />
                    <span className="text-[10px] text-slate-500 mt-2">
                      {blockShape === 'pillar'
                        ? 'Vista previa 3D del Tronco / Columna'
                        : blockShape === 'stairs'
                        ? 'Vista previa 3D de la Escalera'
                        : 'Vista previa 3D de la Losa'}
                    </span>
                  </div>
                )}
              </div>
            )}

            {blockTextureError && (
              <div className="p-3 bg-rose-950/40 border border-rose-900 rounded flex gap-2 items-start text-xs text-rose-300">
                <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                <span>{blockTextureError}</span>
              </div>
            )}
          </div>

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
                    ¿Este bloque se puede craftear?
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
              className="px-6 py-2.5 bg-sky-700 hover:bg-sky-600 text-white rounded transition-colors border-b-4 border-sky-950 active:border-b-0 active:translate-y-0.5 cursor-pointer font-pixel tracking-wider">
              {editingId ? 'Actualizar Bloque' : 'Guardar Bloque'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
