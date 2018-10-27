import { Injectable } from '@angular/core';
import { EtsyItem } from './models/etsy-item';

export const DETSY_STORE = new Map<string, EtsyItem>();

@Injectable()
export class DetsyStoreService {
	constructor() {
		DETSY_STORE.set('4a897acc570a4cdba1e18a41e598a0ef', {
			id: '4a897acc570a4cdba1e18a41e598a0ef',
			qty: 1,
			name: 'Classic hand made pot!',
			description: 'Pottery all the way!',
			price: 24,
			imagePath: '/assets/images/pot.jpg'
		});

		DETSY_STORE.set('8598d4bc54f247a4bdeee3a6a2d177f3', {
			id: '8598d4bc54f247a4bdeee3a6a2d177f3',
			qty: 1,
			name: 'Shiba Inu Coin Doll',
			description: 'Made of acrylic and alpaca yarn with removable cotton bandana! Measures about 7.5" long and 5" tall.',
			price: 27,
			imagePath: '/assets/images/doge.jpg'
		});

		DETSY_STORE.set('12b08ebb1a484489a453837400c93a0e', {
			id: '12b08ebb1a484489a453837400c93a0e',
			qty: 1,
			name: 'Moonshot Catcher Bracelet',
			description: 'Ball chain is nickel plated steel measuring measuring 30".',
			price: 18,
			imagePath: '/assets/images/bracelet.jpg'
		});

		DETSY_STORE.set('9d2a900a7e2a4ce6a8ac114b2cde8862', {
			id: '9d2a900a7e2a4ce6a8ac114b2cde8862',
			qty: 1,
			name: 'Satoshi Spirit Animal',
			description: 'Natural rabbit rattle is a perfect boy baby shower gift and baby boy gift. The baby rattle is soft and light and the thin body makes it easy for the baby to grab him.',
			price: 14,
			imagePath: '/assets/images/rabbit.jpg'
		});

		DETSY_STORE.set('dbb51d51747a442cb4c0b52a74ae3805', {
			id: 'dbb51d51747a442cb4c0b52a74ae3805',
			qty: 1,
			name: 'Crypto Unicorn Doll',
			description: 'Kawaii Plush Toy Soft Unicorn Doll Appease Sleeping Pillow Kids Room Decor Toy For Children Pupil Christmas Halloween present',
			price: 50,
			imagePath: '/assets/images/unicorn.png'
		});

		DETSY_STORE.set('453e9847086a4993bb526a350b6ae252', {
			id: '453e9847086a4993bb526a350b6ae252',
			qty: 1,
			name: 'Vitalik Touched Bracelet',
			description: 'Meet Rudy - your wish and worry monster, also a great anxiety relief toy. Write your wish or worry on a piece of paper, put it into Rudys mouth, zip it and wait - your wish will come true and your worry will fade away :).',
			price: 19,
			imagePath: '/assets/images/bracelet-2.jpg'
		});

		DETSY_STORE.set('9d2a900a7e2a4ce6a8ac114b2cde8867', {
			id: '9d2a900a7e2a4ce6a8ac114b2cde8867',
			qty: 1,
			name: 'Much Baby Doge',
			description: 'Natural rabbit rattle is a perfect boy baby shower gift and baby boy gift. The baby rattle is soft and light and the thin body makes it easy for the baby to grab him.',
			price: 128,
			imagePath: '/assets/images/doge-2.jpeg'
		});

		DETSY_STORE.set('453e9847086a4993bb526a350b6ae257', {
			id: '453e9847086a4993bb526a350b6ae257',
			qty: 1,
			name: 'Cryptolife Hacker',
			description: 'Meet Rudy - your wish and worry monster, also a great anxiety relief toy. Write your wish or worry on a piece of paper, put it into Rudys mouth, zip it and wait - your wish will come true and your worry will fade away :).',
			price: 5,
			imagePath: '/assets/images/monster-doll.jpg'
		});

	}

	public getItem(id) {
		return DETSY_STORE.get(id);
	}
}
