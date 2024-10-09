import express from 'express'
import { createServer } from 'node:http'
import testData from '../sample data/sampleTrivia.json'
import { RoundService } from './roundService'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import cors from 'cors'
import clientRouter from './clientRoutes'
import setupWebsockets from './websockets'

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
app.use(clientRouter)

RoundService.setRounds(testData)

const server = createServer(app)

setupWebsockets(server)

server.listen(port, () => {
	console.log(`Server is running on port ${port}`)
})
