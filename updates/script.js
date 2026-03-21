/**
 * Anbudan Miththiran - Updates Page
 * Dynamic content rendering for book releases, audiobooks, YouTube videos, and announcements
 */

// Sample data for all update categories
const updatesData = {
    bookReleases: [
        {
            id: 'book1',
            title: 'The Digital Awakening: A Journey Through Code and Creativity',
            date: 'March 15, 2026',
            description: 'Explore the intersection of technology and human creativity in this groundbreaking novel. Follow the protagonist as they navigate the digital landscape and discover their true potential.',
            link: '#',
            emoji: '📚'
        },
        {
            id: 'book2',
            title: 'Mindful Development: Building Better Software',
            date: 'February 10, 2026',
            description: 'A practical guide to writing clean, maintainable code while maintaining mental health and work-life balance. Perfect for developers at all levels.',
            link: '#',
            emoji: '💻'
        },
        {
            id: 'book3',
            title: 'Stories from the Silicon Valley: Tales of Innovation',
            date: 'January 5, 2026',
            description: 'A collection of inspiring short stories about entrepreneurs, developers, and creators who changed the world. Each story is a lesson in perseverance and innovation.',
            link: '#',
            emoji: '✨'
        }
    ],
    audiobooks: [
        {
            id: 'audio1',
            title: 'The Digital Awakening (Audiobook)',
            date: 'March 20, 2026',
            description: 'Now available on all major audiobook platforms. Narrated by professional voice actors. Perfect for listening during your commute or workout.',
            link: '#',
            emoji: '🎧'
        },
        {
            id: 'audio2',
            title: 'Mindful Development: Audio Edition',
            date: 'February 15, 2026',
            description: 'Listen to expert insights on writing better code and maintaining work-life balance. Includes exclusive interviews with industry leaders.',
            link: '#',
            emoji: '🎙️'
        },
        {
            id: 'audio3',
            title: 'Podcast Series: Developer Chronicles',
            date: 'January 20, 2026',
            description: 'A weekly podcast where I discuss the latest trends in web development, share coding tips, and interview fellow developers and creators.',
            link: '#',
            emoji: '🎬'
        }
    ],
    youtubeVideos: [
        {
            id: 'yt1',
            title: 'Building a Modern Web App from Scratch - Full Tutorial',
            date: 'March 18, 2026',
            description: 'In this comprehensive tutorial, I walk you through building a full-stack web application using vanilla JavaScript, HTML, and CSS. No frameworks, just pure web development.',
            link: 'https://youtube.com',
            emoji: '🎥'
        },
        {
            id: 'yt2',
            title: 'JavaScript Tips and Tricks for Beginners',
            date: 'March 10, 2026',
            description: 'Learn essential JavaScript concepts that every developer should know. This video covers closures, async/await, and practical coding patterns.',
            link: 'https://youtube.com',
            emoji: '📺'
        },
        {
            id: 'yt3',
            title: 'My Journey as a Self-Taught Developer',
            date: 'February 28, 2026',
            description: 'A personal story about how I became a developer without a formal degree. I share the resources, challenges, and lessons learned along the way.',
            link: 'https://youtube.com',
            emoji: '🎞️'
        }
    ],
    announcements: [
        {
            id: 'ann1',
            title: 'New Course Launch: Web Development Masterclass',
            date: 'March 22, 2026',
            description: 'I\'m excited to announce the launch of my comprehensive web development course. Learn everything from HTML basics to advanced JavaScript patterns. Early bird discount available!',
            link: '#',
            emoji: '🚀'
        },
        {
            id: 'ann2',
            title: 'Speaking at Tech Conference 2026',
            date: 'March 12, 2026',
            description: 'I\'ll be speaking at the International Tech Conference 2026 about "The Future of Web Development". Join me for an engaging session on emerging technologies and best practices.',
            link: '#',
            emoji: '🎤'
        },
        {
            id: 'ann3',
            title: 'Open Source Project: CodeHelper Released',
            date: 'February 25, 2026',
            description: 'I\'m thrilled to release CodeHelper, an open-source tool that helps developers write better code faster. Check it out on GitHub and contribute to the project!',
            link: 'https://github.com',
            emoji: '🔧'
        }
    ]
};

/**
 * Create an update card HTML element
 * @param {Object} update - The update object
 * @returns {HTMLElement} - The card element
 */
function createUpdateCard(update) {
    const card = document.createElement('article');
    card.className = 'update-card';
    card.innerHTML = `
        <div class="update-card-image">${update.emoji}</div>
        <div class="update-card-content">
            <span class="update-card-category">${update.category || 'Update'}</span>
            <h3 class="update-card-title">${update.title}</h3>
            <div class="update-card-date">${update.date}</div>
            <p class="update-card-description">${update.description}</p>
            ${update.link && update.link !== '#' ? `<a href="${update.link}" target="_blank" rel="noopener noreferrer" class="update-card-link">Learn More →</a>` : `<a href="${update.link}" class="update-card-link">Learn More →</a>`}
        </div>
    `;
    return card;
}

/**
 * Render updates for a specific category
 * @param {string} category - The category name
 * @param {string} gridId - The ID of the grid container
 * @param {Array} updates - Array of update objects
 */
function renderUpdates(category, gridId, updates) {
    const grid = document.getElementById(gridId);
    
    if (!grid) {
        console.error(`Grid with ID "${gridId}" not found`);
        return;
    }

    // Clear existing content
    grid.innerHTML = '';

    // Add category to each update and create cards
    updates.forEach(update => {
        update.category = category;
        const card = createUpdateCard(update);
        grid.appendChild(card);
    });
}

/**
 * Initialize the page by rendering all updates
 */
function initializePage() {
    // Render each category
    renderUpdates('Book Release', 'bookReleasesGrid', updatesData.bookReleases);
    renderUpdates('Audiobook', 'audiobooksGrid', updatesData.audiobooks);
    renderUpdates('YouTube', 'youtubeVideosGrid', updatesData.youtubeVideos);
    renderUpdates('Announcement', 'announcementsGrid', updatesData.announcements);

    console.log('Updates page initialized successfully');
}

/**
 * Run initialization when DOM is ready
 */
document.addEventListener('DOMContentLoaded', initializePage);

// Alternative: Initialize immediately if DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePage);
} else {
    initializePage();
}
