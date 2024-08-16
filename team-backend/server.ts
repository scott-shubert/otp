import express from 'express'
import { Server } from 'socket.io'
import { createServer } from 'node:http'
import testData from '../sample data/sampleTrivia.json'
import { RoundService } from './roundService'

const app = express()
const port = 3000
const server = createServer(app)
RoundService.setRounds(testData)

const io = new Server(server, {
	cors: {
		origin: '*',
		methods: ['GET', 'POST'],
	},
	connectionStateRecovery: {},
})

io.on('connection', (socket) => {
	console.log('a user connected: ', socket.id)
	io.to(socket.id).emit('set round', RoundService.activeRound)
	io.to(socket.id).emit('set question', RoundService.activeQuestions)

	socket.on('submit answers', (msg: any) => {
		msg.forEach((q: any) => {
			console.log('questionid: ', q.id)
			q.responses.forEach((r: any) => console.log(r))
		})
	})

	socket.on('change round', (value: number) => {
		if (RoundService.advanceRoundBy(value)) {
			io.emit('set round', RoundService.activeRound)
		}
	})

	socket.on('change question', (value: number) => {
		if (RoundService.advanceQuestionBy(value)) {
			io.emit('set question', RoundService.activeQuestions)
		}
	})

	socket.on('disconnect', () => {
		console.log('user disconnected')
	})
})

server.listen(port, () => {
	console.log(`Server is running on port ${port}`)
})
