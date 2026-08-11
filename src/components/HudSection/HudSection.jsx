//Filename: HudSection.jsx
//Author: Kyle McColgan
//Date: 10 August 2026
//Description: This file contains the HUD section component for the OBS HUD project.

import "./HudSection.css";

export default function HudSection({ label, children })
{
  const headingId = `section-${label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}`;

  return (
    <section className="hud-item" aria-labelledby={headingId}>
      <h2 id={headingId} className="hud-section-label">{label}</h2>
      <div className="hud-section-content">
        {children}
      </div>
    </section>
  );
}
