//Filename: CrewPanel.jsx
//Author: Kyle McColgan
//Date: 13 July 2026
//Description: This file contains the HUD Transmission Panel component for the OBS HUD project.

import React from 'react';
import { motion } from 'motion/react';
import { useYouTubeData } from "../../hooks/useYouTubeData";

export default function CrewPanel()
{
    const { subscriberCount } = useYouTubeData();

    return (
        <motion.strong
            key={subscriberCount}
            initial={{ opacity: 0.5, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
        >
          {subscriberCount}
        </motion.strong>
    );
}
