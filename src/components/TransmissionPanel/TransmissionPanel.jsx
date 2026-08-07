//Filename: TransmissionPanel.jsx
//Author: Kyle McColgan
//Date: 6 August 2026
//Description: This file contains the HUD Transmission Panel component for the OBS HUD project.

import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { STANDARD_TRANSITION } from "../../utils/motion";
import { useYouTubeData } from "../../hooks/useYouTubeData";
import { formatTime, formatMissionTime } from "../../utils/time.js";

const transmissionTransition = {
  ...STANDARD_TRANSITION,
};
const transmissionVariants = {
    initial: { opacity: 0, y: 3, },
    enter: { opacity: 1, y: 0, transition: { ...transmissionTransition, duration: 0.28, }, },
    exit: { opacity: 0, y: -1, transition: { ...transmissionTransition, duration: 0.16, }, },
};

export default function TransmissionPanel()
{
    const reduceMotion = useReducedMotion();
    const { latestMessage } = useYouTubeData();
    const { id, author, message } = latestMessage;

    return (
        <AnimatePresence initial={false}>
            <motion.article
                key={id}
                layout
                className="hud-comms"
                aria-label="Latest transmission"
                aria-live="polite"
                aria-atomic="true"
                variants={reduceMotion ? undefined : transmissionVariants}
                initial={reduceMotion ? false : "initial"}
                animate="enter"
                exit={reduceMotion ? false : "exit"}
            >
              <p className="hud-author">{author}</p>
              <p className="hud-message">{message}</p>
            </motion.article>
        </AnimatePresence>
    );
}
