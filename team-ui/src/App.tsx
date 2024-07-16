import { io } from 'socket.io-client'

function App() {
  const socket = io(import.meta.env.VITE_BACKEND)
  console.log(socket)
  return (
    <>
      <div className="flex justify-center">Team UI goes here.</div>
    </>
  )
}

export default App
