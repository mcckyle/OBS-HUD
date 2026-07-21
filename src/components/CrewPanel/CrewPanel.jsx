//Filename: CrewPanel.jsx
//Author: Kyle McColgan
//Date: 20 July 2026
//Description: This file contains the HUD Transmission Panel component for the OBS HUD project.

import React from 'react';
import { motion } from 'motion/react';
import { useYouTubeData } from "../../hooks/useYouTubeData";
import "./CrewPanel.css";

const subscriberAnimation = {
    initial: { opacity: 0.9, y: -2 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.18, ease: "easeOut" },
};

export default function CrewPanel()
{
    const { subscriberCount } = useYouTubeData();

    return (
        <output className="hud-crew-count" aria-live="polite" aria-atomic="true">
            <motion.span {...subscriberAnimation}>
                {subscriberCount}
            </motion.span>
        </output>
    );
}
