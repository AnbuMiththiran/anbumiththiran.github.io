/**
 * Mentions of Anbudan Miththiran
 * Dynamic content fetching and filtering
 */

// Configuration - Replace with your actual API keys
const CONFIG = {
    YOUTUBE_API_KEY: 'AIzaSyD0_TTy8sqLUy8TKjM6Zt52xYdcBBIgpTw',
    NEWS_API_KEY: '0a52ea0458344bdb862609f1d8b784af',
    KEYWORDS: ['Anbudan Miththiran', 'anbumiththiran', '#anbumiththiran', '#anbudanmiththiran', 'anbumiththiran.in'],
    REFRESH_INTERVAL: 6 * 60 * 60 * 1000, // 6 hours in milliseconds
    MOCK_DATA_ENABLED: true // Set to false when you have real API keys
};

// State management
let allMentions = [];
let filteredMentions = [];
let currentCategory = 'all';
let searchQuery = '';

// DOM Elements
const mentionsGrid = document.getElementById('mentionsGrid');
const loadingIndicator = document.getElementById('loading');
const noResultsMessage = document.getElementById('noResults');
const searchInput = document.getElementById('searchInput');
const categoryFilters = document.getElementById('categoryFilters');

/**
 * Initialize the application
 */
async function init() {
    setupEventListeners();
    await fetchAllMentions();
    
    // Set up auto-refresh
    setInterval(fetchAllMentions, CONFIG.REFRESH_INTERVAL);
}

/**
 * Set up event listeners for search and filters
 */
function setupEventListeners() {
    // Search input listener
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase();
        applyFilters();
    });

    // Category filter listener
    categoryFilters.addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-btn')) {
            // Update active button
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            
            currentCategory = e.target.dataset.category;
            applyFilters();
        }
    });
}

/**
 * Fetch mentions from all sources
 */
async function fetchAllMentions() {
    showLoading(true);
    allMentions = [];

    try {
        // In a real scenario, we would fetch from multiple APIs
        // For this demonstration, we'll use a mix of mock data and API structure
        
        const youtubeMentions = await fetchYouTubeMentions();
        const newsMentions = await fetchNewsMentions();
        const socialMentions = await fetchSocialMentions();

        allMentions = [...youtubeMentions, ...newsMentions, ...socialMentions];
        
        // Sort by date (newest first)
        allMentions.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        applyFilters();
    } catch (error) {
        console.error('Error fetching mentions:', error);
        showNoResults(true);
    } finally {
        showLoading(false);
    }
}

/**
 * Mock/Real YouTube Fetch
 */
async function fetchYouTubeMentions() {
    if (CONFIG.MOCK_DATA_ENABLED || CONFIG.YOUTUBE_API_KEY === 'YOUR_YOUTUBE_API_KEY') {
        return [
            {
                id: 'yt1',
                title: 'Exploring the Digital World with Anbudan Miththiran',
                description: 'In this video, we dive deep into the projects of Anbudan Miththiran and how he is shaping the tech landscape.',
                thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&q=80',
                source: 'YouTube',
                category: 'video',
                url: 'https://youtube.com',
                date: '2026-03-15T10:00:00Z'
            },
            {
                id: 'yt2',
                title: 'Anbudan Miththiran: A Journey Through Code',
                description: 'A documentary-style look at the coding journey of anbumiththiran and his contributions to open source.',
                thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=500&q=80',
                source: 'YouTube',
                category: 'video',
                url: 'https://youtube.com',
                date: '2026-02-20T14:30:00Z'
            }
        ];
    }
    
    // Real API call logic would go here
    // const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(CONFIG.KEYWORDS.join(' OR '))}&type=video&key=${CONFIG.YOUTUBE_API_KEY}`);
    // const data = await response.json();
    // return data.items.map(item => ({ ... }));
    return [];
}

/**
 * Mock/Real News Fetch
 */
async function fetchNewsMentions() {
    if (CONFIG.MOCK_DATA_ENABLED || CONFIG.NEWS_API_KEY === 'YOUR_NEWS_API_KEY') {
        return [
            {
                id: 'news1',
                title: 'Top Tech Influencers to Watch in 2026',
                description: 'Anbudan Miththiran makes the list of top developers to follow this year for his innovative web solutions.',
                thumbnail: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=500&q=80',
                source: 'Tech Daily',
                category: 'article',
                url: 'https://example.com/news1',
                date: '2026-03-10T09:00:00Z'
            },
            {
                id: 'news2',
                title: 'The Rise of anbumiththiran.in',
                description: 'How a personal portfolio became a hub for developers worldwide. A look at the success of anbumiththiran.in.',
                thumbnail: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=500&q=80',
                source: 'Web Weekly',
                category: 'article',
                url: 'https://example.com/news2',
                date: '2026-01-15T11:45:00Z'
            }
        ];
    }
    return [];
}

/**
 * Mock Social Mentions
 */
async function fetchSocialMentions() {
    return [
        {
            id: 'soc1',
            title: 'Twitter Mention: #anbudanmiththiran',
            description: 'Just saw the latest project from @anbumiththiran and it is absolutely mind-blowing! #tech #innovation',
            thumbnail: 'https://images.unsplash.com/photo-1611605698335-8b1569810432?w=500&q=80',
            source: 'Twitter',
            category: 'social',
            url: 'https://twitter.com',
            date: '2026-03-18T16:20:00Z'
        },
        {
            id: 'soc2',
            title: 'LinkedIn: Anbudan Miththiran featured in Dev Spotlight',
            description: 'Honored to be featured in this week\'s developer spotlight. Check out my journey at anbumiththiran.in',
            thumbnail: 'https://images.unsplash.com/photo-1611944212129-29977ae1398c?w=500&q=80',
            source: 'LinkedIn',
            category: 'social',
            url: 'https://linkedin.com',
            date: '2026-03-05T08:15:00Z'
        }
    ];
}

/**
 * Apply search and category filters
 */
function applyFilters() {
    filteredMentions = allMentions.filter(mention => {
        const matchesCategory = currentCategory === 'all' || mention.category === currentCategory;
        const matchesSearch = mention.title.toLowerCase().includes(searchQuery) || 
                             mention.description.toLowerCase().includes(searchQuery) ||
                             mention.source.toLowerCase().includes(searchQuery);
        
        return matchesCategory && matchesSearch;
    });

    renderMentions();
}

/**
 * Render the filtered mentions to the grid
 */
function renderMentions() {
    mentionsGrid.innerHTML = '';
    
    if (filteredMentions.length === 0) {
        showNoResults(true);
        return;
    }

    showNoResults(false);
    
    filteredMentions.forEach(mention => {
        const card = createMentionCard(mention);
        mentionsGrid.appendChild(card);
    });
}

/**
 * Create a mention card element
 */
function createMentionCard(mention) {
    const card = document.createElement('article');
    card.className = 'mention-card';
    
    const date = new Date(mention.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    // Highlight keywords in title and description
    let title = mention.title;
    let description = mention.description;
    
    CONFIG.KEYWORDS.forEach(keyword => {
        const regex = new RegExp(`(${keyword})`, 'gi');
        title = title.replace(regex, '<mark>$1</mark>');
        description = description.replace(regex, '<mark>$1</mark>');
    });

    card.innerHTML = `
        <img src="${mention.thumbnail}" alt="${mention.title}" class="mention-thumbnail" onerror="this.src='https://via.placeholder.com/500x300?text=No+Image'">
        <div class="mention-content">
            <span class="mention-source">${mention.source}</span>
            <h3 class="mention-title">${title}</h3>
            <p class="mention-description">${description}</p>
            <div class="mention-footer">
                <span class="mention-date">${date}</span>
                <a href="${mention.url}" target="_blank" rel="noopener noreferrer" class="mention-link">View Original &rarr;</a>
            </div>
        </div>
    `;
    
    return card;
}

/**
 * UI Helper: Show/Hide loading indicator
 */
function showLoading(show) {
    if (show) {
        loadingIndicator.classList.remove('hidden');
        mentionsGrid.classList.add('hidden');
    } else {
        loadingIndicator.classList.add('hidden');
        mentionsGrid.classList.remove('hidden');
    }
}

/**
 * UI Helper: Show/Hide no results message
 */
function showNoResults(show) {
    if (show) {
        noResultsMessage.classList.remove('hidden');
    } else {
        noResultsMessage.classList.add('hidden');
    }
}

// Start the app
document.addEventListener('DOMContentLoaded', init);
