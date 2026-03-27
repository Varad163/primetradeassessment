"use client"

import { useEffect, useState } from "react"

type Task = {
  id: string
  title: string
  description: string
}

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)

  const fetchTasks = async () => {
    const res = await fetch("/api/tasks")
    const data = await res.json()
    setTasks(data)
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const handleAddTask = async () => {
    if (!title) return

    setLoading(true)

    await fetch("/api/tasks", {
      method: "POST",
      body: JSON.stringify({ title, description }),
    })

    setTitle("")
    setDescription("")
    setLoading(false)

    fetchTasks()
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 text-black">
      <h1 className="text-4xl font-bold mb-8 tracking-tight">
        Dashboard 🚀
      </h1>

      {/* Add Task Card */}
      <div className="bg-white p-6 rounded-2xl shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Add Task</h2>

        <input
          type="text"
          placeholder="Task title..."
          className="border border-gray-300 p-3 w-full mb-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Task description..."
          className="border border-gray-300 p-3 w-full mb-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button
          onClick={handleAddTask}
          className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition"
        >
          {loading ? "Adding..." : "Add Task"}
        </button>
      </div>

      {/* Tasks */}
      <div className="grid gap-4">
        {tasks.length === 0 && (
          <p className="text-gray-600">No tasks yet</p>
        )}

        {tasks.map((task) => (
          <div
            key={task.id}
            className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition"
          >
            <h3 className="text-lg font-semibold mb-1">
              {task.title}
            </h3>
            <p className="text-gray-600 text-sm">
              {task.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}