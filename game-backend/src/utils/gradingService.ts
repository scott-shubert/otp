import { Question, RoundService } from './roundService'

export class GradedQuestion {
	questionId = ''
	points = 0
	answers: string[] = []
	correct: boolean[] = []

	constructor(id: string) {
		this.questionId = id
	}
}

export interface Submission {
	id: string
	responses: string[]
}

export class GradedRound {
	roundId = ''
	questions: GradedQuestion[] = []

	constructor(roundId: string) {
		this.roundId = roundId
	}
}

export function gradeSubmission(submissions: Submission[]): GradedRound {
	const result = new GradedRound(RoundService.activeRound.id)
	const roundQuestions = RoundService.getRoundWithAnswers().questions

	roundQuestions.forEach((question) => {
		const submittted = submissions.find(
			(submission) => submission.id === question.id
		)

		if (submittted === undefined) return

		result.questions.push(gradeQuestion(submittted.responses, question))
	})

	return result
}

function gradeQuestion(
	submission: string[],
	question: Question
): GradedQuestion {
	const result = new GradedQuestion(question.id)
	result.answers = submission

	if (question.answerSlots === 1 || question.answerOrderMatters) {
		submission.forEach((response, index) => {
			if (question.validAnswers[index].includes(response.toLowerCase())) {
				result.correct.push(true)
			} else {
				result.correct.push(false)
			}
		})
	} else {
		const validAnswers = [...question.validAnswers]
		submission.forEach((response) => {
			for (let i = 0; i < validAnswers.length; i++) {
				if (validAnswers[i].includes(response.toLowerCase())) {
					result.correct.push(true)
					validAnswers.splice(i, 1)
					return
				}
			}
			result.correct.push(false)
		})
	}

	calculateScore(result, question)

	return result
}

function calculateScore(result: GradedQuestion, question: Question) {
	if (question.score.allOrNothing) {
		if (result.correct.includes(false)) return
	}

	result.correct.forEach((value, index) => {
		if (value) {
			result.points += question.score.correctPoints
		} else {
			if (result.answers[index] !== '')
				result.points -= question.score.incorrectPoints
		}
	})

	if (result.points < 0) result.points = 0
}
