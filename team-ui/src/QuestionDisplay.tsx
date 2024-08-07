export default function QuestionDisplay({
  data,
  setAnswers,
}: {
  data: Question
  setAnswers(value: string, subIndex: number): void
}) {
  return (
    <div className="mb-6">
      <div>{data.question}</div>
      <div>
        {new Array(data.answerSlots).fill('').map((value, index) => {
          return (
            <input
              key={data.id + '-' + index}
              className="m-1 border border-black"
              type="text"
              onChange={(event) => {
                setAnswers(event.target.value, index)
              }}
            />
          )
        })}
      </div>
    </div>
  )
}

export interface Question {
  id: string
  question: string
  imageUrl: string
  videoUrl: string
  answerSlots: number
  isBonus: boolean
}
