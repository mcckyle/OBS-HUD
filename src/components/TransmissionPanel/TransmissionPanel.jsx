//Filename: TransmissionPanel.jsx
//Author: Kyle McColgan
//Date: 19 July 2026
//Description: This file contains the HUD Transmission Panel component for the OBS HUD project.

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useYouTubeData } from "../../hooks/useYouTubeData";
import { formatTime, formatMissionTime } from "../../utils/time.js";

export default function TransmissionPanel()
{
    const { latestMessage } = useYouTubeData();

    return (
        <AnimatePresence mode="wait">
            <motion.article
                key={latestMessage.id}
                className="hud-comms"
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -3 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
            >
                <h3 className="hud-author">
                  <span className="hud-author-rule" aria-hidden="true" />
                  {latestMessage.author}
                </h3>
                <p className="hud-message">
                  {latestMessage.message}
                </p>
            </motion.article>
        </AnimatePresence>
    );
}
