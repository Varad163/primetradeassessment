import { NextRequest, NextResponse } from "next/server"
import { prisma } from "../../lib/db"
import bcrypt from "bcrypt"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password } = body

    // 🔴 Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      )
    }

    // 🔍 Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      )
    }

    // 🔐 Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // 💾 Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    })

    return NextResponse.json(
      {
        message: "User created successfully ✅",
        user: {
          id: user.id,
          email: user.email,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}