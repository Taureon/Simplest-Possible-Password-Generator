//put your master key here
const MASTERKEY = "";

//hashes a string
//https://stackoverflow.com/questions/55926281/how-do-i-hash-a-string-using-javascript-with-sha512-algorithm
function sha(str) {
    return crypto.subtle.digest("SHA-512", new TextEncoder("utf-8").encode(str)).then(buff => {
        return arrayBufferToBase64(buff);
    });
}

//convert array buffer into base64 encoded string
//https://stackoverflow.com/questions/9267899/arraybuffer-to-base64-encoded-string
function arrayBufferToBase64( buffer ) {
    var binary = '';
    var bytes = new Uint8Array( buffer );
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }
    return btoa( binary );
}

// input: "https://www.youtube.com/watch?v=w43LEH_atDg"
// output:            "youtube.com"
//essentially get the domain and the TLD but discard everything else
function getDomain(url) {

    // the url: "https://www.youtube.com/watch?v=w43LEH_atDg"
    // after splitting: ["https:", " ", "www.youtube.com", "watch?v=w43LEH_atDg"]
    // only grabbing this part           ^^^^^^^^^^^^^^^
    // and split at the dots: ["www", "youtube", "com"]
    let domain = url.split("/")[2].split(".");

    //remove all subdomains located left of the domain and the top level domain
    // ["youtube", "com"]
    while (domain.length > 2) domain.shift();

    //join it with dots: ["youtube", "com"] => "youtube.com"
    //and return it
    return domain.join('.');
}

//get current window
chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
    
    //if you dont understand what this means then not even god can save you
    let domain = getDomain(tabs[0].url);

    //hash the domain of window with the master key
    sha(domain + MASTERKEY).then(hashed => {

        //put out the hashed result
        document.getElementsByTagName('p')[0].innerText = `${domain}\n\n${hashed}`;
    });
});