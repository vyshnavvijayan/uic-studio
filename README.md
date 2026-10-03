# UIC Studio — Digital Identity & Aerospace NFC Experiences

A high-performance digital flagship and section-based visual CMS for **UIC Studio** (Unique Identity Creation). 

UIC Studio bridges architectural digital craft and tactile physical accessories, creating bespoke portfolio platforms, business flagships, and aerospace-grade titanium NFC business cards that transmit credentials with a single physical tap.

---

## Live Reference Specifications
- **Visual Reference**: [uic-sandy.vercel.app](https://uic-sandy.vercel.app/)
- **Repository Destination**: [github.com/vyshnavvijayan/uic-studio](https://github.com/vyshnavvijayan/uic-studio.git)

---

## Technology Stack

- **Framework**: Next.js 16 (App Router with Turbopack & React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 with custom dark luxury tokens
- **Animations**: Motion for React & Canvas rendering for scroll playback
- **Database & Storage**: Supabase Postgres, Supabase Auth, and Supabase Storage (`site-media`)
- **Deployment**: Vercel-ready with edge CDN distribution

---

## Visual Direction & Design Tokens

- **Aesthetic**: Minimalist luxury, oversized editorial typography, generous whitespace, sharp alignment, subtle glassmorphic borders (`border-white/[0.08]`), restrained corner radii (`rounded-2xl`, `rounded-3xl`).
- **Color Palette**:
  - Background Primary: Near-black `#080809`
  - Text Primary: Ivory `#f5f5f7`
  - Text Secondary: Muted Grey `#90909c`
  - Signature Accent: Neon Lime `#c6f36b` (with ambient glow `#c6f36b22`)
  - Border Subtle: `rgba(255, 255, 255, 0.08)`

---

## Core Features

### 1. Cinematic Scroll-Controlled Hero
- Sticky full-screen sequence over ~260vh of scrollable height.
- Coalesced 44-frame canvas rendering (`/images/heropage/0001.webp` through `0044.webp`) with DPR scaling and cover-fit logic.
- Opening headline visible immediately: *"Make your presence felt."* (fades and moves upward as visitor scrolls).
- Climax closing headline appears near the end of scroll: *"More than a first impression."*
- Persistent *"Explore the studio"* link, real-time scroll progress indicator line, and pause/resume motion toggle.
- Preloaded static poster fallback for instant loading and `prefers-reduced-motion` compliance.

### 2. Studio Manifesto & Performance Metrics
- Clean architectural typography highlighting studio locations (`London × Geneva × Tokyo × Worldwide`).
- Technical metrics: `<140ms` Edge Response, `Grade 5` Titanium Alloy, `100%` Bespoke Codebases, `Dynamic` OTA NFC Profile.

### 3. Services Bento Grid
- Modular service cards (Personal Portfolios, Business Flagships, Aerospace NFC Cards, SEO Engineering, Custom Dashboards, Bespoke Web Apps).
- Expandable technical parameter drawers for deep-dive inspections.

### 4. Aceternity-Inspired 3D NFC Card Showcase
- Interactive card stack with automatic cycling timer and perspective tilt.
- Card material switcher (Aerospace Titanium, Brushed Platinum Steel, 24K Gold Mirror, Stealth Carbon Weave).
- Live simulated NFC tap interaction: clicking triggers RF wave pulses, haptic animations, and encrypted credential readouts.

### 5. Selected Work Gallery
- Real high-resolution imagery for all studio projects.
- Concept projects explicitly tagged with `[ Concept Study ]` badges.
- Category filters and modal inspector with project deliverables.

### 6. 4-Stage Methodology
- Clear structured timeline: Strategic Discovery → Architectural Design → Precision Engineering → Deployment & Commission.

### 7. Testimonials Infinite Marquee
- Slow, infinite marquee with faded gradient mask edges.
- Pause on hover, pause on keyboard focus, and explicit Pause/Resume button.
- Built-in admin approval filter: unapproved quotes remain strictly hidden.

### 8. Accessible FAQ Accordion
- Keyboard-accessible expandable questions regarding hardware compatibility, production timelines, and custom domains.

### 9. Honest Direct Contact & Commission CTA
- Editable contact email (`mailto:design@uic.studio`).
- Quick-copy button with instant visual checkmark feedback.
- Structured **Commission Blueprint Formatter** modal: clients can outline scope and launch their default mail client or copy a formatted brief.

### 10. Complete Section-Based CMS (`/admin`)
- **Section Order & Templates**: Reorder sections (Move Up/Down), duplicate, toggle visibility, remove, or add new sections from templates.
- **Repeated Item Management**: Add, edit, reorder, or delete services, portfolio projects, FAQs, testimonials, and process steps.
- **Media Uploading**: Drag-and-drop file upload with client- and server-side validation (Images ≤ 8MB, Videos ≤ 24MB, executable files & SVGs blocked).
- **Brand & SEO Settings**: Edit wordmark, accent color token with preset swatches, primary email, navigation menu, and OpenGraph metadata.
- **Multi-Device Responsive Preview**: Test live changes side-by-side in Desktop (100%), Tablet (768px), or Mobile (390px) viewports.
- **Draft vs. Publish Separation**: Save private drafts without publishing; publish live atomically with revision tracking and celebratory feedback.
- **Preview Sandbox Mode**: If Supabase credentials are not yet supplied, an in-memory/browser-persisted sandbox mode is activated so you can test all features without friction.

---

## Local Installation & Setup

### Prerequisites
- Node.js 18+ (tested on Node v24)
- npm or pnpm

### Quick Start
```bash
# 1. Clone repository
git clone https://github.com/vyshnavvijayan/uic-studio.git
cd uic-studio

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Supabase Setup & Security Guide

### 1. Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project.
2. In Project Settings -> API, copy your `Project URL` and `anon public` key.

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Add your credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Run Database Migrations
Open your Supabase SQL Editor and execute the provided migration script:
[supabase/migrations/20261003000000_init_uic_studio.sql](supabase/migrations/20261003000000_init_uic_studio.sql)

This will create:
- `site_admins`: Table of verified admin user IDs.
- `site_content`: Draft and published documents with Row Level Security.
- `site_revisions`: Immutable audit log of published snapshots.
- `publish_site_content()`: Transactional stored procedure with optimistic concurrency checking.
- `site-media`: Storage bucket with strict file size and MIME type restrictions.

### 4. Create Your Admin User
1. In Supabase Dashboard -> **Authentication** -> **Users**, click **Add User** (e.g. `admin@uic.studio` with a secure password).
2. Note the generated User `UUID`.
3. In SQL Editor, run:
```sql
INSERT INTO public.site_admins (id, email, role)
VALUES ('<USER-UUID-HERE>', 'admin@uic.studio', 'admin')
ON CONFLICT (id) DO NOTHING;
```
Now sign in at [http://localhost:3000/admin/login](http://localhost:3000/admin/login).

---

## Extensibility & Customization

- **Routine Content Edits**: Adding projects, adjusting copy, updating SEO, reordering sections, and changing accent colors can be done 100% inside the CMS without any developer involvement.
- **New Section Layouts**: If entirely new architectural components or custom third-party integrations are desired, developers can register a new section type in `src/types/content.ts` and add its template in `src/components/SectionRenderer.tsx` and `src/components/admin/SectionForm.tsx`.

---

## Production Build & Deployment

```bash
# Verify TypeScript & compile production bundle
npm run build

# Start production server
npm run start
```

### Deploy to Vercel
1. Push your repository to GitHub.
2. Import the repository in [Vercel](https://vercel.com).
3. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to Vercel Environment Variables.
4. Deploy!
