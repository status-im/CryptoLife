import { Injectable } from '@angular/core';
import { NextObserver } from 'rxjs/Observer';
import { Subject } from 'rxjs';

import { SocketService } from './socket.service';

@Injectable()
export class ReceiptService {

	private receiptSubject: Subject<any>;

	constructor(private socketService: SocketService) {
		this.receiptSubject = new Subject();
	}

	public subscribeToReceipt(observer: NextObserver<any>) {
		return this.receiptSubject.subscribe(observer);
	}

	private pushReceipt(receipt: any) {
		this.receiptSubject.next(receipt);
	}

	public startListening(): any {
		this.socketService.socket.on('receipt', (receipt) => {
			this.pushReceipt(receipt);
		});
	}

}
