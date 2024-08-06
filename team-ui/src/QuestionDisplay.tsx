export default function QuestionDisplay({ data }: { data: Question }) {
  return <div>{data.question}</div>
}

export interface Question {
  id: string
  question: string
  imageUrl: string
  videoUrl: string
  answerSlots: number
  isBonus: boolean
}
