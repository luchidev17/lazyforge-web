import { useState, useRef, useCallback } from 'react'
import { Grid3x3, Blocks, Shuffle, X } from 'lucide-react'
import { FieldLabel }  from '../ui/FieldLabel'
import { NumberInput } from '../ui/NumberInput'
import { SlotModal }   from './SlotModal'

/**
 * Mesa de crafteo 3×3. Gestiona sus propios slots activos y el modal de ingredientes.
 * Recibe los slots como estado externo y notifica cambios via onChange.
 */
export const CraftingGrid = ({ slots, onChange, resultCount, onResultCountChange, shapeless, onShapelessChange, cartItems }) => {
  const [activeSlot, setActiveSlot] = useState(null)
  const [anchorRect, setAnchorRect] = useState(null)
  const slotRefs = useRef([])

  const openModal = (index) => {
    const el = slotRefs.current[index]
    if (el) setAnchorRect(el.getBoundingClientRect())
    setActiveSlot(index)
  }

  const closeModal = useCallback(() => setActiveSlot(null), [])

  const assignIngredient = (value) => {
    const next = [...slots]
    next[activeSlot] = value
    onChange(next)
    closeModal()
  }

  const clearSlot = (index, e) => {
    e.stopPropagation()
    const next = [...slots]
    next[index] = null
    onChange(next)
  }

  // Obtener textura personalizada de un ítem del mod por "mod:id"
  const getSlotTexture = (val) => {
    if (!val) return null
    if (val.startsWith('mod:')) {
      const id = val.replace('mod:', '')
      return cartItems.find(i => i.id === id)?.textureUrl ?? null
    }
    return null
  }

  // Abreviar ID largo para display
  const abbreviateId = (val) => {
    if (!val) return ''
    const parts = val.split(':')
    return parts.length > 1 ? parts[1] : val
  }

  return (
    <div className="md:col-span-2 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="bg-mc-dark border-2 border-mc-border rounded-lg p-5 space-y-5">
        {/* Section header */}
        <div className="flex items-center gap-2">
          <Grid3x3 className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-mc-gold uppercase tracking-wider">Mesa de Crafteo</span>
          <span className="ml-auto text-[10px] text-slate-500">Haz clic en una casilla para asignar un ingrediente</span>
        </div>

        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* 3×3 Grid */}
          <div className="shrink-0">
            <div
              className="grid gap-1.5 p-3 bg-[#1a1a1a] rounded-lg border-2 border-[#333] shadow-inner"
              style={{ gridTemplateColumns: 'repeat(3, 64px)' }}
            >
              {slots.map((slot, i) => {
                const texture = getSlotTexture(slot)
                const isEmpty = !slot
                return (
                  <div
                    key={i}
                    ref={el => slotRefs.current[i] = el}
                    onClick={() => isEmpty ? openModal(i) : undefined}
                    className={`
                      w-16 h-16 relative rounded
                      border-2 transition-all duration-150 select-none
                      ${isEmpty
                        ? 'bg-[#2a2a2a] border-[#111] border-b-[#444] border-r-[#444] hover:border-mc-gold hover:bg-[#303030] cursor-pointer group'
                        : 'bg-[#383838] border-[#111] border-b-[#555] border-r-[#555] cursor-default'
                      }
                    `}
                    style={{
                      boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.5), inset -1px -1px 2px rgba(255,255,255,0.03)'
                    }}
                  >
                    {isEmpty ? (
                      <span className="absolute bottom-0.5 right-1 text-[9px] text-[#444] font-pixel group-hover:text-[#666]">{i+1}</span>
                    ) : (
                      <>
                        {texture ? (
                          <img src={texture} alt={slot} className="w-10 h-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-contain" style={{ imageRendering: 'pixelated' }} />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center p-1">
                            <span className="text-[9px] text-slate-300 text-center leading-tight font-mono break-all line-clamp-3">
                              {abbreviateId(slot)}
                            </span>
                          </div>
                        )}
                        {/* Re-assign */}
                        <button
                          type="button"
                          onClick={() => openModal(i)}
                          className="absolute inset-0 w-full h-full opacity-0 hover:opacity-100 bg-black/30 flex items-center justify-center transition-opacity cursor-pointer rounded"
                          title="Cambiar ingrediente"
                        >
                          <span className="text-[9px] text-slate-200">editar</span>
                        </button>
                        {/* Clear */}
                        <button
                          type="button"
                          onClick={(e) => clearSlot(i, e)}
                          className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-rose-900/80 hover:bg-rose-700 flex items-center justify-center transition-colors cursor-pointer z-10"
                          title="Vaciar casilla"
                        >
                          <X className="w-2.5 h-2.5 text-rose-200" />
                        </button>
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/90 text-[9px] text-slate-200 rounded whitespace-nowrap font-mono opacity-0 group-hover:opacity-100 pointer-events-none z-20 border border-mc-border hidden group-hover:block">
                          {slot}
                        </div>
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right side */}
          <div className="flex flex-col gap-4 flex-1">
            {/* Arrow + result slot */}
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-center gap-1">
                <span className="text-[10px] text-slate-500">Resultado</span>
                <div
                  className="w-16 h-16 bg-[#2a2a2a] border-2 border-mc-gold/40 rounded flex items-center justify-center relative shadow-inner"
                  style={{ boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.5)' }}
                >
                  <Blocks className="w-8 h-8 text-mc-gold/50" />
                  <span className="absolute bottom-0.5 right-1 font-pixel text-mc-gold text-sm">{resultCount}</span>
                </div>
              </div>

              <div className="flex-1 space-y-3">
                <div>
                  <FieldLabel>Cantidad resultado</FieldLabel>
                  <NumberInput
                    value={resultCount}
                    onChange={(e) => onResultCountChange(Math.max(1, parseInt(e.target.value) || 1))}
                    step="1" min="1" max="64"
                    className="text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Shapeless toggle */}
            <div
              onClick={() => onShapelessChange(!shapeless)}
              className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                shapeless
                  ? 'bg-purple-950/40 border-purple-700/60'
                  : 'bg-mc-slot border-mc-border hover:border-slate-500'
              }`}
            >
              <div className={`w-10 h-5 rounded-full relative transition-colors ${shapeless ? 'bg-purple-600' : 'bg-slate-600'}`}>
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${shapeless ? 'left-5' : 'left-0.5'}`} />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <Shuffle className={`w-3.5 h-3.5 ${shapeless ? 'text-purple-400' : 'text-slate-400'}`} />
                  <span className={`text-xs font-semibold ${shapeless ? 'text-purple-300' : 'text-slate-300'}`}>
                    Crafteo sin forma (Shapeless)
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  {shapeless ? 'La posición de los ingredientes no importa.' : 'La disposición en la cuadrícula sí importa.'}
                </p>
              </div>
            </div>

            {/* Filled slots summary */}
            <div className="text-[10px] text-slate-500">
              <span className={slots.filter(Boolean).length > 0 ? 'text-emerald-400' : ''}>
                {slots.filter(Boolean).length}/9
              </span>
              {' '}casillas con ingredientes
            </div>
          </div>
        </div>
      </div>

      {/* Slot Modal Portal */}
      {activeSlot !== null && (
        <SlotModal
          position={activeSlot}
          anchorRect={anchorRect}
          onConfirm={assignIngredient}
          onClose={closeModal}
          cartItems={cartItems}
        />
      )}
    </div>
  )
}
