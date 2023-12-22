function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

const maliciousUrl = getQueryParam('url');
console.log("Extracted URL:", maliciousUrl); // For debugging
if (maliciousUrl) {
    const styledUrl = `<span style="color: white; width: 10vh; font-size: larger;">${maliciousUrl}</span>`; 
    let warning =  document.getElementById('warning-message');
    warning.style.width = '60vh';
    warning.style.fontFamily = 'sans-serif'
    document.getElementById('warning-message').innerHTML = `<br>Trying to access dangerous website detected! <br> The website ${styledUrl} is considered malicious.`;
}







