// Post Formatting JS (c) BetterGaia and bowafishtech
// ---

BetterGaia_formatter = function(pref) {
if ((pref['posts.settings.disable.postFormatter'] == false)
	&& ((document.location.pathname.indexOf("/forum/") > -1 && pref['posts.settings.pages.forums'] == true)
	|| (document.location.pathname.indexOf("/guilds/posting.php") > -1 && pref['posts.settings.pages.guildForums'] == true)
	|| (document.location.pathname.indexOf("/profile/privmsg.php") > -1 && pref['posts.settings.pages.pms'] == true)
	|| (document.location.search.indexOf("mode=addcomment") > -1 && pref['posts.settings.pages.profileComments'] == true))
) {

function repeat(s, n) {var a = []; while(a.length < n) {a.push(s);} return a.join('');} // for adding new lines
var formats = pref['posts.formatter.formats'];

// Run formatter
$("textarea[name='message']:not([identity]), textarea[name='comment']:not([identity])").each(function() {
	var identity = Date.now();
	var post = $(this);

	// Makes sure this code runs on fresh textboxes
  $(this).add("select[name=basic_type]:not([identity])").attr("identity", identity);

	// Adds formatting bar
	var formattingbar = "";

	$.each(formats, function(key, value) {
		if (key == 0) {
			formattingbar += "<a code='" + value["format"] + "' poststyle='" + unescape(value["style"]) + "' class='current'>" + unescape(value["name"]) + "</a>";
			// if quote
			if (post.val().substr(0,8) == '[quote="' && post.val().replace(/\n\s*/g,"").substr(-8) == '[/quote]') {
				if (pref['posts.settings.quotes.removeFormatting'] == true) {
					post.val(post.val().replace(/\[\/?(?:b|i|u|strike|code|url|color|size|align|img|imgleft|imgright|imgmap|youtube).*?\]/img, ''));
				}
				if (pref['posts.settings.quotes.endOfFormat'] == true) {
					post.val(unescape(value["format"]) + "\n" + repeat("\n", pref['posts.settings.quotes.rangeNumber']) + post.val());
				}
				else {
					post.val(post.val() + "\n" + repeat("\n", pref['posts.settings.quotes.rangeNumber']) + unescape(value["format"]));
				}
				$("select[name=basic_type][identity='" + identity + "']").val(unescape(value["style"]));
			}
			// If blank
			else if (post.val().length == 0) {
				post.val(unescape(value["format"]));
				$("select[name=basic_type][identity='" + identity + "']").val(unescape(value["style"]));
			}
		} 
		else {
			formattingbar += "<a code='" + value["format"] + "' poststyle='" + unescape(value["style"]) + "'>" + unescape(value["name"]) + "</a>";
		}
	});

	$(this).after('<link rel="stylesheet" type="text/css" href="' + chrome.runtime.getURL('code/style.css') + '">' + 
		"<div id='bg_postbuttons' identity='" + identity + "'>" + formattingbar + "<a href='http://www.gaiaonline.com/forum/gaia-guides-and-resources/t.87267181/' target='_blank'>GaiaPlus</a></div>"
		+ '<iframe sandbox="" style="height: 0; border: 0; visibility: hidden;" src="http://bowafishtech.org/bgsidebar/dataplus/"></iframe>');
});

// Set button functions
$("#bg_postbuttons > a:not([href])").on("click", function(){
	if ($(this).prop("class") != "current") {
		var format = unescape($(this).attr("code"));
		var identity = $(this).parent().attr("identity");
		var post = $("textarea[identity='" + identity + "']");
	
		if (escape(post.val()) == $(this).parent().find("a.current").attr("code")) {
			post.val(format);
		}
		else {
			if (escape(post.val()).indexOf($(this).parent().find("a.current").attr("code")) != -1) {
				var content = escape(post.val()).replace($(this).parent().find("a.current").attr("code"), "");
				content = content.replace("%0A" + repeat("%0A", pref['posts.settings.quotes.rangeNumber']), "");
				post.val(unescape(content));
			}
			if (pref['posts.settings.quotes.endOfFormat'] == true) {
				post.val(format + "\n" + repeat("\n", pref['posts.settings.quotes.rangeNumber']) + post.val());
			}
			else {
				post.val(post.val() + "\n" + repeat("\n", pref['posts.settings.quotes.rangeNumber']) + format);
			}
		}
	
		$("select[name=basic_type][identity='" + identity + "']").val($(this).attr("poststyle"));
		$(this).parent().find("a").removeClass("current");
		$(this).addClass("current");
	}
	return false;
});
}
}
// ---

// Get Storage
chrome.storage.sync.get(null, function(response) {
	// Defaults
	var prefs = {
		'posts.formatter.formats': [{"format":"%5Bsize%3D11%5D%5Bb%5D%5Bcolor%3Ddarkslategray%5DExploring%20the%5B/color%5D%20%5Bcolor%3Dgoldenrod%5Dworld%5B/color%5D%20%5Bcolor%3Ddarkslategray%5Dwill%20never%20mean%5B/color%5D%5B/b%5D%5B/size%5D%5Balign%3Dcenter%5D%0A%0A%0ATo%20customize%20this%20post%20format%20and%20add%20others%2C%20go%20to%20your%20GaiaPlus%20Settings%20in%20Chrome.%0AFor%20help%2C%20%5Burl%3Dhttp%3A//www.gaiaonline.com/forum/t.87267181/%5Dvisit%20our%20thread%5B/url%5D.%0A%0A%0A%5B/align%5D%5Balign%3Dright%5D%5Bsize%3D11%5D%5Bb%5D%5Bcolor%3Ddarkslategray%5Das%5B/color%5D%20%5Bcolor%3Droyalblue%5Dmuch%5B/color%5D%20%5Bcolor%3Ddarkslategray%5Das%20when%20I%27m%20with%20you.%5B/color%5D%5B/b%5D%5B/size%5D%5B/align%5D","name":"Silver","style":"0"},{"format":"This%20should%20be%20under%20Platinum.","name":"Platinum","style":"1"},{"format":"This%20should%20be%20under%20Emerald.","name":"Emerald","style":"2"},{"format":"This%20should%20be%20under%20Crystal.","name":"Crystal","style":"3"},{"format":"This%20should%20be%20under%20Yellow.","name":"Yellow","style":"4"}],

		'posts.settings.pages.forums': true,
		'posts.settings.pages.guildForums': true,
		'posts.settings.pages.pms': true,
		'posts.settings.pages.profileComments': true,

		'posts.settings.quotes.endOfFormat': false,
		'posts.settings.quotes.removeFormatting': false,
		'posts.settings.quotes.rangeNumber': 2,

		'posts.settings.disable.postFormatter': false
	}

	for (var key in response) {prefs[key] = response[key];}
	BetterGaia_formatter(prefs);
});