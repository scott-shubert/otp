import { Injectable } from '@angular/core';
import { first, Observable } from 'rxjs';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket = io('ws://localhost:3000', {});

  constructor() {}

  getMessages() {
    return new Observable((observer) => {
      this.socket.on('set round', (message) => {
        observer.next(message);
      });

      return () => {
        this.socket.disconnect();
      };
    });
  }
}
