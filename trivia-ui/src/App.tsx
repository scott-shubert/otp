import RoundDisplay, { Answer, Round } from './RoundDisplay'
import { useEffect, useState } from 'react'
import { socket } from './socket'
import { Question } from './QuestionDisplay'
import axios from 'axios'
import CreateTeam from './CreateTeam'

interface teamName {
  teamName: string
}

function App() {
  const [currentRound, setCurrentRound] = useState<Round>()
  const [questions, setQuestions] = useState<Question[]>([])
  const [justWatching, setJustWatching] = useState(
    JSON.parse(sessionStorage.getItem('justWatching') || 'false'),
  )
  const [teamName, setTeamName] = useState('')

  useEffect(() => {
    axios
      .get<teamName>('http://localhost:3000/team-name', {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.teamName) {
          setTeamName(response.data.teamName)
        }
      })
      .catch((error) => console.log('Error getting team name: ', error))

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

  const handleSetTeamName = (name: string) => {
    axios
      .post(
        'http://localhost:3000/team-name',
        {
          teamName: name,
        },
        { withCredentials: true },
      )
      .then((response) => {
        if (response.data.teamName) {
          setTeamName(response.data.teamName)
        }
      })
      .catch((error) => console.log('Error setting team name: ', error))
  }

  const handleSetJustWatching = (value: boolean) => {
    setJustWatching(value)
    sessionStorage.setItem('justWatching', JSON.stringify(value))
  }

  return (
    <>
      <div className="flex justify-center">Trivia UI goes here.</div>

      <CreateTeam
        teamName={teamName}
        justWatching={justWatching}
        setTeamName={handleSetTeamName}
        setJustWatching={handleSetJustWatching}
      />

      {(teamName.length > 0 || justWatching === true) && (
        <RoundDisplay
          round={currentRound}
          questions={questions}
          justWatching={justWatching}
          submitAnswers={submitAnswers}
        />
      )}
    </>
  )
}

export default App
