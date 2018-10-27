import { Injectable } from '@angular/core';

@Injectable()
export class ShopperStoreService {
	public shopperId: string;

	constructor() {
	}

	public getShopperId() {
		return this.shopperId;
	}

	public setShopperId(id) {
		this.shopperId = id;
	}
}
