import { useEffect, useState } from 'react'
import { socket } from './socket'
import axios from 'axios'
import CreateTeam from './CreateTeam'
import { Answer, Question, Round, teamName } from './utils/classesAndInterfaces'
import RoundDisplay from './RoundDisplay'

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
    axios
      .post(
        'http://localhost:3000/submission',
        { answers },
        { withCredentials: true },
      )
      .then((response) => {
        console.log(response.data)
      })
      .catch((error) => console.log('Error submitting answers: ', error))
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
