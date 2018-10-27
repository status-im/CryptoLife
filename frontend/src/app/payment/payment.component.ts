import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DetailsComponent } from '../details/details.component';
import * as ethers from 'ethers';
import axios, { AxiosPromise } from 'axios';
import { environment } from './../../environments/environment';
import * as limePayWeb from 'limepay-web/dist/lime-pay.min.js';
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

	constructor(private shopperStoreService: ShopperStoreService,
		private waitingService: WaitingModeService) {
	}

	ngOnInit() {
	}

	public async onPayWithLimePay() {
		this.waitingService.pushWaitingSubject(true);
		let shopperId = this.shopperStoreService.getShopperId();
		let wallet = ethers.Wallet.createRandom();

		let item = this.detailsComponent.etsyItem;
		let requestData = { itemName: item.name, price: 1, walletAddress: wallet.address, shopperId: shopperId };

		let result = await axios({
			method: "POST",
			url: environment.backendUrl + "/api/payment",
			data: requestData
		});

		let limeToken = result.data;

		let limePayConfig = {
			URL: "http://test-limepay-api.eu-west-1.elasticbeanstalk.com",
			eventHandler: {
				onSuccessfulSubmit: function () {
					alert('Your payment was send for processing');
					// Implement some logic
				},
				onFailedSubmit: function (err) {
					console.log(err);
					alert('Your payment failed');
					// Implement some logic
				}
			}
		};

		limePayWeb.init(limeToken, limePayConfig).then(result => {
			this.waitingService.pushWaitingSubject(false);
			this.activateLimePay = true;

		}).catch((err) => {
			this.waitingService.pushWaitingSubject(false);
			console.log(err);
			alert('Form initialization failed');
			// Implement some logic
		});

		console.log(limeToken);
	}

	onProcessPayment() {
		// const cardHolderInformation = {
		// 	name: "George Spasov",
		// 	countryCode: "bg",
		// 	zip: "1010",
		// 	street: "Dragan Tsankov",
		// 	isCompany: false
		// };

		// let signedTransactions = await signTransactions();
		// limePayWeb.PaymentService.processPayment(cardHolderInformation, signedTransactions);
	}
}
