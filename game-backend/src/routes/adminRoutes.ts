import { Router } from 'express'
import { Submission } from '../schemas/roundSubmission'
import { body, matchedData, validationResult } from 'express-validator'

const router = Router()

router.get('/submissions/:round', async (request, response) => {
	const { round } = request.params
	try {
		const submissions = await Submission.where('roundId').equals(round)

		return response.status(200).send({ submissions })
	} catch (error) {
		console.log(error)
		return response.status(500).json({ error: 'Problem retrieving scores.' })
	}
})

router.put(
	'/submission',
	[
		body('_id').isString(),
		body('question._id').isString(),
		body('question.correct').isArray({ min: 1 }),
		body('question.correct.*').isBoolean(),
	],
	async (request, response) => {
		const errors = validationResult(request)

		if (!errors.isEmpty()) {
			return response.status(400).json({ error: 'Invalid request.' })
		}

		const updatedGrade = matchedData(request)

		const submission = await Submission.findById(updatedGrade._id)

		if (!submission)
			return response.status(400).json({ error: 'Invalid request.' })

		submission.questions.map((question) => {
			if (question._id.toString() === updatedGrade.question._id) {
				question.correct = updatedGrade.question.correct
			}
			return question
		})

		await submission.save()

		return response.status(200).send(submission)
	}
)

export default router
