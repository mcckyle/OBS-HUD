//Filename: TransmissionPanel.jsx
//Author: Kyle McColgan
//Date: 3 August 2026
//Description: This file contains the HUD Transmission Panel component for the OBS HUD project.

import { motion, AnimatePresence } from 'motion/react';
import { STANDARD_TRANSITION } from "../../utils/motion";
import { useYouTubeData } from "../../hooks/useYouTubeData";
import { formatTime, formatMissionTime } from "../../utils/time.js";

const ENTER_DURATION = 0.28;
const EXIT_DURATION = 0.16;
const transmissionTransition = {
    ease: STANDARD_TRANSITION.ease,
};
const transmissionVariants = {
    initial: { opacity: 0, y: 3, },
    enter: { opacity: 1, y: 0, transition: { ...transmissionTransition, duration: ENTER_DURATION, }, },
    exit: { opacity: 0, y: -1, transition: { ...transmissionTransition, duration: EXIT_DURATION, }, },
};

export default function TransmissionPanel()
{
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
                variants={transmissionVariants}
                initial="initial"
                animate="enter"
                exit="exit"
            >
              <p className="hud-author">{author}</p>
              <p className="hud-message">{message}</p>
            </motion.article>
        </AnimatePresence>
    );
}
