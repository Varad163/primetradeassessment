"use client"

import { useEffect, useState } from "react"
import { signOut } from "next-auth/react"

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
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // ✏️ Edit states
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [editDescription, setEditDescription] = useState("")

  // 🔥 Fetch tasks
  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/tasks")
      const data = await res.json()
      setTasks(data)
    } catch {
      console.error("Error fetching tasks")
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  // ➕ Add task
  const handleAddTask = async () => {
    if (!title) return

    setLoading(true)

    try {
      await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      })

      setTitle("")
      setDescription("")
      fetchTasks()
    } catch {
      console.error("Error adding task")
    }

    setLoading(false)
  }

  // ❌ Delete task
  const handleDelete = async (id: string) => {
    setDeletingId(id)

    try {
      await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
        credentials: "include",
      })

      fetchTasks()
    } catch {
      console.error("Error deleting task")
    }

    setDeletingId(null)
  }

  // ✏️ Start editing
  const handleEdit = (task: Task) => {
    setEditingId(task.id)
    setEditTitle(task.title)
    setEditDescription(task.description)
  }

  // 💾 Save update
  const handleUpdate = async (id: string) => {
    try {
      await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
        }),
      })

      setEditingId(null)
      fetchTasks()
    } catch {
      console.error("Error updating task")
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 text-black">
      
      {/* 🔥 Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-black">
          Dashboard 🚀
        </h1>

        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
        >
          Logout
        </button>
      </div>

      {/* ➕ Add Task */}
      <div className="bg-white p-6 rounded-2xl shadow-md mb-8 text-black">
        <h2 className="text-xl font-semibold mb-4 text-black">Add Task</h2>

        <input
          type="text"
          placeholder="Task title..."
          className="border border-gray-300 p-3 w-full mb-3 rounded-lg text-black focus:ring-2 focus:ring-black"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Task description..."
          className="border border-gray-300 p-3 w-full mb-3 rounded-lg text-black focus:ring-2 focus:ring-black"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button
          onClick={handleAddTask}
          disabled={loading}
          className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Task"}
        </button>
      </div>

      {/* 📋 Tasks */}
      <div className="grid gap-4">
        {tasks.length === 0 && (
          <p className="text-gray-700">No tasks yet</p>
        )}

        {tasks.map((task) => (
          <div
            key={task.id}
            className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition flex justify-between items-center text-black"
          >
            {editingId === task.id ? (
              <div className="flex-1 mr-4">
                <input
                  className="border p-2 w-full mb-2 rounded text-black"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />

                <textarea
                  className="border p-2 w-full rounded text-black"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                />

                <button
                  onClick={() => handleUpdate(task.id)}
                  className="mt-2 bg-black text-white px-4 py-1 rounded"
                >
                  Save
                </button>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-semibold mb-1 text-black">
                  {task.title}
                </h3>
                <p className="text-gray-700 text-sm">
                  {task.description}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 ml-4">
              {editingId !== task.id && (
                <button
                  onClick={() => handleEdit(task)}
                  className="text-blue-500 hover:text-blue-700 text-sm"
                >
                  Edit
                </button>
              )}

              <button
                onClick={() => handleDelete(task.id)}
                disabled={deletingId === task.id}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                {deletingId === task.id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}