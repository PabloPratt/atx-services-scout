# Price Outreach Agent

Goal: collect missing local prices from service providers without inventing data.

## Inputs

- provider name
- category
- service
- market or ZIP code
- contact URL or email
- current source note

## Workflow

1. Identify providers with `startingPrice: null`.
2. Prefer official contact forms or published email addresses.
3. Draft a short price request for a standard, non-emergency job.
4. Log the sent date, channel, and recipient.
5. When a reply arrives, extract:
   - starting price or range
   - service assumptions
   - market or ZIP
   - date quoted
   - whether taxes, trip fees, diagnostics, or minimums are excluded
6. Update the provider record and set `priceStatus` to `captured`.

## Email Template

Subject: Price request for {{service}}

Hello {{provider_name}},

I'm comparing local service providers for ATX Services Scout. Can you share your starting price or typical price range for {{service}} in {{market}}?

Helpful details:

- Standard appointment, not emergency
- Residential customer unless noted
- Please mention any trip fee, diagnostic fee, minimum charge, or conditions that change the price

Thank you.

## Guardrails

- Never fabricate a price.
- Keep chain and franchise pricing location-specific.
- Do not send repeated emails to the same company without a cooldown.
- Store every quote with date and source.
- Mark unclear replies as `needs-review` until a human verifies them.
