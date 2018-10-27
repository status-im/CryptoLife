import { Subscription } from 'rxjs/Subscription';
import { NextObserver } from 'rxjs/Observer';
import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';

@Injectable()
export class WaitingModeService {

	private waitingSubject: Subject<boolean>;

	constructor() {
		this.waitingSubject = new Subject();
	}

	public subscribeToWaitingSubject(observer: NextObserver<boolean>): Subscription {
		return this.waitingSubject.subscribe(observer);
	}

	public pushWaitingSubject() {
		return this.waitingSubject.next();
	}

}
