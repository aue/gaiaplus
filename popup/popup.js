function options() {
	var optionsUrl = chrome.extension.getURL('options/options.html');

	chrome.tabs.query({url: optionsUrl}, function(tabs) {
		if (tabs.length) {chrome.tabs.update(tabs[0].id, {active: true});}
		else {chrome.tabs.create({url: optionsUrl});}
	});
	_gaq.push(['_trackEvent', 'Popup', 'clicked', 'Settings Link']);
}
function thread() {
	chrome.tabs.create({url: 'http://www.gaiaonline.com/forum/gaia-guides-and-resources/t.45053993/'});
	_gaq.push(['_trackEvent', 'Popup', 'clicked', 'Threads Link']);
}

document.addEventListener('DOMContentLoaded', function () {
	document.getElementById('options').addEventListener('click', options);
	document.getElementById('thread').addEventListener('click', thread);
});