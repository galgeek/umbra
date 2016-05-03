var umbraBehavior = {
	IDLE_TIMEOUT_SEC : 10,
	idleSince : null,
	alreadyClicked : {},

	intervalFunc : function() {
		var clickedSomething = false;
		var somethingLeftBelow = false;
		var somethingLeftAbove = false;
		// var cssSelector = "${click_css_selector}";

		//handle Python to JavaScript boolean conversion
		clickUntilTimeout == "True" ? clickUntilTimeout = true : clickUntilTimeout = false;
		
		var iframes = document.querySelectorAll("iframe");
		var documents = Array(iframes.length + 1);
		documents[0] = document;
		
		for (var i = 0; i < iframes.length; i++) {
			documents[i+1] = iframes[i].contentWindow.document;
		}

		for (var j = 0; j < documents.length; j++) {

			// var clickTargets = documents[j].querySelectorAll(cssSelector);
      var racinecoSections = document.querySelectorAll("td[id^='NavtwocolUserControl11_NavMeeting_item']");

			for ( var i = 0; i < racinecoSections.length; i++) {
				if (racinecoSections[i].umbraClicked && !clickUntilTimeout) {
					continue;
				}

				var where = this.aboveBelowOrOnScreen(racinecoSections[i]);

				if (where == 0) {
					console.log("clicking on " + racinecoSections[i].outerHTML);
					// do mouse over event on click target
					// since some urls are requsted only on
					// this event - see
					// https://webarchive.jira.com/browse/AITFIVE-451
					var mouseOverEvent = document.createEvent('Events');
					mouseOverEvent.initEvent("mouseover",true, false);
					racinecoSections[i].dispatchEvent(mouseOverEvent);
					racinecoSections[i].click();
					clickedSomething = true;
					this.idleSince = null;
					racinecoSections[i].umbraClicked = true;

          racinecoSectionPages = document.querySelectorAll(".GridFooterText>a");
          if (racinecoSectionPages.length == 0) {
            continue;
          }
          for (var p = 0; p < racinecoSectionPages.length; p++) {
  					console.log("clicking on " + racinecoSectionPages[i].outerHTML);
  					// do mouse over event on click target
  					// since some urls are requsted only on
  					// this event - see
  					// https://webarchive.jira.com/browse/AITFIVE-451
  					var mouseOverEvent = document.createEvent('Events');
  					mouseOverEvent.initEvent("mouseover",true, false);
  					racinecoSectionPages[i].dispatchEvent(mouseOverEvent);
  					racinecoSectionPages[i].click();
  					this.idleSince = null;
          }
				} else if (where > 0) {
					somethingLeftBelow = true;
				} else if (where < 0) {
					somethingLeftAbove = true;
				}
			}
		}

		if (!clickedSomething) {
			if (somethingLeftAbove) {
				// console.log("scrolling UP because everything on this screen has been clicked but we missed something above");
				window.scrollBy(0, -500);
				this.idleSince = null;
			} else if (somethingLeftBelow) {
				// console.log("scrolling because everything on this screen has been clicked but there's more below document.body.clientHeight="
				// 				+ document.body.clientHeight);
				window.scrollBy(0, 200);
				this.idleSince = null;
			} else if (window.scrollY + window.innerHeight < document.documentElement.scrollHeight) {
				// console.log("scrolling because we're not to the bottom yet document.body.clientHeight="
				// 				+ document.body.clientHeight);
				window.scrollBy(0, 200);
				this.idleSince = null;
			} else if (this.idleSince == null) {
				this.idleSince = Date.now();
			}
		}

		if (!this.idleSince) {
			this.idleSince = Date.now();
		}
	},

	start : function() {
		var that = this;
		this.intervalId = setInterval(function() {
			that.intervalFunc()
		}, 250);
	},

	isFinished : function() {
		if (this.idleSince != null) {
			var idleTimeMs = Date.now() - this.idleSince;
			if (idleTimeMs / 1000 > this.IDLE_TIMEOUT_SEC) {
				return true;
			}
		}
		return false;
	},

	aboveBelowOrOnScreen : function(e) {
		var eTop = e.getBoundingClientRect().top;
		if (eTop < window.scrollY) {
			return -1; // above
		} else if (eTop > window.scrollY + window.innerHeight) {
			return 1; // below
		} else {
			return 0; // on screen
		}
	},
};

// Called from outside of this script.
var umbraBehaviorFinished = function() {
	return umbraBehavior.isFinished()
};

umbraBehavior.start();
