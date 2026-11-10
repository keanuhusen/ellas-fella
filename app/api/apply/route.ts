import { NextResponse } from "next/server";
import { ensureSchema, sql } from "../../../lib/db";

export const runtime = "nodejs";

const clip = (v: unknown, max: number) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

const ONE_OF = {
  man_or_boy: ["man", "little boy"],
  truck: ["yes", "no", "its my dads"],
  two_step: ["yes", "no", "willing to learn"],
  texas_or_bama: ["alabama", "texas", "wherever she is"],
} as const;

export async function POST(req: Request) {
  let b: Record<string, unknown>;
  try {
    b = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  // Honeypot: bots fill hidden fields; humans don't.
  if (clip(b.website, 200)) return NextResponse.json({ ok: true });

  const d = {
    full_name: clip(b.full_name, 120),
    email: clip(b.email, 200).toLowerCase(),
    phone: clip(b.phone, 40),
    instagram: clip(b.instagram, 60).replace(/^@/, ""),
    city_state: clip(b.city_state, 120),
    age: Number(b.age),
    height: clip(b.height, 20),
    man_or_boy: clip(b.man_or_boy, 20),
    truck: clip(b.truck, 20),
    two_step: clip(b.two_step, 20),
    texas_or_bama: clip(b.texas_or_bama, 20),
    outdoors: Array.isArray(b.outdoors)
      ? b.outdoors.map((x) => clip(x, 30)).filter(Boolean).slice(0, 8)
      : [],
    signature_dish: clip(b.signature_dish, 120),
    favorite_song: clip(b.favorite_song, 120),
    mama_quote: clip(b.mama_quote, 300),
    why_you: clip(b.why_you, 1500),
    photo_url: clip(b.photo_url, 500),
  };

  const errors: string[] = [];
  if (!d.full_name) errors.push("Name is required.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) errors.push("A real email, please.");
  if (!d.city_state) errors.push("Tell us where you're from.");
  if (!Number.isInteger(d.age) || d.age < 21 || d.age > 99)
    errors.push("Applicants must be 21 or older.");
  if (!d.why_you) errors.push("The essay is not optional, partner.");
  if (b.consent !== true) errors.push("Please accept the fine print.");
  for (const [k, allowed] of Object.entries(ONE_OF)) {
    const v = d[k as keyof typeof ONE_OF];
    if (v && !(allowed as readonly string[]).includes(v)) errors.push(`Invalid ${k}.`);
  }
  if (d.man_or_boy !== "man")
    errors.push("We regret to inform you that little boys are not being considered at this time.");
  if (d.photo_url && !/^https?:\/\//i.test(d.photo_url)) d.photo_url = "";

  if (errors.length) return NextResponse.json({ error: errors[0] }, { status: 422 });

  try {
    await ensureSchema();
    const db = sql();
    const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim();
    const ua = clip(req.headers.get("user-agent"), 300);

    // Light throttle: max 3 applications per email per day.
    const recent = (await db`
      SELECT count(*)::int AS n FROM applications
      WHERE email = ${d.email} AND created_at > now() - interval '1 day'`) as { n: number }[];
    if (recent[0]?.n >= 3)
      return NextResponse.json(
        { error: "Easy, cowboy. Three applications a day is plenty." },
        { status: 429 },
      );

    const rows = (await db`
      INSERT INTO applications
        (full_name, email, phone, instagram, city_state, age, height, man_or_boy,
         truck, two_step, texas_or_bama, outdoors, signature_dish, favorite_song,
         mama_quote, why_you, photo_url, ip, user_agent)
      VALUES
        (${d.full_name}, ${d.email}, ${d.phone || null}, ${d.instagram || null},
         ${d.city_state}, ${d.age}, ${d.height || null}, ${d.man_or_boy},
         ${d.truck || null}, ${d.two_step || null}, ${d.texas_or_bama || null},
         ${d.outdoors}, ${d.signature_dish || null}, ${d.favorite_song || null},
         ${d.mama_quote || null}, ${d.why_you}, ${d.photo_url || null}, ${ip || null}, ${ua})
      RETURNING id`) as { id: number }[];

    return NextResponse.json({ ok: true, id: rows[0].id });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Our filing cabinet jammed. Try again in a minute." }, { status: 500 });
  }
}
