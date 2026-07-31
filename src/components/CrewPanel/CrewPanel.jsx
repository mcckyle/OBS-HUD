//Filename: CrewPanel.jsx
//Author: Kyle McColgan
//Date: 30 July 2026
//Description: This file contains the HUD crew panel component for the OBS HUD project.

import { motion } from 'motion/react';
import { useYouTubeData } from "../../hooks/useYouTubeData";
import "./CrewPanel.css";

const crewCountTransition = {
    duration: 0.20, ease: [0.22, 1, 0.36, 1],
};
const crewCountVariants = {
    initial: { opacity: 0.78, y: -1 },
    enter: { opacity: 1, y: 0, transition: crewCountTransition, },
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
              className="hud-crew-value"
              variants={crewCountVariants}
              initial="initial"
              animate="enter"
            >
                {subscriberCount}
            </motion.span>
        </output>
    );
}
