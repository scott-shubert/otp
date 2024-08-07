import { io } from 'socket.io-client'
import RoundDisplay, { Answer, Round } from './RoundDisplay'
import { useState } from 'react'

function App() {
  const socket = io(import.meta.env.VITE_BACKEND_IP)

  const [currentRound, setCurrentRound] = useState<Round>()

  socket.on('set round', (msg: Round) => {
    setCurrentRound(msg)
  })

  const submitAnswers = (answers: Answer[]) => {
    socket.emit('submit answers', answers)
  }

  return (
    <>
      <div className="flex justify-center">Team UI goes here.</div>

      <RoundDisplay data={currentRound} submitAnswers={submitAnswers} />
    </>
  )
}

export default App
