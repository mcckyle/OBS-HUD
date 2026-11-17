//Filename: useSessionTimer.js
//Author: Kyle McColgan
//Date: 16 November 2026
//Description: This file contains a timer hook for the OBS HUD project.

import { useState, useRef } from 'react';
import { useInterval } from "../hooks/useInterval";

const ONE_SECOND_MS = 1000;

export function useSessionTimer()
{
    const [seconds, setSeconds] = useState(0);
    const startTimeRef = useRef(Date.now());

    useInterval(() =>
    {
        const elapsedSeconds = Math.floor((Date.now() - startTimeRef.current) / ONE_SECOND_MS);
        setSeconds(elapsedSeconds);
    }, ONE_SECOND_MS);

    return seconds;
}
