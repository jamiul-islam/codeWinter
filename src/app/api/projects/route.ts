import { NextResponse } from "next/server"
import { z, ZodError } from "zod"
import { getServerSupabaseClient } from "@/lib/supabase/server"

// Validation schema
const schema = z.object({
  name: z.string().min(3, "Project name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters").or(z.literal('')), // allow empty
  features: z.array(z.string().min(2, "Feature must be at least 2 characters")).min(5, "Add at least 5 features").max(10, "Maximum 10 features allowed"),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)

    if (!parsed.success) {
      const zodError = parsed.error as ZodError
      const messages = zodError.errors.map(e => e.message)
      return NextResponse.json({ error: messages }, { status: 400 })
    }

    const { name, description, features } = parsed.data

    // Supabase server client
    const supabase = await getServerSupabaseClient()

    // Get current user from auth
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Insert project
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .insert([{ user_id: user.id, name, description, graph: null }])
      .select()
      .single()

    if (projectError || !project) {
      return NextResponse.json(
        { error: projectError?.message || "Failed to create project" },
        { status: 500 }
      )
    }

    // Insert related features
    const featureRows = features.map(title => ({
      project_id: project.id,
      title,
    }))

    const { error: featureError } = await supabase
      .from("features")
      .insert(featureRows)

    if (featureError) {
      return NextResponse.json(
        { error: featureError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ projectId: project.id }, { status: 201 })
  } catch (err) {
    console.error("API error:", err)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
