import { Component, OnInit, ViewChild, ElementRef, Input, OnDestroy } from '@angular/core';
import { createRequestQRCode, removeRequestQRCode, RequestData, Action } from '@bloomprotocol/share-kit';
import { UUID } from 'angular2-uuid';
import { BloomListenService } from '../bloom-listen-service.service';
import { environment } from '../../environments/environment';
import { Subscription } from 'rxjs';

@Component({
	selector: 'dapp-bloom-button',
	templateUrl: './bloom-button.component.html',
	styleUrls: ['./bloom-button.component.scss']
})
export class BloomButtonComponent implements OnInit, OnDestroy {

	public qrShown: boolean;
	@ViewChild('qrContainer') qrContainer: ElementRef;
	@Input() itemId: string;

	public subscription: Subscription;

	constructor(private bloomListenService: BloomListenService) {
	}

	ngOnInit() {
	}

	ngOnDestroy() {
		if (this.subscription) {
			this.subscription.unsubscribe();
		}
	}

	public showQrCode() {
		const uuidToken = UUID.UUID().split('-').join('');
		console.log(uuidToken);
		this.subscription = this.bloomListenService.subscribeToLogin({
			next: (data) => {
				if (data.qrToken !== `${uuidToken}${this.itemId}`) {
					return;
				}
				console.log(data);
				this.subscription.unsubscribe();
				// TODO Navigate
			}
		});
		this.qrShown = true;
		const requestData: RequestData = {
			action: Action.attestation,
			token: `${uuidToken}${this.itemId}`,
			url: `${environment.backendUrl}/api/receiveData`,
			org_logo_url: 'https://cdn.freebiesupply.com/logos/thumbs/2x/status-2-logo.png',
			org_name: 'Detsy',
			org_usage_policy_url: 'https://bloom.co/legal/terms',
			org_privacy_policy_url: 'https://bloom.co/legal/privacy',
			types: ['email'],
		};

		const options = {
			size: 256,
			fgColor: '#001AF5'
		};

		const requestQRCodeId = createRequestQRCode(requestData, this.qrContainer.nativeElement, options);

		// Some time later
		// removeRequestQRCode(requestQRCodeId);
	}

}
