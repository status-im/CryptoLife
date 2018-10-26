import { Component, OnInit } from '@angular/core';
import { EtsyItem } from '../models/etsy-item';
import { Router } from '@angular/router';

@Component({
	selector: 'dapp-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
	public etsyItems: EtsyItem[];

	constructor(private router: Router) {
	}

	ngOnInit() {
		this.etsyItems = [];
		this.etsyItems.push({
			id: 0,
			name: 'Гривна',
			description: 'Яката гривна',
			price: '1 DAO',
			imagePath: ''
		});

		this.etsyItems.push({
			id: 1,
			name: 'Амулет',
			description: 'Амулетът на Купка',
			price: '13 DAO',
			imagePath: ''
		})
	}

	public etsyDetails(item) {
		this.router.navigate(['/details', item.id]);
	}

}
