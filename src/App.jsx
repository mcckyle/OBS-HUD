//Filename: App.jsx
//Author: Kyle McColgan
//Date: 24 July 2026
//Description: This file contains the App component for the OBS HUD project.

import { motion } from 'motion/react';
import HudHeader from "./components/HudHeader/HudHeader.jsx";
import HudSection from "./components/HudSection/HudSection.jsx";
import CrewPanel from "./components/CrewPanel/CrewPanel.jsx";
import TransmissionPanel from "./components/TransmissionPanel/TransmissionPanel.jsx";
import SessionTimer from "./components/SessionTimer/SessionTimer.jsx";

import './App.css';

const panelVariants = {
  initial: { opacity: 0, y: 14, scale: 0.985, },
  enter: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], }, },
};

export default function App()
{
  //Transparent wrapper that spans the OBS canvas...
  return (
    <main className="hud-stage">
      <motion.aside
          className="hud-panel"
          initial="initial"
          animate="enter"
          variants={panelVariants}
        >
        {/* System Header. */}
        <HudHeader />

        {/* Session. */}
        <HudSection label="ELAPSED TIME" ariaLabel="Session timer">
          <SessionTimer />
        </HudSection>

        {/* Section 2: Live Subscriber Count. */}
        <HudSection label="CREW SIZE" ariaLabel="Subscriber count">
          <CrewPanel />
        </HudSection>

        {/* Section 3: Comms. */}
        <HudSection label="TRANSMISSION" ariaLabel="Latest transmission">
          <TransmissionPanel />
        </HudSection>
      </motion.aside>
    </main>
  );
};
