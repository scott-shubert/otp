import express from 'express'
import { Server } from 'socket.io'
import { createServer } from 'node:http'
import testData from '../sample data/sampleTrivia.json'

const app = express()
const port = 3000
const server = createServer(app)
const rounds = getRounds(testData)
let currentRound = 0
const io = new Server(server, {
	cors: {
		origin: '*',
		methods: ['GET', 'POST'],
	},
})

io.on('connection', (socket) => {
	console.log('a user connected: ', socket.id)

	socket.on('submit answers', (msg: any) => {
		msg.forEach((q: any) => {
			console.log('questionid: ', q.id)
			q.responses.forEach((r: any) => console.log(r))
		})
	})

	socket.on('change round', (value: number) => {
		const newRound = currentRound + value
		if (newRound >= 0 && newRound < rounds.length) {
			currentRound = newRound
			io.emit('set round', rounds[newRound])
		}
	})

	socket.on('disconnect', () => {
		console.log('user disconnected')
	})
})

server.listen(port, () => {
	console.log(`Server is running on port ${port}`)
})

function getRounds(data: any): Round[] {
	const result: Round[] = []

	data.rounds.forEach((round: Round) => {
		const uiRound: Round = {
			name: round.name,
			id: round.id,
			description: round.description,
			questions: [],
		}

		round.questions.forEach((q: any) => {
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

export interface Round {
	id: string
	name: string
	description: string
	questions: Question[]
}

export interface Question {
	id: string
	question: string
	imageUrl: string
	videoUrl: string
	answerSlots: number
	isBonus: boolean
}
