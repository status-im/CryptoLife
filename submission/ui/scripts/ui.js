const ipfs = new window.Ipfs({host: 'ipfs.infura.io', port: 5001, protocol: 'https'})
const reader = new FileReader();

// dom elements
const form = document.querySelector("form#create-listing");
const photoField = document.querySelector("input[type=file]");

// event listeners
form.addEventListener("submit", submit, true);
photoField.addEventListener("change", processImage);


/*
	Update the preview image dom element with a new source
	@param {string} _src
	@param {string} _el - selector of dom element
	@return nothing

	@TODO add some eye candy
		1. pixalte image preview https://codepen.io/crosslab/pen/ZLJxRj
		2. have switch to unpixilate photo but this disables the submit button
 */
function updateImgSrc(_src, _selector="img#preview") {
	let preview = document.querySelector(_selector);
	preview.src = _src;
}


/*
	Process selected file in field
	@param {string} _src
	@return {string}
 */
function processImage() {
	var file = document.querySelector("input[type=file]").files[0];

	// listen for changes to file reader
	reader.addEventListener("load", function () {
		updateImgSrc(reader.result, 'img#preview');
	}, false);

	if(file) {
		reader.readAsDataURL(file);
	}
}


/*
	Submit secret to the market
 */
async function submit(_event) {
	_event.preventDefault();

	// gater submission meta data
	const meta = {
		title: document.querySelector("input#title").value,
		price: document.querySelector("input#price").value,
		desc: document.querySelector("textarea").value,
	};

	try {
		encrypted = await secret.encrypt(ADDRESS, image);
		console.log('encrypted data', encrypted)
	} catch(_error) {
		console.log("error", _error)
	}

}

/*
	Add file to IPFS and so it can never go away
	@param {string} _data
	@return {string}
 */
function storeItForever(_data){
	ipfs.files.add(_data, (_err, _result) => {
		if(_err) {
			console.error(err);
			return _err;
		}

		let url = `https://ipfs.io/ipfs/${_result[0].hash}`;

		console.log(`Url --> ${url}`)
		return url;
	})
}
