import { Router } from 'express'
import { Team } from '../schemas/team'
import { body, matchedData, validationResult } from 'express-validator'

const router = Router()

router.get('/submissions/:teamId', async (request, response) => {
	const { teamId } = request.params
	try {
		const team = await Team.findById(teamId)

		return response.status(200).send({ team })
	} catch (error) {
		console.log(error)
		return response.status(500).json({ error: 'Problem retrieving scores.' })
	}
})

router.put(
	'/submission',
	[
		body('teamId').isString(),
		body('roundId').isNumeric(),
		body('questionId').isString(),
		body('correct').isArray({ min: 1 }),
		body('correct.*').isBoolean(),
	],
	async (request, response) => {
		const errors = validationResult(request)

		if (!errors.isEmpty()) {
			return response.status(400).json({ errors, msg: 'Invalid request.' })
		}

		const updatedGrade = matchedData(request)

		const team = await Team.findById(updatedGrade.teamId)

		if (!team) {
			return response.status(400).json({ error: 'Team not found.' })
		}

		for (const round of team.submissions) {
			if (round.roundId === updatedGrade.roundId) {
				round.questions.map((question) => {
					if (question._id.toString() === updatedGrade.questionId) {
						question.correct = updatedGrade.correct
					}
					return question
				})
			}
		}

		await team.save()

		return response.status(200).send(team)
	}
)

export default router
