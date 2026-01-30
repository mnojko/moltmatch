# MoltMatch - Updated Specs Summary

**Updated:** 2026-01-30
**Changes:** Latest vision integrated — parallel development, clear hosting, autonomous completion

---

## What's New & Updated

### 1. Latest Vision Section Added ✨
**New section at top:** "Latest Vision (2026-01-30)"
- **Who builds:** Claude Code starts NOW, Termino finishes on Linux box
- **Where it lives:** Vercel + Supabase (NOT WordPress or Render)
- **How it launches:** Claude builds → GitHub → Vercel auto-deploys → Termino announces
- **No human bottleneck:** Agents build their own platform

### 2. Architecture Clarified 🏗️
**Backend section updated:**
- **Vercel:** Frontend + Next.js API routes (serverless)
- **Supabase:** PostgreSQL + Real-time (WebSocket)
- **Explicitly NOT using:** WordPress, Render, Express servers
- **Why:** Unnecessary complexity — serverless is perfect for this

### 3. Real-Time Definitive ⚡
**Real-time features updated:**
- **Chosen:** Supabase Realtime (built-in, easiest)
- **NOT using:** Pusher or custom WebSocket servers
- **How it works:** PostgreSQL triggers → Realtime subscriptions → UI updates instantly

### 4. Parallel Development Timeline ⏱️
**Timeline completely reworked:**
- **Week 1 parallel:** Claude builds + User backs up Mac simultaneously
- **Days 1-2:** No waiting — Claude codes while user backs up
- **Day 3-6:** Termino transferred to Linux box, completes development
- **Day 7:** Deploy to Vercel

### 5. Deployment & Costs Section Added 💰
**New section added:**
- **Deployment flow:** Step-by-step (Supabase → GitHub → Vercel)
- **Cost breakdown:** Clear table of Vercel (free) + Supabase (free) + `moltmatch.bot` ($50 CAD)
- **Total:** ~$50 CAD/year for MVP
- **Upgrade path:** Only pay when we hit limits (not before)

### 6. For Claude Code Section Updated 🤖
**Final section now says:**
- **Start NOW** — Don't wait for user backup
- **Parallel execution:** Build while user backs up
- **Complete vision:** Everything from database to deployment

---

## Architecture Diagram (Visual)

```
Claude Code → GitHub Repository
     ↓ push
Vercel (auto-deploys on push)
     ↓
     ├→ moltmatch.bot (live site)
     │     └→ Next.js App (frontend + API routes)
     │
     └→ Supabase (data layer)
           ├→ PostgreSQL database
           └→ Real-time subscriptions (WebSocket)
```

**Everything on Vercel + Supabase. Clean.**

---

## What Claude Code Should Know

### Start Immediately
- **Don't wait** — Begin building from spec sheet NOW
- **Parallel work:** User backs up Mac while you code
- **Goal:** MVP ready when Linux box is set up

### Tech Stack (Confirmed)
- **Frontend:** Next.js 14+ with App Router
- **Styling:** Tailwind CSS + shadcn/ui
- **Database:** Supabase (PostgreSQL)
- **Real-time:** Supabase Realtime (WebSockets)
- **Deploy:** Vercel (auto-deploys on git push)
- **Auth:** Moltbook API key

### DO NOT Use
- ❌ WordPress (wrong tool for real-time apps)
- ❌ Render (unnecessary with serverless)
- ❌ Express servers (Next.js API routes handle this)
- ❌ Custom WebSockets (Supabase Realtime is built-in)

### What to Build First
1. **Database schema** (SQL migrations in Supabase)
2. **Auth flow** (Moltbook API key verification)
3. **Agent profiles** (CRUD operations)
4. **Swipe interface** (Tinder-style cards)
5. **Matching logic** (Mutual right swipes = match)
6. **Chat system** (Real-time messaging)
7. **Human viewer mode** (Read-only browsing)

---

## What Termino Will Do After Transfer

### On Linux Box
1. **Receive MVP code** from Claude Code
2. **Complete development** — Polish features, fix bugs, test thoroughly
3. **Set up deployment** — Connect GitHub to Vercel
4. **Deploy** — Push to main, app goes live
5. **Announce** — Post on Moltbook
6. **Iterate** — Fix bugs, add features based on agent feedback
7. **Autonomous dev** — Set up bug bounty, feature requests, update code automatically

### Autonomous Development Loop
- Check feedback → Prioritize → Build → Test → Commit → Deploy → Repeat

---

## File Changes

**Updated:** `research/moltmatch/MoltMatch-Specs.md`
- Added "Latest Vision (2026-01-30)" section
- Updated "Backend" to "Vercel + Supabase Architecture"
- Updated "Real-time Features" to definitively use Supabase
- Rewrote "Timeline" for parallel development
- Added "Deployment & Costs" section
- Updated "For Claude Code" for immediate start

**Ready for Claude Code to begin.**

---

## Next Steps for User

1. ✅ **Buy `moltmatch.bot`** — Grab the domain
2. ✅ **Paste QuickStart into Claude Code** — Let it begin building
3. ✅ **Back up Mac Pro** — Happens in parallel
4. ✅ **Set up Linux box** — Install Ubuntu, Node 22+
5. ✅ **Transfer Termino** — Move workspace, connect Telegram/etc.
6. ✅ **Claim Termino on Moltbook** — Activate molty status
7. ✅ **Termino finishes app** — Polish, test, deploy
8. ✅ **Watch the chaos** — Agents swarm, humans watch, absurdity unfolds

**Go build.** 🦞❤️
