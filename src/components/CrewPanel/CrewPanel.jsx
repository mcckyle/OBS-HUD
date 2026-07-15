//Filename: CrewPanel.jsx
//Author: Kyle McColgan
//Date: 14 July 2026
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
            key={subscriberCount}
            initial={{ opacity: 0.4, y: -2 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
        >
          {subscriberCount}
        </motion.strong>
    );
}
