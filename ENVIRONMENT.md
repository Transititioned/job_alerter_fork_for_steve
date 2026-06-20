# GAS Environment

This file records the setup that does not live safely in copied `.gs` files.
Use placeholders for secrets. Do not commit real API tokens.

## Source Project

- Source Apps Script project name:
- Source Apps Script project ID:
- Source Google Sheet name:
- Source Google Sheet URL:
- Source Drive folder:

## Fork Project

- Fork/client name:
- Fork Apps Script project name:
- Fork Apps Script project ID:
- Fork Google Sheet name:
- Fork Google Sheet URL:
- Fork Drive folder:

## Script Properties

| Property | Purpose | Example/Placeholder |
| --- | --- | --- |
| `APIFY_TOKEN` | Apify API token used to start actor tasks. | `set-in-gas-project-settings` |
| `APIFY_AI_TASK_ID` | Apify task ID for AI job scrape. | `replace-me` |
| `APIFY_PM_TASK_ID` | Apify task ID for PM job scrape. | `replace-me` |
| `APIFY_GRC_TASK_ID` | Apify task ID for GRC job scrape, if used. | `replace-me` |

## Input Files

| File | Purpose | Source |
| --- | --- | --- |
| `MrBrownFinancialCrimesMgr.csv` | Raw Steve Brown financial-crime jobs export. | Apify/Drive |

## Sheet Tabs

| Tab | Purpose |
| --- | --- |
| `AI_JOBS` | Raw imported jobs staging tab. Kept under the existing name to avoid sheet churn. |
| `Jobs_MASTER` | Permanent deduped/scored job database. |

## Triggers

| Function | Event Source | Schedule/Event | Notes |
| --- | --- | --- | --- |
| `mainControl_TEST` | Time-driven/manual | TBD | Main processing run. |

## Deployments

| Deployment | Type | URL/ID | Notes |
| --- | --- | --- | --- |
| Apify gateway | Web app | `replace-after-fork` | Used by external buttons/tools. |

## External Integrations

| System | Setting | Current Value/Notes |
| --- | --- | --- |
| Apify | Tasks | AI, PM, and optionally GRC tasks. |
| Drive | CSV drop folder | Confirm folder ID/path. |
| Gmail | Alert recipient(s) | Confirm before running live notifications. |

## Known Manual Steps

- Confirm OAuth permissions in the forked GAS project.
- Confirm any web app deployment is set to the intended access level.
- Confirm Apify task IDs point to the fork's intended scraping setup.
- Confirm alert emails go to the intended recipient before enabling triggers.
