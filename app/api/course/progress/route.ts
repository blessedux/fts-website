import { NextResponse } from "next/server"
import { users } from "@/lib/db"

export async function GET(request: Request) {
  // Get the user ID from the query parameters
  const url = new URL(request.url)
  const userId = url.searchParams.get("userId") || "1" // Default to user 1 if not specified

  // Find the user in our mock data
  const user = users.find((u) => u.id === userId)

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  // Mock progress data based on the user
  const progress = {
    userId: user.id,
    courseId: "curso-completo",
    completedModules: [1, 2],
    currentModule: 3,
    progress: user.progress || 66, // Use the user's progress or default to 66%
    quizResults: {
      "1": { passed: true, score: 90 },
      "2": { passed: true, score: 85 },
    },
  }

  // Simulate a network delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  return NextResponse.json(progress)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Just log the data and return success (no actual DB update)
    console.log("Update progress request:", body)

    // Simulate a network delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating progress:", error)
    return NextResponse.json({ error: "Error updating progress" }, { status: 500 })
  }
}
