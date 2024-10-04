import { useEffect, useState } from 'react'
import { Answer, Question, Round } from './utils/classesAndInterfaces'
import QuestionDisplay from './QuestionDisplay'

export default function RoundDisplay({
  round,
  questions,
  justWatching,
  submitAnswers,
}: {
  round: Round | undefined
  questions: Question[]
  justWatching: boolean
  submitAnswers(answers: Answer[]): void
}) {
  const [answers, setAnswers] = useState<Answer[]>([])

  useEffect(() => {
    updateAnswerState()
  }, [questions])

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
      {round && (
        <form onSubmit={handleSubmit}>
          <div>{round.name}</div>
          <div>{round.description}</div>
          <div className="mt-6">
            {questions &&
              questions.map((question, index) => {
                return (
                  <div key={question.id}>
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
          {questions.length === round.numberOfQuestions &&
            questions.length > 0 &&
            !justWatching && (
              <button type="submit" className="border border-black p-1">
                Submit
              </button>
            )}
        </form>
      )}
    </div>
  )

  function updateAnswerState() {
    if (!questions || questions.length === 0) {
      setAnswers([])
      return
    }

    const copy = [...answers]
    if (questions.length > answers.length) {
      const newQ = questions[questions.length - 1]
      copy.push(new Answer(newQ.id, newQ.answerSlots))
      setAnswers(copy)
    } else {
      copy.pop()
      setAnswers(copy)
    }
  }
}
