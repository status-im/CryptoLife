const formMakeBid = document.querySelector("form#make-bid");
form.addEventListener("submit", submit, true);

function submit(_event) {
	_event.preventDefault();
	console.log('hello');
}

// dom elements
const formAcceptBid = document.querySelector("form#accept-bid");
const formMakeBid = document.querySelector("form#create-listing");

// event listeners
photoField.addEventListener("change", processImage);
