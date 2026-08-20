//Filename: HudSection.jsx
//Author: Kyle McColgan
//Date: 19 August 2026
//Description: This file contains the HUD section component for the OBS HUD project.

import { useId } from "react";
import "./HudSection.css";

export default function HudSection({ label, children })
{
  const headingId = useId();

  return (
    <section className="hud-item" aria-labelledby={headingId}>
      <h2 id={headingId} className="hud-section-label">{label}</h2>
      {children}
    </section>
  );
}
