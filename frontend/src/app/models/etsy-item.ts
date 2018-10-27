export interface EtsyItem {
	id: string | number;
	name: string;
	qty: number;
	description: string;
	imagePath: string | null;
	price: string | number;
}