import { BloomListenService } from './bloom-listen-service.service';

declare let require: any;
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { WaitingModeService } from './waiting-mode.service';
import { ReceiptService } from './receipt.service';

@Component({
	selector: 'dapp-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
	public waitingSubscription: Subscription;
	public showWaitingComponent = false;
	public receipts = [];

	constructor(private bloomListenService: BloomListenService,
		private waitingService: WaitingModeService,
		private receiptService: ReceiptService) {

		this.waitingSubscription = this.waitingService.subscribeToWaitingSubject({
			next: (wait) => {
				this.showWaitingComponent = wait;
			}
		});

		this.receiptService.startListening();
		this.receiptService.subscribeToReceipt({
			next: (receipt) => {
				this.receipts = receipt;
			}
		});
	}

	ngOnInit() {
		this.bloomListenService.startListening();
	}

	ngOnDestroy() {
		this.waitingSubscription.unsubscribe();
	}

}
