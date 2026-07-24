//Filename: CrewPanel.jsx
//Author: Kyle McColgan
//Date: 23 July 2026
//Description: This file contains the HUD crew panel component for the OBS HUD project.

import React from 'react';
import { motion } from 'motion/react';
import { useYouTubeData } from "../../hooks/useYouTubeData";
import "./CrewPanel.css";

const crewCountVariants = {
    initial: { opacity: 0.9, y: -2 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1], },
};

export default function CrewPanel()
{
    const { subscriberCount } = useYouTubeData();

    return (
        <output className="hud-crew-count" aria-live="polite" aria-atomic="true">
            <motion.span
              variants={crewCountVariants}
              initial="initial"
              animate="animate"
            >
                {subscriberCount}
            </motion.span>
        </output>
    );
}
