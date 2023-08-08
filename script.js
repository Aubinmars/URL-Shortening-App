const shortenForm = document.getElementById('shorten-form');
const urlInput = document.getElementById('url-input');
const shortenedLinksContainer = document.getElementById('shortened-links');

// Load existing shortened links from localStorage
const storedLinks = JSON.parse(localStorage.getItem('shortenedLinks')) || [];
storedLinks.forEach(link => addToShortenedLinks(link.originalUrl, link.shortenedUrl));

shortenForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const originalUrl = urlInput.value;

    if (!originalUrl) {
        alert('Please enter a valid URL.');
        return;
    }

    try {
        const response = await fetch(`https://api.shrtco.de/v2/shorten?url=${encodeURIComponent(originalUrl)}`);
        const data = await response.json();

        if (data.ok) {
            const shortenedUrl = data.result.full_short_link;
            addToShortenedLinks(originalUrl, shortenedUrl);
            urlInput.value = '';

            // Save updated shortened links to localStorage
            const updatedLinks = [...storedLinks, { originalUrl, shortenedUrl }];
            localStorage.setItem('shortenedLinks', JSON.stringify(updatedLinks));
        } else {
            alert('Error shortening the URL.');
        }
    } catch (error) {
        console.error(error);
        alert('An error occurred.');
    }
});

function addToShortenedLinks(originalUrl, shortenedUrl) {
    const linkElement = document.createElement('div');
    linkElement.className = 'shortened-link';
    linkElement.innerHTML = `
        <p><strong>Original URL:</strong> ${originalUrl}</p>
        <p><strong>Shortened URL:</strong> <a href="${shortenedUrl}" target="_blank">${shortenedUrl}</a></p>
        <button class="copy-btn">Copy</button>
    `;
    shortenedLinksContainer.appendChild(linkElement);

    // Add click event listener to copy button
    const copyBtn = linkElement.querySelector('.copy-btn');
    copyBtn.addEventListener('click', () => copyToClipboard(shortenedUrl));
}

function copyToClipboard(text) {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    alert('Copied to clipboard!');
}
