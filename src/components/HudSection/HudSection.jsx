//Filename: HudSection.jsx
//Author: Kyle McColgan
//Date: 2 August 2026
//Description: This file contains the HUD section component for the OBS HUD project.

import "./HudSection.css";

export default function HudSection({ label, children, ariaLabel })
{
  const headingId = `section-${label.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <section className="hud-item" aria-labelledby={headingId} aria-label={ariaLabel}>
      <h2 id={headingId} className="hud-section-label">{label}</h2>
        {children}
    </section>
  );
}
