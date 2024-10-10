import { Question, RoundService } from './roundService'

export class GradedQuestion {
	id = ''
	answers: string[] = []
	correct: boolean[] = []

	constructor(id: string) {
		this.id = id
	}
}

export interface Submission {
	id: string
	responses: string[]
}

export class GradedRound {
	teamName = ''
	questions: GradedQuestion[] = []

	constructor(teamName: string) {
		this.teamName = teamName
	}
}

export function gradeSubmission(
	teamName: string,
	submissions: Submission[]
): GradedRound {
	const result = new GradedRound(teamName)
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
			if (question.validAnswers[index].includes(response)) {
				result.correct.push(true)
			} else {
				result.correct.push(false)
			}
		})
	} else {
		const validAnswers = [...question.validAnswers]
		submission.forEach((response) => {
			for (let i = 0; i < validAnswers.length; i++) {
				if (validAnswers[i].includes(response)) {
					result.correct.push(true)
					validAnswers.splice(i, 1)
					return
				}
			}
			result.correct.push(false)
		})
	}

	return result
}
