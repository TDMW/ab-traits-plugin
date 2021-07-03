let features = [];
let tokenData = { hash: "", tokenId: "" };

document.addEventListener('DOMContentLoaded', () => {
	let messageBox = document.querySelector('.message');
	let tokenBox = document.querySelector('.token');
	let featureBox = document.querySelector('.featureBox');
	let tokenHash = document.querySelector('.tokenHash');
	let tokenId = document.querySelector('.tokenId');
	let script = document.createElement('script');
	
	document.body.append(script);

	function setTokenData(t){
		const token = t[0].match(/"(.*?)"/g);
		tokenData.hash = JSON.parse(token[1]);
		tokenData.tokenId = JSON.parse(token[3]);
		tokenHash.innerHTML = tokenData.hash;
		tokenId.innerHTML = tokenData.tokenId;
		setFeatures();
	}
	
	chrome.tabs.query({active: true}, function(tabs) {
		var tab = tabs[0];
		tab_title = tab.title;
		chrome.tabs.executeScript(tab.id, {
			code: 'document.querySelectorAll("head > script")[1].innerHTML'
		}, setTokenData);
	});

	const setFeatures = () => {
		script.src = "features.js";
		setTimeout(() => { 
			features.forEach((feature) => {
			featureBox.innerHTML += `<p>${feature}</p>`
		})}, 1000);
	}

	// script.addEventListener("load", (e) => {
	// 	setFeatures();
	// });


	script.onerror = () => {
		messageBox.innerHTML = `No traits script detected. Make sure there's a 'features.js' file in the root of the plugin folder`;
	}
});
