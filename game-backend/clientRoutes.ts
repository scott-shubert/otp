import { Router } from 'express'
import { body, matchedData, validationResult } from 'express-validator'
import { gradeSubmission } from './gradingService'
import { Submission } from './schemas/roundSubmission'

const router = Router()

router.get('/team-name', (request, response) => {
	console.log('get: ', request.sessionID)
	if (request.session.teamName) {
		return response.status(200).send({ teamName: request.session.teamName })
	}
	response.status(200).send({ teamName: '' })
})

router.post(
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
		response.status(200).send({ teamName })
	}
)

router.post(
	'/submission',
	[
		body('answers').isArray({ min: 1, max: 25 }),
		body('answers.*.id').notEmpty(),
		body('answers.*.responses').isArray({ min: 1, max: 25 }),
		body('answers.*.responses.*').trim().isLength({ max: 25 }),
	],
	async (request: any, response: any) => {
		const errors = validationResult(request)

		if (!errors.isEmpty()) {
			return response.status(400).json({ error: 'Invalid request.' })
		}

		if (!request.session.teamName) {
			return response.status(400).json({ error: 'Team name not found.' })
		}

		const { answers } = matchedData(request)

		if (!answers) {
			return response.status(400).json({ error: 'Invalid answer format.' })
		}

		const graddedRound = gradeSubmission(request.session.teamName, answers)
		graddedRound.sessionId = request.sessionID
		const submission = new Submission(graddedRound)

		try {
			await submission.save()
			return response.status(200).send()
		} catch (error) {
			return response.status(500).json({ error: 'Problem saving submission.' })
		}
	}
)

export default router
