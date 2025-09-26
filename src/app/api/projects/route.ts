import { NextResponse } from "next/server"
import { z } from "zod"
import { getServerSupabaseClient } from "@/lib/supabase/server"

// Validation schema
const schema = z.object({
  name: z.string().min(3),
  description: z.string().min(10),
  features: z.array(z.string().min(2)).min(5).max(10),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors },
        { status: 400 }
      )
    }

    const { name, description, features } = parsed.data

    // Supabase server client
    const supabase = await getServerSupabaseClient()

    // get current user from auth
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // insert project
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .insert([
        {
          user_id: user.id,
          name,
          description,
          graph: null, 
        },
      ])
      .select()
      .single()

    if (projectError) {
      return NextResponse.json(
        { error: projectError.message },
        { status: 500 }
      )
    }

    // insert related features
    const featureRows = features.map((title) => ({
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
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
