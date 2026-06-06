# ATX Services Scout

ATX Services Scout is a local-services comparison site for everyday providers: mechanics, cleaners, lawn care, plumbers, and electricians.

The first version is static and deployable on Vercel or GitHub Pages. It supports:

- search and filters by category, provider type, price availability, max price, and rating
- national chains plus local placeholder records for independent companies
- missing-price tracking
- manual price entry after a company replies
- local browser persistence and JSON export

## Current Data Position

Most providers in these categories do not publish a single national price. The app treats this as real product behavior:

- published prices are stored when available
- missing prices are marked as `quote-required` or `needs-research`
- manual research or user-entered replies collect local pricing
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

Free-first ingestion sources:

- provider official websites for published estimate/quote pages
- manual public web research for ATX businesses
- OpenStreetMap/Nominatim only if usage fits their public usage policy
- Supabase free tier for shared provider records, quote status, and manual updates

Suggested normalized fields are already in `data/providers.js`: `category`, `type`, `market`, `service`, `startingPrice`, `rating`, `reviewCount`, `sourceNote`, `sourceUrl`, `contactUrl`, and `email`.

## What Needs To Be Connected

Current no-paid-API plan:

- Avoid Yelp and Google Places/Maps APIs unless the owner explicitly accepts billing risk.
- Use Supabase project `Janus` / `tqoppsiqhkosjbrbgyzc` for provider data.
- Keep OpenAI disabled until the product can pay for usage.
- Keep automated email outreach disabled for now.
- Use manual research and public provider pages for company records until a free or approved data source is chosen.

## Vercel Environment Variables

Add these in Vercel Project Settings -> Environment Variables, then redeploy if Supabase is enabled:

- `SUPABASE_URL`: `https://tqoppsiqhkosjbrbgyzc.supabase.co`
- `SUPABASE_ANON_KEY`: public anon key from Supabase project settings.

Do not put these values in frontend JavaScript or commit them to GitHub.

## Supabase Setup

The schema migration is in `supabase/migrations/202606050001_create_service_directory.sql`.
Apply it to the `Janus` Supabase project, then seed `public.service_providers`.

## Deferred Paid Features

- OpenAI-powered natural-language search.
- Google Places/Maps distance and review enrichment.
- Yelp enrichment.
- Automated email sending.
