import { Router } from 'express'
import { body, matchedData, validationResult } from 'express-validator'
import { gradeSubmission } from '../utils/gradingService'
import { Team, Submission } from '../schemas/team'

const router = Router()

router.get('/team-name', async (request, response) => {
	if (request.session.teamName) {
		try {
			const existingTeamName = await Team.findOne({
				nameLowerCase: request.session.teamName.toLowerCase(),
			})
			if (
				existingTeamName &&
				existingTeamName.name === request.session.teamName
			) {
				return response.status(200).send({ teamName: request.session.teamName })
			} else {
				return response.status(400).json({ error: 'Session info missmatch.' })
			}
		} catch (error) {
			return response.status(400).json({ error: "Can't verify team name." })
		}
	}
	response.status(200).send({ teamName: '' })
})

router.post(
	'/team-name',
	body('teamName')
		.trim()
		.isLength({ min: 1, max: 25 })
		.isAlphanumeric('en-US', { ignore: ' ' }),
	async (request, response) => {
		const errors = validationResult(request)

		if (!errors.isEmpty()) {
			return response.status(400).json({ error: 'Invalid team name.' })
		}
		if (request.session.teamName) {
			return response.status(400).json({ error: "Can't change team name." })
		}

		const { teamName } = matchedData(request)

		try {
			const existingTeamName = await Team.findOne({
				nameLowerCase: teamName.toLowerCase(),
			})
			if (existingTeamName)
				return response
					.status(400)
					.json({ error: 'Team names must be unique.' })

			const teamSchema = new Team({
				sessionId: request.sessionID,
				name: teamName,
				nameLowerCase: teamName.toLowerCase(),
			})
			await teamSchema.save()
			request.session.teamName = teamName
			return response.status(200).send({ teamName })
		} catch (error) {
			return response.status(500).json({ error: 'Problem saving team name.' })
		}
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
	async (request, response) => {
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

		const team = await Team.findOne({ sessionId: request.sessionID })

		if (!team) {
			return response.status(400).json({ error: 'Team not found.' })
		}

		const submission = new Submission(gradeSubmission(answers))

		team.submissions = team.submissions.filter(
			(round) => round.roundId !== submission.roundId
		)

		team.submissions.push(submission)

		try {
			await team.save()
			return response.status(200).send()
		} catch (error) {
			console.error(`Error saving submission for team ${team.name}: `, error)
			return response.status(500).json({ error: 'Problem saving submission.' })
		}
	}
)

export default router
