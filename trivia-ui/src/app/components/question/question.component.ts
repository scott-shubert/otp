import { Component, inject, Input } from '@angular/core';
import { Question } from '../round/round.component';
import {
  ControlContainer,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { AnswerComponent } from '../answer/answer.component';

@Component({
  selector: 'app-question',
  standalone: true,
  imports: [ReactiveFormsModule, AnswerComponent],
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true }),
    },
  ],
  templateUrl: './question.component.html',
})
export class QuestionComponent {
  @Input() data: Question = new Question();
  parentContainer = inject(ControlContainer);

  get parentFormGroup() {
    return this.parentContainer.control as FormGroup;
  }

  ngOnInit() {
    this.parentFormGroup.addControl(this.data.id, new FormGroup({}));
  }
  ngOnDestroy() {
    this.parentFormGroup.removeControl(this.data.id);
  }
}
