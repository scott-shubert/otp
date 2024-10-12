import express from 'express'
import { createServer } from 'node:http'
import testData from '../../sample data/sampleTrivia.json'
import { RoundService } from './utils/roundService'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import cors from 'cors'
import clientRouter from './routes/clientRoutes'
import setupWebsockets from './routes/websockets'
import mongoose from 'mongoose'
import MongoStore = require('connect-mongo')

declare module 'express-session' {
	export interface SessionData {
		teamName: string
	}
}
mongoose
	.connect('mongodb://localhost:27017/otp', {
		authSource: 'admin',
		user: 'admin',
		pass: 'PasswordForOTP',
	})
	.then(() => console.log('Connected to DB'))
	.catch((error) => console.log('Error connecting to DB: ', error))

const secret = 'super secret password'
const sessionMiddleware = session({
	secret: secret,
	resave: false,
	saveUninitialized: false,
	cookie: {
		maxAge: 60000 * 60 * 6,
		sameSite: 'lax',
	},
	store: MongoStore.create({
		client: mongoose.connection.getClient(),
	}),
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
