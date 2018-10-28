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
				const result = [
					'0xf1159e311a389786dfea4e18d675277c36ec36806ff48d33e6b1247bbf79ca69',
					'0x7af983217ad29dd4d447f9b5f9368724d1d3b4dbd02d2e1e5fe72cfb3dc6d6f0',
					'0xe9201884ed7cdfd9a618f47a0557357b0c36948ecd36ca920193d2a4bff215c8'
				];
				console.log(receipt);
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
