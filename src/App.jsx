import { useEffect, useMemo, useState } from 'react'
import HeaderBar from './components/HeaderBar'
import KanbanBoard from './components/KanbanBoard'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function App() {
  const [dark, setDark] = useState(true)
  const [loading, setLoading] = useState(false)
  const [columns, setColumns] = useState([])
  const [tasks, setTasks] = useState([])
  const [error, setError] = useState('')

  const toggleDark = () => setDark((d) => !d)

  useEffect(() => {
    const root = document.documentElement
    if (dark) root.classList.add('dark')
    else root.classList.remove('dark')
  }, [dark])

  const fetchColumns = async () => {
    const res = await fetch(`${API_BASE}/api/columns`)
    if (!res.ok) throw new Error('Failed to load columns')
    return res.json()
  }

  const fetchTasks = async () => {
    const res = await fetch(`${API_BASE}/api/tasks`)
    if (!res.ok) throw new Error('Failed to load tasks')
    return res.json()
  }

  const bootstrapColumnsIfEmpty = async () => {
    const cols = await fetchColumns()
    if (cols.length > 0) return cols
    const defaults = ['To Do', 'In Progress', 'Done']
    const created = []
    for (let i = 0; i < defaults.length; i++) {
      const res = await fetch(`${API_BASE}/api/columns`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: defaults[i], position: i }),
      })
      if (res.ok) created.push(await res.json())
    }
    return created
  }

  const loadAll = async () => {
    try {
      setLoading(true)
      setError('')
      const cols = await bootstrapColumnsIfEmpty()
      setColumns(cols)
      const t = await fetchTasks()
      setTasks(t)
    } catch (e) {
      setError(e.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAll()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const groupedTasks = useMemo(() => {
    const map = {}
    for (const c of columns) map[c.id] = []
    for (const t of tasks) {
      if (!map[t.column_id]) map[t.column_id] = []
      map[t.column_id].push(t)
    }
    for (const key of Object.keys(map)) {
      map[key].sort((a, b) => (a.position || 0) - (b.position || 0))
    }
    return map
  }, [columns, tasks])

  const addColumn = async () => {
    const name = prompt('Column name')
    if (!name) return
    const res = await fetch(`${API_BASE}/api/columns`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, position: columns.length }),
    })
    if (res.ok) {
      const col = await res.json()
      setColumns((c) => [...c, col])
    }
  }

  const addTask = async (columnId) => {
    const title = prompt('Task title')
    if (!title) return
    const res = await fetch(`${API_BASE}/api/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, column_id: columnId }),
    })
    if (res.ok) {
      const task = await res.json()
      setTasks((t) => [...t, task])
    }
  }

  const moveTask = async (taskId, targetColumnId) => {
    const res = await fetch(`${API_BASE}/api/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ column_id: targetColumnId, position: null }),
    })
    if (res.ok) {
      const updated = await res.json()
      setTasks((list) => list.map((t) => (t.id === taskId ? updated : t)))
    }
  }

  const updateTask = async (taskId, updates) => {
    const res = await fetch(`${API_BASE}/api/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    })
    if (res.ok) {
      const updated = await res.json()
      setTasks((list) => list.map((t) => (t.id === taskId ? updated : t)))
    }
  }

  const deleteTask = async (taskId) => {
    const res = await fetch(`${API_BASE}/api/tasks/${taskId}`, { method: 'DELETE' })
    if (res.ok) {
      setTasks((list) => list.filter((t) => t.id !== taskId))
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 transition-colors duration-300 dark:bg-zinc-950 dark:text-zinc-100">
      <HeaderBar dark={dark} onToggleDark={toggleDark} onAddColumn={addColumn} loading={loading} />

      {error && (
        <div className="mx-auto mt-4 max-w-4xl rounded-md border border-red-500/30 bg-red-500/10 p-3 text-red-200">
          {error}
        </div>
      )}

      <KanbanBoard
        columns={columns}
        tasksByColumn={groupedTasks}
        onAddTask={addTask}
        onMoveTask={moveTask}
        onUpdateTask={updateTask}
        onDeleteTask={deleteTask}
        loading={loading}
      />
    </div>
  )
}

export default App
