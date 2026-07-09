//Filename: App.jsx
//Author: Kyle McColgan
//Date: 8 July 2026
//Description: This file contains the App component for the OBS HUD project.

import React, { useState, useEffect } from 'react';
import { useYouTubeData } from "./hooks/useYouTubeData";
import { motion, AnimatePresence } from 'motion/react';
import './App.css';

const formatTime = (totalSeconds) => {
  const hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const secs = String(totalSeconds % 60).padStart(2, '0');
  return `${hrs}:${mins}:${secs}`;
};

export default function App() {
  const [seconds, setSeconds] = useState(0);
  const { subscriberCount, latestMessage } = useYouTubeData();

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
        <header className="hud-header">
          <span className="hud-title">STARFIELD LIVE</span>
          <div className="hud-status">
            <span className="hud-status-dot" />
            ACTIVE
          </div>
        </header>

        {/* Section 1: Elapsed Timer Module. */}
        <section className="hud-item hud-item-primary" aria-label="Session timer">
          <span className="hud-label">ELAPSED TIME</span>
          <strong className="hud-value">{formatTime(seconds)}</strong>
        </section>

        {/* Section 2: Live Subscriber Milestones. */}
        <section className="hud-item" aria-label="Subscriber goal milestone">
          <span className="hud-label">SUBSCRIBERS</span>
          <motion.strong
            key={subscriberCount}
            initial={{ opacity: 0.5, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {subscriberCount}
          </motion.strong>
        </section>

        {/* Section 3: Comms. */}
        <section className="hud-item" aria-label="Latest transmission signal">
          <span className="hud-label">LATEST TRANSMISSION</span>
          <AnimatePresence mode="wait">
            <motion.div
              key={latestMessage.id}
              className="hud-comms"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
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
        </section>
      </motion.section>
    </main>
  );
};

//2. JSON Polling Loop (Checks public/mission.json every 3000ms).
//   useEffect(() => {
//     const syncMission = async () => {
//       try
//       {
//         const response = await fetch(`./mission.json?t=${Date.now()}`);
//         if (!response.ok)
//         {
//           return;
//         }
//
//         const data = await response.json();
//         if (data.objective)
//         {
//           setCurrentMission(data.objective);
//         }
//       }
//       catch (error)
//       {
//         console.warn("Navigation feed unavailable!");
//       }
//     };
//
//     syncMission();
//     const pollInterval = setInterval(syncMission, MISSION_REFRESH_MS);
//
//     return () => clearInterval(pollInterval);
//   }, []);
