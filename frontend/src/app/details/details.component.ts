import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DetsyStoreService } from '../detsy-store.service';
import { EtsyItem } from '../models/etsy-item';

@Component({
	selector: 'dapp-details',
	templateUrl: './details.component.html',
	styleUrls: ['./details.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class DetailsComponent implements OnInit {
	@Input() showPurchaseButton = true;
	public itemId;
	public etsyItem: EtsyItem;

	constructor(private activeRoute: ActivatedRoute,
		private router: Router,
		private detsyStoreService: DetsyStoreService) {
	}

	ngOnInit() {
		this.itemId = this.activeRoute.snapshot.params.itemId;

		this.etsyItem = this.detsyStoreService.getItem(this.itemId);
	}

	public goToPayment(item) {
		this.router.navigate(['/payment', this.itemId]);
	}

}
