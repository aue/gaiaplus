// GaiaPlus, Gaia+ -- by bowafishtech
// powered by BetterGaia

// Check if install, update
chrome.runtime.onInstalled.addListener(function(details) {
	if (details['reason'] == "install") {
		// Send welcome message
		var notification = webkitNotifications.createNotification(
			'icon/48.png',
			'Welcome to GaiaPlus.',
			'Use Gaia just as you already have been.'
		);
		notification.show();
	}
	else if (details['reason'] == "update") {}
});

// On start
chrome.runtime.onStartup.addListener(function() {
	chrome.management.get('lmgjagdflhhfjflolfalapokbplfldna', function(r){
		if (typeof r !== 'undefined' && r['enabled'] === true) chrome.storage.sync.set({'posts.settings.disable.postFormatter': true});
		else chrome.storage.sync.set({'posts.settings.disable.postFormatter': false});
	});
});

// Send to scripts
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	if (request.elements == "options page") {
		var optionsUrl = chrome.runtime.getURL('options/options.html');
	
		chrome.tabs.query({url: optionsUrl}, function(tabs) {
			if (tabs.length) {chrome.tabs.update(tabs[0].id, {active: true});}
			else {chrome.tabs.create({url: optionsUrl});}
		});	
	}
	else if (request.elements == "reset") {sendResponse({"reset": true});}
});