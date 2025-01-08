import mongoose from 'mongoose'

const GameSchema = new mongoose.Schema({
	quizId: mongoose.Schema.Types.ObjectId,
	state: {
		round: Number,
		question: Number,
	},
})

export const Game = mongoose.model('Game', GameSchema)
