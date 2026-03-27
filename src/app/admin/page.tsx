"use client"

import { useEffect, useState } from "react"
import { signOut, useSession } from "next-auth/react"

type User = {
  id: string
  email: string
  role: string
}

type Task = {
  id: string
  title: string
  description: string
  user: {
    email: string
  }
}

export default function AdminPage() {
  const { data: session } = useSession()

  const [users, setUsers] = useState<User[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchAdminData = async () => {
  try {
    const res = await fetch("/api/admin", {
      credentials: "include", // 🔥 IMPORTANT
    })

    if (!res.ok) {
      console.error("API ERROR:", res.status)
      return
    }

    const data = await res.json()

    setUsers(data.users || [])
    setTasks(data.tasks || [])
  } catch (err) {
    console.error("Fetch error:", err)
  }
}

  useEffect(() => {
    fetchAdminData()
  }, [])

  // 🔥 Delete ANY task (admin power)
  const handleDelete = async (id: string) => {
    setDeletingId(id)

    try {
      await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
        credentials: "include",
      })

      fetchAdminData()
    } catch {
      console.error("Error deleting task")
    }

    setDeletingId(null)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 text-black">
      
      {/* 🔥 Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold">Admin Panel 👑</h1>
          <p className="text-sm text-gray-600">
            Logged in as: {session?.user?.email}
          </p>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
        >
          Logout
        </button>
      </div>

      {/* 👥 Users */}
      <div className="bg-white p-6 rounded-2xl mb-8 shadow">
        <h2 className="text-xl font-semibold mb-4">Users</h2>

        {users.map((user) => (
          <div
            key={user.id}
            className="border-b py-2 flex justify-between"
          >
            <span>{user.email}</span>
            <span className="text-sm text-gray-600">{user.role}</span>
          </div>
        ))}
      </div>

      {/* 📋 Tasks */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-xl font-semibold mb-4">All Tasks</h2>

        {tasks.map((task) => (
          <div
            key={task.id}
            className="border-b py-3 flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold">{task.title}</h3>
              <p className="text-sm text-gray-600">
                {task.description}
              </p>
              <p className="text-xs text-gray-500">
                by {task.user.email}
              </p>
            </div>

            <button
              onClick={() => handleDelete(task.id)}
              disabled={deletingId === task.id}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              {deletingId === task.id ? "Deleting..." : "Delete"}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}