//Filename: CrewPanel.jsx
//Author: Kyle McColgan
//Date: 16 July 2026
//Description: This file contains the HUD Transmission Panel component for the OBS HUD project.

import React from 'react';
import { motion } from 'motion/react';
import { useYouTubeData } from "../../hooks/useYouTubeData";
import "./CrewPanel.css";

export default function CrewPanel()
{
    const { subscriberCount } = useYouTubeData();

    return (
        <motion.strong
            className="hud-crew-count"
            aria-live="polite"
            animate={{ opacity: [0.8, 1], y: [-1, 0] }}
            transition={{ duration: 0.18 }}
        >
          {subscriberCount}
        </motion.strong>
    );
}
