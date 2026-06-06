# ATX Services Scout

ATX Services Scout is a local-services comparison site for everyday providers: mechanics, cleaners, lawn care, plumbers, and electricians.

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
- Google Maps Distance Matrix or Mapbox Matrix API for distance from a user's address
- OpenAI API for turning natural-language service requests into searchable categories and query terms
- Supabase or Neon Postgres for shared provider records, quote status, and manual updates
- Resend, Postmark, SendGrid, or Gmail API for automated price-request emails

Suggested normalized fields are already in `data/providers.js`: `category`, `type`, `market`, `service`, `startingPrice`, `rating`, `reviewCount`, `sourceNote`, `sourceUrl`, `contactUrl`, and `email`.

## What Needs To Be Connected

To make the product fully live, provide API keys or connected accounts for:

- Google Places API: finds ATX providers and returns ratings, review counts, websites, phones, and coordinates.
- Google Maps Distance Matrix API: calculates distance from the user's address to each provider.
- OpenAI API: interprets searches like "my sink is leaking" into plumber queries and service aliases.
- Supabase or Neon: stores provider data, manual price updates, outreach status, and quote replies.
- Email provider: sends price-request emails and records replies. Resend or Postmark is simplest for app mail; Gmail is better if you want the emails to come directly from your inbox.

## Email Agent Roadmap

`agents/price-outreach-agent.md` defines the agent workflow. Production email sending should be connected through a real provider such as Gmail, SendGrid, Postmark, or Resend. Do not scrape or email aggressively; rate-limit requests and keep an audit trail.
