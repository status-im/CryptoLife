import { Injectable } from '@angular/core';
import { NextObserver } from 'rxjs/Observer';
import { Subject } from 'rxjs';

import { SocketService } from './socket.service';

@Injectable()
export class BloomListenService {

	private loginSubject: Subject<any>;

	constructor(private socketService: SocketService) {
		this.loginSubject = new Subject();
	}

	public subscribeToLogin(observer: NextObserver<any>) {
		return this.loginSubject.subscribe(observer);
	}

	private pushLogin(login: any) {
		this.loginSubject.next(login);
	}

	public startListening(): any {
		this.socketService.socket.on('message', (data) => {
			this.pushLogin(data);
		});
	}

}
