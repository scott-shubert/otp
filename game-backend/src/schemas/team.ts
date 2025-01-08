import mongoose, { Schema } from 'mongoose'

const QuestionSubmissionSchema = new mongoose.Schema({
	questionId: String,
	points: Number,
	answers: [String],
	correct: [Boolean],
})

const SubmissionSchema = new mongoose.Schema({
	roundId: Number,
	questions: [QuestionSubmissionSchema],
})

const TeamSchema = new mongoose.Schema({
	sessionId: String,
	gameId: Schema.Types.ObjectId,
	name: String,
	nameLowerCase: String,
	score: Number,
	submissions: [SubmissionSchema],
})

export const Team = mongoose.model('Team', TeamSchema)
export const Submission = mongoose.model('Submission', SubmissionSchema)
