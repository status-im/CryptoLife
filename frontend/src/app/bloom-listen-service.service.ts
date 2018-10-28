import { environment } from './../environments/environment';
import { Injectable } from '@angular/core';
import { NextObserver } from 'rxjs/Observer';
import { Subject } from 'rxjs';
import * as io from 'socket.io-client';

@Injectable()
export class BloomListenService {

  private loginSubject: Subject<any>;
  private socket: any;

  constructor() {
    this.loginSubject = new Subject();
  }

  public subscribeToLogin(observer: NextObserver<any>) {
    return this.loginSubject.subscribe(observer);
  }

  private pushLogin(login: any) {
    this.loginSubject.next(login);
  }

  public startListening(): any {
    this.socket = io(environment.backendUrl);

    this.socket.on('message', (data) => {
      this.pushLogin(data);
    });
  }

}
