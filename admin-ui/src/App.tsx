import { socket } from './socket'
import { useEffect } from 'react'

function App() {
  const handleChangeRound = (value: number) => {
    socket.emit('change round', value)
  }

  const handleChangeQuestion = (value: number) => {
    socket.emit('change question', value)
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
        <button
          onClick={() => handleChangeRound(1)}
          className="border border-black p-1"
        >
          Next Round
        </button>
      </div>
      <div>
        <button
          onClick={() => handleChangeRound(-1)}
          className="border border-black p-1"
        >
          Previous Round
        </button>
      </div>
      <div>
        <button
          className="border border-black p-1"
          onClick={() => handleChangeQuestion(1)}
        >
          Next Question
        </button>
      </div>
      <div>
        <button
          className="border border-black p-1"
          onClick={() => handleChangeQuestion(-1)}
        >
          Previous Question
        </button>
      </div>
    </>
  )
}

export default App
