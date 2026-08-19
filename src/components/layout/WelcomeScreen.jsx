import { Plus, Blocks, Box, Sparkles, Shield } from 'lucide-react'

export function WelcomeScreen({ onAddItem, onAddBlock, onAddArmor }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-mc-panel rounded-lg border-2 border-mc-border shadow-2xl group">
      <div className="w-20 h-20 bg-mc-slot flex items-center justify-center rounded-lg border-4 border-mc-border shadow-inner mb-6 transition-transform group-hover:scale-110 duration-300">
        <Blocks className="w-10 h-10 text-mc-gold" />
      </div>
      <h2 className="font-pixel text-4xl text-mc-gold mb-3 tracking-wider">¡Bienvenido a Lazy Forge!</h2>
      <p className="max-w-md text-slate-400 mb-8 leading-relaxed">
        Diseña elementos personalizados para Minecraft. Forja herramientas, armas, comidas, bloques, armaduras o proyectiles y descárgalos con un instalador automático que compilará el mod por ti.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <button
          onClick={onAddItem}
          className="group/btn px-8 py-4 bg-mc-green hover:bg-mc-green-hover text-white font-pixel text-2xl tracking-wider rounded border-b-4 border-orange-950 active:border-b-0 active:translate-y-1 transition-all shadow-md flex items-center gap-3 cursor-pointer"
        >
          <Plus className="w-6 h-6 transition-transform group-hover/btn:rotate-90 duration-300" />
          Añadir Nuevo Ítem
        </button>
        <button
          onClick={onAddBlock}
          className="group/btn px-8 py-4 bg-sky-700 hover:bg-sky-600 text-white font-pixel text-2xl tracking-wider rounded border-b-4 border-sky-950 active:border-b-0 active:translate-y-1 transition-all shadow-md flex items-center gap-3 cursor-pointer"
        >
          <Box className="w-6 h-6 transition-transform group-hover/btn:scale-110 duration-300" />
          Añadir Nuevo Bloque
        </button>
        <button
          onClick={onAddArmor}
          className="group/btn px-8 py-4 bg-purple-700 hover:bg-purple-600 text-white font-pixel text-2xl tracking-wider rounded border-b-4 border-purple-950 active:border-b-0 active:translate-y-1 transition-all shadow-md flex items-center gap-3 cursor-pointer"
        >
          <Shield className="w-6 h-6 transition-transform group-hover/btn:scale-110 duration-300" />
          Añadir Armadura
        </button>
        <button
          disabled
          className="px-8 py-4 bg-slate-800 text-slate-500 font-pixel text-xl tracking-wider rounded border border-slate-700 opacity-60 flex items-center gap-3 cursor-not-allowed select-none"
        >
          <Sparkles className="w-5 h-5 text-slate-600" />
          Añadir Efectos <span className="text-[10px] bg-slate-900 px-1.5 py-0.5 rounded text-slate-500 font-sans tracking-normal font-semibold">PRÓXIMAMENTE</span>
        </button>
      </div>
    </div>
  )
}
