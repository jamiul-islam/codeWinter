import { getServerSupabaseClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/supabase/types'

type Feature = Database['public']['Tables']['features']['Row']
type Project = Database['public']['Tables']['projects']['Row']
type FeatureEdge = Database['public']['Tables']['feature_edges']['Row']

export interface PrdContext {
  project: Project
  targetFeature: Feature
  connectedFeatures: Feature[]
  dependencies: {
    incoming: Feature[] // Features that depend on this one
    outgoing: Feature[] // Features this one depends on
  }
  totalTokenEstimate: number
}

export async function buildPrdContext(
  featureId: string,
  projectId: string,
  userId: string
): Promise<PrdContext> {
  const supabase = await getServerSupabaseClient()

  // Fetch project details
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .eq('user_id', userId)
    .single()

  if (projectError || !project) {
    throw new Error('Project not found or access denied')
  }

  // Fetch target feature
  const { data: targetFeature, error: featureError } = await supabase
    .from('features')
    .select('*')
    .eq('id', featureId)
    .eq('project_id', projectId)
    .single()

  if (featureError || !targetFeature) {
    throw new Error('Feature not found')
  }

  // Fetch all edges for this project
  const { data: edges, error: edgesError } = await supabase
    .from('feature_edges')
    .select('*')
    .eq('project_id', projectId)

  if (edgesError) {
    throw new Error('Failed to fetch feature relationships')
  }

  // Find connected feature IDs
  const connectedFeatureIds = new Set<string>()
  const incomingFeatureIds = new Set<string>()
  const outgoingFeatureIds = new Set<string>()

  edges?.forEach((edge) => {
    if (edge.source_feature_id === featureId) {
      connectedFeatureIds.add(edge.target_feature_id)
      outgoingFeatureIds.add(edge.target_feature_id)
    }
    if (edge.target_feature_id === featureId) {
      connectedFeatureIds.add(edge.source_feature_id)
      incomingFeatureIds.add(edge.source_feature_id)
    }
  })

  // Fetch connected features
  let connectedFeatures: Feature[] = []
  let incomingFeatures: Feature[] = []
  let outgoingFeatures: Feature[] = []

  if (connectedFeatureIds.size > 0) {
    const { data: features, error: connectedError } = await supabase
      .from('features')
      .select('*')
      .in('id', Array.from(connectedFeatureIds))
      .eq('project_id', projectId)

    if (connectedError) {
      throw new Error('Failed to fetch connected features')
    }

    connectedFeatures = features || []
    
    // Separate incoming and outgoing
    incomingFeatures = connectedFeatures.filter(f => incomingFeatureIds.has(f.id))
    outgoingFeatures = connectedFeatures.filter(f => outgoingFeatureIds.has(f.id))
  }

  // Estimate token count for context optimization
  const totalTokenEstimate = estimateTokenCount({
    project,
    targetFeature,
    connectedFeatures,
  })

  return {
    project,
    targetFeature,
    connectedFeatures,
    dependencies: {
      incoming: incomingFeatures,
      outgoing: outgoingFeatures,
    },
    totalTokenEstimate,
  }
}

function estimateTokenCount(context: {
  project: Project
  targetFeature: Feature
  connectedFeatures: Feature[]
}): number {
  // Rough token estimation (1 token ≈ 4 characters)
  let totalChars = 0
  
  // Project context
  totalChars += context.project.name.length
  totalChars += context.project.description.length
  
  // Target feature
  totalChars += context.targetFeature.title.length
  totalChars += (context.targetFeature.notes || '').length
  
  // Connected features
  context.connectedFeatures.forEach(feature => {
    totalChars += feature.title.length
    totalChars += (feature.notes || '').length * 0.5 // Reduced weight for connected features
  })
  
  // Add prompt template overhead (approximately 1000 characters)
  totalChars += 1000
  
  return Math.ceil(totalChars / 4)
}

export function optimizeContextForTokenLimit(
  context: PrdContext,
  maxTokens: number = 3500
): PrdContext {
  if (context.totalTokenEstimate <= maxTokens) {
    return context
  }

  // If over limit, reduce connected features
  const prioritizedFeatures = context.connectedFeatures
    .sort((a, b) => {
      // Prioritize features with more detailed notes
      const aScore = (a.notes || '').length
      const bScore = (b.notes || '').length
      return bScore - aScore
    })
    .slice(0, Math.max(3, Math.floor(context.connectedFeatures.length / 2)))

  return {
    ...context,
    connectedFeatures: prioritizedFeatures,
    dependencies: {
      incoming: context.dependencies.incoming.filter(f => 
        prioritizedFeatures.some(pf => pf.id === f.id)
      ),
      outgoing: context.dependencies.outgoing.filter(f => 
        prioritizedFeatures.some(pf => pf.id === f.id)
      ),
    },
    totalTokenEstimate: estimateTokenCount({
      project: context.project,
      targetFeature: context.targetFeature,
      connectedFeatures: prioritizedFeatures,
    }),
  }
}