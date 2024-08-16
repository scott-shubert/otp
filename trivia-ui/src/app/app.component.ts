import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SocketService } from './services/socket.service';
import { Round, RoundComponent } from './components/round/round.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RoundComponent],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title = 'trivia-ui';
  round: Round = new Round();

  constructor(private socketService: SocketService) {}

  ngOnInit() {
    this.socketService.getRoundChanges().subscribe((message: any) => {
      console.log('round: ', message.name);
      this.round = message;
    });
    this.socketService.getQuestionChanges().subscribe((message: any) => {
      console.log('question: ', message);
      this.round.questions = message;
    });
  }
}
