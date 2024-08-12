import { socket } from './socket'
import { useEffect } from 'react'

function App() {
  const handleNextRound = () => {
    socket.emit('change round', 1)
  }

  const handlePreviousRound = () => {
    socket.emit('change round', -1)
  }

  useEffect(() => {
    socket.connect()

    return () => {
      socket.disconnect()
    }
  }, [])

  return (
    <>
      Admin UI Goes Here
      <div>
        <button onClick={handleNextRound} className="border border-black p-1">
          Next Round
        </button>
      </div>
      <div>
        <button
          onClick={handlePreviousRound}
          className="border border-black p-1"
        >
          Previous Round
        </button>
      </div>
    </>
  )
}

export default App
