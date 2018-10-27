import { Injectable } from '@angular/core';
import { EtsyItem } from './models/etsy-item';

export const DETSY_STORE = new Map<string, EtsyItem>();

@Injectable()
export class DetsyStoreService {
	constructor() {
		DETSY_STORE.set('8598d4bc54f247a4bdeee3a6a2d177f3', {
			id: '8598d4bc54f247a4bdeee3a6a2d177f3',
			qty: 1,
			name: 'Blue Leather Bracelet White Flag of Argentina',
			description: 'With a velvet pouch\n' +
			'Material: alloy, leather\n' +
			'Width: 1.4 cm\n' +
			'Length: 20 / 21.5 / 23 cm\n' +
			'Color: blue white\n' +
			'Package Contents:\n' +
			'1 x belt\n' +
			'1 x velvet bag\n' +
			'Note: Light shooting and different displays may cause the color of the item in the picture a little different from the real thing. The measurement allowed error is +/- 1-3cm.',
			price: '1 DAI',
			imagePath: '/assets/images/leather-bracelet-argentina.jpg'
		});

		DETSY_STORE.set('9d2a900a7e2a4ce6a8ac114b2cde8862', {
			id: '9d2a900a7e2a4ce6a8ac114b2cde8862',
			qty: 1,
			name: 'Blue Leather Bracelet White Flag of Argentina',
			description: 'With a velvet pouch\n' +
			'Material: alloy, leather\n' +
			'Width: 1.4 cm\n' +
			'Length: 20 / 21.5 / 23 cm\n' +
			'Color: blue white\n' +
			'Package Contents:\n' +
			'1 x belt\n' +
			'1 x velvet bag\n' +
			'Note: Light shooting and different displays may cause the color of the item in the picture a little different from the real thing. The measurement allowed error is +/- 1-3cm.',
			price: '1 DAI',
			imagePath: '/assets/images/leather-bracelet-argentina.jpg'
		});

		DETSY_STORE.set('dbb51d51747a442cb4c0b52a74ae3805', {
			id: 'dbb51d51747a442cb4c0b52a74ae3805',
			qty: 1,
			name: 'Blue Leather Bracelet White Flag of Argentina',
			description: 'With a velvet pouch\n' +
			'Material: alloy, leather\n' +
			'Width: 1.4 cm\n' +
			'Length: 20 / 21.5 / 23 cm\n' +
			'Color: blue white\n' +
			'Package Contents:\n' +
			'1 x belt\n' +
			'1 x velvet bag\n' +
			'Note: Light shooting and different displays may cause the color of the item in the picture a little different from the real thing. The measurement allowed error is +/- 1-3cm.',
			price: '1 DAI',
			imagePath: '/assets/images/leather-bracelet-argentina.jpg'
		});

		DETSY_STORE.set('453e9847086a4993bb526a350b6ae252', {
			id: '453e9847086a4993bb526a350b6ae252',
			qty: 1,
			name: 'Blue Leather Bracelet White Flag of Argentina',
			description: 'With a velvet pouch\n' +
			'Material: alloy, leather\n' +
			'Width: 1.4 cm\n' +
			'Length: 20 / 21.5 / 23 cm\n' +
			'Color: blue white\n' +
			'Package Contents:\n' +
			'1 x belt\n' +
			'1 x velvet bag\n' +
			'Note: Light shooting and different displays may cause the color of the item in the picture a little different from the real thing. The measurement allowed error is +/- 1-3cm.',
			price: '1 DAI',
			imagePath: '/assets/images/leather-bracelet-argentina.jpg'
		});

		DETSY_STORE.set('4a897acc570a4cdba1e18a41e598a0ef', {
			id: '4a897acc570a4cdba1e18a41e598a0ef',
			qty: 1,
			name: 'Blue Leather Bracelet White Flag of Argentina',
			description: 'With a velvet pouch\n' +
			'Material: alloy, leather\n' +
			'Width: 1.4 cm\n' +
			'Length: 20 / 21.5 / 23 cm\n' +
			'Color: blue white\n' +
			'Package Contents:\n' +
			'1 x belt\n' +
			'1 x velvet bag\n' +
			'Note: Light shooting and different displays may cause the color of the item in the picture a little different from the real thing. The measurement allowed error is +/- 1-3cm.',
			price: '1 DAI',
			imagePath: '/assets/images/leather-bracelet-argentina.jpg'
		});

		DETSY_STORE.set('12b08ebb1a484489a453837400c93a0e', {
			id: '12b08ebb1a484489a453837400c93a0e',
			qty: 1,
			name: 'Blue Leather Bracelet White Flag of Argentina',
			description: 'With a velvet pouch\n' +
			'Material: alloy, leather\n' +
			'Width: 1.4 cm\n' +
			'Length: 20 / 21.5 / 23 cm\n' +
			'Color: blue white\n' +
			'Package Contents:\n' +
			'1 x belt\n' +
			'1 x velvet bag\n' +
			'Note: Light shooting and different displays may cause the color of the item in the picture a little different from the real thing. The measurement allowed error is +/- 1-3cm.',
			price: '1 DAI',
			imagePath: '/assets/images/leather-bracelet-argentina.jpg'
		});
	}

	public getItem(id) {
		return DETSY_STORE.get(id);
	}
}
