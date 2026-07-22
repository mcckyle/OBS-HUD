//Filename: TransmissionPanel.jsx
//Author: Kyle McColgan
//Date: 21 July 2026
//Description: This file contains the HUD Transmission Panel component for the OBS HUD project.

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useYouTubeData } from "../../hooks/useYouTubeData";
import { formatTime, formatMissionTime } from "../../utils/time.js";

const transmissionVariants = {
    initial: { opacity: 0, y: 4 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -4 },
};
const transmissionTransition = { duration: 0.40, ease: "easeOut" };

export default function TransmissionPanel()
{
    const { latestMessage } = useYouTubeData();

    return (
        <AnimatePresence mode="wait">
            <motion.article
                key={latestMessage.id}
                className="hud-comms"
                variants={transmissionVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={transmissionTransition}
            >
                <h3 className="hud-author">
                  {latestMessage.author}
                </h3>
                <p className="hud-message">
                  {latestMessage.message}
                </p>
            </motion.article>
        </AnimatePresence>
    );
}
