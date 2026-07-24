//Filename: TransmissionPanel.jsx
//Author: Kyle McColgan
//Date: 23 July 2026
//Description: This file contains the HUD Transmission Panel component for the OBS HUD project.

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useYouTubeData } from "../../hooks/useYouTubeData";
import { formatTime, formatMissionTime } from "../../utils/time.js";

const transmissionVariants = {
    initial: { opacity: 0, y: 6 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1], }, },
    exit: { opacity: 0, y: -6, transition: { duration: 0.20 }, },
};
const transmissionTransition = { duration: 0.40, ease: "easeOut" };

export default function TransmissionPanel()
{
    const { latestMessage } = useYouTubeData();
    const { id, author, message } = latestMessage;

    return (
        <AnimatePresence mode="popLayout" initial={false}>
            <motion.article
                key={id}
                className="hud-comms"
                variants={transmissionVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={transmissionTransition}
            >
                <h3 className="hud-author">
                  {author}
                </h3>
                <p className="hud-message">
                  {message}
                </p>
            </motion.article>
        </AnimatePresence>
    );
}
