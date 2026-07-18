//Filename: useMissionClock.js
//Author: Kyle McColgan
//Date: 17 July 2026
//Description: This file contains a clock hook for the OBS HUD project.

import { useState } from 'react';
import { useInterval } from "../hooks/useInterval";
import { formatMissionTime } from "../utils/time";

const ONE_SECOND_MS = 1000;

export function useMissionClock()
{
    const [missionTime, setMissionTime] = useState(() => formatMissionTime());

    useInterval(() =>
    {
        setMissionTime(formatMissionTime());
    }, ONE_SECOND_MS);

    return missionTime;
}
