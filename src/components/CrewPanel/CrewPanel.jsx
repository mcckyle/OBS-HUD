//Filename: CrewPanel.jsx
//Author: Kyle McColgan
//Date: 19 August 2026
//Description: This file contains the HUD crew panel component for the OBS HUD project.

import { motion, useReducedMotion } from 'motion/react';
import { STANDARD_TRANSITION } from "../../utils/motion";
import { useYouTubeData } from "../../hooks/useYouTubeData";

import "./CrewPanel.css";

const CREW_COUNT_VARIANTS = {
    initial: { opacity: 0.60, y: -1, },
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
              variants={reduceMotion ? undefined : CREW_COUNT_VARIANTS}
            >
                {subscriberCount}
            </motion.span>
        </output>
    );
}
