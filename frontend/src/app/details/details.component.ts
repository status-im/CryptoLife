import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DetsyStoreService } from '../detsy-store.service';
import { EtsyItem } from '../models/etsy-item';

@Component({
	selector: 'dapp-details',
	templateUrl: './details.component.html',
	styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
	public itemId;
	public etsyItem: EtsyItem;

	constructor(private activeRoute: ActivatedRoute,
		private detsyStoreService: DetsyStoreService) {
	}

	ngOnInit() {
		this.itemId = this.activeRoute.snapshot.params.itemId;

		this.etsyItem = this.detsyStoreService.getItem(this.itemId);
	}

}
