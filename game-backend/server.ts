import express from 'express'
import { Server } from 'socket.io'
import { createServer } from 'node:http'
import testData from '../sample data/sampleTrivia.json'
import { RoundService } from './roundService'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import cors from 'cors'
import { body, matchedData, validationResult } from 'express-validator'

declare module 'express-session' {
	export interface SessionData {
		teamName: string
	}
}
const secret = 'super secret password'
const sessionMiddleware = session({
	secret: secret,
	resave: false,
	saveUninitialized: false,
	cookie: {
		maxAge: 60000 * 60 * 6,
		sameSite: 'lax',
	},
})
const app = express()
const port = 3000

app.use(
	cors({
		credentials: true,
		origin: ['http://localhost:5173', 'http://localhost:5174'],
	})
)
app.use(express.json())
app.use(sessionMiddleware)
app.use(cookieParser(secret))
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
		console.log(msg)
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

app.get('/team-name', (request, response) => {
	console.log('get: ', request.sessionID)
	if (request.session.teamName) {
		return response.status(200).send({ teamName: request.session.teamName })
	}
	response.status(200).send({ teamName: '' })
})

app.post(
	'/team-name',
	body('teamName')
		.trim()
		.isLength({ min: 1, max: 25 })
		.isAlphanumeric('en-US', { ignore: ' ' }),
	(request, response) => {
		const errors = validationResult(request)

		if (!errors.isEmpty()) {
			return response.status(400).json({ error: 'Invalid team name.' })
		}
		if (request.session.teamName) {
			return response.status(400).json({ error: "Can't change team name." })
		}

		const { teamName } = matchedData(request)
		request.session.teamName = teamName
		console.log('post: ', request.sessionID)
		response.status(200).send({ teamName })
	}
)

server.listen(port, () => {
	console.log(`Server is running on port ${port}`)
})
