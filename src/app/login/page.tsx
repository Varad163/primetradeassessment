"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

 const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault()
  setLoading(true)
  setError("")

  const res = await signIn("credentials", {
    email,
    password,
    redirect: false,
  })

  setLoading(false)

  if (res?.error) {
    setError(res.error)
    return
  }

  // 🔥 FETCH SESSION
  const sessionRes = await fetch("/api/auth/session")
  const session = await sessionRes.json()

  console.log("ROLE:", session.user?.role) // 🔍 debug

  // 🔥 ROLE-BASED REDIRECT
  if (session.user?.role === "ADMIN") {
    router.push("/admin")
  } else {
    router.push("/dashboard")
  }
}
  return (
  <div className="flex min-h-screen items-center justify-center bg-gray-100 text-black">
    <form
      onSubmit={handleLogin}
      className="bg-white p-8 rounded-xl shadow-md w-96 text-black"
    >
      <h2 className="text-2xl font-bold mb-4 text-center text-black">
  Login
</h2>

{/* 🔥 Admin Demo Box */}
<div className="bg-gray-100 border border-gray-300 rounded-lg p-3 mb-4 text-sm text-black">
  <p className="font-semibold mb-1">Admin Demo</p>
  <p>
    Email: <span className="font-mono">john@gmail.com</span>
  </p>
  <p>
    Password: <span className="font-mono">123456</span>
  </p>
</div>
      {error && (
        <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
      )}

      <input
        type="email"
        placeholder="Email"
        className="w-full mb-4 p-2 border rounded text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full mb-4 p-2 border rounded text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-black text-white p-2 rounded hover:bg-gray-800 transition"
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      <p className="text-sm mt-4 text-center text-black">
        Don't have an account?{" "}
        <Link href="/register" className="text-blue-500">
          Register
        </Link>
      </p>
    </form>
  </div>
)
}