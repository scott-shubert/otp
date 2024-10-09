export class Round {
	id = ''
	name = ''
	description = ''
	questions: Question[] = []
	numberOfQuestions = 0
}

export class Question {
	id = ''
	question = ''
	imageUrl = ''
	videoUrl = ''
	answerSlots = 0
	validAnswers = []
	validAnswerDisplay = ''
	answerOrderMatters = false
	isBonus = false
}

export class RoundService {
	private static allRounds: Round[] = []
	private static currentRound = -1
	private static currentQuestionCount = -1

	static activeRound = new Round()
	static activeQuestions: Question[] = []

	static setRounds(data: any): void {
		this.allRounds = data.rounds
	}

	static advanceRoundBy(value: number): boolean {
		const newRoundNumber = this.currentRound + value
		if (newRoundNumber >= -1 && newRoundNumber < this.allRounds.length) {
			this.currentRound = newRoundNumber
			if (newRoundNumber === -1) {
				this.activeRound = new Round()
			} else {
				const newRound: Round = { ...this.allRounds[this.currentRound] }
				newRound.numberOfQuestions = newRound.questions.length
				newRound.questions = []
				this.activeRound = newRound
			}
			this.activeQuestions = []
			this.currentQuestionCount = -1
			return true
		}
		return false
	}

	static advanceQuestionBy(value: number): boolean {
		if (this.currentRound < 0) return false

		const newQuestionCount = this.currentQuestionCount + value
		const currentRoundLength =
			this.allRounds[this.currentRound].questions.length

		if (newQuestionCount >= -1 && newQuestionCount < currentRoundLength) {
			this.currentQuestionCount = newQuestionCount

			if (value >= 0 && this.activeQuestions.length < currentRoundLength) {
				const newQuestion =
					this.allRounds[this.currentRound].questions[
						this.activeQuestions.length
					]
				newQuestion.validAnswers = []
				newQuestion.validAnswerDisplay = ''
				this.activeQuestions.push(newQuestion)
			} else if (value < 0) {
				this.activeQuestions.pop()
			}
			return true
		}
		return false
	}
}
