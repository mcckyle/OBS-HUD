//Filename: useSessionTimer.js
//Author: Kyle McColgan
//Date: 17 July 2026
//Description: This file contains a timer hook for the OBS HUD project.

import { useState } from 'react';
import { useInterval } from "../hooks/useInterval";

const ONE_SECOND_MS = 1000;

export function useSessionTimer()
{
    const [seconds, setSeconds] = useState(0);

    useInterval(() =>
    {
        setSeconds(previous => previous + 1);
    }, [ONE_SECOND_MS]);

    return seconds;
}
