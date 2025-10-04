import { decryptApiKey } from '@/lib/gemini'
import { GeminiService } from '@/lib/services/GeminiService'

const FEATURE_COUNT_DEFAULT = 5

export interface GeneratedFeature {
  title: string
  summary?: string
}

interface GenerateFeaturesInput {
  projectName: string
  projectDescription: string
  encryptedApiKey: string
  count?: number
}

export async function generateProjectFeatures({
  projectName,
  projectDescription,
  encryptedApiKey,
  count = FEATURE_COUNT_DEFAULT,
}: GenerateFeaturesInput): Promise<GeneratedFeature[]> {
  try {
    const apiKey = decryptApiKey(encryptedApiKey)
    const geminiService = new GeminiService(apiKey)

    geminiService.addSystemInstruction(
      'You are a senior product manager helping founders brainstorm product features. You respond with structured JSON and never include markdown fences.'
    )

    geminiService.addUserPrompt(
      buildFeaturePrompt({
        projectName,
        projectDescription,
        count,
      })
    )

    const response = await geminiService.generateContent()
    return parseFeatureResponse(response, count)
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to generate features'
    throw new Error(message)
  }
}

function buildFeaturePrompt({
  projectName,
  projectDescription,
  count,
}: {
  projectName: string
  projectDescription: string
  count: number
}) {
  return `Project name: ${projectName}\nProject description: ${projectDescription}\n\nGenerate exactly ${count} distinct product features for this project. Each feature should be concise, action-oriented, and avoid duplicates.\n\nRespond in valid JSON with the following shape:\n{\n  "features": [\n    { "title": "string", "summary": "string (one sentence)" }\n  ]\n}\n\nRules:\n- Titles must be between 3 and 80 characters.\n- Summaries must be under 160 characters and optional.\n- Do not include any text outside the JSON.`
}

function parseFeatureResponse(response: string, expectedCount: number) {
  const jsonText = extractJson(response)

  if (!jsonText) {
    throw new Error('AI response did not include JSON output')
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(jsonText)
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : 'Unable to parse AI response'
    )
  }

  if (!parsed || typeof parsed !== 'object' || !('features' in parsed)) {
    throw new Error('AI response is missing "features" data')
  }

  const { features } = parsed as { features: unknown }

  if (!Array.isArray(features)) {
    throw new Error('AI response provided an invalid features list')
  }

  const normalized = features
    .map((item) => normalizeFeature(item))
    .filter((item): item is GeneratedFeature => Boolean(item))
    .slice(0, expectedCount)

  if (normalized.length < expectedCount) {
    throw new Error('AI returned fewer features than requested')
  }

  return normalized
}

function normalizeFeature(input: unknown): GeneratedFeature | null {
  if (!input || typeof input !== 'object') return null

  const title = 'title' in input ? String((input as { title: unknown }).title) : ''
  const summary =
    'summary' in input ? String((input as { summary?: unknown }).summary ?? '') : ''

  const trimmedTitle = title.trim()
  const trimmedSummary = summary.trim()

  if (trimmedTitle.length < 3 || trimmedTitle.length > 120) {
    return null
  }

  return {
    title: trimmedTitle,
    ...(trimmedSummary ? { summary: trimmedSummary } : {}),
  }
}

function extractJson(response: string) {
  if (!response) return null

  const start = response.indexOf('{')
  if (start === -1) return null

  let depth = 0
  for (let i = start; i < response.length; i++) {
    const char = response[i]
    if (char === '{') depth += 1
    if (char === '}') {
      depth -= 1
      if (depth === 0) {
        return response.slice(start, i + 1)
      }
    }
  }

  return null
}
