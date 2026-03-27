export const runtime = "nodejs"
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getToken } from "next-auth/jwt"

// 🟢 GET: Fetch tasks
export async function GET(req: NextRequest) {
  const token = await getToken({ req })

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // ✅ Cast token values
  const userId = token.id as string
  const role = token.role as string

  let tasks

  // 👑 ADMIN → all tasks
  if (role === "ADMIN") {
    tasks = await prisma.task.findMany()
  } else {
    // 👤 USER → only their tasks
    tasks = await prisma.task.findMany({
      where: { userId },
    })
  }

  return NextResponse.json(tasks)
}

// 🔵 POST: Create task
export async function POST(req: NextRequest) {
  const token = await getToken({ req })

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // ✅ Cast token id
  const userId = token.id as string

  const body = await req.json()
  const { title, description } = body

  const task = await prisma.task.create({
    data: {
      title,
      description,
      userId,
    },
  })

  return NextResponse.json(task, { status: 201 })
}