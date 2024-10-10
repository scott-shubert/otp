import { Router } from 'express'
import { body, matchedData, validationResult } from 'express-validator'
import { gradeSubmission } from './gradingService'

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
		console.log('post: ', request.sessionID)
		response.status(200).send({ teamName })
	}
)

router.post(
	'/submission',
	[
		body('answers').isArray({ min: 1 }),
		body('answers.*.id').notEmpty(),
		body('answers.*.responses').isArray({ min: 1 }),
	],
	(request: any, response: any) => {
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

		console.log(request.session.teamName, answers)
		const graddedQuestions = gradeSubmission(request.session.teamName, answers)
		console.log(graddedQuestions)
		graddedQuestions.questions.forEach((q) => console.log(q))
		response.status(200).send()
	}
)

export default router
