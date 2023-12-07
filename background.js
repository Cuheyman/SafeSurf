chrome.tabs.onActivated.addListener(activeInfo => {
    chrome.tabs.get(activeInfo.tabId, function(tab) {
        scanWebsite(tab.url, activeInfo.tabId);
    });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url) {
        scanWebsite(tab.url, tabId);
    }
});




chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === "scanWebsite") {
        scanWebsite(message.url);
    } else if (message.action === "reportWebsite") {
        reportWebsite(message.url);
    }
});


// http://malware.testing.google.test/testing/malware/ en hjemmeside for test. 


function reportWebsite(url) {
    var reportEndpoint = 'http://localhost:3000/report'; 

    var data = {
        url: url,
        reportedAt: new Date().toISOString(),
    };

    fetch(reportEndpoint, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        alert('Website reported successfully. Report ID: ' + data.id);
    })
    .catch(error => {
        console.error('Error reporting the website:', error);
    });
}
 


function scanWebsite(url , tabId) {
    console.log('Scanning URL:', url); 

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        console.log('Invalid URL for scanning:', url);
        return; 
    }

    var apiKey = 'AIzaSyAaBrAAp4eJ8NuwZH5ut6qyDX1yB4vOOfU';
    var apiURL = 'https://safebrowsing.googleapis.com/v4/threatMatches:find?key=' + apiKey;

    var requestBody = {
        client: {
            clientId: "yourClientID",
            clientVersion: "1.5.2"
        },
        threatInfo: {
            threatTypes: ["MALWARE", "SOCIAL_ENGINEERING"],
            platformTypes: ["WINDOWS"],
            threatEntryTypes: ["URL"],
            threatEntries: [{ url: url }]
        }
    };

    console.log('Request Body:', JSON.stringify(requestBody, null, 2)); // Log the request body

    fetch(apiURL, {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => {
        console.log('API Response Status:', response.status); // Log the response status
        return response.json();
    })
    .then(data => {
        console.log("API RESPONSE:", JSON.stringify(data, null, 2)); // Log the full API response
        if (data.matches) {
       // When you need to show a warning   
       const warningPageUrl = `warning.html?url=${encodeURIComponent(url)}`;
            chrome.tabs.update(tabId, { url: warningPageUrl });
chrome.runtime.sendMessage({ action: "showWarning" });

        } else {
            chrome.notifications.create({
                type: 'basic',
                iconUrl: 'logo.png', // Path to the icon
                title: 'Scan Result',
                message: 'This site is safe according to Google Safe Browsing.'
            });
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
