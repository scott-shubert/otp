import { Router } from 'express'
import { Quiz } from '../schemas/quiz'
import { body, matchedData, validationResult } from 'express-validator'

const router = Router()

const validators = [
	body('createdBy').isString(),
	body('lastModified').isString(),
	body('name').isString(),
	body('description').isString(),
	body('rounds').isArray({ min: 1, max: 25 }),
	body('rounds.*.name').isString(),
	body('rounds.*.description').isString(),
	body('rounds.*.questions').isArray({ min: 1, max: 25 }),
	body('rounds.*.questions.*.question').isString(),
	body('rounds.*.questions.*.imageUrl').isString(),
	body('rounds.*.questions.*.videoUrl').isString(),
	body('rounds.*.questions.*.validAnswerDisplay').isString(),
	body('rounds.*.questions.*.answerSlots').isNumeric(),
	body('rounds.*.questions.*.answerOrderMatters').isBoolean(),
	body('rounds.*.questions.*.isBonus').isBoolean(),
	body('rounds.*.questions.*.score.allOrNothing').isBoolean(),
	body('rounds.*.questions.*.score.correctPoints').isNumeric(),
	body('rounds.*.questions.*.score.incorrectPoints').isNumeric(),
]

router.post('/quiz', validators, async (request, response) => {
	try {
		const errors = validationResult(request)

		if (!errors.isEmpty()) {
			return response.status(400).json({ error: 'Invalid request.' })
		}

		const quiz = new Quiz(matchedData(request))

		await quiz.save()

		return response.status(200).send({ quiz })
	} catch (error) {
		console.error(error)
		return response.status(500).json({ error: 'Problem saving quiz.' })
	}
})

export default router
