# Phase D — Controlled Beta Protocol

Local readiness only. Public deployment, payments, and unrelated feature work remain blocked.

## Cohort

Run with 5–10 fresh users who are not the builder. Each participant uses a fresh browser profile or cleared site data and a real résumé statement. Do not ask participants to paste API keys, passwords, or unrelated sensitive information.

## Journey

1. Add a résumé and target job locally.
2. Select one factual but weak résumé statement.
3. Answer only the bounded evidence questions: what changed, observed result, affected group, and scale where applicable.
4. Generate one grounded candidate through the configured provider.
5. Confirm the UI shows the original statement, supplied facts, candidate, and factual trace.
6. Edit the candidate, verify the edit remains a proposal, and approve it.
7. Confirm approval does not change the source résumé.
8. Create an explicit local revision and confirm the original remains unchanged.
9. Discard a separate proposal and confirm no résumé mutation occurs.

## Hostile and failure checks

The candidate must fail closed for an unsupported percentage, technology/tool, leadership/ownership claim, team size or global scope, and business outcome. Repeat these after provider integration.

Also exercise malformed provider JSON, provider unavailable/invalid configuration, and timeout. The UI must retain the supplied facts and show a bounded error without exposing provider details or sensitive content.

## Evidence to record

Record only route, status, duration, model, token count if available, and feature-event outcomes. Do not record résumé text, job-description text, candidate rewrites, factual answers, names, email addresses, or API keys.

For each participant record: fresh-user setup, journey result, hostile checks, failure checks, source/revision isolation, and any defect. Stop the beta gate if any unsupported fact is accepted, approval mutates the source, or sensitive content appears in logs or telemetry.
