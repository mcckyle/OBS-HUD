//Filename: HudSection.jsx
//Author: Kyle McColgan
//Date: 28 July 2026
//Description: This file contains the HUD section component for the OBS HUD project.

import "./HudSection.css";

export default function HudSection({ label, children, ariaLabel })
{
  return (
    <section className="hud-item" aria-label={ariaLabel}>
      <h2 className="hud-section-label">{label}</h2>
        {children}
    </section>
  );
}
