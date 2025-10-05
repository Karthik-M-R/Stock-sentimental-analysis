const API_KEY = 'f2239a3477464c6689e9dd6634fe32d9'; // Replace with your NewsAPI key



// Dark mode toggle
const darkModeToggle = document.getElementById('darkModeToggle');
const html = document.documentElement;

// Check for saved dark mode preference or default to light mode
if (localStorage.getItem('darkMode') === 'true') {
    html.classList.add('dark');
    document.body.classList.add('dark');
}

darkModeToggle.addEventListener('click', () => {
    html.classList.toggle('dark');
    document.body.classList.toggle('dark');
    const isDark = html.classList.contains('dark');
    localStorage.setItem('darkMode', isDark.toString());
});

// Sentiment analysis keywords
const positiveWords = [
    'profit', 'gain', 'surge', 'boost', 'growth', 'rise', 'up', 'high', 
    'bull', 'positive', 'strong', 'success', 'record', 'peak', 'rally', 
    'soar', 'jump', 'advance', 'upgrade', 'buy', 'outperform'
];

const negativeWords = [
    'loss', 'drop', 'fall', 'decline', 'crash', 'bear', 'negative', 
    'weak', 'down', 'low', 'slump', 'plunge', 'tumble', 'concern', 
    'worry', 'risk', 'threat', 'sell', 'downgrade', 'underperform', 'cut'
];

function analyzeSentiment(text) {
    const lowerText = text.toLowerCase();
    let positiveScore = 0;
    let negativeScore = 0;

    positiveWords.forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'g');
        const matches = lowerText.match(regex);
        if (matches) positiveScore += matches.length;
    });

    negativeWords.forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'g');
        const matches = lowerText.match(regex);
        if (matches) negativeScore += matches.length;
    });

    if (positiveScore > negativeScore) return 'positive';
    if (negativeScore > positiveScore) return 'negative';
    return 'neutral';
}

function getSentimentBadge(sentiment) {
    const badges = {
        positive: '<span class="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">😊 Positive</span>',
        negative: '<span class="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">😟 Negative</span>',
        neutral: '<span class="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">😐 Neutral</span>'
    };
    return badges[sentiment];
}

async function fetchNews(symbol) {
    const query = `${symbol} AND (India OR NSE OR BSE OR stock)`;
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&pageSize=20&apiKey=${API_KEY}`;
    
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Failed to fetch news. Please check your API key.');
    }
    return await response.json();
}

function updateUI(articles) {
    const sentiments = articles.map(article => {
        const text = `${article.title} ${article.description || ''}`;
        return analyzeSentiment(text);
    });

    const positive = sentiments.filter(s => s === 'positive').length;
    const negative = sentiments.filter(s => s === 'negative').length;
    const neutral = sentiments.filter(s => s === 'neutral').length;
    const total = articles.length;

    const posPercent = Math.round((positive / total) * 100);
    const negPercent = Math.round((negative / total) * 100);
    const neuPercent = Math.round((neutral / total) * 100);

    // Update percentages
    document.getElementById('positivePercent').textContent = `${posPercent}%`;
    document.getElementById('negativePercent').textContent = `${negPercent}%`;
    document.getElementById('neutralPercent').textContent = `${neuPercent}%`;
    
    document.getElementById('positiveCount').textContent = `${positive} articles`;
    document.getElementById('negativeCount').textContent = `${negative} articles`;
    document.getElementById('neutralCount').textContent = `${neutral} articles`;

    // Update chart
    setTimeout(() => {
        document.getElementById('posBar').style.width = `${posPercent}%`;
        document.getElementById('neuBar').style.width = `${neuPercent}%`;
        document.getElementById('negBar').style.width = `${negPercent}%`;
        
        document.getElementById('posChartPercent').textContent = `${posPercent}%`;
        document.getElementById('neuChartPercent').textContent = `${neuPercent}%`;
        document.getElementById('negChartPercent').textContent = `${negPercent}%`;
    }, 100);

    // Render news cards
    const newsContainer = document.getElementById('newsContainer');
    newsContainer.innerHTML = articles.map((article, index) => {
        const sentiment = sentiments[index];
        const date = new Date(article.publishedAt).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        return `
            <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-5 hover:shadow-lg transition-shadow bg-gray-50 dark:bg-gray-700/50">
                <div class="flex justify-between items-start mb-3">
                    ${getSentimentBadge(sentiment)}
                    <span class="text-xs text-gray-500 dark:text-gray-400">${date}</span>
                </div>
                <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                    ${article.title}
                </h3>
                <p class="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                    ${article.description || 'No description available'}
                </p>
                <div class="flex justify-between items-center">
                    <span class="text-xs font-medium text-gray-500 dark:text-gray-400">
                        📰 ${article.source.name}
                    </span>
                    <a href="${article.url}" target="_blank" class="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium">
                        Read more →
                    </a>
                </div>
            </div>
        `;
    }).join('');
}

async function analyzeStock() {
    const stockInput = document.getElementById('stockInput');
    const symbol = stockInput.value.trim().toUpperCase();
    
    if (!symbol) {
        showError('Please enter a stock symbol');
        return;
    }

    if (API_KEY === 'YOUR_NEWSAPI_KEY_HERE') {
        showError('Please add your NewsAPI key in the code. Get it free at newsapi.org');
        return;
    }

    hideAll();
    document.getElementById('loading').classList.remove('hidden');

    try {
        const data = await fetchNews(symbol);
        
        if (!data.articles || data.articles.length === 0) {
            showError('No news found for this stock symbol. Try another one.');
            return;
        }

        hideAll();
        document.getElementById('results').classList.remove('hidden');
        updateUI(data.articles);
    } catch (err) {
        hideAll();
        showError(err.message);
    }
}

function showError(message) {
    const errorDiv = document.getElementById('error');
    const errorMessage = document.getElementById('errorMessage');
    errorDiv.classList.remove('hidden');
    errorMessage.textContent = message;
}

function hideAll() {
    document.getElementById('loading').classList.add('hidden');
    document.getElementById('results').classList.add('hidden');
    document.getElementById('error').classList.add('hidden');
}

// Event listeners
document.getElementById('analyzeBtn').addEventListener('click', analyzeStock);
document.getElementById('stockInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') analyzeStock();
});