// import { NextRequest, NextResponse } from 'next/server'
// import { getServerSupabaseClient } from '@/lib/supabase/server'

// export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
//   // await params before accessing id
//   const { id: projectId } = await params

//   try {
//     const supabase = await getServerSupabaseClient()

//     // Ensure user is authenticated
//     const { data: userData } = await supabase.auth.getUser()
//     if (!userData.user?.id) {
//       return NextResponse.json({ error: 'User not authenticated' }, { status: 401 })
//     }

//     // Fetch the project
//     const { data: project, error } = await supabase
//       .from('projects')
//       .select('*')
//       .eq('id', projectId)
//       .single()

//     if (error || !project) {
//       return NextResponse.json({ error: error?.message || 'Project not found' }, { status: 404 })
//     }

//     return NextResponse.json(project)
//   } catch (err: any) {
//     return NextResponse.json({ error: err.message }, { status: 500 })
//   }
// }


import { NextRequest, NextResponse } from 'next/server'
import { getServerSupabaseClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id: projectId } = params 

  try {
    const supabase = await getServerSupabaseClient()

    // Ensure user is authenticated
    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user?.id) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 })
    }

    // Fetch the project
    const { data: project, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single()

    if (error || !project) {
      return NextResponse.json({ error: error?.message || 'Project not found' }, { status: 404 })
    }

    return NextResponse.json({ project }) // wrap project in an object
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
