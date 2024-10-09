export interface teamName {
  teamName: string
}

export interface Question {
  id: string
  question: string
  imageUrl: string
  videoUrl: string
  answerSlots: number
  isBonus: boolean
}

export interface Round {
  id: string
  name: string
  description: string
  questions: Question[]
  numberOfQuestions: number
}

export class Answer {
  id: string
  responses: string[]

  constructor(id: string, responses: number) {
    this.id = id
    this.responses = new Array<string>(responses).fill('')
  }
}
