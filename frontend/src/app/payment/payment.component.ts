import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DetailsComponent } from '../details/details.component';
import { ShopperStoreService } from '../shopper-store.service';
import { WaitingModeService } from '../waiting-mode.service';

@Component({
	selector: 'dapp-payment',
	templateUrl: './payment.component.html',
	styleUrls: ['./payment.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class PaymentComponent implements OnInit {
	@ViewChild(DetailsComponent) detailsComponent: DetailsComponent;
	public activateLimePay = false;
	private wallet;

	constructor(private shopperStoreService: ShopperStoreService,
		private waitingService: WaitingModeService) {
	}

	ngOnInit() {
	}

}
