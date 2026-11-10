import { ensureSchema, sql } from "../../lib/db";

export const dynamic = "force-dynamic";
export const metadata = { title: "Applications — Admin", robots: { index: false } };

type Row = Record<string, any>;

export default async function Admin() {
  await ensureSchema();
  const rows = (await sql()`SELECT * FROM applications ORDER BY created_at DESC LIMIT 500`) as Row[];

  return (
    <main className="admin">
      <header>
        <h1>Applications on file: <span>{rows.length}</span></h1>
        <a className="btn" href="/api/export">Download CSV</a>
      </header>
      {rows.length === 0 && <p>No applicants yet. The dandelions are still blowing.</p>}
      {rows.map((r) => (
        <details key={r.id} className="app-card">
          <summary>
            <strong>#{r.id} {r.full_name}</strong> {r.age} · {r.city_state}
            <span>{new Date(r.created_at).toLocaleString("en-US", { timeZone: "America/Chicago" })}</span>
          </summary>
          <dl>
            {[
              ["Email", r.email], ["Phone", r.phone], ["Instagram", r.instagram && `@${r.instagram}`],
              ["Height", r.height], ["Truck", r.truck], ["Two-step", r.two_step],
              ["Alabama or Texas", r.texas_or_bama], ["Outdoors", r.outdoors?.join(", ")],
              ["Signature dish", r.signature_dish], ["Favorite Ella song", r.favorite_song],
              ["Mama says", r.mama_quote], ["Photo", r.photo_url],
            ].filter(([, v]) => v).map(([k, v]) => (
              <div key={k}><dt>{k}</dt><dd>{k === "Photo" ? <a href={v} target="_blank" rel="noreferrer">{v}</a> : v}</dd></div>
            ))}
          </dl>
          <p className="essay">{r.why_you}</p>
        </details>
      ))}
    </main>
  );
}
