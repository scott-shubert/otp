import express from 'express'
import { Server } from 'socket.io'
import { createServer } from 'node:http'
import testData from '../sample data/sampleTrivia.json' assert { type: 'json' }

const app = express()
const port = 3000
const server = createServer(app)
const rounds = getRounds(testData)
const io = new Server(server, {
	cors: {
		origins: 'http://localhost:5173/',
		methods: ['GET', 'POST'],
	},
})

app.get('/set-round/:id', (req, res) => {
	io.emit('set-round', rounds[req.params.id])
	res.send('hello world')
})

io.on('connection', (socket) => {
	console.log('a user connected: ', socket.id)

	socket.on('chat message', (msg) => {
		console.log('message: ' + msg)
	})
})

server.listen(port, () => {
	console.log(`Server is running on port ${port}`)
})

function getRounds(data) {
	const result = []

	data.rounds.forEach((round) => {
		const uiRound = {
			name: round.name,
			id: round.id,
			description: round.description,
			questions: [],
		}

		round.questions.forEach((q) => {
			uiRound.questions.push({
				id: q.id,
				question: q.question,
				imageUrl: q.imageUrl,
				videoUrl: q.videoUrl,
				answerSlots: q.answerSlots,
				isBonus: q.isBonus,
			})
		})

		result.push(uiRound)
	})

	return result
}
