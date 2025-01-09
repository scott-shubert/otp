import mongoose from 'mongoose'

const QuestionSchema = new mongoose.Schema({
	question: String,
	imageUrl: String,
	videoUrl: String,
	answerSlots: Number,
	validAnswers: [[String]],
	validAnswerDisplay: String,
	answerOrderMatters: Boolean,
	isBonus: Boolean,
	score: {
		correctPoints: Number,
		incorrectPoints: Number,
		allOrNothing: Boolean,
	},
})

const RoundSchema = new mongoose.Schema({
	name: String,
	description: String,
	questions: [QuestionSchema],
})

const QuizSchema = new mongoose.Schema({
	createdBy: String,
	name: String,
	lastModified: String,
	description: String,
	rounds: [RoundSchema],
})

export const Quiz = mongoose.model('Quiz', QuizSchema)
