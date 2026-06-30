//Filename: App.jsx
//Author: Kyle McColgan
//Date: 29 June 2026
//Description: This file contains the App component for the OBS HUD project.

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, Clock } from 'lucide-react';
import './App.css';

export default function App() {
  const [seconds, setSeconds] = useState(0);

  //Change text below per quest...
  const [currentMission, setCurrentMission] = useState("Initializing Navigation...");

  //1. Live Session Timer.
  useEffect(() => {
    const timer = setInterval(() => setSeconds(time => time + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  //2. JSON Polling Loop (Checks public/mission.json every 3000ms).
  useEffect(() => {
    const syncMission = async () => {
      try
      {
        //Cache-busting URL parameter ensures Linux browser parses fresh data...
        const response = await fetch(`/mission.json?t=${Date.now()}`);
        if (!response.ok)
        {
          return;
        }

        const data = await response.json();
        if (data.objective)
        {
          setCurrentMission(data.objective);
        }
      }
      catch (error)
      {
        console.warn("Mission feed unavailable:");
      }
    };

    //Execute immediately on mount, then track every three seconds...
    syncMission();
    const pollInterval = setInterval(syncMission, 3000);

    return () => clearInterval(pollInterval);
  }, []);

  //Formatter function to cleanly display clock digits.
  const formatTime = (totalSeconds) => {
    const hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const secs = String(totalSeconds % 60).padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  //Transparent wrapper that spans the OBS canvas...
  return (
    <main className="hud-stage">

    <motion.section
        className="hud-panel"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        {/* Header / System Status. */}
        <header className="hud-top">
          <span>NAV_COMPUTER</span>
          <div className="online">
            <span />
            ONLINE
          </div>
        </header>

        {/* Section 1: Elapsed Timer Module. */}
        <section className="hud-module">
          <Clock />
          <div>
            <small>SESSION TIME</small>
            <strong>{formatTime(seconds)}</strong>
          </div>
        </section>

        {/* Section 2: Dynamic Objective Module. */}
        <section className="hud-module">
          <Compass className="rotating" />
          <div>
            <small>OBJECTIVE</small>
            <AnimatePresence mode="wait">
              <motion.p
                key={currentMission}
                className="mission-text"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {currentMission}
              </motion.p>
            </AnimatePresence>
          </div>
        </section>
      </motion.section>
    </main>
  );
};
