import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DetailsComponent } from '../details/details.component';
import * as ethers from 'ethers';
import axios, { AxiosPromise } from 'axios';
import { environment } from './../../environments/environment';
import * as limePayWeb from 'limepay-web/dist/lime-pay.min.js';

@Component({
	selector: 'dapp-payment',
	templateUrl: './payment.component.html',
	styleUrls: ['./payment.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class PaymentComponent implements OnInit {
	@ViewChild(DetailsComponent) detailsComponent: DetailsComponent;

	constructor() {
	}

	ngOnInit() {
	}

	public async onPayWithLimePay() {
		let shopperId = "5bd46e498532d5bf6bdb1b2f";
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
		}

		limePayWeb.init(limeToken, limePayConfig).then(result => {

			// TODO Show payment FORM

		}).catch((err) => {
			console.log(err);
			alert('Form initialization failed');
			// Implement some logic
		});

		console.log(limeToken);
	}
}
