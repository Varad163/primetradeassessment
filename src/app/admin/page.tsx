"use client"

import { useEffect, useState } from "react"

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
  const [users, setUsers] = useState<User[]>([])
  const [tasks, setTasks] = useState<Task[]>([])

  const fetchAdminData = async () => {
    const res = await fetch("/api/admin")
    const data = await res.json()

    setUsers(data.users)
    setTasks(data.tasks)
  }

  useEffect(() => {
    fetchAdminData()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 p-6 text-black">
      <h1 className="text-4xl font-bold mb-8">Admin Panel 👑</h1>

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
          <div key={task.id} className="border-b py-2">
            <h3 className="font-semibold">{task.title}</h3>
            <p className="text-sm text-gray-600">
              {task.description}
            </p>
            <p className="text-xs text-gray-500">
              by {task.user.email}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}