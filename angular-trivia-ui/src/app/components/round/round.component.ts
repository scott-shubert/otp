import { Component, Input } from '@angular/core';
import { QuestionComponent } from '../question/question.component';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SocketService } from '../../services/socket.service';

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
  imports: [QuestionComponent, ReactiveFormsModule],
  templateUrl: './round.component.html',
})
export class RoundComponent {
  @Input() round: Round = new Round();

  constructor(private socketService: SocketService) {}

  roundForm = new FormGroup({});

  onSubmit() {
    const submition = {
      roundId: this.round.id,
      answers: { ...this.roundForm.value },
    };
    this.socketService.submitAnswer(submition);
  }
}
