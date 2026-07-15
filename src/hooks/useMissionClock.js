//Filename: useMissionClock.js
//Author: Kyle McColgan
//Date: 14 July 2026
//Description: This file contains a clock hook for the OBS HUD project.

import React, { useState, useEffect } from 'react';
import { formatMissionTime } from "../utils/time";

export function useMissionClock()
{
    const [missionTime, setMissionTime] = useState(formatMissionTime());

    useEffect(() =>
    {
        const interval = setInterval(() =>
        {
            setMissionTime(formatMissionTime());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return missionTime;
}
