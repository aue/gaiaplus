// Options JS (c) BetterGaia and bowafishtech

var options = {
	message: function(message) {
		$("#message").stop().addClass("show").delay(2000).queue(function(next){$(this).removeClass("show"); next();});
	},

	// Set up page
	prepare: function() {
		chrome.storage.sync.get({'posts.settings.disable.postFormatter': false}, function(r) {
			alert('You seem to have BetterGaia installed, meaning your post formats with BetterGaia will apply first.')
		});

		// -- Add post formats
		chrome.storage.sync.get({'posts.formatter.formats': [{"format":"%5Bsize%3D11%5D%5Bb%5D%5Bcolor%3Ddarkslategray%5DExploring%20the%5B/color%5D%20%5Bcolor%3Dgoldenrod%5Dworld%5B/color%5D%20%5Bcolor%3Ddarkslategray%5Dwill%20never%20mean%5B/color%5D%5B/b%5D%5B/size%5D%5Balign%3Dcenter%5D%0A%0A%0ATo%20customize%20this%20post%20format%20and%20add%20others%2C%20go%20to%20your%20GaiaPlus%20Settings%20in%20Chrome.%0AFor%20help%2C%20%5Burl%3Dhttp%3A//www.gaiaonline.com/forum/t.87267181/%5Dvisit%20our%20thread%5B/url%5D.%0A%0A%0A%5B/align%5D%5Balign%3Dright%5D%5Bsize%3D11%5D%5Bb%5D%5Bcolor%3Ddarkslategray%5Das%5B/color%5D%20%5Bcolor%3Droyalblue%5Dmuch%5B/color%5D%20%5Bcolor%3Ddarkslategray%5Das%20when%20I%27m%20with%20you.%5B/color%5D%5B/b%5D%5B/size%5D%5B/align%5D","name":"Silver","style":"0"},{"format":"This%20should%20be%20under%20Platinum.","name":"Platinum","style":"1"},{"format":"This%20should%20be%20under%20Emerald.","name":"Emerald","style":"2"},{"format":"This%20should%20be%20under%20Crystal.","name":"Crystal","style":"3"},{"format":"This%20should%20be%20under%20Yellow.","name":"Yellow","style":"4"}]}, function(pref) {
			var postformating = pref['posts.formatter.formats'];
			var formats = "";
		
			if (postformating.length >= 1 && postformating[0] != "") {
				$.each(postformating, function(key, value) {			
					var select_style = $("<select><option value='0'>Say</option><option value='1'>Whisper</option><option value='2'>Shout</option><option value='3'>Think</option><option value='4'>Document</option><option value='5'>Ornate</option></select>").find("[value='" + unescape(value["style"]) + "']").attr("selected","selected").parent().wrap("<div />").parent().html();
			
					formats += "<li formatname='" + unescape(value["name"]) + "'>\
						<div class='tools'><a class='edit'>Edit</a> | <a class='delete'>Delete</a></div>\
						<div class='ask'>\
							<h3>Edit <span class='close' title='Close'>&#10005;</span></h3>\
							<div class='preview right'>" + bbcode_parser(unescape(value["format"])) + "</div>\
							<div class='form'>\
								<input type='text' value='" + unescape(value["name"]) + "' maxlength='50' placeholder='Name' />\
								<textarea class='code'>" + unescape(value["format"]) + "</textarea>\
								" + select_style + "\
							</div>\
						</div>\
					</li>";
				});
				$("#postformating aside").append(formats);
			}
		});
		// -- END post formats
		
		// Range number for quote new lines
		chrome.storage.sync.get({'posts.settings.quotes.rangeNumber': 2}, function(pref) {
			$(".page.postformatting li.range input[pref='posts.settings.quotes.rangeNumber']").val(pref['posts.settings.quotes.rangeNumber']);
			$(".page.postformatting li.range span.value").text(pref['posts.settings.quotes.rangeNumber']);	
		});

		this.loadPrefs();
	},

	// Fill in current values from local storage
	loadPrefs: function() {
		// Checkbox prefs
		$("input[type='checkbox'][pref]").each(function() {			
			var name = $(this);
			chrome.storage.sync.get(name.attr("pref"), function(pref) {
				if ($.isEmptyObject(pref)) return;
				else if (pref[name.attr("pref")] === true) name.prop("checked", true);
				else if (pref[name.attr("pref")] === false) name.prop("checked", false);
				else name.prop("disabled", true);
			});
		});

		this.run();
	},

	// Update prefs
	run: function() {
		// Checkbox prefs
		$("input[type='checkbox'][pref]:not([disabled])").change(function() {
			var pref = {};
			if ($(this).prop("checked")) pref[$(this).attr("pref")] = true;
			else pref[$(this).attr("pref")] = false;
			chrome.storage.sync.set(pref, function(response){
				if (chrome.runtime.lastError) alert('Error: Try again later./n/n' + chrome.runtime.lastError.message);
				else message();
			});
		});

		// Enable ask popup		
		$(".page").on("click", ".ask h3 .close", function() {
			$(this).parent().parent().hide();
		});

		// Post Formatter
		$("#postformating .save").click(function(){		
			var postformats = $("#postformating aside li div.ask");
			var list = [];

			$.each(postformats, function(key, value) {
				var name = $(value).find("input").val();
				var code = $(value).find("textarea").val();
				var style = $(value).find("select").val();
		
				list.push({"name": escape(name), "format": escape(code), "style": escape(style)});
			});

			chrome.storage.sync.set({'posts.formatter.formats': list}, function(response){
				if (chrome.runtime.lastError) alert('Error: Try again later./n/n' + chrome.runtime.lastError.message);
				else {
					$("#postformating").delay(500).queue(function(next) {$(this).removeClass("needtosave"); next();});
					message();
				}
			});
		});

		$("#postformating").click(function(){ $(this).addClass("needtosave"); });
		$("#postformating aside").on("click", "li .tools .edit", function(){ 
			$("#postformating aside > li .ask").hide();
			$(this).parent().parent().find('.ask').show(); 
			
			$("#postformating aside > li").removeClass("editing");
			$(this).parent().parent().addClass("editing");
		});
		$("#postformating aside").on("click", ".tools .delete", function(){ $(this).parent().parent().remove(); });

		$("#postformating aside").on("keyup", ".ask input[type='text']", function(){ 
			$(this).parent().parent().parent().attr("formatname", $(this).val());
		});
		$("#postformating aside").on("keyup", ".ask textarea.code", function(){ 
			$(this).parent().parent().find(".preview").html(bbcode_parser($(this).val()));
		});

		$("#postformating aside").on("click", ".ask h3 .close", function() {
			$(this).parent().parent().parent().removeClass("editing");
		});
	
			// Add format
			$("#postformating .add").click(function(){
				_gaq.push(['_trackEvent', 'Settings', 'clicked', 'Add Format']);
				
				if ($("#postformating aside li").length >= 30) {
					alert("For sanity reasons, we limit the amount of formats you can have to 30.");
				}
				else {
					var format = unescape("%5Bsize%3D11%5D%5Bb%5D%5Bcolor%3Dlightgrey%5DAs%20time%5B/color%5D%20%5Bcolor%3Dsteelblue%5Dgoes%20by%5B/color%5D%20%5Bcolor%3Dlightgrey%5Dand%20we%20grow%5B/color%5D%20%5Bcolor%3Dslategray%5Dolder%5B/color%5D%5Bcolor%3Dlightgrey%5D...%5B/color%5D%5B/b%5D%5B/size%5D%5Balign%3Dcenter%5D%0A%0A%0ATo%20customize%20this%20post%20format%20and%20add%20others%2C%20go%20to%20your%20GaiaPlus%20Settings%20in%20Chrome.%0AFor%20help%2C%20%5Burl%3Dhttp%3A//www.gaiaonline.com/forum/t.87267181/%5Dvisit%20our%20thread%5B/url%5D.%0A%0A%0A%5B/align%5D%5Balign%3Dright%5D%5Bsize%3D11%5D%5Bb%5D%5Bcolor%3Dlightgrey%5Dthe%5B/color%5D%20%5Bcolor%3Dbrown%5Dworld%5B/color%5D%20%5Bcolor%3Dlightgrey%5Dbrings%20us%5B/color%5D%20%5Bcolor%3Ddarkorange%5Dcloser%5B/color%5D%5Bcolor%3Dlightgrey%5D.%5B/color%5D%5B/b%5D%5B/size%5D%5B/align%5D");

					$("<textarea class='code'></textarea>").val();
					$("#postformating aside").append("<li formatname='Beyond'>\
						<div class='tools'><a class='edit'>Edit</a> | <a class='delete'>Delete</a></div>\
						<div class='ask'>\
							<h3>Edit <span class='close' title='Close'>&#10005;</span></h3>\
							<div class='preview right'>" + bbcode_parser(format) + "</div>\
							<div class='form'>\
								<input type='text' value='Beyond' maxlength='50' placeholder='Name' />\
								<textarea class='code'>" + format + "</textarea>\
								<select><option value='0'>Say</option><option value='1'>Whisper</option><option value='2'>Shout</option><option value='3'>Think</option><option value='4'>Document</option><option value='5'>Ornate</option></select>\
							</div>\
						</div>\
					</li>");
				}
			});
	
		// Range number for quote new lines		
		$(".page.postformatting li.range input[pref='posts.settings.quotes.rangeNumber']").change(function(){
			$(".page.postformatting li.range span.value").html('&#8230;');
			if (this.sliderTimeout) clearTimeout(this.sliderTimeout);
			this.sliderTimeout = setTimeout(function() {
				var value = $(".page.postformatting li.range input[pref='posts.settings.quotes.rangeNumber']").val();
				$(".page.postformatting li.range span.value").text(value);
					chrome.storage.sync.set({'posts.settings.quotes.rangeNumber': parseInt(value, 10)}, function(response){
						if (chrome.runtime.lastError) alert('Error: Try again later./n/n' + chrome.runtime.lastError.message);
						else message();
					});
				message();
			}, 1000);
		});

		// Enable .list elements 
		$("section.list aside").sortable({distance: 30});
		
		// About
		$("#pages .page.about section input.agreeReset").click(function(){
			if($(this).prop("checked")) {
				$("#pages .page.about section button.reset").show();
				$(this).prop("disabled", true);
				_gaq.push(['_trackEvent', 'Settings', 'opened', 'Reset']);
			}
		});
		$("#pages .page.about section button.reset").click(function(){
			localStorage.clear();
			chrome.storage.sync.clear();
			chrome.extension.sendMessage({elements: 'reset'}, function(){
				chrome.runtime.reload();
			});
			_gaq.push(['_trackEvent', 'Settings', 'clicked', 'Reset']);
		});
	
		// Links
		$("menu a").click(function(){
			$("menu a.current").removeClass("current");
	
			var tab_class = $(this).attr("class");
			$("#pages .page").removeClass("selected");
			$("#pages .page." + tab_class).addClass("selected");
			location.hash = tab_class;
	
			$(this).addClass("current");
			_gaq.push(['_trackEvent', 'Settings Sidebar', 'opened', $(this).text()]);
		});
	}
}

function message(message) {options.message(message);}

function bbcode_parser(str) {
	search = new Array(
	      /\[b\]([\s\S]*?)\[\/b\]/ig, 
	      /\[i\]([\s\S]*?)\[\/i\]/ig,
	      /\[u\]([\s\S]*?)\[\/u\]/ig,
	      /\[strike\](.*?)\[\/strike\]/ig,
	      /\[img\](.*?)\[\/img\]/ig,
	      /\[img(left|right)\](.*?)\[\/img(left|right)\]/ig,
	      /\[imgmap\](.*?)\[\/imgmap\]/ig,
	      /\[url\="?(.*?)"?\](.*?)\[\/url\]/ig,
	      /\[url\](.*?)\[\/url\]/ig,
	      /\[code\]([\s\S]*?)\[\/code\]/ig,
	      /\[quote\]([\s\S]*?)\[\/quote\]/ig,
	      /\[quote\="?(.*?)"?\]([\s\S]*?)\[\/quote\]/ig,
	      /\[color\=(.*?)\]([\s\S]*?)\[\/color\]/ig,
	      /\[size\="?(.*?)"?\]([\s\S]*?)\[\/size\]/gi,
	      /\[align\="?(right|left|center)"?\]([\s\S]*?)\[\/align\]/ig,
	      /\[align\=(.*?)\]([\s\S]*?)\[\/align\]/ig,
	      /\[list\="?(.*?)"?\]([\s\S]*?)\[\/list\]/gi,
	      /\[list\]/gi,
	      /\[\/list\]/gi,
	      /\[\*\]\s?(.*?)\n/ig,
	      /\n\n/ig,
	      /\[center\]([\s\S]*?)\[\/center\]/ig,
	      /\[left\]([\s\S]*?)\[\/left\]/ig,
	      /\[right\]([\s\S]*?)\[\/right\]/ig);
	
	replace = new Array(
	      "<strong>$1</strong>",
	      "<em>$1</em>",
	      "<span style=\"text-decoration: underline\">$1</span>",
	      "<span style=\"text-decoration: line-through\">$1</span>",
	      "<img src=\"$1\" alt=\"User Image\" />",
	      "<img src=\"$2\" style=\"float:$1;\" alt=\"User Image\" />",
	      "<img src=\"$1\" ismap=\"ismap\" alt=\"User Image\" />",
	      "<a href=\"$1\">$2</a>",
	      "<a href=\"$1\">$1</a>",
	      "<div class=\"code\">test</div>",
	      "<div class=\"quote\"><div class=\"cite\">Quote:</div><div class=\"quoted\">$1<div class=\"clear\"></div></div></div>",
	      "<div class=\"quote\"><div class=\"cite\">$1</div><div class=\"quoted\">$2<div class=\"clear\"></div></div></div>",
	      "<span style=\"color:$1\">$2</span>",
	      "<span style=\"font-size: $1px\">$2</span>",
	      "<div class=\"postcontent-align-$1\" style=\"text-align: $1\">$2</div>",
	      "$1",
	      "<ol>$2</ol>",
	      "<ul>",
	      "</ul>",
	      "<li>$1</li>",
	      "<br />",
	      "<div class=\"postcontent-align-center\" style=\"text-align: center\">$1</div>",
	      "<div class=\"postcontent-align-left\" style=\"text-align: left\">$1</div>",
	      "<div class=\"postcontent-align-right\" style=\"text-align: right\">$1</div>");
	
	var test;
	
	for (i = 0; i < search.length; i++) {
	    var stop = false;
	    while(stop==false)
	    {
	    	str = str.replace(search[i], replace[i]);
	    	test = str.match(search[i]);
	    	if(test==null) {
	    		stop = true;
	    	}
	    }
	}
		
	return str;
}

$(document).ready(function() {
	options.prepare();
});