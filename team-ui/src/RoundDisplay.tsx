import { useEffect, useState } from 'react'
import QuestionDisplay, { Question } from './QuestionDisplay'

export default function RoundDisplay({
  data,
  submitAnswers,
}: {
  data: Round | undefined
  submitAnswers(answers: Answer[]): void
}) {
  const [answers, setAnswers] = useState<Answer[]>([])

  useEffect(() => {
    setAnswers(buildInitialAnswers())
  }, [data])

  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault()
    submitAnswers(answers)
  }

  const handleChangeAnswer = (
    value: string,
    index: number,
    subIndex: number,
  ): void => {
    const copy = [...answers]
    if (copy[index]) {
      copy[index].responses[subIndex] = value
      setAnswers(copy)
    }
  }

  return (
    <div>
      {data && (
        <form onSubmit={handleSubmit}>
          <div>{data.name}</div>
          <div>{data.description}</div>
          <div className="mt-6">
            {data.questions &&
              data.questions.map((question, index) => {
                return (
                  <div key={'q-' + index}>
                    {question.isBonus ? 'Bouns' : 'Question ' + (index + 1)}:
                    <QuestionDisplay
                      data={question}
                      setAnswers={(value, subIndex) => {
                        handleChangeAnswer(value, index, subIndex)
                      }}
                    />
                  </div>
                )
              })}
          </div>
          <button type="submit" className="border border-black p-1">
            Submit
          </button>
        </form>
      )}
    </div>
  )

  function buildInitialAnswers(): Answer[] {
    if (!data) return []

    const result = new Array<Answer>(data.questions.length)

    data.questions.forEach((question, index) => {
      result[index] = new Answer(question.id, question.answerSlots)
    })

    return result
  }
}

export interface Round {
  id: string
  name: string
  description: string
  questions: Question[]
}

export class Answer {
  id: string
  responses: string[]

  constructor(id: string, responses: number) {
    this.id = id
    this.responses = new Array<string>(responses).fill('')
  }
}
