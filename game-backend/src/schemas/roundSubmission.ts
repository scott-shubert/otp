import mongoose from 'mongoose'

const QuestionSchema = new mongoose.Schema({
	questionId: String,
	points: Number,
	answers: [String],
	correct: [Boolean],
})

const RoundSchema = new mongoose.Schema({
	sessionId: String,
	teamName: String,
	roundId: Number,
	questions: [QuestionSchema],
})

export const Submission = mongoose.model('Submission', RoundSchema)
