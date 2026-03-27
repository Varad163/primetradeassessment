import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getToken } from "next-auth/jwt"

export async function GET(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })

  if (!token || token.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      role: true,
    },
  })

  const tasks = await prisma.task.findMany({
    include: {
      user: true,
    },
  })

  return NextResponse.json({ users, tasks })
}