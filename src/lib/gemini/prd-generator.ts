import { decryptApiKey } from '@/lib/gemini'
import type { PrdContext } from '@/lib/graph/context-builder'
import { GeminiService } from '@/lib/services/GeminiService'

/**
 * Clean up markdown content by removing wrapper code fences
 */
function cleanMarkdownContent(content: string): string {
  if (!content) return content

  const trimmed = content.trim()

  // Debug: Log the first 100 characters to understand the pattern
  console.log('\n\n\nCleaning markdown content\n\n\n')
  console.log('First 40 chars:', JSON.stringify(trimmed.substring(0, 40)))
  console.log('Last 40 chars:', JSON.stringify(trimmed.substring(-40)))
  console.log('\n\n\nCleaning markdown done\n\n\n')

  // Pattern 1: Handle content that starts with ``` and ends with ```
  // This covers: ```\n...content...\n``` and ```markdown\n...content...\n```
  if (trimmed.startsWith('```') && trimmed.endsWith('```')) {
    console.log('Matched Pattern 1: Complete code block')
    // Find the first newline after the opening ```
    const firstNewline = trimmed.indexOf('\n')
    if (firstNewline !== -1) {
      // Remove the opening ``` line (with optional language specifier) and closing ``` line
      const withoutOpening = trimmed.substring(firstNewline + 1)
      const lastBackticks = withoutOpening.lastIndexOf('\n```')
      if (lastBackticks !== -1) {
        const cleaned = withoutOpening.substring(0, lastBackticks).trim()
        console.log(
          'Pattern 1 result, first 100 chars:',
          JSON.stringify(cleaned.substring(0, 100))
        )
        return cleaned
      }
    }
  }

  // Pattern 2: Handle content that starts with ``` followed by newlines
  // This covers cases where AI generates: ```\n\n# Title\n...content...
  if (trimmed.startsWith('```\n')) {
    console.log('Matched Pattern 2: Opening with newlines')
    // Find where the actual content starts (after ``` and any newlines)
    let startIndex = 3 // Skip ```
    while (startIndex < trimmed.length && trimmed[startIndex] === '\n') {
      startIndex++
    }
    let cleaned = trimmed.substring(startIndex).trim()

    // Check if there's another nested code fence (```markdown or similar)
    if (cleaned.startsWith('```')) {
      console.log('Found nested code fence, cleaning recursively')
      cleaned = cleanMarkdownContent(cleaned) // Recursive call to handle nested fences
    }

    console.log('Pattern 2 result, first 100 chars:', JSON.stringify(cleaned.substring(0, 100)))
    return cleaned
  }

  // Pattern 3: Handle content that starts with ``` followed by content on same line
  // This covers: ```# Title\n...content... or ```markdown\n...content...
  if (trimmed.startsWith('```') && !trimmed.includes('\n```')) {
    console.log('Matched Pattern 3: Opening without closing')
    let cleaned = trimmed.substring(3) // Remove ```
    
    // If it starts with a language specifier (like "markdown\n"), remove it
    const languageMatch = cleaned.match(/^(markdown|md|text)?\s*\n/)
    if (languageMatch) {
      cleaned = cleaned.substring(languageMatch[0].length)
    }
    
    cleaned = cleaned.trim()
    console.log('Pattern 3 result, first 100 chars:', JSON.stringify(cleaned.substring(0, 100)))
    return cleaned
  }

  // Pattern 4: Use regex for complex patterns with optional language specifiers
  // Handles: \n\n```markdown\n ... \n``` or similar variations
  const codeBlockPattern =
    /^\s*```(?:markdown|md)?\s*\n([\s\S]*?)(?:\n```\s*)?$/
  const match = trimmed.match(codeBlockPattern)
  if (match) {
    console.log('Matched Pattern 4: Regex pattern')
    const cleaned = match[1].trim()
    console.log(
      'Pattern 4 result, first 100 chars:',
      JSON.stringify(cleaned.substring(0, 100))
    )
    return cleaned
  }

  console.log('No pattern matched, returning original content')
  return content
}

export interface PrdGenerationResult {
  summary: string
  prdMarkdown: string
  prdJson: {
    title: string
    executiveSummary: string
    problemStatement: string
    successMetrics: string[]
    technicalRequirements: string[]
    dependencies: string[]
    implementationTimeline: string
    estimatedEffort: string
  }
  modelUsed: string
  tokenCount: number
}

export async function generatePrd(
  context: PrdContext,
  encryptedApiKey: string
): Promise<PrdGenerationResult> {
  try {
    // Decrypt the API key
    const apiKey = decryptApiKey(encryptedApiKey)

    // Create Gemini service instance
    const geminiService = new GeminiService(apiKey)

    // Build the structured prompt
    const prompt = buildPrdPrompt(context)

    // Add prompt to service and generate content
    geminiService.addUserPrompt(prompt)
    const response = await geminiService.generateContent()

    // Parse and structure the response
    return parsePrdResponse(response, context)
  } catch (error) {
    console.error('PRD generation failed:', error)
    throw new Error(
      error instanceof Error ? error.message : 'Failed to generate PRD'
    )
  }
}

function buildPrdPrompt(context: PrdContext): string {
  const { project, targetFeature, connectedFeatures, dependencies } = context

  const connectedFeaturesText =
    connectedFeatures.length > 0
      ? connectedFeatures
          .map((f) => `- ${f.title}${f.notes ? `: ${f.notes}` : ''}`)
          .join('\n')
      : 'None (isolated feature)'

  const incomingDepsText =
    dependencies.incoming.length > 0
      ? dependencies.incoming.map((f) => `- ${f.title}`).join('\n')
      : 'None'

  const outgoingDepsText =
    dependencies.outgoing.length > 0
      ? dependencies.outgoing.map((f) => `- ${f.title}`).join('\n')
      : 'None'

  return `
    You are a senior product manager tasked with creating a comprehensive Product Requirements Document (PRD).

    PROJECT CONTEXT:
    Project: ${project.name}
    Description: ${project.description}

    TARGET FEATURE:
    Feature: ${targetFeature.title}
    Notes: ${targetFeature.notes || 'No additional notes provided'}

    CONNECTED FEATURES:
    ${connectedFeaturesText}

    DEPENDENCIES:
    Features that depend on this feature:
    ${incomingDepsText}

    Features this feature depends on:
    ${outgoingDepsText}

    TASK:
    Generate a comprehensive PRD for the target feature "${targetFeature.title}" that includes:

    1. **Executive Summary** (2-3 sentences)
    2. **Problem Statement** (What problem does this feature solve?)
    3. **Success Metrics** (3-5 measurable KPIs)
    4. **Technical Requirements** (5-8 specific technical needs)
    5. **Dependencies** (Based on the connected features above)
    6. **Implementation Timeline** (Realistic phases and milestones)
    7. **Estimated Effort** (Development time estimate)

    FORMAT YOUR RESPONSE AS JSON:
    {
      "summary": "Brief 1-2 sentence overview",
      "executiveSummary": "2-3 sentence executive summary",
      "problemStatement": "Detailed problem statement",
      "successMetrics": ["metric1", "metric2", "metric3"],
      "technicalRequirements": ["req1", "req2", "req3"],
      "dependencies": ["dep1", "dep2"],
      "implementationTimeline": "Detailed timeline with phases",
      "estimatedEffort": "Time estimate with reasoning"
    }

    Then provide the full PRD in professional Markdown format after the JSON.

    IMPORTANT:
    - Be specific and actionable
    - Reference connected features where relevant
    - Consider the project context in all recommendations
    - Use professional product management language
    - Ensure all sections are comprehensive but concise
  `
}

function parsePrdResponse(
  response: string,
  context: PrdContext
): PrdGenerationResult {
  try {
    // Extract JSON from response (should be at the beginning)
    // Use a more robust approach to find the complete JSON object
    const jsonStart = response.indexOf('{')
    if (jsonStart === -1) {
      console.error('No JSON found in response. Response preview:', response.substring(0, 500))
      throw new Error('No JSON found in response')
    }

    // Find the matching closing brace
    let braceCount = 0
    let jsonEnd = jsonStart
    for (let i = jsonStart; i < response.length; i++) {
      if (response[i] === '{') braceCount++
      if (response[i] === '}') braceCount--
      if (braceCount === 0) {
        jsonEnd = i
        break
      }
    }

    if (braceCount !== 0) {
      console.error('Incomplete JSON found in response. Response preview:', response.substring(0, 500))
      throw new Error('Incomplete JSON found in response')
    }

    const jsonStr = response.substring(jsonStart, jsonEnd + 1)
    console.log('Extracted JSON string:', jsonStr)
    
    let prdJson: any
    try {
      prdJson = JSON.parse(jsonStr)
    } catch (parseError) {
      console.error('JSON parse error:', parseError)
      console.error('Problematic JSON string:', jsonStr)
      throw new Error(`Invalid JSON format: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`)
    }

    // Validate required fields
    const requiredFields = [
      'summary',
      'executiveSummary',
      'problemStatement',
      'successMetrics',
      'technicalRequirements',
      'dependencies',
      'implementationTimeline',
      'estimatedEffort',
    ]
    for (const field of requiredFields) {
      if (!prdJson[field]) {
        throw new Error(`Missing required field: ${field}`)
      }
    }

    // Extract markdown (everything after the JSON)
    const markdownStart = response.indexOf(jsonStr) + jsonStr.length
    let prdMarkdown = response.substring(markdownStart).trim()

    // Clean up markdown content by removing wrapper code fences
    prdMarkdown = cleanMarkdownContent(prdMarkdown)

    // If no markdown found after JSON, generate it from JSON
    if (!prdMarkdown || prdMarkdown.length < 100) {
      prdMarkdown = generateMarkdownFromJson(prdJson, context)
    }

    // Estimate token count (rough approximation)
    const tokenCount = Math.ceil(response.length / 4)

    return {
      summary: prdJson.summary,
      prdMarkdown,
      prdJson: {
        title: context.targetFeature.title,
        ...prdJson,
      },
      modelUsed: 'gemini-2.0-flash',
      tokenCount,
    }
  } catch (error) {
    console.error('Failed to parse PRD response:', error)
    throw new Error('Failed to parse AI response into structured PRD')
  }
}

function generateMarkdownFromJson(
  prdJson: {
    executiveSummary: string
    problemStatement: string
    successMetrics: string[]
    technicalRequirements: string[]
    dependencies: string[]
    implementationTimeline: string
    estimatedEffort: string
  },
  context: PrdContext
): string {
  return `# PRD: ${context.targetFeature.title}

## Executive Summary
${prdJson.executiveSummary}

## Problem Statement
${prdJson.problemStatement}

## Success Metrics
${prdJson.successMetrics.map((metric: string) => `- ${metric}`).join('\n')}

## Technical Requirements
${prdJson.technicalRequirements.map((req: string) => `- ${req}`).join('\n')}

## Dependencies
${prdJson.dependencies.map((dep: string) => `- ${dep}`).join('\n')}

## Implementation Timeline
${prdJson.implementationTimeline}

## Estimated Effort
${prdJson.estimatedEffort}

---
*Generated by codeWinter AI on ${new Date().toISOString().split('T')[0]}*`
}
