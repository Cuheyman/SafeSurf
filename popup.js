

document.getElementById('reportSite').addEventListener('click', function() {
    // Implement the functionality to report a site
    console.log("I HAVE BEEN PRESSED.")
});

document.getElementById('goToHomepage').addEventListener('click', function() {
    window.open('https://safesurf.com', '_blank');
});

document.getElementById('scanSite').addEventListener('click', function() {
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
    // You can append this HTML to your popup or create a new HTML file and open it in a new tab/window
    document.body.innerHTML = warningHtml; // This will replace the current popup content
}

document.getElementById('reportSite').addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var activeTab = tabs[0];
        reportWebsite(activeTab.url);
    });
});
