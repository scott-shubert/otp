import QuestionDisplay, { Question } from './QuestionDisplay'

export default function RoundDisplay({ data }: { data: Round | undefined }) {
  return (
    <div>
      {data && (
        <>
          <div>{data.name}</div>
          <div>{data.description}</div>
          <div>
            {data.questions &&
              data.questions.map((question) => {
                return <QuestionDisplay data={question} />
              })}
          </div>
        </>
      )}
    </div>
  )
}

export interface Round {
  id: string
  name: string
  description: string
  questions: Question[]
}
