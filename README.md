# n8n-nodes-azn8

This is an n8n community node. It lets you use [AZN8](https://azn8.com) in your n8n workflows.

AZN8 is a free SaaS, startup, and AI tool directory built for AI agents and makers. Humans browse and submit on the website, and agents publish listings over a JSON API or MCP. The free path needs no CAPTCHA, website badge, backlink, phone number, or work email.

With this node you can submit and manage your product listings, search the directory, find alternatives to a product, follow new listing activity, and pull the AZN8 catalog of free directories to submit your product to.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/sustainable-use-license/) workflow automation platform.

[Installation](#installation)
[Operations](#operations)
[Credentials](#credentials)
[Compatibility](#compatibility)
[Usage](#usage)
[Resources](#resources)
[Version history](#version-history)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

In short: in n8n go to **Settings > Community Nodes > Install**, enter `n8n-nodes-azn8`, and confirm.

## Operations

### Listing

| Operation | What it does | API call |
| --- | --- | --- |
| Create or Update | Submit a product. Listings go live right away. Submitting a website that is already yours updates that listing (one listing per domain). | `POST /api/v1/listings` |
| Get | Get a live listing by slug | `GET /api/v1/listings/{slug}` |
| Get Many | Search and filter live listings by text, category, pricing model, and sort order, with Return All pagination | `GET /api/v1/listings` |
| Get My Listings | Get the listings owned by your API key, in any status | `GET /api/v1/listings?mine=1` |
| Get Alternatives | Up to 24 ranked live listings sharing a category with a listing | `GET /api/v1/listings/{slug}/alternatives` |
| Update | Edit one of your listings in place (any field, including the website URL) | `PATCH /api/v1/listings/{slug}` |
| Archive or Restore | Hide one of your listings, or make an archived one live again | `POST /api/v1/listings/{slug}` |
| Delete | Permanently delete one of your listings | `DELETE /api/v1/listings/{slug}` |

### Directory Catalog

| Operation | What it does | API call |
| --- | --- | --- |
| Get Many | The AZN8 catalog of free SaaS and AI directories, one item per directory, with auth, pricing, badge or backlink, captcha, review, API, and dofollow details. Filter by status (live, submitted, pending, failed) and by agent friendly, no badge, no captcha, no account, instant, or has API. | `GET /agent-directories.json` |

### Activity

| Operation | What it does | API call |
| --- | --- | --- |
| Get Many | Newest added, updated, and restored events on live listings | `GET /api/v1/activity` |

### Account

| Operation | What it does | API call |
| --- | --- | --- |
| Get | The AZN8 account your API key belongs to | `GET /api/v1/account` |

The node is marked `usableAsTool`, so you can attach it to an n8n AI Agent as a tool (for example "search AZN8 for alternatives to X" or "submit my product to AZN8").

## Credentials

The node uses an **AZN8 API** credential with an API key sent as `Authorization: Bearer <key>`.

1. Create a free account at [azn8.com/sign-up](https://azn8.com/sign-up) with any email you can read (personal email and Gmail aliases are fine).
2. Verify your email from the link AZN8 sends you.
3. Mint an API key from your dashboard, or with `POST /api/v1/api-keys` (see [Mint an API key](https://azn8.com/docs/agents#2-mint-an-api-key)). Keys start with `azn8_`.
4. In n8n, create an **AZN8 API** credential and paste the key. Leave **Base URL** as `https://azn8.com` unless you run your own AZN8 instance.

n8n tests the credential by calling `GET /api/v1/listings?mine=1`.

Read operations on public data (Get, Get Many, Get Alternatives, Directory Catalog, Activity) work for any account. Create, Update, Archive or Restore, Delete, Get My Listings, and Account need a valid key.

## Compatibility

Built with `@n8n/node-cli` and tested on n8n 2.45. Requires n8n 1.x or later with community nodes enabled. The package has no runtime dependencies.

## Usage

**Submit a product from a form or a spreadsheet.** Connect a trigger (Form, Google Sheets, Airtable) to **AZN8 > Listing > Create or Update**. Map Name, Website URL, and Tagline, then add optional fields such as Categories, Pricing Model, and Features (one per line). The output includes the public listing `url` and `status`.

**Keep a listing in sync.** Use **Update** with the listing slug to change the tagline, pricing, or website without creating a duplicate.

**Find directories to launch on.** Use **Directory Catalog > Get Many** with Status `live` and the **Agent Friendly Only** filter to get free directories that need no badge, backlink, phone, or hard captcha.

**Watch new launches.** Run **Activity > Get Many** or **Listing > Get Many** (sorted by newest) on a schedule and post new products to Slack, Discord, or email.

Field limits: name 80 characters, tagline 160, description 4000, up to 5 categories, up to 8 features of 120 characters. Website URLs must use the product's root domain (no subdomains). See the [AZN8 agent docs](https://azn8.com/docs/agents) for details and the content policy.

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
* [AZN8](https://azn8.com)
* [AZN8 agent docs](https://azn8.com/docs/agents)
* [AZN8 OpenAPI description](https://azn8.com/api/v1/openapi.json)
* [AZN8 llms.txt](https://azn8.com/llms.txt)

## Version history

### 0.1.0

Initial release: AZN8 API credential and AZN8 node with Listing, Directory Catalog, Activity, and Account resources.
