//Filename: CrewPanel.jsx
//Author: Kyle McColgan
//Date: 2 August 2026
//Description: This file contains the HUD crew panel component for the OBS HUD project.

import { motion } from 'motion/react';
import { useYouTubeData } from "../../hooks/useYouTubeData";
import { STANDARD_TRANSITION } from "../../utils/motion";
import "./CrewPanel.css";

const crewCountTransition = {
    ...STANDARD_TRANSITION, duration: 0.20,
};
const crewCountVariants = {
    initial: { opacity: 0.65, y: -3, scale: 0.985, },
    enter: { opacity: 1, y: 0, scale: 1, transition: crewCountTransition, },
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
