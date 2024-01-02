document.getElementById('reportSite').addEventListener('click', function() {
    // Implement the functionality to report a site
    console.log("Report Site button has been pressed.");
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var activeTab = tabs[0];
        chrome.runtime.sendMessage({ action: "reportWebsite", url: activeTab.url });
    });
});

document.getElementById('goToHomepage').addEventListener('click', function() {
    window.open('dashboard.html', '_blank');
});

document.getElementById('checkSafeSite').addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var activeTab = tabs[0];
        chrome.runtime.sendMessage({ action: "scanWebsite", url: activeTab.url });
    });
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === "showWarning") {
        showWarningPopup();
    }
});

function showWarningPopup() {
    var warningHtml = `
        <div style="background-color: red; color: white; padding: 20px; border-radius: 5px;">
            <strong>Warning!</strong> This site may be dangerous.
        </div>
    `;
    document.body.innerHTML = warningHtml;
}


function showSafeSitePopup(url, tabId) {
    const safepageurl = `safePopup.html?url=${encodeURIComponent(url)}`;
    chrome.tabs.update(tabId, { url: safepageurl });
}



document.getElementById('checkSafeSite').addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var activeTab = tabs[0];
        chrome.runtime.sendMessage({ 
            action: "showSafeSitePopup", 
            url: activeTab.url 
        });
    });
});