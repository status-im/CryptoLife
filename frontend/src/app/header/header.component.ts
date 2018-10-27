import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'dapp-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
	@Input() showWaitingComponent = false;

	constructor(private router: Router) {
	}

	ngOnInit() {
	}

	public goHome(item) {
		this.router.navigate(['']);
	}

}
