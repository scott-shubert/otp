import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SocketService } from './services/socket.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title = 'trivia-ui';

  constructor(private socketService: SocketService) {}

  ngOnInit() {
    this.socketService.getMessages().subscribe((message) => {
      console.log(message);
    });
  }
}
