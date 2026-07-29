//Filename: TransmissionPanel.jsx
//Author: Kyle McColgan
//Date: 28 July 2026
//Description: This file contains the HUD Transmission Panel component for the OBS HUD project.

import { motion, AnimatePresence } from 'motion/react';
import { useYouTubeData } from "../../hooks/useYouTubeData";
import { formatTime, formatMissionTime } from "../../utils/time.js";

const transmissionVariants = {
    initial: { opacity: 0, y: 3 },
    enter: { opacity: 1, y: 0, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1], }, },
    exit: { opacity: 0, y: -2, transition: { duration: 0.16, ease: "easeOut", }, },
};

export default function TransmissionPanel()
{
    const { latestMessage } = useYouTubeData();
    const { id, author, message } = latestMessage;

    return (
        <AnimatePresence initial={false}>
            <motion.article
                key={id}
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
