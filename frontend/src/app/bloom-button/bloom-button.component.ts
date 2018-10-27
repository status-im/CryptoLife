import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { createRequestQRCode, removeRequestQRCode, RequestData, Action } from '@bloomprotocol/share-kit';

@Component({
  selector: 'dapp-bloom-button',
  templateUrl: './bloom-button.component.html',
  styleUrls: ['./bloom-button.component.scss']
})
export class BloomButtonComponent implements OnInit {

  public qrShown: boolean;
  @ViewChild('qrContainer') qrContainer: ElementRef;
  @Input() itemId: string;

  constructor() { }

  ngOnInit() {
  }

  public showQrCode() {
    this.qrShown = true;
    const requestData: RequestData = {
      action: Action.attestation,
      token: this.itemId,
      url: 'https://9a5928b7.ngrok.io/api/receiveData',
      org_logo_url: 'https://cdn.freebiesupply.com/logos/thumbs/2x/status-2-logo.png',
      org_name: 'Detsy',
      org_usage_policy_url: 'https://bloom.co/legal/terms',
      org_privacy_policy_url: 'https://bloom.co/legal/privacy',
      types: ['full-name', 'email'],
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
