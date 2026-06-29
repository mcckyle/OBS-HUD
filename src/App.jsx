//Filename: App.jsx
//Author: Kyle McColgan
//Date: 28 June 2026
//Description: This file contains the App component for the OBS HUD project.

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react';
import { Compass, Clock } from 'lucide-react';
import './App.css'

export default function App() {
  const [seconds, setSeconds] = useState(0);

  //Change text below per quest...
  const [currentMission, setCurrentMission] = useState("Initializing Navigation...");

  //1. Live Session Timer.
  useEffect(() => {
    const timer = setInterval(() => setSeconds(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  //2. JSON Polling Loop (Checks public/mission.json every 3000ms).
  useEffect(() => {
    const fetchMission = async () => {
      try
      {
        //Cache-busting URL parameter ensures Linux browser parses fresh data...
        const response = await fetch(`/mission.json?t=${Date.now()}`);
        if (!response.ok)
        {
          throw new Error("Mission profile unavailable!");
        }

        const data = await response.json();
        if ((data.objective) && (data.objective !== currentMission))
        {
          setCurrentMission(data.objective);
        }
      }
      catch (error)
      {
        console.error("Mission Sync Error:", error);
      }
    };

    //Execute immediately on mount, then track every three seconds...
    fetchMission();
    const pollInterval = setInterval(fetchMission, 3000);

    return () => clearInterval(pollInterval);
  }, [currentMission]);

  //Formatter function to cleanly display clock digits.
  const formatTime = (totalSeconds) => {
    const hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const secs = String(totalSeconds % 60).padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  //Transparent wrapper that spans the OBS canvas...
  return (
    <div className="canvas-wrapper">

      {/* Container with a slide-in-from-right animation. */}
      <motion.section
        className="hud-box"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Header / System Status. */}
        <header className="hud-header">
          <span>NAV_SYSTEM_v1.61</span>
          <div className="status-flex">{/* ● ONLINE </span>*/}
            <span className="status-indicator" />
            ONLINE
          </div>
        </header>

        {/* Section 1: Elapsed Timer Module. */}
        <div className="hud-row">
          <Clock className="hud-icon" />
          <div>
            <div className="label">Mission Time</div>
            <div className="value">{formatTime(seconds)}</div>
          </div>
        </div>

        {/* Section 2: Dynamic Objective Module. */}
        <div className="hud-row">
          <Compass className="hud-icon spin" />
          <div className="text-container">
            <div className="label">Current Objective</div>

            {/* AnimatePresence handles smooth transition when text changes. */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentMission}
                className="mission-text"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
              >
                {currentMission}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.section>
    </div>
  );
};
