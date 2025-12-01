import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface EvaluationResult {
  score: number
  strengths: string[]
  weaknesses: string[]
  improvements: string[]
  full_report: string
}

export async function evaluateTask(
  title: string,
  description: string,
  code?: string
): Promise<EvaluationResult> {
  const prompt = `
You are an expert code reviewer and software engineering mentor. Evaluate the following coding task:

Title: ${title}
Description: ${description}
${code ? `Code:\n\`\`\`\n${code}\n\`\`\`` : 'No code provided - evaluate the task description and provide guidance.'}

Please provide a comprehensive evaluation in the following JSON format:
{
  "score": <number between 0-100>,
  "strengths": [<array of strength points>],
  "weaknesses": [<array of weakness points>],
  "improvements": [<array of specific improvement suggestions>],
  "full_report": "<detailed analysis covering code quality, best practices, performance, security, maintainability, and learning recommendations>"
}

Evaluation criteria:
- Code correctness and functionality
- Code quality and readability
- Best practices and conventions
- Performance considerations
- Security aspects
- Error handling
- Documentation and comments
- Maintainability and scalability

If no code is provided, focus on:
- Task clarity and requirements
- Suggested approach and architecture
- Best practices for implementation
- Potential challenges and solutions
- Learning resources and next steps

Provide constructive, actionable feedback that helps the developer improve.
`

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert code reviewer. Always respond with valid JSON only.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error('No response from OpenAI')
    }

    // Parse the JSON response
    const evaluation = JSON.parse(content) as EvaluationResult
    
    // Validate the response structure
    if (typeof evaluation.score !== 'number' || 
        !Array.isArray(evaluation.strengths) ||
        !Array.isArray(evaluation.weaknesses) ||
        !Array.isArray(evaluation.improvements) ||
        typeof evaluation.full_report !== 'string') {
      throw new Error('Invalid response format from AI')
    }

    return evaluation
  } catch (error) {
    console.error('Error evaluating task:', error)
    
    // Fallback evaluation if AI fails
    return {
      score: 50,
      strengths: ['Task submitted successfully'],
      weaknesses: ['Unable to perform detailed analysis due to technical issues'],
      improvements: ['Please try submitting again', 'Ensure code is properly formatted'],
      full_report: 'Technical evaluation temporarily unavailable. Please try again later.'
    }
  }
}