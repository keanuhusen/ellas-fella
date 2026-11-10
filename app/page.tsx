"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "done";

const OUTDOORS = ["Fishing", "Hunting", "Mudding", "Bonfires", "Front-porch sitting", "Church on Sunday"];

export default function Home() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [appId, setAppId] = useState<number | null>(null);
  const [manOrBoy, setManOrBoy] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const f = new FormData(e.currentTarget);
    const body = {
      ...Object.fromEntries(f.entries()),
      outdoors: f.getAll("outdoors"),
      consent: f.get("consent") === "on",
    };
    setStatus("sending");
    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Something went wrong.");
      setAppId(json.id ?? null);
      setStatus("done");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError((err as Error).message);
      setStatus("idle");
    }
  }

  return (
    <>
      <div className="ticker">
        <span>Fan-made parody · Not affiliated with Ella Langley or her team · Little boys need not apply · </span>
        <span aria-hidden="true">Fan-made parody · Not affiliated with Ella Langley or her team · Little boys need not apply · </span>
      </div>

      <main className="paper">
        <header className="hero">
          <div className="hero-copy">
            <p className="form-no">Form EL-26 · Rev. Dandelion Season</p>
            <h1>
              <small>Application for the position of</small> Boyfriend
            </h1>
            <p className="dept">Office of Not Little Boys · Hope Hull, Alabama</p>
            <p className="note">
              She said she&rsquo;s taking applications.<br />So we opened an office.
            </p>
          </div>
          <div className="hero-art">
            <img className="hero-frame" src="/images/frame-tour1.png" width={735} height={864}
              alt="Ella Langley in an ornate gold frame surrounded by dandelions" />
            <div className="stamp">Now<br />Accepting</div>
          </div>
        </header>

        {status === "done" ? (
          <section className="received">
            <div className="stamp big">Received</div>
            <h2>Application #{appId ?? "—"} is on file.</h2>
            <p>
              Your paperwork has been placed in a very official manila folder. Do not call us.
              We&rsquo;ll call you. (Honestly, we probably won&rsquo;t.)
            </p>
            <p className="handwritten">Go call your mama and tell her you did it.</p>
          </section>
        ) : (
          <>
            <section className="quals">
              <h2>Minimum Qualifications</h2>
              <ol>
                <li><b>Must be a man.</b> Not a little boy. This is non-negotiable and will be verified.</li>
                <li>Must be 21 years of age or older.</li>
                <li>Must have a mama who will vouch for you, in writing.</li>
                <li>Tall, dark hair, dimple: <i>preferred, not required.</i> Applicants without a dimple are encouraged to smile harder.</li>
                <li>Must be able to hold a conversation, a door, and a fishing rod.</li>
              </ol>
            </section>

            <form onSubmit={onSubmit} className="form" noValidate={false}>
              {/* Honeypot */}
              <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hp" aria-hidden="true" />

              <fieldset>
                <legend><span>I.</span> Applicant Information</legend>
                <div className="grid">
                  <label className="wide">Full legal name<input name="full_name" required maxLength={120} /></label>
                  <label>Age<input name="age" type="number" min={21} max={99} required /></label>
                  <label>Height<input name="height" placeholder={`e.g. 6'2"`} maxLength={20} /></label>
                  <label className="wide">Hometown (City, State)<input name="city_state" required maxLength={120} /></label>
                  <label>Email<input name="email" type="email" required maxLength={200} /></label>
                  <label>Phone <em>(optional)</em><input name="phone" type="tel" maxLength={40} /></label>
                  <label>Instagram <em>(optional)</em><input name="instagram" placeholder="@" maxLength={60} /></label>
                  <label>Photo link <em>(optional)</em><input name="photo_url" type="url" placeholder="https://" maxLength={500} /></label>
                </div>
              </fieldset>

              <fieldset>
                <legend><span>II.</span> Qualifications</legend>

                <div className="q">
                  <p className="q-label">1. Please indicate which of the following best describes you. <b>*</b></p>
                  <div className="choices">
                    <label className="choice"><input type="radio" name="man_or_boy" value="man" required onChange={(e) => setManOrBoy(e.target.value)} /> A man</label>
                    <label className="choice"><input type="radio" name="man_or_boy" value="little boy" onChange={(e) => setManOrBoy(e.target.value)} /> A little boy</label>
                  </div>
                  {manOrBoy === "little boy" && (
                    <p className="warn">Thank you for your honesty. Unfortunately, this position requires a man.</p>
                  )}
                </div>

                <div className="q">
                  <p className="q-label">2. Do you own a truck?</p>
                  <div className="choices">
                    <label className="choice"><input type="radio" name="truck" value="yes" /> Yes</label>
                    <label className="choice"><input type="radio" name="truck" value="no" /> No</label>
                    <label className="choice"><input type="radio" name="truck" value="its my dads" /> It&rsquo;s my dad&rsquo;s</label>
                  </div>
                </div>

                <div className="q">
                  <p className="q-label">3. Can you two-step?</p>
                  <div className="choices">
                    <label className="choice"><input type="radio" name="two_step" value="yes" /> Yes</label>
                    <label className="choice"><input type="radio" name="two_step" value="no" /> No</label>
                    <label className="choice"><input type="radio" name="two_step" value="willing to learn" /> Willing to learn</label>
                  </div>
                </div>

                <div className="q">
                  <p className="q-label">4. Alabama or Texas?</p>
                  <div className="choices">
                    <label className="choice"><input type="radio" name="texas_or_bama" value="alabama" /> Alabama</label>
                    <label className="choice"><input type="radio" name="texas_or_bama" value="texas" /> Texas</label>
                    <label className="choice"><input type="radio" name="texas_or_bama" value="wherever she is" /> Wherever she is</label>
                  </div>
                </div>

                <div className="q">
                  <p className="q-label">5. Outdoor competencies (check all that apply)</p>
                  <div className="choices">
                    {OUTDOORS.map((o) => (
                      <label key={o} className="choice"><input type="checkbox" name="outdoors" value={o} /> {o}</label>
                    ))}
                  </div>
                </div>

                <div className="grid">
                  <label>6. Your signature dish<input name="signature_dish" placeholder="Cereal does not count" maxLength={120} /></label>
                  <label>7. Favorite Ella song<input name="favorite_song" placeholder="Choose wisely" maxLength={120} /></label>
                </div>
              </fieldset>

              <fieldset>
                <legend><span>III.</span> Character Reference</legend>
                <label>A sentence from your mama about why you&rsquo;re a catch
                  <textarea name="mama_quote" rows={2} maxLength={300} placeholder={`"He calls me every Sunday." — Mama`} />
                </label>
              </fieldset>

              <fieldset>
                <legend><span>IV.</span> Essay</legend>
                <label>In 250 words or fewer: why you? <b>*</b>
                  <textarea name="why_you" rows={6} required maxLength={1500} />
                </label>
              </fieldset>

              <fieldset className="fine">
                <legend><span>V.</span> The Fine Print</legend>
                <label className="choice consent">
                  <input type="checkbox" name="consent" required />
                  <span>
                    I understand this is a <b>fan-made parody</b>, not affiliated with or endorsed by Ella Langley,
                    her label, or her team. My application goes to the people who run this site, who may pass it
                    along to her team. Nobody is promising anyone a date. I am 21 or older.
                  </span>
                </label>
              </fieldset>

              {error && <p className="error" role="alert">{error}</p>}

              <button className="submit" disabled={status === "sending"}>
                {status === "sending" ? "Filing…" : "Submit Application"}
              </button>
              <p className="sig">Applicant signature not required. We trust you. Mostly.</p>
            </form>
          </>
        )}
      </main>

      <footer className="foot">
        <img className="foot-title" src="/images/dandelion-title.png" width={830} height={250} alt="Dandelion" />
        <p>
          A fan-made joke inspired by a joke. Not affiliated with, sponsored by, or endorsed by Ella Langley or
          anyone who works with her. Submissions are stored privately by the site owner and never sold.
        </p>
      </footer>
    </>
  );
}
