import { Injectable } from '@angular/core';
import { first, Observable } from 'rxjs';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket = io('ws://localhost:3000', {});

  constructor() {}

  getRoundChanges() {
    return new Observable((observer) => {
      this.socket.on('set round', (message) => {
        observer.next(message);
      });

      return () => {
        this.socket.disconnect();
      };
    });
  }

  getQuestionChanges() {
    return new Observable((observer) => {
      this.socket.on('set question', (message) => {
        observer.next(message);
      });

      return () => {
        this.socket.disconnect();
      };
    });
  }

  submitAnswer(data: any) {
    this.socket.emit('submit answers', data);
  }
}
