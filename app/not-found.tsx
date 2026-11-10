import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";

export const metadata: Metadata = {
  title: "Form EL-404 — Notice of Missing Page",
  description: "The page you requested does not exist. It may have blown away. These things happen in dandelion season.",
};

const REASONS: [string, boolean][] = [
  ["Page not found", true],
  ["Page found, but it was a little boy", false],
  ["Page went out for cigarettes and never came back", false],
  ["Applicant typed the URL with his thumbs while driving the truck", false],
];

// Each seed leaves the bare head and drifts up and off the page: --dx/--dy is where it ends up.
const SEEDS = [
  { dx: "160px", dy: "-340px", r: "40deg", t: "9s", d: "0s", s: 1 },
  { dx: "260px", dy: "-220px", r: "-30deg", t: "11s", d: "1.8s", s: 0.8 },
  { dx: "90px", dy: "-420px", r: "60deg", t: "12s", d: "3.6s", s: 0.9 },
  { dx: "340px", dy: "-300px", r: "-50deg", t: "10s", d: "5.2s", s: 0.7 },
  { dx: "200px", dy: "-480px", r: "25deg", t: "13s", d: "6.8s", s: 1.1 },
  { dx: "-60px", dy: "-380px", r: "-40deg", t: "12s", d: "8.4s", s: 0.75 },
];

function Seed() {
  return (
    <svg viewBox="0 0 40 60" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="0.8" fill="none" strokeLinecap="round">
        {[-80, -60, -40, -20, 0, 20, 40, 60, 80].map((a) => (
          <line key={a} x1="20" y1="16" x2="20" y2="3" transform={`rotate(${a} 20 16)`} />
        ))}
        <line x1="20" y1="16" x2="20" y2="46" />
      </g>
      <ellipse cx="20" cy="51" rx="1.8" ry="5" fill="currentColor" />
    </svg>
  );
}

export default function NotFound() {
  return (
    <div className="lost-wrap">
      <div className="ticker">
        <span>Fan-made parody · Not affiliated with Ella Langley or her team · Little boys need not apply · </span>
        <span aria-hidden="true">Fan-made parody · Not affiliated with Ella Langley or her team · Little boys need not apply · </span>
      </div>

      {/* Roughens the rubber stamp so it reads as ink, not type */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <filter id="stamp-ink">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed="4" result="noise" />
          <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -2.4 0 0 0 2.1" result="speckle" />
          <feComposite in="SourceGraphic" in2="speckle" operator="in" result="speckled" />
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="9" result="warp" />
          <feDisplacementMap in="speckled" in2="warp" scale="3" />
        </filter>
      </svg>

      <main className="paper lost">
        <header className="hero">
          <div className="hero-copy">
            <h1>
              <small>Form EL-404</small> Missing Page
            </h1>
            <br />
            <p className="form-no">Office of Not Little Boys · Hope Hull, Alabama</p>
          </div>
          <div className="bare-dandelion" aria-hidden="true">
            <svg className="stem" viewBox="0 0 120 300">
              <path d="M58 300 C 52 230, 50 160, 66 64" stroke="#6f7440" strokeWidth="4.5" fill="none" strokeLinecap="round" />
              <path d="M58 60 q 8 -10 16 0 q -8 8 -16 0 z" fill="#8a7a4a" />
              <g fill="#8a7a4a">
                <circle cx="61" cy="56" r="1" /><circle cx="66" cy="54" r="1" /><circle cx="71" cy="56" r="1" />
              </g>
            </svg>
            {SEEDS.map((s, i) => (
              <span
                key={i}
                className="seed"
                style={{ "--dx": s.dx, "--dy": s.dy, "--r": s.r, "--t": s.t, "--d": s.d, "--s": s.s } as CSSProperties}
              >
                <span className="seed-sway"><Seed /></span>
              </span>
            ))}
          </div>
        </header>

        <section className="letter">
          <p className="margin-note">Bless your heart.</p>
          <p>Dear Applicant,</p>
          <p>
            We&rsquo;ve searched every filing cabinet in the Hope Hull field office, and the page you requested
            does not exist. It may have blown away. These things happen in dandelion season.
          </p>

          <div className="reasons">
            <p className="q-label"><b>Reason for return</b> (check one):</p>
            <ul>
              {REASONS.map(([text, checked]) => (
                <li key={text}>
                  <span className={checked ? "box checked" : "box"} aria-hidden="true" />
                  <span>
                    {checked && <span className="sr-only">Checked: </span>}
                    {text}
                  </span>
                </li>
              ))}
            </ul>
            <div className="stamp return" aria-label="Stamped: Return to sender">Return to Sender</div>
          </div>

          <p>Please do not resubmit this request. Mama has been notified.</p>
        </section>

        <Link href="/" className="submit">Return to the Application &rarr;</Link>
      </main>

      <footer className="foot">
        <p>
          A fan-made joke inspired by a joke. Not affiliated with, sponsored by, or endorsed by Ella Langley or
          anyone who works with her.
        </p>
      </footer>
    </div>
  );
}
