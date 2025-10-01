import {
  GoogleGenerativeAI,
  GenerativeModel,
  HarmCategory,
  HarmBlockThreshold,
} from '@google/generative-ai'

interface PromptPart {
  role: 'system' | 'user'
  content: string
}

export class GeminiService {
  private genAI: GoogleGenerativeAI
  private model: GenerativeModel
  private promptParts: PromptPart[] = []

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey)
    this.model = this.genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      },
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
    })
  }

  addSystemInstruction(instruction: string) {
    this.promptParts.push({ role: 'system', content: instruction })
  }

  addUserPrompt(prompt: string) {
    this.promptParts.push({ role: 'user', content: prompt })
  }

  async generateContent(): Promise<string> {
    const fullPrompt = this.promptParts
      .map((part) => `${part.role}: ${part.content}`)
      .join('\n')

    const result = await this.model.generateContent(fullPrompt)
    const response = await result.response
    return response.text()
  }

  clearPrompt() {
    this.promptParts = []
  }
}
