const EthCrypto = window.EthCrypto;

/*
	Encrypt data given an address
	@param {string} _address
	@param {string} _data
	@return Promise
 */
const encrypt = (_address, _data) => {
	return new Promise((_resolve, _reject) => {
		EthCrypto.encryptWithPublicKey(
			_address,
			JSON.stringify(_data)
			)
			.then((_encrypted) => {
				_resolve(_encrypted);
			})
			.catch((_error) => {
				_reject(_error);
			});
	});
}

/*
	Decrypt data using a private key
	@param {string} _privateKey
	@param {string} _encryptedData
	@return Promise
 */
const decrypt = (_privateKey, _encryptedData) => {
	return new Promise((_resolve, _reject) => {
		EthCrypto.decryptWithPrivateKey(
			_privateKey,
			_encryptedData
			)
			.then((_decrypted) => {
				_resolve(stripEndQuotes(_decrypted));
			})
			.catch((_error) => {
				_reject(_error);
			});
	});
}


/*
	Check and strip starting and end quotes from a string
	@param {string} _src
	@return {string}
 */
const stripEndQuotes = (s) => {
	var t=s.length;
	if (s.charAt(0)=='"') s=s.substring(1,t--);
	if (s.charAt(--t)=='"') s=s.substring(0,t);
	return s;
}

const secret = {
	encrypt,
	decrypt,
}