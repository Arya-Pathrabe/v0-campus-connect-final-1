import { GoogleGenerativeAI } from "@google/generative-ai"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { message, chatHistory } = await request.json()

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Invalid message" }, { status: 400 })
    }

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "Google API key is not configured. Please add GOOGLE_GENERATIVE_AI_API_KEY to your environment variables.",
        },
        { status: 500 },
      )
    }

    const client = new GoogleGenerativeAI(apiKey)
    const model = client.getGenerativeModel({ model: "gemini-2.0-flash" })

    // Build conversation history for context
    const conversationHistory = (chatHistory || []).slice(-10).map((msg: any) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content || "" }],
    }))

    // System prompt for academic assistant
    const systemPrompt = `You are a helpful and knowledgeable academic AI assistant for Suryodaya College of Engineering & Technology. Your role is to:

1. Help students with academic questions across various subjects (programming, mathematics, engineering, etc.)
2. Provide clear, comprehensive explanations with practical examples
3. Suggest study strategies and learning resources
4. Break down complex concepts into understandable parts
5. Encourage critical thinking and problem-solving

Guidelines:
- Be encouraging and supportive
- Use clear language appropriate for engineering students
- Provide step-by-step explanations when solving problems
- Suggest practical applications of concepts
- If asked about non-academic topics, politely redirect to academic help
- Always maintain a professional and helpful tone

Remember to provide detailed, well-structured responses that help students learn effectively.`

    const chat = model.startChat({
      history: conversationHistory,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2000,
      },
    })

    const result = await chat.sendMessage(message)
    const text = result.response.text()

    return NextResponse.json({ response: text })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json(
      { error: "Failed to generate response. Please ensure your Google API key is valid and configured." },
      { status: 500 },
    )
  }
}
