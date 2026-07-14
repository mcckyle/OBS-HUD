//Filename: HudHeader.jsx
//Author: Kyle McColgan
//Date: 13 July 2026
//Description: This file contains the HUD header component for the OBS HUD project.

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { formatTime, formatMissionTime } from "../../utils/time.js";
import "./HudHeader.css";

export default function HudHeader()
{
    const [missionTime, setMissionTime] = useState(formatMissionTime());

    //Mission timer.
    useEffect(() => {
        const interval = setInterval(() => {
            setMissionTime(formatMissionTime());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
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
    );
}
