# Session Handoff

Last saved: June 5, 2026

## Current Status

- App name: ATX Services Scout.
- Repo: https://github.com/PabloPratt/atx-services-scout
- Current branch: `main`.
- Latest committed direction: no paid API integrations.
- Local app path: `/Users/regalia/service-scout`.
- Production alias: https://atx-services-scout.vercel.app

## Product Scope

Start with:

- mechanics
- cleaning services
- lawn care
- plumbers
- electricians

Do not include yet:

- wedding venues
- gyms
- storage venues

## Current Implementation

- Static frontend with provider cards and filters.
- Search separates location terms such as `austin`, `atx`, and Austin ZIPs from service terms.
- Users can hide providers that need quotes.
- Address/radius UI exists, but real distance filtering needs provider addresses in data.
- Manual price entry saves to browser localStorage and can export JSON.
- Supabase schema migration exists but is not confirmed applied.

## Cost Constraints

- Do not use OpenAI API yet.
- Do not use Google Places/Maps API yet.
- Do not use Yelp API.
- Do not use paid email senders.
- Use Supabase only if the existing/free account is acceptable.
- Use public/manual research for providers and prices.

## Supabase

Discovered project:

- Name: `Janus`
- Ref: `tqoppsiqhkosjbrbgyzc`
- URL: `https://tqoppsiqhkosjbrbgyzc.supabase.co`

Migration to apply:

- `supabase/migrations/202606050001_create_service_directory.sql`

Vercel env vars needed only if Supabase is enabled:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

## Next Practical Step

Apply the Supabase migration, add the two Supabase env vars in Vercel, then update the frontend to read providers from Supabase with the static seed data as fallback.
