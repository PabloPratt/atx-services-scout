# ATX Services Scout Memory

Project name: ATX Services Scout

Scope for version 1:

- mechanics
- cleaning services
- lawn care
- plumbers
- electricians

Explicitly out of scope for now:

- wedding venues
- gyms
- storage venues

Product intent:

- compare service providers by price and reviews
- include big chains and small local companies
- pull public provider/review data only from free/manual sources for now
- keep automated email outreach disabled for now
- allow manual price entry after a reply
- keep all data source notes visible
- deploy as a website and put the work on GitHub

Important data rule:

- Do not invent prices or reviews. Use `quote-required`, `needs-research`, or `review data pending` when data is unavailable.

Cost rule:

- Do not use paid APIs until the product can pay for them.
- OpenAI API is disabled for now.
- Google Places/Maps API is disabled for now.
- Yelp API is disabled for now.
- Paid email providers are disabled for now.
- Supabase may be used if the existing account/free tier is acceptable.

Current saved repo:

- GitHub: https://github.com/PabloPratt/atx-services-scout
- Vercel alias: https://atx-services-scout.vercel.app
- Supabase project discovered: `Janus` / `tqoppsiqhkosjbrbgyzc`
- Supabase URL: `https://tqoppsiqhkosjbrbgyzc.supabase.co`

Current setup tasks:

- Run `supabase/migrations/202606050001_create_service_directory.sql` in Supabase SQL Editor.
- Add `SUPABASE_URL` and `SUPABASE_ANON_KEY` in Vercel if Supabase-backed data is enabled.
- Redeploy Vercel after environment variable changes.
- If Vercel returns 401, disable deployment protection/password protection for production.
