//Filename: App.jsx
//Author: Kyle McColgan
//Date: 14 July 2026
//Description: This file contains the App component for the OBS HUD project.

import HudHeader from "./components/HudHeader/HudHeader.jsx";
import HudSection from "./components/HudSection/HudSection.jsx";
import CrewPanel from "./components/CrewPanel/CrewPanel.jsx";
import TransmissionPanel from "./components/TransmissionPanel/TransmissionPanel.jsx";
import SessionTimer from "./components/SessionTimer/SessionTimer.jsx";
import { useYouTubeData } from "./hooks/useYouTubeData";
import { motion } from 'motion/react';

import './App.css';

export default function App()
{
  //Transparent wrapper that spans the OBS canvas...
  return (
    <main className="hud-stage">
      <motion.section
          className="hud-panel"
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.08
              }
            }
          }}
        >
        {/* Header / System Status. */}
        <HudHeader />

        {/* Section 1: Elapsed Timer Module. */}
        <HudSection
          primary
          label="ELAPSED TIME"
          ariaLabel="Session timer"
        >
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
      </motion.section>
    </main>
  );
};
