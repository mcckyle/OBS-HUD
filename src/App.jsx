//Filename: App.jsx
//Author: Kyle McColgan
//Date: 13 July 2026
//Description: This file contains the App component for the OBS HUD project.

import React, { useState, useEffect } from 'react';
import HudHeader from "./components/HudHeader/HudHeader.jsx";
import HudSection from "./components/HudSection/HudSection.jsx";
import CrewPanel from "./components/CrewPanel/CrewPanel.jsx";
import TransmissionPanel from "./components/TransmissionPanel/TransmissionPanel.jsx";
import { formatTime, formatMissionTime } from "./utils/time.js";
import { useYouTubeData } from "./hooks/useYouTubeData";
import { motion, AnimatePresence } from 'motion/react';
import './App.css';

export default function App()
{
  const [seconds, setSeconds] = useState(0);
  const { subscriberCount, latestMessage } = useYouTubeData();
  const [missionTime, setMissionTime] = useState(formatMissionTime());

  //1. Live Session Timer.
  useEffect(() => {
    const timer = setInterval(() => setSeconds(time => time + 1), 1000);
    return () => clearInterval(timer);
  }, []);

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
          <strong className="hud-value">{formatTime(seconds)}</strong>
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
