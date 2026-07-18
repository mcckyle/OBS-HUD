//Filename: useInterval.js
//Author: Kyle McColgan
//Date: 17 July 2026
//Description: This file contains an abstract shared interval hook for the OBS HUD project.

import { useEffect, useRef } from 'react';

export function useInterval(callback, delay)
{
    const callbackRef = useRef(callback);

    useEffect(() =>
    {
        callbackRef.current = callback;
    }, [callback]);

    useEffect(() =>
    {
        if (delay == null)
        {
            return;
        }

        const id = setInterval(() =>
        {
            callbackRef.current();
        }, delay);

        return () => clearInterval(id);
    }, [delay]);
}
