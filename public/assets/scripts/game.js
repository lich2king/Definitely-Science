function isInIframeAndSameDomain() {
    try {
        // Check if the current page is within an iframe
        if (window.self !== window.parent) {
            // Check if the parent page (window.parent) is from the same domain
            if (window.parent.location.hostname === window.location.hostname) {
                return {
                    inIframe: true,
                    sameDomain: true
                };
            } else {
                return {
                    inIframe: true,
                    sameDomain: false
                };
            }
        } else {
            // The page is not in an iframe
            return {
                inIframe: false,
                sameDomain: false
            };
        }
    } catch (e) {
        // If accessing window.parent.location.hostname throws an error, 
        // it means the iframe is on a different domain
        return {
            inIframe: true,
            sameDomain: false
        };
    }
}

// Call the function and check the result
const result = isInIframeAndSameDomain();

let canRedir = true;
try {
    const query = window.location.search;
    if (query) {
        const params = new URLSearchParams(query);
        if (params.has('school') && params.get('school') === '1') {
            canRedir = false;
        }
    }
} catch (error) {
    console.error("Error parsing URL parameters:", error);
}

if (canRedir && result.inIframe && !result.sameDomain) {
	
	const getRootDomain = (hostname) => {
        const parts = hostname.split('.');
        return parts.length > 2 ? parts.slice(-2).join('.') : hostname;
    };
    const rootDomain1 = getRootDomain(window.location.hostname);
	
	if (rootDomain1 === "googleapis.com" && window.self !== window.parent)
	{
		console.log("pre gg");
		window.location.href = './pre-gg.html';
	}
	else if (rootDomain1 !== "freezenova.com" && rootDomain1 !== "onlinegames.io"
		&& rootDomain1 !== "totallyscience.co" && window.self !== window.parent)
	{
		// Redirect to pre.html if the page is in an iframe and not on the same domain
		console.log("pre");
		window.location.href = './pre.html';
	}
}
