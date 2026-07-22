//Filename: HudSection.jsx
//Author: Kyle McColgan
//Date: 21 July 2026
//Description: This file contains the HUD section component for the OBS HUD project.

import { motion } from 'motion/react';
import "./HudSection.css";

const sectionVariants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 }
};

export default function HudSection({
  label,
  children,
  primary = false,
  ariaLabel
}) {
  return (
    <motion.section
      className={primary ? "hud-item hud-item-primary" : "hud-item"}
      aria-label={ariaLabel}
      variants={sectionVariants}
    >
      <h2 className="hud-section-label">{label}</h2>
        {children}
    </motion.section>
  );
}
