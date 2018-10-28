import { ShopperStoreService } from './../shopper-store.service';
import { WaitingModeService } from './../waiting-mode.service';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DetsyStoreService } from '../detsy-store.service';
import { EtsyItem } from '../models/etsy-item';
import * as ethers from 'ethers';
import axios, { AxiosPromise } from 'axios';
import { environment } from './../../environments/environment';
import * as limePayWeb from 'limepay-web/dist/lime-pay.min.js';

@Component({
	selector: 'dapp-details',
	templateUrl: './details.component.html',
	styleUrls: ['./details.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class DetailsComponent implements OnInit {
	@Input() showBloomAuthentication = true;
	public itemId;
	public etsyItem: EtsyItem;
	public activateLimePay: boolean;
	private wallet;

	constructor(private activeRoute: ActivatedRoute,
		private router: Router,
		private detsyStoreService: DetsyStoreService,
		private waitingService: WaitingModeService,
		private shopperStoreService: ShopperStoreService) {
	}

	ngOnInit() {
		this.itemId = this.activeRoute.snapshot.params.itemId;
		this.etsyItem = this.detsyStoreService.getItem(this.itemId);
	}

	public startPayment() {
		this.wallet = ethers.Wallet.createRandom();
		this.showBloomAuthentication = false;
	}

	public async onPayWithLimePay() {
		this.waitingService.pushWaitingSubject(true);
		const shopperId = this.shopperStoreService.getShopperId();

		const requestData = { itemName: this.etsyItem.name, price: 1, walletAddress: this.wallet.address, shopperId: shopperId };

		const result = await axios({
			method: 'POST',
			url: environment.backendUrl + '/api/payment',
			data: requestData
		});

		const limeToken = result.data;

		const limePayConfig = {
			URL: 'http://test-limepay-api.eu-west-1.elasticbeanstalk.com',
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

		limePayWeb.init(limeToken, limePayConfig).then(() => {
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
