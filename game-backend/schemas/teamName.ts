import mongoose from 'mongoose'

const TeamNameSchema = new mongoose.Schema({
	sessionId: String,
	name: String,
	nameLowerCase: String,
})

export const TeamName = mongoose.model('TeamName', TeamNameSchema)
