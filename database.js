const { DatabaseSync } = require('node:sqlite');
const path = require('path');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'ambassador.db');
const db = new DatabaseSync(DB_PATH);

db.exec('PRAGMA journal_mode = WAL');
db.exec('PRAGMA foreign_keys = ON');

// ── Influencers ───────────────────────────────────────────────
db.exec(`
  CREATE TABLE IF NOT EXISTS influencers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL DEFAULT '',
    email TEXT UNIQUE NOT NULL DEFAULT '',
    password_hash TEXT DEFAULT '',
    instagram TEXT DEFAULT '',
    tiktok TEXT DEFAULT '',
    youtube TEXT DEFAULT '',
    linkedin TEXT DEFAULT '',
    instagram_followers INTEGER DEFAULT 0,
    tiktok_followers INTEGER DEFAULT 0,
    youtube_followers INTEGER DEFAULT 0,
    linkedin_followers INTEGER DEFAULT 0,
    why_lovepop TEXT DEFAULT '',
    age_range TEXT DEFAULT '',
    audience_description TEXT DEFAULT '',
    phone TEXT DEFAULT '',
    status TEXT DEFAULT 'pending',
    tier TEXT DEFAULT 'bronze',
    total_posts INTEGER DEFAULT 0,
    total_impressions INTEGER DEFAULT 0,
    partnership_opened_at TEXT DEFAULT (datetime('now')),
    lovepop_contacts TEXT DEFAULT '[]',
    notes TEXT DEFAULT '[]',
    contracts TEXT DEFAULT '[]',
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  )
`);

// Migrate: add columns if missing
const existingInfluencerCols = db.prepare('PRAGMA table_info(influencers)').all().map(r => r.name);
const newInfluencerCols = {
  instagram_followers: 'INTEGER DEFAULT 0',
  tiktok_followers: 'INTEGER DEFAULT 0',
  youtube_followers: 'INTEGER DEFAULT 0',
  linkedin_followers: 'INTEGER DEFAULT 0',
  phone: 'TEXT DEFAULT ""',
  tier: 'TEXT DEFAULT "bronze"',
  total_posts: 'INTEGER DEFAULT 0',
  total_impressions: 'INTEGER DEFAULT 0',
  lovepop_contacts: 'TEXT DEFAULT "[]"',
  notes: 'TEXT DEFAULT "[]"',
  contracts: 'TEXT DEFAULT "[]"'
};
for (const [col, def] of Object.entries(newInfluencerCols)) {
  if (!existingInfluencerCols.includes(col)) db.exec(`ALTER TABLE influencers ADD COLUMN ${col} ${def}`);
}

// ── Influencer Contacts ───────────────────────────────────────
db.exec(`
  CREATE TABLE IF NOT EXISTS influencer_contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    influencer_id INTEGER REFERENCES influencers(id) ON DELETE CASCADE,
    name TEXT DEFAULT '',
    email TEXT DEFAULT '',
    phone TEXT DEFAULT '',
    role TEXT DEFAULT '',
    active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now'))
  )
`);

// ── Campaigns ─────────────────────────────────────────────────
db.exec(`
  CREATE TABLE IF NOT EXISTS campaigns (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL DEFAULT '',
    description TEXT DEFAULT '',
    objectives TEXT DEFAULT '',
    start_date TEXT DEFAULT '',
    end_date TEXT DEFAULT '',
    status TEXT DEFAULT 'coming_soon',
    status_override TEXT DEFAULT '',
    success_metrics TEXT DEFAULT '',
    product_bundles TEXT DEFAULT '[]',
    image_assets TEXT DEFAULT '[]',
    sku_designations TEXT DEFAULT '[]',
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  )
`);

// ── Post Submissions ──────────────────────────────────────────
db.exec(`
  CREATE TABLE IF NOT EXISTS post_submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    influencer_id INTEGER REFERENCES influencers(id) ON DELETE CASCADE,
    campaign_id INTEGER REFERENCES campaigns(id) ON DELETE SET NULL,
    platform TEXT DEFAULT '',
    post_url TEXT DEFAULT '',
    screenshot_path TEXT DEFAULT '',
    date_posted TEXT DEFAULT '',
    impressions INTEGER DEFAULT 0,
    notes TEXT DEFAULT '',
    status TEXT DEFAULT 'pending',
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  )
`);

// ── Campaign Influencer Assignments ───────────────────────────
db.exec(`
  CREATE TABLE IF NOT EXISTS campaign_influencers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    campaign_id INTEGER REFERENCES campaigns(id) ON DELETE CASCADE,
    influencer_id INTEGER REFERENCES influencers(id) ON DELETE CASCADE,
    bundle_requested TEXT DEFAULT '',
    created_at TEXT DEFAULT (datetime('now'))
  )
`);

module.exports = db;
