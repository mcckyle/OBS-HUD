//Filename: App.jsx
//Author: Kyle McColgan
//Date: 12 July 2026
//Description: This file contains the App component for the OBS HUD project.

import React, { useState, useEffect } from 'react';
import HudSection from "./components/HudSection/HudSection.jsx";
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

  //Mission timer.
  useEffect(() => {
    const interval = setInterval(() => {
      setMissionTime(formatMissionTime());
    }, 1000);

    return () => clearInterval(interval);
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
        <header className="hud-header">
          <div className="hud-system">
            <span className="hud-title">STARFIELD LIVE</span>
            <span className="hud-system-id">CONSTELLATION NETWORK</span>
          </div>
          <div className="hud-clock">
            <span className="hud-clock-sol">SOL {missionTime.sol}</span>
            <motion.span
              key={missionTime.time}
              className="hud-clock-time"
              initial={{ opacity: 0.55 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25 }}
            >
              {missionTime.time} UTC
            </motion.span>
          </div>
        </header>

        {/* Section 1: Elapsed Timer Module. */}
        <HudSection
          primary
          label="ELAPSED TIME"
          ariaLabel="Session timer"
        >
          <strong className="hud-value">{formatTime(seconds)}</strong>
        </HudSection>

        {/* Section 2: Live Subscriber Milestones. */}
        <HudSection
          label="CREW SIZE"
          ariaLabel="Subscriber count"
        >
          <motion.strong
            key={subscriberCount}
            initial={{ opacity: 0.5, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {subscriberCount}
          </motion.strong>
        </HudSection>

        {/* Section 3: Comms. */}
        <HudSection
          label="TRANSMISSION"
          ariaLabel="Latest transmission"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={latestMessage.id}
              className="hud-comms"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              variants={{
                hidden: { opacity: 0, y: 6 },
                show: {
                  opacity: 1,
                  y: 0
                }
              }}
            >
              <span className="hud-author">
                {latestMessage.author}
              </span>
              <p className="hud-message">
                {latestMessage.message}
              </p>
            </motion.div>
          </AnimatePresence>
        </HudSection>
      </motion.section>
    </main>
  );
};
