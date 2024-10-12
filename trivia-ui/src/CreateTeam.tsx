import { useRef } from 'react'

export default function CreateTeam({
  teamName,
  justWatching,
  setTeamName,
  setJustWatching,
}: {
  teamName: string
  justWatching: boolean
  setTeamName: (name: string) => void
  setJustWatching: (value: boolean) => void
}) {
  const name = useRef<HTMLInputElement>(null)

  const handleSetTeamName = () => {
    if (name.current?.value) setTeamName(name.current.value)
  }

  const handleJoinGame = () => {
    setJustWatching(false)
  }

  return (
    <div className="h-12">
      {!justWatching && !teamName && (
        <div>
          <input
            ref={name}
            maxLength={25}
            className="m-1 border border-black"
          />
          <button
            onClick={handleSetTeamName}
            className="border border-black p-1"
          >
            Submit
          </button>
          <button
            onClick={() => setJustWatching(true)}
            className="border border-black p-1"
          >
            Just Watch
          </button>
        </div>
      )}
      {teamName && <div>Team: {teamName}</div>}
      {justWatching && (
        <div>
          Just Watching{' '}
          <button onClick={handleJoinGame} className="border border-black p-1">
            Join Game
          </button>
        </div>
      )}
    </div>
  )
}
