function getTokenData() {
	return tokenData;
}

window.postMessage({ type: "FROM_PAGE", getTokenData()});