import { Question } from './utils/classesAndInterfaces'

export default function QuestionDisplay({
  data,
  setAnswers,
}: {
  data: Question
  setAnswers(value: string, subIndex: number): void
}) {
  return (
    <div className="mb-6">
      {data.imageUrl && <img className="max-h-80" src={data.imageUrl} />}
      {data.videoUrl && (
        <iframe
          width="560"
          height="315"
          src={data.videoUrl}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        ></iframe>
      )}
      <div>{data.question}</div>
      <div>
        {new Array(data.answerSlots).fill('').map((value, index) => {
          return (
            <input
              key={data.id + '-' + index}
              className="m-1 border border-black"
              type="text"
              maxLength={25}
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
