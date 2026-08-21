//Filename: App.jsx
//Author: Kyle McColgan
//Date: 20 August 2026
//Description: This file contains the App component for the OBS HUD project.

import { motion, useReducedMotion } from 'motion/react';
import HudHeader from "./components/HudHeader/HudHeader.jsx";
import HudSection from "./components/HudSection/HudSection.jsx";
import CrewPanel from "./components/CrewPanel/CrewPanel.jsx";
import TransmissionPanel from "./components/TransmissionPanel/TransmissionPanel.jsx";
import SessionTimer from "./components/SessionTimer/SessionTimer.jsx";

import './App.css';

const PANEL_VARIANTS = {
  hidden: { opacity: 0, y: 8, },
  visible: { opacity: 1, y: 0, transition: { duration: 0.50, ease: [0.22, 1, 0.36, 1], }, },
};

export default function App()
{
  const reduceMotion = useReducedMotion();

  //Transparent wrapper that spans the OBS canvas...
  return (
    <main className="hud-stage">
      <motion.section
          className="hud-panel"
          initial={reduceMotion ? false : "hidden"}
          animate="visible"
          variants={reduceMotion ? undefined : PANEL_VARIANTS}
          aria-label="Starfield livestream HUD"
        >
        {/* System Header. */}
        <HudHeader />

        <div className="hud-sections">
          {/* Session. */}
          <HudSection label="ELAPSED TIME">
            <SessionTimer />
          </HudSection>

          {/* Section 2: Live Subscriber Count. */}
          <HudSection label="CREW SIZE">
            <CrewPanel />
          </HudSection>

          {/* Section 3: Comms. */}
          <HudSection label="TRANSMISSION">
            <TransmissionPanel />
          </HudSection>
        </div>
      </motion.section>
    </main>
  );
};
