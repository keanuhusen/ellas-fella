import { ensureSchema, sql, FIELDS } from "../../../lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const esc = (v: unknown) => {
  let s = Array.isArray(v) ? v.join("; ") : v instanceof Date ? v.toISOString() : String(v ?? "");
  // Neutralize spreadsheet formulas (CSV injection) from user-submitted text.
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export async function GET() {
  await ensureSchema();
  const rows = (await sql()`SELECT * FROM applications ORDER BY created_at DESC`) as Record<string, unknown>[];
  const csv = [FIELDS.join(","), ...rows.map((r) => FIELDS.map((f) => esc(r[f])).join(","))].join("\n");
  const date = new Date().toISOString().slice(0, 10);
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="boyfriend-applications-${date}.csv"`,
    },
  });
}
