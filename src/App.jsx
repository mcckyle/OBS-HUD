//Filename: App.jsx
//Author: Kyle McColgan
//Date: 22 July 2026
//Description: This file contains the App component for the OBS HUD project.

import { motion } from 'motion/react';
import HudHeader from "./components/HudHeader/HudHeader.jsx";
import HudSection from "./components/HudSection/HudSection.jsx";
import CrewPanel from "./components/CrewPanel/CrewPanel.jsx";
import TransmissionPanel from "./components/TransmissionPanel/TransmissionPanel.jsx";
import SessionTimer from "./components/SessionTimer/SessionTimer.jsx";

import './App.css';

const panelVariants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" }, },
};

export default function App()
{
  //Transparent wrapper that spans the OBS canvas...
  return (
    <main className="hud-stage">
      <motion.aside
          className="hud-panel"
          initial="hidden"
          animate="show"
          variants={panelVariants}
        >
        {/* Header / System Status. */}
        <HudHeader />

        {/* Section 1: Elapsed Timer Module. */}
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
