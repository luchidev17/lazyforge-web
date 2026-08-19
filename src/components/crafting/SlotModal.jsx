import { useState, useRef, useEffect } from 'react'
import { X } from 'lucide-react'
import { MINECRAFT_ITEMS } from '../../constants/minecraftItems'

/**
 * Modal flotante con combobox unificado para buscar ingredientes de crafteo.
 * Combina ítems vanilla de Minecraft con los ítems/bloques del mod del usuario.
 */
export const SlotModal = ({ position, anchorRect, onConfirm, onClose, cartItems }) => {
  const [query,       setQuery]       = useState('')
  const [activeIndex, setActiveIndex] = useState(-1)
  const modalRef = useRef(null)
  const inputRef = useRef(null)
  const listRef  = useRef(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handler = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) onClose()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  // Opciones filtradas
  const q = query.trim().toLowerCase()

  const vanillaOptions = MINECRAFT_ITEMS
    .filter(id => !q || id.includes(q))
    .map(id => ({ label: id, value: id, source: 'vanilla' }))

  const cartOptions = cartItems
    .filter(item => !q || item.id.includes(q) || item.name.toLowerCase().includes(q))
    .map(item => ({
      label:    `mod:${item.id}`,
      sublabel: item.name,
      value:    `mod:${item.id}`,
      source:   'mod',
    }))

  const allOptions  = [...vanillaOptions, ...cartOptions]
  const vanillaCount = vanillaOptions.length

  // Navegación por teclado
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex(i => Math.min(i + 1, allOptions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (activeIndex >= 0 && allOptions[activeIndex]) {
        onConfirm(allOptions[activeIndex].value)
      } else if (query.trim()) {
        onConfirm(query.trim())
      }
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  // Scroll del ítem activo
  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const el = listRef.current.children[activeIndex]
      el?.scrollIntoView({ block: 'nearest' })
    }
  }, [activeIndex])

  // Reset al cambiar query
  useEffect(() => { setActiveIndex(-1) }, [query])

  // Posición del modal
  const style = anchorRect ? {
    position: 'fixed',
    top:  Math.min(anchorRect.bottom + 6, window.innerHeight - 380),
    left: Math.max(0, Math.min(anchorRect.left, window.innerWidth - 310)),
    zIndex: 9999,
    width: 300,
  } : {}

  const showVanillaHeader = vanillaOptions.length > 0
  const showModHeader     = cartOptions.length    > 0

  return (
    <div ref={modalRef} style={style} className="bg-[#1e1e1e] border-2 border-mc-gold rounded-lg shadow-2xl flex flex-col overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-mc-slot border-b border-mc-border shrink-0">
        <span className="text-xs font-semibold text-mc-gold">Casilla #{position + 1} — Ingrediente</span>
        <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-100 transition-colors cursor-pointer">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Combobox input */}
      <div className="p-2 border-b border-mc-border shrink-0">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Buscar: iron_ingot, stick…"
            autoComplete="off"
            spellCheck={false}
            className="w-full px-3 py-2 bg-mc-dark border-2 border-mc-border rounded text-sm text-slate-200 focus:outline-none focus:border-mc-gold placeholder:text-slate-600 font-mono"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Results list */}
      <div ref={listRef} className="overflow-y-auto" style={{ maxHeight: 260 }}>
        {allOptions.length === 0 ? (
          <div className="px-4 py-6 text-center">
            <p className="text-xs text-slate-500">Sin coincidencias para</p>
            <p className="text-xs text-slate-300 font-mono mt-1 truncate">"{query}"</p>
            <button
              type="button"
              onClick={() => onConfirm(query.trim())}
              className="mt-3 px-3 py-1.5 bg-mc-green hover:bg-mc-green-hover text-white text-xs font-pixel tracking-wider rounded cursor-pointer"
            >
              Usar ID personalizado
            </button>
          </div>
        ) : (
          <>
            {/* Vanilla section */}
            {showVanillaHeader && (
              <div className="px-3 py-1 bg-[#191919] border-b border-mc-border/60 sticky top-0 z-10">
                <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-widest">Vanilla Minecraft</span>
              </div>
            )}
            {vanillaOptions.map((opt, idx) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => onConfirm(opt.value)}
                onMouseEnter={() => setActiveIndex(idx)}
                className={`w-full flex items-center gap-2 px-3 py-2 text-left transition-colors cursor-pointer border-b border-mc-border/30 last:border-0
                  ${activeIndex === idx ? 'bg-mc-gold/10 text-slate-100' : 'hover:bg-mc-slot text-slate-300'}`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-slate-600 shrink-0" />
                <span className="text-xs font-mono truncate">{opt.label}</span>
              </button>
            ))}

            {/* Mod items section */}
            {showModHeader && (
              <div className="px-3 py-1 bg-[#191919] border-y border-mc-border/60 sticky top-0 z-10">
                <span className="text-[9px] font-semibold text-mc-gold/70 uppercase tracking-widest">Tu Mod</span>
              </div>
            )}
            {cartOptions.map((opt, idx) => {
              const globalIdx = vanillaCount + idx
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onConfirm(opt.value)}
                  onMouseEnter={() => setActiveIndex(globalIdx)}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-left transition-colors cursor-pointer border-b border-mc-border/30 last:border-0
                    ${activeIndex === globalIdx ? 'bg-mc-gold/10 text-slate-100' : 'hover:bg-mc-slot text-slate-300'}`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-mc-gold/60 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs font-mono truncate">{opt.label}</div>
                    {opt.sublabel && <div className="text-[9px] text-slate-500 truncate">{opt.sublabel}</div>}
                  </div>
                </button>
              )
            })}
          </>
        )}
      </div>

      {/* Footer hint */}
      <div className="px-3 py-1.5 border-t border-mc-border bg-[#181818] shrink-0 flex items-center gap-3">
        <span className="text-[9px] text-slate-600">↑↓ navegar</span>
        <span className="text-[9px] text-slate-600">Enter confirmar</span>
        <span className="text-[9px] text-slate-600">Esc cerrar</span>
        <span className="text-[9px] text-slate-500 ml-auto">{allOptions.length} resultados</span>
      </div>
    </div>
  )
}
