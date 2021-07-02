const injectScript = (file_path, tag) => {
	let node = getElementsByTagName(tag)[0];
	let script = document.createElement('script');
	script.setAttribute('type', 'text/javascript');
	script.setAttribute('src', file_path);
	node.appendChild(script);
}

injectScript(chrome.extension.getUrl('inject-script.js'), 'body');

window.addEventListener("message", (e) => {
	console.log(e);
	if(e.data.type && (e.data.type == "FROM_PAGE")
	 && typeof chrome.app.isInstalled !== 'undefined') {
		chrome.runtime.sendMessage({ essential: e.data.essential});
	}
}, false);