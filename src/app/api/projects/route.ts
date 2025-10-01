import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getServerSupabaseClient } from '@/lib/supabase/server'

// Zod schema for project creation
const projectSchema = z.object({
  name: z.string().min(3, 'Project name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  features: z
    .array(z.string().min(3, 'Each feature must be at least 3 characters'))
    .min(5, 'At least 5 features are required')
    .max(10, 'No more than 10 features allowed'),
})

// POST: Create a new project with features
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const validatedData = projectSchema.parse(body)
    const supabase = await getServerSupabaseClient()

    // Ensure user is authenticated
    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user?.id) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      )
    }
    const userId = userData.user.id

    // Insert project with initial empty graph placeholder
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert({
        name: validatedData.name,
        description: validatedData.description,
        user_id: userId,
        graph: { nodes: [], edges: [] }, // placeholder
      })
      .select()
      .single()

    if (projectError || !project) {
      return NextResponse.json(
        { error: projectError?.message || 'Failed to create project' },
        { status: 500 }
      )
    }

    // Insert features
    const featuresData = validatedData.features.map((feature) => ({
      project_id: project.id,
      title: feature,
    }))
    const { error: featuresError } = await supabase
      .from('features')
      .insert(featuresData)

    if (featuresError) {
      return NextResponse.json(
        { error: featuresError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Project created successfully',
      project,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    const message =
      error instanceof Error ? error.message : 'Failed to create project'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// GET: Fetch all projects for the logged-in user
export async function GET() {
  try {
    const supabase = await getServerSupabaseClient()

    // Ensure user is authenticated
    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user?.id) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      )
    }
    const userId = userData.user.id

    // Fetch projects
    const { data: projects, error } = await supabase
      .from('projects')
      .select('id, name, updated_at')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ projects })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to fetch projects'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
