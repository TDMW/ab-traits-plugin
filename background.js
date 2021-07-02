window.getToken = {};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	window.getToken[sender.tab.id] = message.essential || null;
})