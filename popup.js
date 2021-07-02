let features = [];

document.addEventListener('DOMContentLoaded', () => {
	let messageBox = document.querySelector('.message');
	let script = document.createElement('script');
	document.body.append(script);


	console.log(chrome.extension);

	let bg = chrome.extension.getBackgroundPage();

	chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
		let currentTabId = tabs[0].id;
		let currentTokenData = bg.getToken[currentTabId];

		// console.log(currentTokenData);
	})

	const callback = () => {
		messageBox.innerHTML = features;
	}

	script.addEventListener("load", (e) => {
		callback();
	});

	script.src = "features.js";

	script.onerror = () => {
		messageBox.innerHTML = `No traits script detected. Make sure there's a 'features.js' file in the root of the plugin folder`;
	}
});
