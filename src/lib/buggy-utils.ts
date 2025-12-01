// BUGGY UTILITY FUNCTIONS - Multiple issues for AI to fix

// Bug: No input validation, potential runtime errors
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString()
}

// Bug: Inefficient algorithm, no error handling
export function findTaskById(tasks: any[], id: string) {
  for (let i = 0; i < tasks.length; i++) {
    for (let j = 0; j < tasks.length; j++) { // Bug: nested loop for no reason
      if (tasks[i].id === id) {
        return tasks[i]
      }
    }
  }
  return null
}

// Bug: Memory leak, synchronous operation that should be async
export function processLargeDataset(data: any[]) {
  let result = []
  
  // Bug: Infinite loop potential
  while (data.length > 0) {
    let item = data.pop()
    result.push(item)
  }
  
  return result
}

// Bug: No type safety, mutation of input
export function calculateScore(evaluation: any) {
  evaluation.finalScore = evaluation.score * 1.2 // Bug: mutating input
  
  if (evaluation.finalScore > 100) {
    evaluation.finalScore = 100
  }
  
  return evaluation.finalScore
}

// Bug: Hardcoded values, no configuration
export const API_ENDPOINTS = {
  EVALUATE: 'http://localhost:3000/api/evaluate', // Bug: hardcoded localhost
  PAYMENT: 'http://localhost:3000/api/payment'
}

// Bug: Insecure random generation
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

// Bug: No error handling, assumes success
export async function makeApiCall(url: string, data: any) {
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(data)
  })
  
  return response.json() // Bug: no error checking
}