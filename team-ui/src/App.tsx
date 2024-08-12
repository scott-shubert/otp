import RoundDisplay, { Answer, Round } from './RoundDisplay'
import { useEffect, useState } from 'react'
import { socket } from './socket'

function App() {
  const [currentRound, setCurrentRound] = useState<Round>()

  useEffect(() => {
    function onSetRound(value: Round) {
      setCurrentRound(value)
    }

    socket.on('set round', onSetRound)
    socket.connect()

    return () => {
      socket.off('set round', onSetRound)
      socket.disconnect()
    }
  }, [])

  const submitAnswers = (answers: Answer[]) => {
    // socket.emit('submit answers', answers)
    console.log('submit...', answers)
  }

  return (
    <>
      <div className="flex justify-center">Team UI goes here.</div>

      <RoundDisplay data={currentRound} submitAnswers={submitAnswers} />
    </>
  )
}

export default App
