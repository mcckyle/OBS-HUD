//Filename: HudSection.jsx
//Author: Kyle McColgan
//Date: 12 July 2026
//Description: This file contains the HUD section component for the OBS HUD project.

export default function HudSection({
    label,
    children,
    primary = false,
    ariaLabel
}) {
    return (
        <section
          className={`hud-item${primary ? " hud-item-primary" : ""}`}
          aria-label={ariaLabel}
        >
          <span className="hud-label">{label}</span>
          {children}
        </section>
    );
}
