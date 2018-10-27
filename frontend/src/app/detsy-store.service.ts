import { Injectable } from '@angular/core';
import { EtsyItem } from './models/etsy-item';

export const DETSY_STORE = new Map<string, EtsyItem>();

@Injectable()
export class DetsyStoreService {
	constructor() {
		DETSY_STORE.set('8598d4bc54f247a4bdeee3a6a2d177f3', {
			id: '8598d4bc54f247a4bdeee3a6a2d177f3',
			qty: 1,
			name: 'Shiba Inu Doll',
			description: 'Made of acrylic and alpaca yarn with removable cotton bandana! Measures about 7.5" long and 5" tall.',
			price: 5,
			imagePath: '/assets/images/doge.jpg'
		});

		DETSY_STORE.set('9d2a900a7e2a4ce6a8ac114b2cde8862', {
			id: '9d2a900a7e2a4ce6a8ac114b2cde8862',
			qty: 1,
			name: 'Baby Rattle',
			description: 'Natural rabbit rattle is a perfect boy baby shower gift and baby boy gift. The baby rattle is soft and light and the thin body makes it easy for the baby to grab him.',
			price: 4,
			imagePath: '/assets/images/rabbit.jpg'
		});

		DETSY_STORE.set('12b08ebb1a484489a453837400c93a0e', {
			id: '12b08ebb1a484489a453837400c93a0e',
			qty: 1,
			name: 'Wearable BloccChainz ',
			description: 'Ball chain is nickel plated steel measuring measuring 30".',
			price: 10,
			imagePath: '/assets/images/block-chain.jpg'
		});

		DETSY_STORE.set('453e9847086a4993bb526a350b6ae252', {
			id: '453e9847086a4993bb526a350b6ae252',
			qty: 1,
			name: 'Worry Monster Doll',
			description: 'Meet Rudy - your wish and worry monster, also a great anxiety relief toy. Write your wish or worry on a piece of paper, put it into Rudys mouth, zip it and wait - your wish will come true and your worry will fade away :).',
			price: 5,
			imagePath: '/assets/images/monster-doll.jpg'
		});

		DETSY_STORE.set('4a897acc570a4cdba1e18a41e598a0ef', {
			id: '4a897acc570a4cdba1e18a41e598a0ef',
			qty: 1,
			name: 'Classic Creepy Clown doll',
			description: 'Beep Beep, Richie! This 23 page pattern features almost 60 full color detailed step by step photos to make a CLASSIC super creepy amigurumi clown doll that measures almost 14" tall.',
			price: 7,
			imagePath: '/assets/images/clown.jpg'
		});

		DETSY_STORE.set('dbb51d51747a442cb4c0b52a74ae3805', {
			id: 'dbb51d51747a442cb4c0b52a74ae3805',
			qty: 1,
			name: 'Soft Unicorn Doll ',
			description: 'Kawaii Plush Toy Soft Unicorn Doll Appease Sleeping Pillow Kids Room Decor Toy For Children Pupil Christmas Halloween present',
			price: 8,
			imagePath: '/assets/images/unicorn.jpg'
		});
	}

	public getItem(id) {
		return DETSY_STORE.get(id);
	}
}
