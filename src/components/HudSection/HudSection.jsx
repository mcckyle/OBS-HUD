//Filename: HudSection.jsx
//Author: Kyle McColgan
//Date: 16 July 2026
//Description: This file contains the HUD section component for the OBS HUD project.

import { motion } from 'motion/react';
import "./HudSection.css";

export default function HudSection({
    label,
    children,
    primary = false,
    ariaLabel
}) {
    return (
        <motion.section
          className={`hud-item${primary ? " hud-item-primary" : ""}`}
          aria-label={ariaLabel}
          variants={{
            hidden: { opacity: 0, y: 8, scale: 0.985 },
            show: { opacity: 1, y: 0, scale: 1 }
          }}
        >
          <span className="hud-label">{label}</span>
            {children}
        </motion.section>
    );
}
