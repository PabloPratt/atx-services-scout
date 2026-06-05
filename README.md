# ServiceScout

ServiceScout is a local-services comparison site for everyday providers: mechanics, cleaners, lawn care, plumbers, and electricians.

The first version is static and deployable on Vercel or GitHub Pages. It supports:

- search and filters by category, provider type, price availability, max price, and rating
- national chains plus local placeholder records for independent companies
- missing-price tracking
- email drafts for quote requests
- manual price entry after a company replies
- local browser persistence and JSON export

## Current Data Position

Most providers in these categories do not publish a single national price. The app treats this as real product behavior:

- published prices are stored when available
- missing prices are marked as `quote-required` or `needs-research`
- outreach emails collect local pricing
- source notes explain where each data point came from

Initial public sources checked on June 5, 2026:

- Jiffy Lube FAQ: https://www.jiffylube.com/frequently-asked-questions
- Molly Maid estimate flow: https://www.mollymaid.com/request-a-free-estimate/
- Merry Maids house cleaning: https://www.merrymaids.com/cleaning-services/house-cleaning/
- TruGreen quote flow: https://www.trugreen.com/get-a-quote/custom-services/
- Mr. Electric service page: https://mrelectric.com/

## Run Locally

Open `index.html` in a browser, or run:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Internet Data Roadmap

Recommended ingestion sources:

- Google Places API for local businesses, ratings, review counts, location, phone, and website
- Yelp Fusion API for review and category enrichment
- provider official websites for published estimate/quote pages
- manual quote email replies for actual local price ranges

Suggested normalized fields are already in `data/providers.js`: `category`, `type`, `market`, `service`, `startingPrice`, `rating`, `reviewCount`, `sourceNote`, `sourceUrl`, `contactUrl`, and `email`.

## Email Agent Roadmap

`agents/price-outreach-agent.md` defines the agent workflow. Production email sending should be connected through a real provider such as Gmail, SendGrid, Postmark, or Resend. Do not scrape or email aggressively; rate-limit requests and keep an audit trail.
