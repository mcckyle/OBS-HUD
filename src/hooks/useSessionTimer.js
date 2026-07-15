//Filename: useSessionTimer.js
//Author: Kyle McColgan
//Date: 14 July 2026
//Description: This file contains a timer hook for the OBS HUD project.

import React, { useState, useEffect } from 'react';

export function useSessionTimer()
{
    const [seconds, setSeconds] = useState(0);

    useEffect(() =>
    {
        const timer = setInterval(() =>
        {
            setSeconds(previous => previous + 1);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return seconds;
}
