import { Component, OnDestroy, OnInit } from '@angular/core';
import { EtsyItem } from '../models/etsy-item';
import { Router } from '@angular/router';
import { DETSY_STORE, DetsyStoreService } from '../detsy-store.service';
import { Subscription } from 'rxjs/Subscription';
import { WaitingModeService } from '../waiting-mode.service';

@Component({
	selector: 'dapp-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
	public etsyItems: EtsyItem[];

	constructor(private router: Router,
		private detsyService: DetsyStoreService) {

	}

	ngOnInit() {
		this.etsyItems = [];
		DETSY_STORE.forEach((item) => {
			this.etsyItems.push(item);
		})
	}

	public etsyDetails(item) {
		this.router.navigate(['/details', item.id]);
	}

}
