function writeHeaderAndFooter(){
	var header = "\n __          __                          _           _ _\n"+
" \\ \\        / /                         (_)         (_) |\n"+
"  \\ \\  /\\  / /__  __ _ _ __   ___  _ __  _ _______   _| |_\n"+
"   \\ \\/  \\/ / _ \\/ _` | '_ \\ / _ \\| '_ \\| |_  / _ \\ | | __|\n"+
"    \\  /\\  /  __/ (_| | |_) | (_) | | | | |/ /  __/_| | |_\n"+
"     \\/  \\/ \\___|\\__,_| .__/ \\___/|_| |_|_/___\\___(_)_|\\__|\n"+
"                      | |\n"+
"                      |_|";

	var footer = "Nicholas Ferreira - 2023\n"+
	"Inspiration: <a href='https://ippsec.rocks/' target='_blank'>IppSec</a>";
	document.getElementsByClassName("header")[0].innerHTML = header;
	document.getElementsByClassName("footer")[0].innerHTML = footer;
}

var jsonData;
async function fetchJsonData() {
    try {
        var response = await fetch('data.json');
        jsonData = await response.json();
        displayJSON(jsonData);
    } catch (error) {
        console.error('Error fetching JSON data:', error);
    }
}

function safeUrl(str) {
    str = str.toLowerCase().replace(/\s+/g, '-');
    str = str.toLowerCase().replace('?', '');      
    return safeString(str);
}

function safeString(inputString) {
    var encodedString = inputString.replace(/[\u00A0-\u9999<>&]/gim, function(i) {
        return '&#' + i.charCodeAt(0) + ';';
    });
    return encodedString;
}

function displayJSON(jsonData){
    var jsonListDiv = document.getElementById('jsonList');
	isAbout = false;
    jsonData.forEach((data, index) => {
    	if(data.tags[0] == "about" && window.location.hash == "#about"){
	        var jsonContainer = document.createElement('div');
	        jsonContainer.innerHTML = `<a href="#${safeUrl(data.title)}"><h1 id="${safeUrl(data.title)}">${safeString(data.title)}</h1></a>
	                                   <h2>${safeString(data.description)}</h2>`;

	        var dataDiv = document.createElement('div');
	        Object.entries(data.data).forEach(([desc, data]) => {
	            dataDiv.innerHTML += `<span class="description">${safeString(desc)}</span><p class='about'>${safeString(data)}</p>`;
	        });

	        jsonContainer.appendChild(dataDiv);
			jsonListDiv.appendChild(jsonContainer);
    		isAbout = true;
    	}

		if(isAbout || data.tags[0] == "about") return;
    	
        var jsonContainer = document.createElement('div');
        jsonContainer.innerHTML = `<a href="#${safeUrl(data.title)}"><h1 id="${safeUrl(data.title)}">${safeString(data.title)}</h1></a>
                                   <h2>${safeString(data.description)}</h2>`;

        var dataDiv = document.createElement('div');
        Object.entries(data.data).forEach(([desc, data]) => {
            var lang = data.match(/^!([^\s]+)/);
            lang = lang ? lang[1] : "text";
			data = data.replace(/^![^\s]+ */i, "");
            dataDiv.innerHTML += `<span class="description">${safeString(desc)}</span><pre><code class="language-${lang}">${safeString(data)}</code></pre>`;
        });
        jsonContainer.appendChild(dataDiv);

		var tagsSmall = document.createElement('small');
		tagsSmall.innerHTML = 'Tags: ';

		data.tags.forEach((tag, index) => {
		    var tagLink = document.createElement('a');
		    tagLink.href = `#tag:${safeUrl(tag)}`; 
		    tagLink.innerText = tag;

            tagLink.addEventListener('click', function () {
                filterItemsByTag(tag);
            });

		    tagsSmall.appendChild(tagLink);
		    if (index < data.tags.length - 1) {
		        tagsSmall.appendChild(document.createTextNode(', '));
		    }
		});

		jsonContainer.appendChild(tagsSmall);

        if (index < jsonData.length - 1) {
            var separator = document.createElement('div');
            separator.className = 'separator';
            jsonContainer.appendChild(separator);
        }

        jsonListDiv.appendChild(jsonContainer);
    });

	hljs.highlightAll();

}

function filterItemsByTag(clickedTag) {
	var containers = document.querySelectorAll('#jsonList > div');
	containers.forEach(container => {
		var tagsSmall = container.querySelector('small');
		container.style.display = (tagsSmall && tagsSmall.innerText.includes(clickedTag)) ? 'block' : 'none';
     });
 }

const placeholderTexts = ['pentest', 'malware analysis', 'network scan', 'subdomain', 'enumeration', 'information gathering', 'osint', 'wireshark', 'buffer overflow', 'binary exploitation', 'cryptography', 'obfuscation', 'privilege escalation', 'mobile pentest', 'android', 'malware', 'red team', 'steganography', 'phishing', 'post exploitation', 'social engineering', 'firewall evasion', 'metasploit', 'password cracking', 'reverse engineering', 'spyware', 'anti virus evasion', 'anti virus bypass', 'wi-fi cracking', 'wireless hacking', 'password spraying', 'container escaping', 'kerberoasting', 'pass the hash', 'pass the ticket', 'process injection', 'domain takeover', 'c2', 'shellcode', 'active directory', 'lateral movement', 'persistence', 'fuzzing', 'rainbow table', 'data exfiltration', 'honeypot', 'sql injection', 'cross-site scripting', 'xss', 'cross-site request forgery', 'server-side request forgery', 'command injection', 'owasp', 'xml external entities', 'path traversal', 'session hijacking', 'http smuggling', 'cache poisoning', 'arbitrary upload', 'reverse shell', 'webshell', 'rootkit'];

var textbox = document.querySelector('.custom-textbox');

function updatePlaceholder() {
	textbox.placeholder = "";
    var currentText = placeholderTexts[Math.floor(Math.random() * placeholderTexts.length )];

    var typingDelay = 50;
    var eraseDelay = 30; 
    var stringChangeDelay = 1500; 
    var totalTypingTime = typingDelay * currentText.length;
    var totalEraseTime = eraseDelay * currentText.length;
    var totalDelay = totalTypingTime + totalEraseTime + stringChangeDelay;

    for (let i = 0; i < currentText.length; i++) {
        setTimeout(() => {
            textbox.placeholder = currentText.substring(0, i + 1);
        }, i * typingDelay);
    }

    setTimeout(() => {
        for (let i = currentText.length - 1; i >= 0; i--) {
            setTimeout(() => {
                textbox.placeholder = currentText.substring(0, i);
            }, (currentText.length - i) * eraseDelay);
        }

        setTimeout(updatePlaceholder, eraseDelay * currentText.length);
    }, totalTypingTime + ( stringChangeDelay + Math.floor(Math.random() * 21)));
}

function handleTextbox() {
    updatePlaceholder();

    function filterJsonData(searchText) {
        var filteredData = jsonData.filter((data) => {
            var lowerSearchText = searchText.toLowerCase();
            return (
                data.title.toLowerCase().includes(lowerSearchText) ||
                data.description.toLowerCase().includes(lowerSearchText) ||
                data.tags.some((tag) => tag.toLowerCase().includes(lowerSearchText))
            );
        });

        var jsonListDiv = document.getElementById('jsonList');
        jsonListDiv.innerHTML = '';
	
        if(filteredData.length !== 0){
	        displayJSON(filteredData);
        }else{
        	document.getElementById('jsonList').innerHTML = "<span class='not-found'>No results found.</span>";
        }
    }

    // Event listener for handling input changes
    textbox.addEventListener('input', function () {
        filterJsonData(textbox.value);
    });

}


function about() {
	window.location.hash="#about"
	filterItemsByTag("about");
	displayJSON(jsonData);
};


function scrollToHash() {
    var hash = window.location.hash;
    if(hash){
        var decodedHash = hash;
        console.log("scrolltohash(): "+decodedHash);
        setTimeout(function () {
            var targetElement = document.querySelector(decodedHash);
            if(targetElement){
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
            if(hash.includes("tag:")){
				filterItemsByTag(decodedHash);
			}
        }, 500);
    }
}

document.addEventListener('DOMContentLoaded', function () {
	var errorMessage = document.getElementById('error-message');
	errorMessage.style.display = 'none';
    scrollToHash();
});

writeHeaderAndFooter();
fetchJsonData();
handleTextbox();