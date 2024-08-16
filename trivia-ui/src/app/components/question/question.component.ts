import { Component, Input } from '@angular/core';
import { Question } from '../round/round.component';

@Component({
  selector: 'app-question',
  standalone: true,
  imports: [],
  templateUrl: './question.component.html',
})
export class QuestionComponent {
  @Input() data: Question = new Question();
}
