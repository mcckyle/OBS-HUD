//Filename: App.jsx
//Author: Kyle McColgan
//Date: 1 July 2026
//Description: This file contains the App component for the OBS HUD project.

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, Clock } from 'lucide-react';
import './App.css';

export default function App() {
  const [seconds, setSeconds] = useState(0);
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
        const response = await fetch(`./mission.json?t=${Date.now()}`);
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
        console.warn("Navigation feed unavailable!");
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
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header / System Status. */}
        <header className="hud-header">
          <div>
            <span>NAVIGATION SYSTEM</span>
          </div>
          <div className="hud-status">
            <span />
            ONLINE
          </div>
        </header>

        {/* Section 1: Elapsed Timer Module. */}
        <section className="hud-item">
          <Clock />
          <div>
            <span className="hud-label">SESSION</span>
            <strong>{formatTime(seconds)}</strong>
          </div>
        </section>

        {/* Section 2: Dynamic Objective Module. */}
        <section className="hud-item">
          <Compass className="hud-compass" />
          <div>
            <span className="hud-label">OBJECTIVE</span>
            <AnimatePresence mode="wait">
              <motion.p
                key={currentMission}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
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
