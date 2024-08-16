import { Component, Input } from '@angular/core';
import { QuestionComponent } from '../question/question.component';

export class Round {
  id = '';
  name = '';
  description = '';
  questions: Question[] = [];
}

export class Question {
  id = '';
  question = '';
  imageUrl = '';
  videoUrl = '';
  answerSlots = 0;
  validAnswers = [];
  validAnswerDisplay = '';
  answerOrderMatters = false;
  isBonus = false;
}

@Component({
  selector: 'app-round',
  standalone: true,
  imports: [QuestionComponent],
  templateUrl: './round.component.html',
})
export class RoundComponent {
  @Input() round: Round = new Round();
}
