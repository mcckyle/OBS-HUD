//Filename: CrewPanel.jsx
//Author: Kyle McColgan
//Date: 28 July 2026
//Description: This file contains the HUD crew panel component for the OBS HUD project.

import { motion } from 'motion/react';
import { useYouTubeData } from "../../hooks/useYouTubeData";
import "./CrewPanel.css";

const crewCountVariants = {
    initial: { opacity: 0.78, y: -1 },
    enter: { opacity: 1, y: 0, transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1], }, },
};

export default function CrewPanel()
{
    const { subscriberCount } = useYouTubeData();

    return (
        <output
          className="hud-crew-count"
          aria-label="Current crew size"
          aria-live="polite"
          aria-atomic="true"
        >
            <motion.span
              key={subscriberCount}
              variants={crewCountVariants}
              initial="initial"
              animate="enter"
            >
                {subscriberCount}
            </motion.span>
        </output>
    );
}
