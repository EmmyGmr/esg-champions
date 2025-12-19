# ESG Champions Platform

**STIF - Sustainability Technology and Innovation Forum**

A collaborative platform for sustainability experts to validate and improve ESG (Environmental, Social, and Governance) indicators.

## 🌟 Features

- **ESG Panels**: 14 comprehensive panels covering Environmental, Social, and Governance categories
- **50+ Indicators**: Detailed ESG indicators with methodology, data sources, and frequencies
- **Champion Reviews**: Submit and validate ESG indicator reviews
- **Community Voting**: Upvote/downvote system for community-driven quality
- **Leaderboard**: Recognition system with STIF credits and rankings
- **Admin Tools**: Moderation queue, panel/indicator management, data export
- **Progress Tracking**: "Continue where you left off" feature

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Supabase account (free tier works)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/esg-champions.git
cd esg-champions
npm install
```

### 2. Configure Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Get your Project URL and Anon Key from Settings → API
3. Update `supabase-config.js`:

```javascript
const SUPABASE_URL = 'https://YOUR-PROJECT-REF.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR-ANON-PUBLIC-KEY';
```

### 3. Set Up Database

Run the SQL scripts in Supabase SQL Editor in this order:

1. `complete-database-schema.sql` - Core tables, policies, and functions
2. `add-notifications-table.sql` - Notification system
3. `seed-panels-indicators.sql` - Initial ESG panels and indicators
4. `add-user-progress-tracking.sql` - Progress tracking (optional)
5. `fix-accepted-reviews-updated-at.sql` - Bug fix (if needed)

### 4. Configure Auth

In Supabase Dashboard → Authentication → URL Configuration:
- **Site URL**: `http://localhost:8000`
- **Redirect URLs**: Add `http://localhost:8000/**`

For LinkedIn OAuth (optional):
1. Enable LinkedIn OIDC in Authentication → Providers
2. Add redirect URL: `https://YOUR-PROJECT-REF.supabase.co/auth/v1/callback`

### 5. Run Locally

```bash
npm run dev
# Opens at http://localhost:8000
```

Or with Python:
```bash
python -m http.server 8000
```

## 📁 Project Structure

```
esg-champions/
├── index.html              # Homepage
├── about.html              # About page
├── faq.html                # FAQ page
├── privacy.html            # Privacy policy
├── cookie-policy.html      # Cookie policy
├── champion-login.html     # Login page
├── champion-register.html  # Registration page
├── champion-dashboard.html # User dashboard
├── champion-panels.html    # ESG panels browser
├── champion-indicators.html # Indicator detail & review
├── champion-profile.html   # User profile settings
├── ranking.html            # Leaderboard
├── admin-review.html       # Admin panel
├── linkedin-callback.html  # OAuth callback
├── styles.css              # Main stylesheet
├── supabase-config.js      # Supabase credentials
├── supabase-service.js     # Supabase API wrapper
├── champion-auth-supabase.js # Authentication service
├── champion-db-supabase.js  # Database helpers
├── champion-dashboard.js   # Dashboard logic
├── champion-panels.js      # Panels page logic
├── champion-indicators.js  # Indicators page logic
├── champion-profile.js     # Profile page logic
├── ranking-supabase.js     # Leaderboard logic
├── admin-service.js        # Admin API calls
├── admin-review.js         # Admin panel logic
├── dynamic-navigation.js   # Role-based nav
├── mobile-menu.js          # Mobile menu handler
├── logout.js               # Logout handler & toasts
├── build.js                # Build script
├── package.json            # Dependencies
└── SQL Scripts/
    ├── complete-database-schema.sql
    ├── add-notifications-table.sql
    ├── seed-panels-indicators.sql
    ├── add-user-progress-tracking.sql
    └── fix-accepted-reviews-updated-at.sql
```

## 🛠 Deployment

### Vercel (Recommended)

```bash
npm i -g vercel
vercel
vercel --prod
```

Set environment variables in Vercel:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

### Netlify

1. Build command: `node build.js`
2. Publish directory: `public`
3. Add environment variables

### GitHub Pages

Serve the root directory directly or use `build.js` to prepare `public/`.

## 🔐 Admin Setup

Grant admin privileges to your account:

```sql
UPDATE champions
SET is_admin = true
WHERE email = 'your-email@example.com';
```

## 📊 ESG Framework

### Environmental (5 Panels)
- Climate Action
- Energy Management
- Water Stewardship
- Waste & Circular Economy
- Biodiversity & Land Use

### Social (5 Panels)
- Human Rights
- Labor Practices
- Health & Safety
- Diversity & Inclusion
- Community Engagement

### Governance (4 Panels)
- Corporate Governance
- Ethics & Compliance
- Risk Management
- Transparency & Reporting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

See `contributor-agreements.md` for CLA and NDA information.

## 📄 License

MIT License - See [LICENSE](LICENSE)

## 📞 Support

- **Documentation**: See `SETUP_GUIDE.md` for detailed setup
- **Quick Start**: See `QUICK_SETUP.md` for rapid deployment
- **Email**: support@stif.org

---

© 2024 STIF - Sustainability Technology and Innovation Forum

