import TaskCard from './TaskCard'
import { Plus } from 'lucide-react'

export default function KanbanColumn({ column, tasks, onAddTask, onDragStart, onDragEnd, onDragOverColumn, onUpdateTask, onDeleteTask }) {
  return (
    <section
      className="flex flex-col gap-3 rounded-lg border border-zinc-200 bg-zinc-50/60 p-3 dark:border-zinc-800 dark:bg-zinc-900/40"
      onDragOver={(e) => {
        e.preventDefault()
        onDragOverColumn?.(column.id)
      }}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold tracking-tight">{column.name}</h3>
        <button
          onClick={onAddTask}
          className="inline-flex items-center gap-1 rounded-md border border-zinc-200 bg-white px-2 py-1 text-xs font-medium shadow-sm hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700"
        >
          <Plus size={14} /> Add
        </button>
      </div>
      <div className="flex flex-1 flex-col gap-3">
        {tasks.map((t) => (
          <TaskCard
            key={t.id}
            task={t}
            onDragStart={() => onDragStart?.(t)}
            onDragEnd={onDragEnd}
            onUpdate={onUpdateTask}
            onDelete={onDeleteTask}
          />
        ))}
      </div>
    </section>
  )
}
