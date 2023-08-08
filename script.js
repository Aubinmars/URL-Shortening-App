const shortenForm = document.getElementById('shorten-form');
const urlInput = document.getElementById('url-input');
const shortenedLinksContainer = document.getElementById('shortened-links');

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
    `;
    shortenedLinksContainer.appendChild(linkElement);
}
