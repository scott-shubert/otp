import { RoundService } from './roundService'
import { Server } from 'socket.io'

export default function setupWebsockets(server: any) {
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
}
