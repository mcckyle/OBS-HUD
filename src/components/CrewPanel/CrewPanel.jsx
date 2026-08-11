//Filename: CrewPanel.jsx
//Author: Kyle McColgan
//Date: 10 August 2026
//Description: This file contains the HUD crew panel component for the OBS HUD project.

import { motion, useReducedMotion } from 'motion/react';
import { useYouTubeData } from "../../hooks/useYouTubeData";
import { STANDARD_TRANSITION } from "../../utils/motion";
import "./CrewPanel.css";

const crewCountVariants = {
    initial: { opacity: 0.72, y: -2, },
    enter: { opacity: 1, y: 0, transition: { ...STANDARD_TRANSITION, duration: 0.20, }, },
};

export default function CrewPanel()
{
    const reduceMotion = useReducedMotion();
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
              initial={reduceMotion ? false : "initial"}
              animate={reduceMotion ? undefined : "enter"}
              variants={reduceMotion ? undefined : crewCountVariants}
            >
                {subscriberCount}
            </motion.span>
        </output>
    );
}
