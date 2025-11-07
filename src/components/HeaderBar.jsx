import { Moon, Sun, Plus } from 'lucide-react'

export default function HeaderBar({ dark, onToggleDark, onAddColumn, loading }) {
  return (
    <header className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-zinc-900/60 border-b border-zinc-200/60 dark:border-zinc-800/60">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded bg-gradient-to-br from-fuchsia-500 to-indigo-500" />
          <h1 className="text-lg font-semibold tracking-tight">Kanban Tasks</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            disabled={loading}
            onClick={onAddColumn}
            className="inline-flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-sm font-medium shadow-sm hover:bg-zinc-50 active:scale-[0.99] dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700"
          >
            <Plus size={16} /> Add column
          </button>
          <button
            onClick={onToggleDark}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-zinc-200 bg-white shadow-sm hover:bg-zinc-50 active:scale-95 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700"
            aria-label="Toggle dark mode"
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </header>
  )
}
