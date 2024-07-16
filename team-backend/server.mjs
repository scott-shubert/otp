import express from 'express'
import { Server } from 'socket.io'
import { createServer } from 'node:http'

const app = express()
const port = 3000
const server = createServer(app)
const io = new Server(server, {
	cors: {
		origins: 'http://10.0.0.9:5173/',
		methods: ['GET', 'POST'],
	},
})

app.get('/', (req, res) => {
	res.send('hello world')
})

io.on('connection', (socket) => {
	console.log('a user connected: ', socket.id)
})

server.listen(port, () => {
	console.log(`Server is running on port ${port}`)
})
