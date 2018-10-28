export interface EtsyItem {
	id: string | number;
	name: string;
	qty: number;
	description: string;
	imagePath: string | null;
	price: number;
	vendor: string;
	vendorAddress: string;
}