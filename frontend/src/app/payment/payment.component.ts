import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DetailsComponent } from '../details/details.component';
import * as ethers from 'ethers';
import axios, { AxiosPromise } from 'axios';
import { environment } from './../../environments/environment';
import * as limePayWeb from 'limepay-web/dist/lime-pay.min.js';
import { ShopperStoreService } from '../shopper-store.service';

@Component({
	selector: 'dapp-payment',
	templateUrl: './payment.component.html',
	styleUrls: ['./payment.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class PaymentComponent implements OnInit {
	@ViewChild(DetailsComponent) detailsComponent: DetailsComponent;
	public activateLimePay = false;

	constructor(private shopperStoreService: ShopperStoreService) {
	}

	ngOnInit() {
	}

	public async onLimePayProcess() {
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

		limePayWeb.init(limeToken, limePayConfig).catch((err) => {
			console.log(err);
			alert('Form initialization failed');
			// Implement some logic
		}).then(() => {
			this.activateLimePay = true;
		});

		console.log(limeToken);
	}
}
