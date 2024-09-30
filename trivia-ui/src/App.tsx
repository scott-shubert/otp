import RoundDisplay, { Answer, Round } from './RoundDisplay'
import { useEffect, useState } from 'react'
import { socket } from './socket'
import { Question } from './QuestionDisplay'

function App() {
  const [currentRound, setCurrentRound] = useState<Round>()
  const [questions, setQuestions] = useState<Question[]>([])

  useEffect(() => {
    function onSetRound(value: Round) {
      setCurrentRound(value)
      setQuestions([])
    }

    function onSetQuestion(value: Question[]) {
      setQuestions(value)
    }

    socket.on('set round', onSetRound)
    socket.on('set question', onSetQuestion)
    socket.connect()

    return () => {
      socket.off('set round', onSetRound)
      socket.off('set question', onSetQuestion)
      socket.disconnect()
    }
  }, [])

  const submitAnswers = (answers: Answer[]) => {
    socket.emit('submit answers', answers)
  }

  return (
    <>
      <div className="flex justify-center">Team UI goes here.</div>

      <RoundDisplay
        round={currentRound}
        questions={questions}
        submitAnswers={submitAnswers}
      />
    </>
  )
}

export default App
