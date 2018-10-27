import { BloomListenService } from './bloom-listen-service.service';

declare let require: any;
import { Component, OnDestroy, OnInit } from '@angular/core';
import * as ethers from 'ethers';
import { Subscription } from 'rxjs/Subscription';
import { WaitingModeService } from './waiting-mode.service';

const Billboard = require('./contract_interfaces/Billboard.json');

@Component({
	selector: 'dapp-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

	public billboardContent: string = null;
	public address: string;
	public newSlogan: string;
	public privateKey: string;
	public currentBlock: number;
	public gasPrice: string;
	public infuraApiKey = 'abca6d1110b443b08ef271545f24b80d';
	public infuraProvider: ethers.providers.InfuraProvider;
	public contractAddress = '0x78ed7A34D67fB3eAc745e7af78aE1bcA770C26de';
	public deployedContract: ethers.Contract;

	public password: string;
	public encryptPassword: string;


	public waitingSubscription: Subscription;
	public showWaitingComponent = false;

	constructor(private bloomListenService: BloomListenService,
		private waitingService: WaitingModeService) {

		this.waitingSubscription = this.waitingService.subscribeToWaitingSubject({
			next: (wait) => {
				this.showWaitingComponent = wait;
			}
		});

		this.infuraProvider = new ethers.providers.InfuraProvider('rinkeby', this.infuraApiKey);
		this.infuraProvider.on('block', blockNumber => {
			this.currentBlock = blockNumber;
		});
		this.deployedContract = new ethers.Contract(this.contractAddress, Billboard.abi, this.infuraProvider);
	}

	ngOnInit() {
		this.bloomListenService.startListening();
	}

	ngOnDestroy() {
		this.waitingSubscription.unsubscribe();
	}

	public async getCurrentBlock() {
		this.currentBlock = await this.infuraProvider.getBlockNumber();
	}

	public async getGasPrice() {
		const price = await this.infuraProvider.getGasPrice();
		this.gasPrice = ethers.utils.formatEther(price.toNumber());
	}

	public async getBillboardContent() {
		this.billboardContent = await this.deployedContract.slogan();
	}

	public async getTransactionHash(transactionHash) {
		const transaction = await this.infuraProvider.getTransactionReceipt(transactionHash);
		console.log(transaction);
	}

	public async moneySpent() {
		const moneySpent = await this.deployedContract.moneySpent(this.address);
		console.log(moneySpent.toNumber());
	}

	public async buyBillboard() {

	}

	public async createWallet() {

	}

}
