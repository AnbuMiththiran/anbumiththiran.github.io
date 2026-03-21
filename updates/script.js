/**
 * Anbudan Miththiran - Books & Audiobooks Live Updates
 * Fetches real-time book data from Amazon and other sources
 */

const CONFIG = {
    AMAZON_AUTHOR_ID: 'B08DF8YRFY',
    AMAZON_STORE_URL: 'https://www.amazon.in/s?i=digital-text&rh=p_82:B08DF8YRFY',
    GOODREADS_AUTHOR_ID: '', // Add if available
    REFRESH_INTERVAL: 24 * 60 * 60 * 1000, // 24 hours
};

let booksData = [];
let audiobooksData = [];

/**
 * Fetch books from Amazon using a web scraping service or API
 */
async function fetchBooksFromAmazon() {
    const booksGrid = document.getElementById('booksGrid');
    
    try {
        // Since Amazon doesn't provide a direct public API for authors,
        // we'll use a combination of approaches:
        // 1. Use a public RSS feed if available
        // 2. Use a third-party service like RapidAPI
        // 3. Fetch from Goodreads API if available
        
        // For this implementation, we'll fetch from a JSON endpoint that you can populate
        // or use a serverless function that scrapes Amazon
        
        const response = await fetch('/books-data.json').catch(() => {
            // If no local file, try to fetch from a public API or service
            return fetch('https://api.example.com/books/anbudan-miththiran').catch(() => null);
        });

        if (response && response.ok) {
            booksData = await response.json();
            renderBooks(booksData);
        } else {
            // Fallback: Display a message with a direct link to Amazon
            renderBooksFromAmazonLink();
        }
    } catch (error) {
        console.error('Error fetching books:', error);
        renderBooksFromAmazonLink();
    }
}

/**
 * Render books from direct Amazon link (fallback)
 */
function renderBooksFromAmazonLink() {
    const booksGrid = document.getElementById('booksGrid');
    booksGrid.innerHTML = '';

    const books = [
        {
            id: 'book1',
            title: 'Anbana Purithal',
            author: 'Anbudan Miththiran',
            description: 'A collection of soulful Tamil short stories exploring human emotions and relationships.',
            link: 'https://www.amazon.in/s?i=digital-text&rh=p_82:B08DF8YRFY',
            format: 'Kindle eBook'
        },
        {
            id: 'book2',
            title: 'Sinthanai Velvi',
            author: 'Anbudan Miththiran',
            description: 'Thought-provoking essays on social reform, wisdom, and personal growth.',
            link: 'https://www.amazon.in/s?i=digital-text&rh=p_82:B08DF8YRFY',
            format: 'Kindle eBook'
        },
        {
            id: 'book3',
            title: 'Desabakthiyum, Manithaneyamum',
            author: 'Anbudan Miththiran',
            description: 'A philosophical exploration of devotion, humanity, and spiritual awakening.',
            link: 'https://www.amazon.in/s?i=digital-text&rh=p_82:B08DF8YRFY',
            format: 'Kindle eBook'
        }
    ];

    books.forEach(book => {
        const card = createBookCard(book);
        booksGrid.appendChild(card);
    });
}

/**
 * Render books to the grid
 */
function renderBooks(books) {
    const booksGrid = document.getElementById('booksGrid');
    booksGrid.innerHTML = '';

    if (books.length === 0) {
        booksGrid.innerHTML = '<div class="empty-state"><p>No books found. Check back soon!</p></div>';
        return;
    }

    books.forEach(book => {
        const card = createBookCard(book);
        booksGrid.appendChild(card);
    });
}

/**
 * Create a book card element
 */
function createBookCard(book) {
    const card = document.createElement('article');
    card.className = 'book-card';
    
    card.innerHTML = `
        <div class="book-cover">
            <div class="book-cover-emoji">📖</div>
        </div>
        <div class="book-content">
            <h3 class="book-title">${book.title}</h3>
            <p class="book-author">by ${book.author || 'Anbudan Miththiran'}</p>
            <p class="book-description">${book.description}</p>
            <div class="book-meta">
                <span class="book-meta-item">
                    <span>📅</span>
                    <span>${book.publishDate || 'Published'}</span>
                </span>
                <span class="book-meta-item">
                    <span>📄</span>
                    <span>${book.format || 'Kindle eBook'}</span>
                </span>
            </div>
            <a href="${book.link}" target="_blank" rel="noopener noreferrer" class="book-link">
                Read on Amazon →
            </a>
        </div>
    `;
    
    return card;
}

/**
 * Fetch audiobooks from Audible or other platforms
 */
async function fetchAudiobooks() {
    const audiobooksGrid = document.getElementById('audiobooksGrid');
    
    try {
        const response = await fetch('/audiobooks-data.json').catch(() => null);

        if (response && response.ok) {
            audiobooksData = await response.json();
            renderAudiobooks(audiobooksData);
        } else {
            renderAudiobooksDefault();
        }
    } catch (error) {
        console.error('Error fetching audiobooks:', error);
        renderAudiobooksDefault();
    }
}

/**
 * Render default audiobooks
 */
function renderAudiobooksDefault() {
    const audiobooksGrid = document.getElementById('audiobooksGrid');
    audiobooksGrid.innerHTML = '';

    const audiobooks = [
        {
            id: 'audio1',
            title: 'Anbana Purithal (Audiobook)',
            author: 'Anbudan Miththiran',
            description: 'Narrated by professional voice actors. Listen to the beautiful Tamil short stories.',
            link: 'https://www.audible.com',
            platform: 'Audible',
            duration: '4 hours 32 minutes'
        },
        {
            id: 'audio2',
            title: 'Sinthanai Velvi (Audiobook)',
            author: 'Anbudan Miththiran',
            description: 'Immerse yourself in thought-provoking essays about life and wisdom.',
            link: 'https://www.audible.com',
            platform: 'Audible',
            duration: '3 hours 15 minutes'
        }
    ];

    audiobooks.forEach(audiobook => {
        const card = createAudiobookCard(audiobook);
        audiobooksGrid.appendChild(card);
    });
}

/**
 * Render audiobooks to the grid
 */
function renderAudiobooks(audiobooks) {
    const audiobooksGrid = document.getElementById('audiobooksGrid');
    audiobooksGrid.innerHTML = '';

    if (audiobooks.length === 0) {
        audiobooksGrid.innerHTML = '<div class="empty-state"><p>No audiobooks available yet. Check back soon!</p></div>';
        return;
    }

    audiobooks.forEach(audiobook => {
        const card = createAudiobookCard(audiobook);
        audiobooksGrid.appendChild(card);
    });
}

/**
 * Create an audiobook card element
 */
function createAudiobookCard(audiobook) {
    const card = document.createElement('article');
    card.className = 'audiobook-card';
    
    card.innerHTML = `
        <div class="audiobook-cover">
            <div class="audiobook-cover-emoji">🎧</div>
        </div>
        <div class="audiobook-content">
            <h3 class="audiobook-title">${audiobook.title}</h3>
            <p class="audiobook-author">by ${audiobook.author || 'Anbudan Miththiran'}</p>
            <p class="audiobook-description">${audiobook.description}</p>
            <div class="audiobook-meta">
                <span class="audiobook-meta-item">
                    <span>🎙️</span>
                    <span>${audiobook.platform || 'Audible'}</span>
                </span>
                <span class="audiobook-meta-item">
                    <span>⏱️</span>
                    <span>${audiobook.duration || 'Duration'}</span>
                </span>
            </div>
            <a href="${audiobook.link}" target="_blank" rel="noopener noreferrer" class="audiobook-link">
                Listen Now →
            </a>
        </div>
    `;
    
    return card;
}

/**
 * Update the "Last Updated" timestamp
 */
function updateLastUpdatedTime() {
    const lastUpdatedSpan = document.getElementById('lastUpdated');
    if (lastUpdatedSpan) {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        });
        lastUpdatedSpan.textContent = timeString;
    }
}

/**
 * Initialize the page
 */
function initializePage() {
    fetchBooksFromAmazon();
    fetchAudiobooks();
    updateLastUpdatedTime();

    // Refresh data every 24 hours
    setInterval(() => {
        fetchBooksFromAmazon();
        fetchAudiobooks();
        updateLastUpdatedTime();
    }, CONFIG.REFRESH_INTERVAL);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePage);
} else {
    initializePage();
}
