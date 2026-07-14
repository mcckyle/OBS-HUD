//Filename: TransmissionPanel.jsx
//Author: Kyle McColgan
//Date: 13 July 2026
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
            <motion.div
                key={latestMessage.id}
                className="hud-comms"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                variants={{
                    hidden: { opacity: 0, y: 6 },
                    show: {
                        opacity: 1,
                        y: 0
                    }
                }}
            >
            <span className="hud-author">
              {latestMessage.author}
            </span>
            <p className="hud-message">
              {latestMessage.message}
            </p>
            </motion.div>
        </AnimatePresence>
    );
}
