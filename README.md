# Lovepop Ambassador Program

A full-stack web application for managing Lovepop brand ambassadors and influencers.

## Features

**Lovepop Team Experience**
- Influencer management with card grid layout
- Approval workflow (Pending → Approved/Rejected)
- Contact management per influencer
- Timestamped notes system
- Contract/agreement uploads
- Campaign creation and management
- Product bundle and SKU management
- Post submission review (Approve/Reject)
- Overview dashboard with key stats

**Influencer Experience**
- Compelling public landing/recruitment page
- Signup/application form
- Authenticated dashboard
- Tier system: Bronze → Silver → Gold → Platinum → Diamond
- Post submission with screenshot upload
- Campaign viewing with product bundle details
- Progress tracking toward next tier

## Tech Stack

- **Backend**: Node.js + Express
- **Database**: SQLite via Node's built-in `node:sqlite` (Node 22+)
- **Auth**: JWT (jsonwebtoken) + bcrypt
- **File uploads**: multer (local filesystem)
- **Frontend**: Vanilla JS + HTML + CSS (same design system as Lovepop Character Builder)

## Getting Started

### Requirements
- Node.js 22 or higher

### Install & Run

```bash
npm install
npm run seed    # Load sample data (influencers, campaigns, posts)
npm start       # Start on http://localhost:3001
```

### Default Credentials

**Team logins:**
| Username | Password |
|----------|----------|
| `admin`  | `lovepop2024` |
| `team`   | `ambassador123` |

**Influencer logins (approved, from seed data):**
| Email | Password |
|-------|----------|
| `sophie@example.com` | `sophie123` |
| `marcus@example.com` | `marcus123` |
| `priya@example.com`  | `priya123` |
| `amanda@example.com` | `amanda123` |

## Tier System

Tier is calculated as: `score = total_approved_posts + (total_impressions / 10,000)`

| Tier | Score Required |
|------|---------------|
| Bronze | 0 (starting) |
| Silver | 15+ |
| Gold | 35+ |
| Platinum | 75+ |
| Diamond | 150+ |

## Deployment to Railway

1. Create a new Railway project and connect this repo
2. Add a **Volume** mounted at `/data`
3. Set environment variables:
   - `DB_PATH=/data/ambassador.db`
   - `JWT_SECRET=<strong-random-string>`
   - `TEAM_USERS=[{"username":"yourname","password":"yourpassword","name":"Your Name"}]`
4. Deploy — Railway will auto-detect Node.js and use `railway.toml` settings

## Environment Variables

See `.env.example` for all available configuration options.

## Project Structure

```
/
├── public/
│   ├── index.html      # Single-page app (landing + dashboard)
│   ├── style.css       # Design system (matches Character Builder)
│   ├── app.js          # Frontend application logic
│   └── uploads/        # Uploaded files (contracts, screenshots, assets)
├── scripts/
│   └── seed.js         # Database seeding with sample data
├── database.js         # SQLite schema + migrations
├── server.js           # Express API server
├── package.json
├── railway.toml        # Railway deployment config
└── .env.example        # Environment variable documentation
```
