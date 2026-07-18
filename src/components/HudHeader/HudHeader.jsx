//Filename: HudHeader.jsx
//Author: Kyle McColgan
//Date: 16 July 2026
//Description: This file contains the HUD header component for the OBS HUD project.

import { motion } from 'motion/react';
import { useMissionClock } from "../../hooks/useMissionClock";
import "./HudHeader.css";

export default function HudHeader()
{
    const missionTime = useMissionClock();

    return (
        <header className="hud-header">
          <div className="hud-system">
            <span className="hud-title">STARFIELD LIVE</span>
            <span className="hud-system-id">CONSTELLATION NETWORK</span>
          </div>
          <div className="hud-clock">
            <span className="hud-clock-sol">SOL {missionTime.sol}</span>
            <motion.time
              className="hud-clock-time"
              dateTime={missionTime.time}
              initial={{ opacity: 0.8, y: -1 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.14, ease: "easeOut" }}
            >
              {missionTime.time} UTC
            </motion.time>
          </div>
        </header>
    );
}
