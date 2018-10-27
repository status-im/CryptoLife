import { BloomListenService } from './bloom-listen-service.service';

declare let require: any;
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { WaitingModeService } from './waiting-mode.service';

@Component({
	selector: 'dapp-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
	public waitingSubscription: Subscription;
	public showWaitingComponent = false;

	constructor(private bloomListenService: BloomListenService,
		private waitingService: WaitingModeService) {

		this.waitingSubscription = this.waitingService.subscribeToWaitingSubject({
			next: (wait) => {
				this.showWaitingComponent = wait;
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
