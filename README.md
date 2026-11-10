# Boyfriend Application — Form EL-26

A one-page, fan-made parody application site. It runs on Next.js 15 with a Neon Postgres database, hosted on Vercel.

- `/`: the application form
- `/admin`: a password-protected list of every application
- `/api/export`: downloads every application as a CSV (also password-protected)

The database table creates itself on the first submission, so there is no migration step.

## Deploy (about 10 minutes)

1. **Push to GitHub.**
   ```bash
   cd ella-apply
   git init && git add . && git commit -m "Form EL-26"
   gh repo create ella-application --private --source . --push
   ```
2. **Import the repo in Vercel.** Go to vercel.com/new and pick the repo. The defaults are fine, so click Deploy. The first deploy works, but the form won't save anything until step 3.
3. **Add the database.** In the Vercel project, go to **Storage → Create Database → Neon (Serverless Postgres)**, then connect it to the project. This sets `DATABASE_URL` for you. The free tier is plenty.
4. **Set the admin login.** In **Settings → Environment Variables**, add:
   - `ADMIN_USER`: any username
   - `ADMIN_PASSWORD`: a long random password
5. **Redeploy** (Deployments → ⋯ → Redeploy) so the new variables take effect.
6. **Add your domain.** Go to **Settings → Domains**, add the domain, and set the DNS records Vercel shows you at your registrar.

## Run locally

```bash
npm install
npm run dev
```

## Getting applications to Ella's team

Open `/admin` to read applications, or `/api/export` to download a CSV you can open in Excel or Google Sheets, sort, and forward. In Neon's console you can also run SQL directly, for example:

```sql
SELECT full_name, city_state, why_you FROM applications
WHERE man_or_boy = 'man' AND truck = 'yes' ORDER BY created_at DESC;
```

## Built-in protection

- A hidden honeypot field silently drops bot submissions.
- Each email address can submit at most 3 applications per day.
- The server enforces the 21+ age limit and requires the consent checkbox.
- "Little boy" applicants are rejected, per policy.

If the site goes viral and gets spammed, turn on **Vercel Firewall → Bot Protection** (one click) or add Cloudflare Turnstile.
