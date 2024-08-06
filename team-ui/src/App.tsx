import { io } from 'socket.io-client'
import RoundDisplay, { Round } from './RoundDisplay'
import { useState } from 'react'

function App() {
  const socket = io(import.meta.env.VITE_BACKEND_IP)

  const [currentRound, setCurrentRound] = useState<Round>()

  socket.on('set-round', (msg: Round) => {
    setCurrentRound(msg)
  })

  return (
    <>
      <div className="flex justify-center">Team UI goes here.</div>
      <button
        onClick={() => {
          console.log('what')
          socket.emit('chat message', 'testing123')
        }}
      >
        click me
      </button>

      <RoundDisplay data={currentRound} />
    </>
  )
}

export default App
