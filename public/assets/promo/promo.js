class AdManager {
  constructor(ads) {
    this.ads = ads;
	this.currentAd = null;
    this.adContainer = null;
    this.adIframe = null;
    this.skipButton = null;
    this.overlay = null;
    this.currentAdIndex = -1;
	
	this.skipInterval = null;
	this.autoCloseTimeout = null;
	this.adChangeTimeout = null;
	
	this.onRewardedReady = () => {};
    this.onRewardedSuccess = () => {};
    this.onRewardedFail = () => {};
    this.onRewardedClose = () => {};
	
	this.promoLocation = "/assets/promo/";
	  
	this.useAbsoluteLinks = false;
	this.classroomGames = false;
	
    this.init();
  }

  // Initialize the ad manager
  init() {
    this.createStyles();

    const path = window.location.pathname;
    const host = window.location.host;

    if (host === 'storage.googleapis.com') {
        this.promoLocation = '/freezenova/assets/promo/';
    } else if (path != null) {
        this.promoLocation = '/assets/promo/';
    }
}

  // Dynamically inject CSS
  createStyles() {
    const style = document.createElement('style');
    style.innerHTML = `
      body {
        margin: 0;
        font-family: Arial, sans-serif;
      }

      #ad-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8); /* Dark overlay */
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
      }

      #ad-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5); /* Background dimming */
        z-index: 1; /* Keep behind iframe */
      }

      #ad-container iframe {
        width: 80%;
        height: 80%;
        border: none;
        border-radius: 8px;
        overflow: hidden;
        z-index: 2; /* On top of the overlay */
      }

      #skip-button {
        position: absolute;
        bottom: 20px;
        right: 20px;
        padding: 10px 20px;
        background-color: rgba(0, 0, 0, 0.7);
        color: white;
        border: 2px solid white; /* Add a white border for the box effect */
        border-radius: 5px;
        cursor: pointer;
        z-index: 3; /* On top of iframe */
        text-align: center;
        font-size: 16px;
        font-weight: bold;
      }
	  
	  #skip-button:hover {
		background-color: white;
		color: black;
		transition: background-color 0.3s, color 0.3s;
	}

      .adhidden {
        display: none;
      }
    `;
    document.head.appendChild(style);
  }
  
  selectAd(nextAd) {
	  if (window.location.pathname.includes(nextAd.id))
	  {
		  this.currentAdIndex = (this.currentAdIndex + 1) % this.ads.length;
		  nextAd = this.ads[this.currentAdIndex];
	  }
	  
	  this.currentAd = nextAd;
	  
	  const path = window.location.pathname;
	  if (path != null && this.useAbsoluteLinks)
	  {
		  if (!this.currentAd.url.includes("https://"))
		  {
			  this.currentAd.url = "https://unblocked-games.s3.amazonaws.com" + this.currentAd.url;
		  }
	  }
  }

  // Create ad container and elements
  createAdContainer() {
    this.adContainer = document.createElement('div');
    this.adContainer.id = 'ad-container';
    this.adContainer.classList.add('adhidden');
    document.body.appendChild(this.adContainer);

    this.overlay = document.createElement('div');
    this.overlay.id = 'ad-overlay';
    this.adContainer.appendChild(this.overlay);

    this.adIframe = document.createElement('iframe');
    this.adIframe.id = 'ad-iframe';
    this.adContainer.appendChild(this.adIframe);

    this.skipButton = document.createElement('div');
    this.skipButton.id = 'skip-button';
    //this.skipButton.classList.add('adhidden');
    this.skipButton.textContent = 'Skip';
    this.adContainer.appendChild(this.skipButton);
  }

  // Remove ad elements from the DOM
  closeAd() {
    if (this.adContainer) {
      this.adContainer.remove();
	  this.currentAd = null;
      this.adContainer = null;
      this.adIframe = null;
      this.skipButton = null;
      this.overlay = null;
    }
	
	if (this.skipInterval != null) clearInterval(this.skipInterval);
	if (this.autoCloseTimeout != null) clearTimeout(this.autoCloseTimeout);
	if (this.adChangeTimeout != null) clearTimeout(this.adChangeTimeout);
	  
	this.skipInterval = null;
	this.autoCloseTimeout = null;
	this.adChangeTimeout = null;
  }

  // Show a random ad
  refetchAd(onAdEnd) {
	try {
		this.closeAd();
		this.createAdContainer();
	  
		this.currentAdIndex = Math.floor(Math.random() * this.ads.length);
		this.selectAd(this.ads[this.currentAdIndex]);

		// Set iframe source with query parameters
		const iframeSrc = this.promoLocation + `promo.html?name=${encodeURIComponent(this.currentAd.name)}&img=${encodeURIComponent(this.currentAd.image)}&url=${encodeURIComponent(this.currentAd.url)}`;
		this.adIframe.src = iframeSrc;

		this.adContainer.classList.remove('adhidden');

		const skipTime = 3; //ad.type === "0" ? 5 : 10; // Skip button appears after this time
		const autoCloseTime = 30; // Auto-close time based on type
		//const adChangeTime = this.currentAd.timer; // Time to change the ad (from JSON)

		// Skip button logic
		//this.skipButton.textContent = `Skip in ${skipTime}`; // Initialize with "Skip in X"
		this.skipButton.classList.remove('enabled');
		this.skipButton.style.cursor = 'not-allowed'; // Disable cursor
		this.skipButton.onclick = null; // Ensure it's not clickable initially

		let remainingTime = skipTime;
		this.skipButton.textContent = `Skip in ${remainingTime}`;
		remainingTime--;
		
		this.skipInterval = setInterval(() => {
		  if (remainingTime <= 0) {
			this.skipButton.textContent = 'Skip Ad \u25B6\u25B6'; // Update text to "Skip" u23E9
			this.skipButton.classList.add('enabled');
			this.skipButton.style.cursor = 'pointer'; // Enable cursor
			this.skipButton.onclick = () => {
			  this.closeAd();
			  if (onAdEnd) { onAdEnd(); onAdEnd = null; } 
			};
			clearInterval(this.skipInterval); // Stop updating remaining time
		  } else {
			this.skipButton.textContent = `Skip in ${remainingTime}`; // Update countdown
		  }
		  remainingTime--;
		}, 1000);

		// Automatically close the ad after the specified auto-close time
		this.autoCloseTimeout = setTimeout(() => {
		  this.closeAd(); // Close the current ad
		  if (onAdEnd) { onAdEnd(); onAdEnd = null; } 
		}, autoCloseTime * 1000);

		// Automatically change the ad after `adChangeTime`
		this.adChangeTimeout = setTimeout(() => {
		  this.updateAd(); // Update the ad content
		}, this.currentAd.timer * 1000);
		  
	} catch (error) {
		console.error("Error in showAd:", error);
		this.closeAd();
		if (onAdEnd) { onAdEnd(); onAdEnd = null; } 
	}
	
  }
  
   updateAd() {
	  this.currentAdIndex = (this.currentAdIndex + 1) % this.ads.length; // Move to the next ad
	  this.selectAd(this.ads[this.currentAdIndex]);

	  // Update iframe source with query parameters
	  const iframeSrc = this.promoLocation + `promo.html?name=${encodeURIComponent(this.currentAd.name)}&img=${encodeURIComponent(this.currentAd.image)}&url=${encodeURIComponent(this.currentAd.url)}`;
	  this.adIframe.src = iframeSrc;
	  
	  this.adChangeTimeout = setTimeout(() => {
		  this.updateAd(); // Update the ad content
		}, this.currentAd.timer * 1000);
	}

    // Start
	start() {
	    //this.refetchAd();
		console.log("Promo start");
	}
	
	triggerRewardedReady() {
        if (typeof this.onRewardedReady === 'function') {
            this.onRewardedReady();
        }
    }

    triggerRewardedSuccess() {
        if (typeof this.onRewardedSuccess === 'function') {
            this.onRewardedSuccess();
        }
    }

    triggerRewardedFail() {
        if (typeof this.onRewardedFail === 'function') {
            this.onRewardedFail();
        }
    }

    triggerRewardedClose() {
        if (typeof this.onRewardedClose === 'function') {
            this.onRewardedClose();
        }
    }
  
    registerRewardCallbacks(callbacks) {
        this.onRewardedReady = callbacks.onReady || (() => {});
        this.onRewardedSuccess = callbacks.onSuccess || (() => {});
        this.onRewardedFail = callbacks.onFail || (() => {});
        this.onRewardedClose = callbacks.onClose || (() => {});

        console.log("Reward callbacks registered successfully.");
		
		this.triggerRewardedReady();
    }
	
	showRewardAd() {
		
		try {
			this.closeAd();
			this.createAdContainer();
		  
			this.currentAdIndex = Math.floor(Math.random() * this.ads.length);
			this.selectAd(this.ads[this.currentAdIndex]);

			// Set iframe source with query parameters
			const iframeSrc = this.promoLocation + `promo.html?name=${encodeURIComponent(this.currentAd.name)}&img=${encodeURIComponent(this.currentAd.image)}&url=${encodeURIComponent(this.currentAd.url)}`;
			this.adIframe.src = iframeSrc;

			this.adContainer.classList.remove('adhidden');

			const skipTime = 5; //ad.type === "0" ? 5 : 10; // Skip button appears after this time
			const autoCloseTime = 40; // Auto-close time based on type
			//const adChangeTime = this.currentAd.timer; // Time to change the ad (from JSON)

			// Skip button logic
			//this.skipButton.textContent = `Reward in ${skipTime}`; // Initialize with "Skip in X"
			this.skipButton.classList.remove('enabled');
			this.skipButton.style.cursor = 'not-allowed'; // Disable cursor
			this.skipButton.onclick = null; // Ensure it's not clickable initially

			let remainingTime = skipTime;
			this.skipButton.textContent = `Reward in ${remainingTime}`;
			remainingTime--;
			
			this.skipInterval = setInterval(() => {
			  if (remainingTime <= 0) {
				this.skipButton.textContent = 'Get Reward \u25B6\u25B6'; // Update text to "Skip" u23E9
				this.skipButton.classList.add('enabled');
				this.skipButton.style.cursor = 'pointer'; // Enable cursor
				this.skipButton.onclick = () => {
				  this.closeAd();
				  this.triggerRewardedSuccess();
				  this.triggerRewardedClose();
				  this.triggerRewardedReady();
				};
				clearInterval(this.skipInterval); // Stop updating remaining time
			  } else {
				this.skipButton.textContent = `Reward in ${remainingTime}`; // Update countdown
			  }
			  remainingTime--;
			}, 1000);

			// Automatically close the ad after the specified auto-close time
			this.autoCloseTimeout = setTimeout(() => {
			  this.closeAd(); // Close the current ad
			  this.triggerRewardedSuccess();
			  this.triggerRewardedClose();
			  this.triggerRewardedReady();
			}, autoCloseTime * 1000);

			// Automatically change the ad after `adChangeTime`
			this.adChangeTimeout = setTimeout(() => {
			  this.updateAd(); // Update the ad content
			}, this.currentAd.timer * 1000);
			  
		} catch (error) {
			console.error("Error in showAd:", error);
			this.closeAd();
			this.triggerRewardedFail();
			this.triggerRewardedClose();
			this.triggerRewardedReady();
		}
		
	}
	

}

window.syncPromoManager = function(fast)
{
	try {
        const query = window.location.search;
        if (query) {
            const params = new URLSearchParams(query);
            if (params.has('school') && params.get('school') === '1') {
                return;
            }
        }
    } catch (error) {
        console.error("Error parsing URL parameters:", error);
    }
	
	
	let t = fast == true ? 100 : 1000;
	//console.log(t);
	
	setTimeout(() => 
	{
		
		// if (typeof window.preroll === 'undefined' ||
			// typeof window.preroll.config === "undefined" ||
			// typeof window.preroll.config.loaderObjectName === "undefined" ||
			// typeof window[preroll.config.loaderObjectName] === "undefined"
			// )
		if (typeof window.preroll === 'undefined')
		{
			if (typeof window.preroll === 'undefined') {
				window.preroll = {};
			}

			if (typeof window.preroll.config === 'undefined') {
				window.preroll.config = {};
			}

			if (typeof window.preroll.config.loaderObjectName === 'undefined') {
				window.preroll.config.loaderObjectName = "adManager";
			}

			if (typeof window[window.preroll.config.loaderObjectName] != 'undefined')
			{
				window[window.preroll.config.loaderObjectName].start();
			}
			// if (typeof window[window.preroll.config.loaderObjectName] === 'undefined') {
				// window[window.preroll.config.loaderObjectName] = {};
			// }
		}
		
	}, t);
}

if (window.wgLoaded == 1)
{
	window.syncPromoManager(false);
}
else if (window.wgLoaded == 2)
{
	window.syncPromoManager(true);
}


// Initialize the ad manager and start showing ads
// ad url => local if page url contains /games/ otherwise the website is not hosted on this domain and we have to use absolute url
window.adManager = new AdManager([
  {
    id: "survival-karts",
    name: "Survival Karts",
    url: "https://unblocked-games.s3.amazonaws.com/survival-karts.html",
    image: "./img/survival-karts.webp",
    timer: 11
  },
  {
    id: "block-blast",
    name: "Block Blast",
    url: "https://unblocked-games.s3.amazonaws.com/block-blast.html",
    image: "./img/block-blast.webp",
    timer: 11
  },
  {
    id: "cake-match-puzzle",
    name: "Cake Match Puzzle",
    url: "https://unblocked-games.s3.amazonaws.com/cake-match-puzzle.html",
    image: "./img/cake-match-puzzle.webp",
    timer: 11
  },
  {
    id: "basketball-king",
    name: "Basketball King",
    url: "https://unblocked-games.s3.amazonaws.com/basketball-king.html",
    image: "./img/basketball-king.webp",
    timer: 11
  },
  {
    id: "basket-hoop",
    name: "Basket Hoop",
    url: "https://unblocked-games.s3.amazonaws.com/basket-hoop.html",
    image: "./img/basket-hoop.webp",
    timer: 11
  },
  {
    id: "stickman-parkour",
    name: "Stickman Parkour",
    url: "https://unblocked-games.s3.amazonaws.com/stickman-parkour.html",
    image: "./img/stickman-parkour.webp",
    timer: 11
  },
  {
    id: "egg-car-racing",
    name: "Egg Car Racing",
    url: "https://unblocked-games.s3.amazonaws.com/egg-car-racing.html",
    image: "./img/egg-car-racing.webp",
    timer: 11
  },
  {
    id: "geometry-escape",
    name: "Geometry Escape",
    url: "https://unblocked-games.s3.amazonaws.com/geometry-escape.html",
    image: "./img/geometry-escape.webp",
    timer: 11
  },
  {
    id: "police-chase-drifter",
    name: "Police Chase Drifter",
    url: "https://unblocked-games.s3.amazonaws.com/police-chase-drifter.html",
    image: "./img/police-chase-drifter.webp",
    timer: 11
  },
  {
    id: "highway-traffic",
    name: "Highway Traffic",
    url: "https://unblocked-games.s3.amazonaws.com/highway-traffic.html",
    image: "./img/highway-traffic.jpg",
    timer: 11
  },
  {
    id: "online-games",
    name: "Online Games.io",
    url: "https://www.onlinegames.io/",
    image: "./img/onlinegames-mascot.png",
    timer: 11
  },
  {
    id: "stickman-gta-city",
    name: "Stickman Gta City",
    url: "https://unblocked-games.s3.amazonaws.com/stickman-gta-city.html",
    image: "./img/stickman-gta-city.webp",
    timer: 11
  },
  {
    id: "snake",
    name: "Snake",
    url: "https://unblocked-games.s3.amazonaws.com/snake.html",
    image: "./img/snake.webp",
    timer: 11
  },
  {
    id: "self-hosting",
    name: "Self-Hosting FreezeNova",
    url: "https://github.com/freezenova/freezenova.github.io",
    image: "./img/selfhosting-freezenova.webp",
    timer: 11
  },
  {
    id: "totally-science",
    name: "Totally Science Games",
    url: "https://totallyscience.co/",
    image: "./img/totally-science.webp",
    timer: 11
  },
  {
    id: "unblocked-games-77",
    name: "Unblocked Games Premium 77",
    url: "https://sites.google.com/site/unblockedgames77/home",
    image: "./img/unblocked-games-77.webp",
    timer: 11
  },
  {
    id: "freezenova-youtube",
    name: "FreezeNova Websites on YouTube",
    url: "https://www.youtube.com/@freezenova",
    image: "./img/freezenova-youtube.webp",
    timer: 11
  },
  {
    id: "escape-car",
    name: "Escape Car",
    url: "https://unblocked-games.s3.amazonaws.com/escape-car.html",
    image: "./img/escape-car.webp",
    timer: 11
  },
  {
    id: "completely-science",
    name: "Completely Science",
    url: "https://d1tmbzjih4bfq6.cloudfront.net/",
    image: "./img/completely-science.webp",
    timer: 11
  }
]);


try
{
	// check if we need absolute links
	function unblockedGetParentUrl()
	{
		var isInIframe = (parent!==window),parentUrl=null;if(isInIframe){parentUrl=document.referrer}
				
		if (parentUrl != null && !parentUrl.includes("http"))
		{
			return null;
		}
				
		return parentUrl;
	}

	const currentIframeHref = unblockedGetParentUrl();
	if (currentIframeHref != null)
	{
		var referrer = new URL(currentIframeHref).hostname;
		var iframeDomain = window.location.hostname;
		
		if (referrer !== iframeDomain)
		{
			if (typeof window.adManager !== "undefined")
			{
				window.adManager.useAbsoluteLinks = true;
				//console.log("useAbsoluteLinks 1");
			}
		}
	}
	
	if (window.location.hostname.includes("cloudfront.net"))
	{
		if (typeof window.adManager !== "undefined")
		{
			window.adManager.useAbsoluteLinks = true;
			window.adManager.classroomGames = true;
			//console.log("useAbsoluteLinks 2");
		}
	}
	
	//console.log("promo init hostname " + window.location.hostname + " ,currentIframeHref: " + currentIframeHref);
}
catch(error)
{
	console.error("Error in unblockedGetParentUrl:", error);
}


//window.adManager.showAd();
//window.syncPromoManager();

// setTimeout(() => 
	// {
		// if (typeof window.preroll === 'undefined')
		// {
			// window.syncPromoManager();
		// }
		
	// }, 10000);