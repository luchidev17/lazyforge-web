import './App.css'
import { useModWorkspace } from './hooks/useModWorkspace'
import { AppHeader } from './components/layout/AppHeader'
import { WelcomeScreen } from './components/layout/WelcomeScreen'
import { ModSidebar } from './components/layout/ModSidebar'
import { ItemForm } from './components/forms/ItemForm'
import { BlockForm } from './components/forms/BlockForm'
import { ArmorForm } from './components/forms/ArmorForm'

function App() {
  const ws = useModWorkspace()
  const cartItems = [...ws.items, ...ws.blocks, ...(ws.armors || [])]

  return (
    <div className="min-h-screen bg-mc-dark text-slate-100 flex flex-col font-sans">
      <AppHeader />

      <main className="flex-1 flex flex-col md:flex-row">
        <section className="w-full md:w-[70%] p-6 flex flex-col gap-6 border-r-0 md:border-r-4 border-mc-border min-h-0">
          {!ws.formMode ? (
            <WelcomeScreen
              onAddItem={() => ws.setFormMode('item')}
              onAddBlock={() => ws.setFormMode('block')}
              onAddArmor={() => ws.setFormMode('armor')}
            />
          ) : ws.formMode === 'item' ? (
            <ItemForm ws={ws} cartItems={cartItems} />
          ) : ws.formMode === 'block' ? (
            <BlockForm ws={ws} cartItems={cartItems} />
          ) : (
            <ArmorForm ws={ws} cartItems={cartItems} />
          )}
        </section>

        <ModSidebar ws={ws} />
      </main>
    </div>
  )
}

export default App
