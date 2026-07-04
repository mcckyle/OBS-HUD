//Filename: App.jsx
//Author: Kyle McColgan
//Date: 3 July 2026
//Description: This file contains the App component for the OBS HUD project.

import React, { useState, useEffect } from 'react';
import { useYouTubeData } from "./hooks/useYouTubeData";
import { motion, AnimatePresence } from 'motion/react';
import { Clock, Shield, Radio } from 'lucide-react';
import './App.css';

const MISSION_REFRESH_MS = 3000;

//Formatter function to cleanly display clock digits.
const formatTime = (totalSeconds) => {
  const hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const secs = String(totalSeconds % 60).padStart(2, '0');
  return `${hrs}:${mins}:${secs}`;
};

export default function App() {
  const [seconds, setSeconds] = useState(0);

  //Pull live statistics directly via the new hook.
  const { subscriberCount, latestSubscriber } = useYouTubeData();
  const goalString = `${subscriberCount} / 1`;

  //1. Live Session Timer.
  useEffect(() => {
    const timer = setInterval(() => setSeconds(time => time + 1), 1000);
    return () => clearInterval(timer);
  }, []);

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

  //Transparent wrapper that spans the OBS canvas...
  return (
    <main className="hud-stage">

    <motion.section
        className="hud-panel"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header / System Status. */}
        <header className="hud-header">
          <span className="hud-title">CONSTELLATION BROADCAST</span>
          <div className="hud-status">
            <span className="hud-status-dot" />
            LIVE
          </div>
        </header>

        {/* Section 1: Elapsed Timer Module. */}
        <section className="hud-item" aria-label="Session timer">
          <Clock className="hud-icon" />
          <div>
            <span className="hud-label">ELAPSED TIME</span>
            <strong>{formatTime(seconds)}</strong>
          </div>
        </section>

        {/* Section 2: Live Subscriber Milestones. */}
        <section className="hud-item" aria-label="Subscriber goal milestone">
          <Shield className="hud-icon" />
          <div>
            <span className="hud-label">CREW CAPACITY</span>
            <strong>{goalString}</strong>
          </div>
        </section>

        {/* Section 3: Live Signal Metric Status. */}
        <section className="hud-item" aria-label="Latest transmission signal">
          <Radio className="hud-compass" />
          <div>
            <span className="hud-label">DATA FEED</span>
            <AnimatePresence mode="wait">
              <motion.p
                key={latestSubscriber?.id || 'empty'}
                initial={{ opacity: 0, x: -6, skewX: -5 }}
                animate={{ opacity: 1, x: 0, skewX: 0 }}
                exit={{ opacity: 0, x: 6, skewX: 5 }}
                transition={{ duration: 0.25 }}
                className="hud-ticker-text"
              >
                {latestSubscriber?.text || 'ESTABLISHING LINK...'}
              </motion.p>
            </AnimatePresence>
          </div>
        </section>
      </motion.section>
    </main>
  );
};
