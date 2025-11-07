import { useMemo, useRef, useState } from 'react'
import Column from './KanbanColumn'

export default function KanbanBoard({ columns, tasksByColumn, onAddTask, onMoveTask, onUpdateTask, onDeleteTask, loading }) {
  const [drag, setDrag] = useState(null)
  const overColumnRef = useRef(null)

  const orderedColumns = useMemo(() => {
    return [...columns].sort((a, b) => (a.position || 0) - (b.position || 0))
  }, [columns])

  const handleDragStart = (task) => setDrag(task)
  const handleDragEnd = () => setDrag(null)

  const handleDragOverColumn = (columnId) => {
    overColumnRef.current = columnId
  }

  const handleDrop = () => {
    if (drag && overColumnRef.current && drag.column_id !== overColumnRef.current) {
      onMoveTask(drag.id, overColumnRef.current)
    }
    setDrag(null)
    overColumnRef.current = null
  }

  return (
    <main className="mx-auto max-w-6xl px-4 pb-16 pt-6">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Drag tasks between columns</h2>
        {loading && <span className="text-xs text-zinc-500">Loading…</span>}
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3" onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
        {orderedColumns.map((col) => (
          <Column
            key={col.id}
            column={col}
            tasks={tasksByColumn[col.id] || []}
            onAddTask={() => onAddTask(col.id)}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOverColumn={() => handleDragOverColumn(col.id)}
            onUpdateTask={onUpdateTask}
            onDeleteTask={onDeleteTask}
          />
        ))}
      </div>
    </main>
  )
}
