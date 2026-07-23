//Filename: CrewPanel.jsx
//Author: Kyle McColgan
//Date: 22 July 2026
//Description: This file contains the HUD crew panel component for the OBS HUD project.

import React from 'react';
import { motion } from 'motion/react';
import { useYouTubeData } from "../../hooks/useYouTubeData";
import "./CrewPanel.css";

const crewCountVariants = {
    initial: { opacity: 0.9, y: -2 },
    animate: { opacity: 1, y: 0 },
};
const crewCountTransition = { duration: 0.18, ease: "easeOut" };

export default function CrewPanel()
{
    const { subscriberCount } = useYouTubeData();

    return (
        <output className="hud-crew-count" aria-live="polite" aria-atomic="true">
            <motion.span
              variants={crewCountVariants}
              initial="initial"
              animate="animate"
              transition={crewCountTransition}
            >
                {subscriberCount}
            </motion.span>
        </output>
    );
}
