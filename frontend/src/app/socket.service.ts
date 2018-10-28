import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import * as io from 'socket.io-client';

@Injectable()
export class SocketService {

	public socket: any;

	constructor() {
		this.socket = io(environment.backendUrl);
	}

}
