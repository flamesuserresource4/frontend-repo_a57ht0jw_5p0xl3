import { GripVertical, Trash2, Edit3 } from 'lucide-react'
import { useState } from 'react'

export default function TaskCard({ task, onDragStart, onDragEnd, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(task.title)

  const save = async () => {
    if (!title.trim()) return
    await onUpdate(task.id, { title })
    setEditing(false)
  }

  return (
    <div
      className="group rounded-md border border-zinc-200 bg-white p-3 shadow-sm dark:border-zinc-700 dark:bg-zinc-800"
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <div className="flex items-start gap-2">
        <GripVertical className="mt-0.5 shrink-0 text-zinc-400" size={16} />
        <div className="flex-1">
          {!editing ? (
            <div className="text-sm font-medium text-zinc-800 dark:text-zinc-100">{task.title}</div>
          ) : (
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded border border-zinc-300 bg-white px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-600 dark:bg-zinc-900"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') save()
                if (e.key === 'Escape') setEditing(false)
              }}
            />
          )}
        </div>
        <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          {!editing ? (
            <button className="rounded p-1 hover:bg-zinc-100 dark:hover:bg-zinc-700" onClick={() => setEditing(true)}>
              <Edit3 size={16} />
            </button>
          ) : (
            <button className="rounded p-1 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950" onClick={save}>
              Save
            </button>
          )}
          <button className="rounded p-1 hover:bg-zinc-100 dark:hover:bg-zinc-700" onClick={() => onDelete(task.id)}>
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
