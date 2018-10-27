import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'dapp-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

	constructor(private router: Router) {
	}

	ngOnInit() {
	}

	public goHome(item) {
		this.router.navigate(['']);
	}

}
