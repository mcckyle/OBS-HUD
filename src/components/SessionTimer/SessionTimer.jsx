//Filename: SessionTimer.jsx
//Author: Kyle McColgan
//Date: 14 July 2026
//Description: This file contains the session timer component for the OBS HUD project.

import { formatTime } from "../../utils/time";
import { useSessionTimer } from "../../hooks/useSessionTimer";
import "./SessionTimer.css";

export default function SessionTimer()
{
    const seconds = useSessionTimer();
    const value = formatTime(seconds);

    return (
        <time className="hud-value" dateTime={`PT${seconds}S`}>
          {value}
        </time>
    );
}
