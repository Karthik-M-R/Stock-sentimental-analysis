# Stock Sentiment Dashboard (India)

A simple **static HTML + JavaScript** dashboard that fetches the latest news for an Indian stock symbol and performs **basic sentiment analysis** (positive / neutral / negative) using keyword matching. It also includes a **dark mode** toggle.

## What’s in this repo

- `index.html` — UI (Tailwind via CDN), input + results layout
- `script.js` — NewsAPI fetch + sentiment scoring + DOM updates + dark mode
- `styles.css` — small custom CSS for sentiment bars, dark background, line clamp

## How it works

1. Enter a stock symbol (examples: `TCS`, `RELIANCE`, `INFY`, `HDFC`)
2. App calls **NewsAPI** `everything` endpoint with this query:

   ```
   <SYMBOL> AND (India OR NSE OR BSE OR stock)
   ```

3. For each article, sentiment is computed from:
   - `article.title`
   - `article.description` (if present)

4. The UI shows:
   - overall positive/neutral/negative percentages
   - a simple bar chart
   - a list of articles with sentiment badges and “Read more” links

## Requirements

- A modern web browser
- A **NewsAPI key** (https://newsapi.org)

## Setup (NewsAPI key)

Open `script.js` and set your key here:

- `script.js` → `const API_KEY = '...'`

> Note: This project is frontend-only, so if you commit a real API key into the repo it will be public. Prefer keeping your key private

Because this is a static project, you can run it in either of these ways:

### Option A: Open directly
Just open `index.html` in your browser.

### Option B: Use a local static server (recommended)
Example using VS Code:
- Install **Live Server**
- Right-click `index.html` → **Open with Live Server**

## Notes / Limitations

- Sentiment is **keyword-based**, not ML-based, so it’s only an approximation.
- NewsAPI free tier may have rate limits and other restrictions.
- If the API request fails, the UI shows an error (commonly due to invalid API key).

## Credits

Made by **Karthik MR** (as shown in the footer in `index.html`).
