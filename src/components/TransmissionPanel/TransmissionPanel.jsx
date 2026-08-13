//Filename: TransmissionPanel.jsx
//Author: Kyle McColgan
//Date: 12 August 2026
//Description: This file contains the HUD Transmission Panel component for the OBS HUD project.

import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { STANDARD_TRANSITION } from "../../utils/motion";
import { useYouTubeData } from "../../hooks/useYouTubeData";
import { formatTime, formatMissionTime } from "../../utils/time.js";

const transmissionVariants = {
    initial: { opacity: 0, y: 3, },
    enter: { opacity: 1, y: 0, transition: { ...STANDARD_TRANSITION, duration: 0.28, }, },
    exit: { opacity: 0, y: -2, transition: { ...STANDARD_TRANSITION, duration: 0.16, }, },
};

export default function TransmissionPanel()
{
    const reduceMotion = useReducedMotion();
    const { latestMessage } = useYouTubeData();
    const { id, author, message } = latestMessage;

    return (
        <AnimatePresence initial={false} mode="wait">
            <motion.article
                key={id}
                className="hud-comms"
                aria-label="Latest transmission"
                aria-live="polite"
                aria-atomic="true"
                initial={reduceMotion ? false : "initial"}
                animate={reduceMotion ? false : "enter"}
                exit={reduceMotion ? false : "exit"}
                variants={reduceMotion ? undefined : transmissionVariants}
            >
              <p className="hud-author">{author}</p>
              <p className="hud-message">{message}</p>
            </motion.article>
        </AnimatePresence>
    );
}
