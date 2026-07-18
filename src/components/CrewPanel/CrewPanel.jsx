//Filename: CrewPanel.jsx
//Author: Kyle McColgan
//Date: 17 July 2026
//Description: This file contains the HUD Transmission Panel component for the OBS HUD project.

import React from 'react';
import { motion } from 'motion/react';
import { useYouTubeData } from "../../hooks/useYouTubeData";
import "./CrewPanel.css";

export default function CrewPanel()
{
    const { subscriberCount } = useYouTubeData();

    return (
        <output className="hud-crew-count" aria-live="polite">
            <motion.span
                key={subscriberCount}
                initial={{ opacity: 0.85, y: -1 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.16, ease: "easeOut" }}
            >
              {subscriberCount}
            </motion.span>
        </output>
    );
}
