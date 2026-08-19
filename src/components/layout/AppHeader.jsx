import { Flame } from 'lucide-react'

export function AppHeader() {
  return (
    <header className="bg-mc-panel border-b-4 border-mc-border p-4 shadow-lg flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Flame className="w-8 h-8 text-mc-green animate-pulse" />
        <div>
          <h1 className="font-pixel text-3xl tracking-wide text-mc-gold select-none">Lazy Forge</h1>
          <p className="text-xs text-slate-400">Forja de Mods Automatizada</p>
        </div>
      </div>
      <div className="flex items-center gap-2 bg-mc-dark px-3 py-1.5 rounded border border-mc-border text-xs text-slate-400">
        <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
        Workspace activo
      </div>
    </header>
  )
}
